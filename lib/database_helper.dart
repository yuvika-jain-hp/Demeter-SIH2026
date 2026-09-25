// lib/core/database_helper.dart
// Demeter – Farmer Edge Ingestion Module
// Thread-safe SQLite helper using sqflite.
// CRITICAL: Audio blobs are NEVER stored here. Only filesystem paths.

import 'dart:async';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart' as p;

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

enum SyncStatus { pending, synced, failed }

extension SyncStatusX on SyncStatus {
  int get code => index; // 0 = pending, 1 = synced, 2 = failed
}

class MicroLot {
  final String id;          // UUID v4
  final String audioFilePath; // absolute OS path – never a blob
  final String tfliteGradeHint; // 'A' | 'B' | 'C' | 'UNKNOWN'
  final int timestamp;      // epoch-ms at capture time
  final SyncStatus syncStatus;

  const MicroLot({
    required this.id,
    required this.audioFilePath,
    required this.tfliteGradeHint,
    required this.timestamp,
    this.syncStatus = SyncStatus.pending,
  });

  Map<String, Object?> toMap() => {
        'id': id,
        'audio_file_path': audioFilePath,
        'tflite_grade_hint': tfliteGradeHint,
        'timestamp': timestamp,
        'sync_status': syncStatus.code,
      };

  factory MicroLot.fromMap(Map<String, Object?> m) => MicroLot(
        id: m['id'] as String,
        audioFilePath: m['audio_file_path'] as String,
        tfliteGradeHint: m['tflite_grade_hint'] as String,
        timestamp: m['timestamp'] as int,
        syncStatus: SyncStatus.values[m['sync_status'] as int],
      );

  MicroLot copyWith({SyncStatus? syncStatus}) => MicroLot(
        id: id,
        audioFilePath: audioFilePath,
        tfliteGradeHint: tfliteGradeHint,
        timestamp: timestamp,
        syncStatus: syncStatus ?? this.syncStatus,
      );
}

// ---------------------------------------------------------------------------
// DatabaseHelper  (singleton, thread-safe via sqflite's internal serialiser)
// ---------------------------------------------------------------------------

class DatabaseHelper {
  DatabaseHelper._();
  static final DatabaseHelper instance = DatabaseHelper._();

  static const _kDbName = 'demeter_edge.db';
  static const _kDbVersion = 1;
  static const _kTable = 'micro_lots';

  // sqflite serialises all writes on a single background isolate – safe.
  Database? _db;

  Future<Database> get _database async {
    _db ??= await _openDb();
    return _db!;
  }

  // ── Schema ────────────────────────────────────────────────────────────────

  Future<Database> _openDb() async {
    final dbPath = p.join(await getDatabasesPath(), _kDbName);
    return openDatabase(
      dbPath,
      version: _kDbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
      // Enables WAL mode: readers don't block writers on low-end HW.
      onOpen: (db) async => db.execute('PRAGMA journal_mode=WAL;'),
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS $_kTable (
        id                TEXT PRIMARY KEY NOT NULL,
        audio_file_path   TEXT NOT NULL,
        tflite_grade_hint TEXT NOT NULL DEFAULT 'UNKNOWN',
        timestamp         INTEGER NOT NULL,
        sync_status       INTEGER NOT NULL DEFAULT 0
      );
    ''');

    // Index speeds up the sync worker's pending-query on large local queues.
    await db.execute('''
      CREATE INDEX IF NOT EXISTS idx_sync_status
        ON $_kTable (sync_status);
    ''');
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Migration stubs – extend per version bump.
    if (oldVersion < 2) {
      // e.g. ALTER TABLE micro_lots ADD COLUMN crop_type TEXT DEFAULT 'rice';
    }
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  /// Insert a new [MicroLot]. Throws [DatabaseException] on constraint violation.
  Future<void> insertLot(MicroLot lot) async {
    final db = await _database;
    await db.insert(
      _kTable,
      lot.toMap(),
      conflictAlgorithm: ConflictAlgorithm.abort,
    );
  }

  /// Fetch all lots with [SyncStatus.pending] – used by the sync worker.
  /// Returns an empty list (never throws) so the worker can safely loop.
  Future<List<MicroLot>> getPendingLots() async {
    try {
      final db = await _database;
      final rows = await db.query(
        _kTable,
        where: 'sync_status = ?',
        whereArgs: [SyncStatus.pending.code],
        orderBy: 'timestamp ASC', // FIFO – oldest lot synced first
      );
      return rows.map(MicroLot.fromMap).toList();
    } on DatabaseException catch (e) {
      // Log but don't crash the background worker.
      _log('getPendingLots error: $e');
      return [];
    }
  }

  /// Atomically update [syncStatus] for a given [id].
  Future<void> updateSyncStatus(String id, SyncStatus status) async {
    final db = await _database;
    await db.update(
      _kTable,
      {'sync_status': status.code},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  /// Batch-mark multiple lots as synced in a single transaction.
  /// Prefer this over repeated [updateSyncStatus] calls in the worker.
  Future<void> markLotsAsSynced(List<String> ids) async {
    if (ids.isEmpty) return;
    final db = await _database;
    await db.transaction((txn) async {
      final batch = txn.batch();
      for (final id in ids) {
        batch.update(
          _kTable,
          {'sync_status': SyncStatus.synced.code},
          where: 'id = ?',
          whereArgs: [id],
        );
      }
      await batch.commit(noResult: true);
    });
  }

  /// Fetch a single lot by primary key. Returns null if not found.
  Future<MicroLot?> getLotById(String id) async {
    final db = await _database;
    final rows = await db.query(
      _kTable,
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );
    if (rows.isEmpty) return null;
    return MicroLot.fromMap(rows.first);
  }

  /// Hard-delete a lot record AND its audio file from the filesystem.
  /// Call only after confirmed sync if storage reclamation is needed.
  Future<void> deleteLot(String id) async {
    final db = await _database;
    await db.delete(_kTable, where: 'id = ?', whereArgs: [id]);
  }

  Future<void> close() async => (await _database).close();

  void _log(String msg) {
    // Replace with your preferred logging solution (e.g. logger package).
    // ignore: avoid_print
    print('[DatabaseHelper] $msg');
  }
}
