// lib/core/sync_worker.dart
// Demeter – Farmer Edge Ingestion Module
// WorkManager callback + Dio multipart upload.
//
// ARCHITECTURE NOTES:
//   • callbackDispatcher() is a top-level function – WorkManager requirement.
//     It runs in its own Dart isolate (not the main Flutter isolate).
//   • All dependencies (DB, Dio) are re-initialised inside the worker because
//     the isolate has no access to the main isolate's singletons.
//   • Files are streamed (not buffered) – avoids OOM on 2 GB RAM devices.
//   • A single failed upload marks that lot as 'failed' and continues the
//     loop; it does NOT abort the entire sync batch.

import 'dart:io';
import 'package:dio/dio.dart';
import 'package:workmanager/workmanager.dart';

import 'database_helper.dart'; // MicroLot, SyncStatus, DatabaseHelper

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/// Unique task name registered with WorkManager.
const kSyncTaskName = 'demeter.farmerEdgeSync';

/// Unique task identifier (must match registration in main.dart).
const kSyncTaskUniqueName = 'demeter_sync_periodic';

/// Backend ingest endpoint. Replace with production URL before release.
const _kIngestUrl = 'https://api.demeter.example/api/v1/ingest';

/// Dio connect/receive timeouts – conservative for flaky rural networks.
const _kConnectTimeout = Duration(seconds: 30);
const _kReceiveTimeout = Duration(seconds: 120); // large audio may be slow

// ---------------------------------------------------------------------------
// WorkManager callback dispatcher  (MUST be top-level)
// ---------------------------------------------------------------------------

/// Entry point called by WorkManager in a background isolate.
/// Register this in main.dart BEFORE runApp().
@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((taskName, inputData) async {
    if (taskName != kSyncTaskName) {
      // Unknown task – return success to prevent WorkManager from retrying.
      return Future.value(true);
    }

    try {
      await _runSyncCycle();
      return Future.value(true);
    } catch (e) {
      // Returning false signals WorkManager to retry with back-off.
      _log('Sync cycle failed with unhandled exception: $e');
      return Future.value(false);
    }
  });
}

// ---------------------------------------------------------------------------
// Core sync logic
// ---------------------------------------------------------------------------

Future<void> _runSyncCycle() async {
  final db = DatabaseHelper.instance;
  final uploader = _IngestUploader();

  final pending = await db.getPendingLots();
  if (pending.isEmpty) {
    _log('No pending lots – sync cycle complete.');
    return;
  }

  _log('Starting sync cycle for ${pending.length} pending lot(s).');

  final successIds = <String>[];

  for (final lot in pending) {
    final file = File(lot.audioFilePath);

    // ── Guard: file must exist before attempting upload ──────────────────
    if (!file.existsSync()) {
      _log(
        'Audio file missing for lot ${lot.id}: ${lot.audioFilePath}. '
        'Marking as failed.',
      );
      await db.updateSyncStatus(lot.id, SyncStatus.failed);
      continue;
    }

    try {
      final uploaded = await uploader.uploadLot(lot, file);
      if (uploaded) {
        successIds.add(lot.id);
        _log('Uploaded lot ${lot.id} ✓');
      } else {
        // Server returned non-2xx – mark failed, do not retry this cycle.
        await db.updateSyncStatus(lot.id, SyncStatus.failed);
        _log('Upload rejected by server for lot ${lot.id} – marked failed.');
      }
    } on DioException catch (e) {
      _log('DioException for lot ${lot.id}: ${e.message}');
      // Network errors stay as 'pending' so WorkManager retries next cycle.
      // Permanent HTTP errors (4xx) are marked failed.
      if (_isPermanentHttpError(e)) {
        await db.updateSyncStatus(lot.id, SyncStatus.failed);
      }
      // else: leave as pending; WorkManager will retry via back-off schedule.
    } catch (e) {
      _log('Unexpected error uploading lot ${lot.id}: $e');
      // Conservative: leave as pending.
    }
  }

  // Batch-commit all successes in one transaction.
  if (successIds.isNotEmpty) {
    await db.markLotsAsSynced(successIds);
    _log('Marked ${successIds.length} lot(s) as synced.');
  }
}

/// Returns true for HTTP errors that will never succeed on retry (4xx, excl. 429).
bool _isPermanentHttpError(DioException e) {
  final code = e.response?.statusCode;
  if (code == null) return false;
  // 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 422 Unprocessable
  // are permanent. 429 Too Many Requests and 5xx are transient → keep as pending.
  return code >= 400 && code < 500 && code != 429;
}

// ---------------------------------------------------------------------------
// Uploader
// ---------------------------------------------------------------------------

class _IngestUploader {
  late final Dio _dio;

  _IngestUploader() {
    _dio = Dio(
      BaseOptions(
        connectTimeout: _kConnectTimeout,
        receiveTimeout: _kReceiveTimeout,
        headers: {
          // Add auth headers here (e.g. Bearer token from secure storage).
          'X-Demeter-Version': '1.0',
        },
      ),
    );
    // Interceptors for logging / token-refresh can be added here.
  }

  /// Streams [file] as multipart/form-data to the ingest endpoint.
  ///
  /// Returns true on HTTP 200/201, false on any other status.
  /// Throws [DioException] on network-level failures.
  Future<bool> uploadLot(MicroLot lot, File file) async {
    final fileSize = await file.length();

    // MultipartFile.fromFileSync would load the entire file into memory –
    // use the async factory instead to stream chunks and protect 2 GB RAM.
    final multipartFile = await MultipartFile.fromFile(
      file.path,
      filename: '${lot.id}.ogg',
      // Content-Type tells the backend this is Opus audio in an OGG container.
      contentType: DioMediaType('audio', 'ogg'),
    );

    final formData = FormData.fromMap({
      'lot_id': lot.id,
      'grade_hint': lot.tfliteGradeHint,
      'timestamp': lot.timestamp.toString(),
      'audio': multipartFile,
    });

    _log(
      'Uploading lot ${lot.id} | '
      'grade=${lot.tfliteGradeHint} | '
      'file=${file.path} | '
      'size=${_formatBytes(fileSize)}',
    );

    final response = await _dio.post<Map<String, dynamic>>(
      _kIngestUrl,
      data: formData,
      onSendProgress: (sent, total) {
        if (total > 0) {
          _log('  → ${lot.id}: ${(sent / total * 100).toStringAsFixed(1)}%');
        }
      },
    );

    return response.statusCode == 200 || response.statusCode == 201;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

String _formatBytes(int bytes) {
  if (bytes < 1024) return '${bytes}B';
  if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)}KB';
  return '${(bytes / (1024 * 1024)).toStringAsFixed(2)}MB';
}

void _log(String msg) {
  // ignore: avoid_print
  print('[SyncWorker] $msg');
}
