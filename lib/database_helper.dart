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
  final String id;
  final String audioFilePath;
  final String tfliteGradeHint;
  final int timestamp;
  final SyncStatus syncStatus;

  // Stage 2 VLE Hub data
  final String? farmerId;
  final String? commodity;
  final double? grossWeightKg;
  final int? bagCount;
  final double? tareWeightKg;
  final double? netWeightKg;
  final double? moisturePercent;
  final String? verifiedGrade;

  const MicroLot({
    required this.id,
    required this.audioFilePath,
    required this.tfliteGradeHint,
    required this.timestamp,
    this.syncStatus = SyncStatus.pending,

    this.farmerId,
    this.commodity,
    this.grossWeightKg,
    this.bagCount,
    this.tareWeightKg,
    this.netWeightKg,
    this.moisturePercent,
    this.verifiedGrade,
  });

  Map<String, Object?> toMap() => {
        'id': id,
        'audio_file_path': audioFilePath,
        'tflite_grade_hint': tfliteGradeHint,
        'timestamp': timestamp,
        'sync_status': syncStatus.code,

        'farmer_id': farmerId,
        'commodity': commodity,
        'gross_weight_kg': grossWeightKg,
        'bag_count': bagCount,
        'tare_weight_kg': tareWeightKg,
        'net_weight_kg': netWeightKg,
        'moisture_percent': moisturePercent,
        'verified_grade': verifiedGrade,
      };

  factory MicroLot.fromMap(Map<String, Object?> m) => MicroLot(
        id: m['id'] as String,
        audioFilePath: m['audio_file_path'] as String,
        tfliteGradeHint: m['tflite_grade_hint'] as String,
        timestamp: m['timestamp'] as int,
        syncStatus: SyncStatus.values[m['sync_status'] as int],

        farmerId: m['farmer_id'] as String?,
        commodity: m['commodity'] as String?,
        grossWeightKg: (m['gross_weight_kg'] as num?)?.toDouble(),
        bagCount: m['bag_count'] as int?,
        tareWeightKg: (m['tare_weight_kg'] as num?)?.toDouble(),
        netWeightKg: (m['net_weight_kg'] as num?)?.toDouble(),
        moisturePercent: (m['moisture_percent'] as num?)?.toDouble(),
        verifiedGrade: m['verified_grade'] as String?,
      );

  MicroLot copyWith({
    SyncStatus? syncStatus,
    String? farmerId,
    String? commodity,
    double? grossWeightKg,
    int? bagCount,
    double? tareWeightKg,
    double? netWeightKg,
    double? moisturePercent,
    String? verifiedGrade,
  }) =>
      MicroLot(
        id: id,
        audioFilePath: audioFilePath,
        tfliteGradeHint: tfliteGradeHint,
        timestamp: timestamp,
        syncStatus: syncStatus ?? this.syncStatus,

        farmerId: farmerId ?? this.farmerId,
        commodity: commodity ?? this.commodity,
        grossWeightKg: grossWeightKg ?? this.grossWeightKg,
        bagCount: bagCount ?? this.bagCount,
        tareWeightKg: tareWeightKg ?? this.tareWeightKg,
        netWeightKg: netWeightKg ?? this.netWeightKg,
        moisturePercent: moisturePercent ?? this.moisturePercent,
        verifiedGrade: verifiedGrade ?? this.verifiedGrade,
      );
}

// ---------------------------------------------------------------------------
// DatabaseHelper  (singleton, thread-safe via sqflite's internal serialiser)
// ---------------------------------------------------------------------------

class DatabaseHelper {
  DatabaseHelper._();
  static final DatabaseHelper instance = DatabaseHelper._();

  static const _kDbName = 'demeter_edge.db';
  static const _kDbVersion = 3;
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
      sync_status       INTEGER NOT NULL DEFAULT 0,

      farmer_id         TEXT,
      commodity         TEXT,
      gross_weight_kg   REAL,
      bag_count         INTEGER,
      tare_weight_kg    REAL,
      net_weight_kg     REAL,
      moisture_percent  REAL,
      verified_grade    TEXT
    );
  ''');
}

Future<void> _onUpgrade(
    Database db, int oldVersion, int newVersion) async {
  if (oldVersion < 3) {
    await db.execute(
      'ALTER TABLE $_kTable ADD COLUMN farmer_id TEXT NOT NULL DEFAULT ""',
    );

    await db.execute(
      'ALTER TABLE $_kTable ADD COLUMN commodity TEXT NOT NULL DEFAULT "UNKNOWN"',
    );

    await db.execute(
      'ALTER TABLE $_kTable ADD COLUMN gross_weight_kg REAL NOT NULL DEFAULT 0',
    );

    await db.execute(
      'ALTER TABLE $_kTable ADD COLUMN bag_count INTEGER NOT NULL DEFAULT 0',
    );

    await db.execute(
      'ALTER TABLE $_kTable ADD COLUMN tare_weight_kg REAL NOT NULL DEFAULT 0',
    );

    await db.execute(
      'ALTER TABLE $_kTable ADD COLUMN net_weight_kg REAL NOT NULL DEFAULT 0',
    );

    await db.execute(
      'ALTER TABLE $_kTable ADD COLUMN moisture_percent REAL NOT NULL DEFAULT 0',
    );

    await db.execute(
      'ALTER TABLE $_kTable ADD COLUMN verified_grade TEXT',
    );
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
  /// Fetch all lots, newest first.
/// Used by the local lot history screen.
Future<List<MicroLot>> getAllLots() async {
  try {
    final db = await _database;

    final rows = await db.query(
      _kTable,
      orderBy: 'timestamp DESC',
    );

    return rows.map(MicroLot.fromMap).toList();
  } on DatabaseException catch (e) {
    _log('getAllLots error: $e');
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
Future<void> testDatabase() async {
  final lots = await getPendingLots();

  print('========== DATABASE TEST ==========');
  print('Number of pending lots: ${lots.length}');

  for (final lot in lots) {
    print('Lot ID: ${lot.id}');
    print('Farmer: ${lot.farmerId}');
    print('Commodity: ${lot.commodity}');
    print('Net Weight: ${lot.netWeightKg}');
    print('Moisture: ${lot.moisturePercent}');
    print('Status: ${lot.syncStatus}');
    print('==================================');
  }
}
  void _log(String msg) {
    // Replace with your preferred logging solution (e.g. logger package).
    // ignore: avoid_print
    print('[DatabaseHelper] $msg');
  }

}
