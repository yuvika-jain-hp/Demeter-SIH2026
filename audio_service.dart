// lib/core/audio_service.dart
// Demeter – Farmer Edge Ingestion Module
// Records farmer voice input to the OS filesystem as .ogg (Opus).
//
// RULES ENFORCED:
//   ✗  No Base64 encoding
//   ✗  No SQLite blob storage
//   ✓  Files land in getApplicationDocumentsDirectory()/demeter/audio/
//   ✓  Returns the absolute path for metadata-only DB insertion

import 'dart:io';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:record/record.dart';

// ---------------------------------------------------------------------------
// Exceptions
// ---------------------------------------------------------------------------

class AudioServiceException implements Exception {
  const AudioServiceException(this.message, [this.cause]);
  final String message;
  final Object? cause;

  @override
  String toString() =>
      'AudioServiceException: $message${cause != null ? ' (caused by $cause)' : ''}';
}

// ---------------------------------------------------------------------------
// AudioSession – represents one recording lifecycle
// ---------------------------------------------------------------------------

class AudioSession {
  AudioSession._({
    required this.sessionId,
    required this.filePath,
  });

  final String sessionId;  // matches MicroLot.id
  final String filePath;   // absolute OS path → stored in DB, not the file

  File get file => File(filePath);

  bool get fileExists => file.existsSync();

  /// Size in bytes; 0 if the file doesn't exist yet (recording in progress).
  int get fileSizeBytes => fileExists ? file.lengthSync() : 0;

  @override
  String toString() => 'AudioSession($sessionId, $filePath)';
}

// ---------------------------------------------------------------------------
// AudioService  (one recorder instance per app lifecycle)
// ---------------------------------------------------------------------------

class AudioService {
  AudioService._();
  static final AudioService instance = AudioService._();

  final AudioRecorder _recorder = AudioRecorder();
  AudioSession? _activeSession;

  bool get isRecording => _activeSession != null;

  // ── Directory bootstrap ───────────────────────────────────────────────────

  /// Returns (and creates if absent) the canonical audio storage directory.
  /// Path: <Documents>/demeter/audio/
  /// This is private, sandboxed storage – no READ_EXTERNAL_STORAGE needed.
  Future<Directory> _getAudioDir() async {
    final docs = await getApplicationDocumentsDirectory();
    final dir = Directory(p.join(docs.path, 'demeter', 'audio'));
    if (!dir.existsSync()) {
      await dir.create(recursive: true);
    }
    return dir;
  }

  // ── Recording lifecycle ───────────────────────────────────────────────────

  /// Starts recording a new session keyed by [lotId] (UUID).
  ///
  /// The caller must have already requested MICROPHONE permission.
  /// Throws [AudioServiceException] if:
  ///   - a recording is already in progress
  ///   - microphone permission is not granted
  ///   - an OS-level recording error occurs
  Future<AudioSession> startRecording(String lotId) async {
    if (_activeSession != null) {
      throw const AudioServiceException(
        'Cannot start a new session: a recording is already in progress.',
      );
    }

    final hasPermission = await _recorder.hasPermission();
    if (!hasPermission) {
      throw const AudioServiceException(
        'Microphone permission not granted. '
        'Request permission before calling startRecording().',
      );
    }

    try {
      final audioDir = await _getAudioDir();
      // filename: <lotId>.ogg – UUID ensures no collisions across sessions.
      final filePath = p.join(audioDir.path, '$lotId.ogg');

      await _recorder.start(
        const RecordConfig(
          encoder: AudioEncoder.opus, // Opus → OGG container; excellent for speech
          bitRate: 32000,             // 32 kbps: intelligible speech on 2 GB RAM devices
          sampleRate: 16000,          // 16 kHz: standard for ASR pipelines
          numChannels: 1,             // Mono – halves file size vs. stereo
        ),
        path: filePath,
      );

      _activeSession = AudioSession._(sessionId: lotId, filePath: filePath);
      _log('Recording started → $filePath');
      return _activeSession!;
    } catch (e) {
      _activeSession = null;
      throw AudioServiceException('Failed to start recording', e);
    }
  }

  /// Stops the active recording and returns the finalised [AudioSession].
  ///
  /// Throws [AudioServiceException] if no session is active or if the
  /// recorder fails to stop cleanly.
  Future<AudioSession> stopRecording() async {
    if (_activeSession == null) {
      throw const AudioServiceException(
        'stopRecording() called but no recording is in progress.',
      );
    }

    try {
      // `stop()` flushes buffers and closes the file handle.
      final savedPath = await _recorder.stop();
      final session = _activeSession!;
      _activeSession = null;

      if (savedPath == null || savedPath.isEmpty) {
        throw const AudioServiceException(
          'Recorder returned a null/empty path after stop. '
          'File may be corrupted.',
        );
      }

      // Sanity-check: ensure the file was actually written.
      final file = File(savedPath);
      if (!file.existsSync() || file.lengthSync() == 0) {
        throw AudioServiceException(
          'Audio file is missing or empty after recording: $savedPath',
        );
      }

      _log('Recording stopped → ${file.lengthSync()} bytes at $savedPath');
      return session;
    } catch (e, st) {
      _activeSession = null;
      if (e is AudioServiceException) rethrow;
      throw AudioServiceException('Failed to stop recording', e);
    }
  }

  /// Cancels an in-progress recording and deletes any partial file.
  /// Safe to call even if no recording is active.
  Future<void> cancelRecording() async {
    if (_activeSession == null) return;
    final session = _activeSession!;
    _activeSession = null;

    try {
      await _recorder.cancel();
    } catch (_) {
      // Best-effort cancel – proceed to cleanup regardless.
    }

    // Remove the partial .ogg file to avoid polluting storage.
    final file = session.file;
    if (file.existsSync()) {
      try {
        await file.delete();
        _log('Cancelled – partial file deleted: ${file.path}');
      } catch (e) {
        _log('Warning: could not delete partial file: ${file.path} → $e');
      }
    }
  }

  // ── File management ───────────────────────────────────────────────────────

  /// Deletes the audio file for the given [filePath].
  /// Called by the sync worker after confirmed upload to reclaim storage.
  Future<bool> deleteAudioFile(String filePath) async {
    final file = File(filePath);
    if (!file.existsSync()) {
      _log('deleteAudioFile: file not found at $filePath – skipping.');
      return false;
    }
    try {
      await file.delete();
      _log('Deleted audio file: $filePath');
      return true;
    } catch (e) {
      _log('Failed to delete $filePath: $e');
      return false;
    }
  }

  /// Returns the total size (in bytes) of all stored .ogg files.
  /// Useful for a "storage used" display in the farmer UI.
  Future<int> totalAudioStorageBytes() async {
    try {
      final dir = await _getAudioDir();
      return dir
          .listSync(recursive: false)
          .whereType<File>()
          .where((f) => f.path.endsWith('.ogg'))
          .fold<int>(0, (sum, f) => sum + f.lengthSync());
    } catch (_) {
      return 0;
    }
  }

  // ── Disposal ──────────────────────────────────────────────────────────────

  Future<void> dispose() async {
    await _recorder.dispose();
  }

  void _log(String msg) {
    // ignore: avoid_print
    print('[AudioService] $msg');
  }
}
