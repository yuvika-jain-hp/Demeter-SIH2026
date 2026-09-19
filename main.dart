// lib/main.dart  (bootstrap snippet – non-UI portions only)
// Demeter – Farmer Edge Ingestion Module
//
// ORDER OF OPERATIONS:
//   1. WidgetsFlutterBinding.ensureInitialized()  ← mandatory before any plugin
//   2. Workmanager().initialize()                 ← registers the Dart isolate entrypoint
//   3. Workmanager().registerPeriodicTask()        ← schedules the sync job
//   4. runApp(DemeterApp())

import 'package:flutter/material.dart';
import 'package:workmanager/workmanager.dart';

import 'core/sync_worker.dart'; // callbackDispatcher, kSyncTaskName, kSyncTaskUniqueName

// ---------------------------------------------------------------------------
// TFLite Grade Service (Placeholder)
// ---------------------------------------------------------------------------
// Replace the body of gradeFromCameraFrame() with real tflite_flutter
// inference once the .tflite model is available.
// This function must NEVER block the UI thread – call it via compute() or
// wrap it inside a Future so it's executed off the raster thread.

enum CropGrade { a, b, c, unknown }

/// Takes a raw camera frame (as bytes) and returns a [CropGrade].
/// Currently returns a mock value; plug in tflite_flutter model here.
///
/// Example with tflite_flutter (when model is ready):
/// ```dart
/// final interpreter = await Interpreter.fromAsset('assets/grade_model.tflite');
/// final input  = preprocessFrame(frameBytes);   // normalise to [0,1], reshape
/// final output = List.filled(3, 0.0).reshape([1, 3]);
/// interpreter.run(input, output);
/// final gradeIndex = output[0].indexOf(output[0].reduce(max));
/// return CropGrade.values[gradeIndex];
/// ```
Future<CropGrade> gradeFromCameraFrame(List<int> frameBytes) async {
  // ── PLACEHOLDER IMPLEMENTATION ────────────────────────────────────────
  // Simulates a short inference time to keep the UI responsive.
  await Future.delayed(const Duration(milliseconds: 120));

  // Mock: rotate A → B → C → UNKNOWN deterministically for demo purposes.
  final mockIndex = (DateTime.now().second ~/ 15) % 4;
  return CropGrade.values[mockIndex];
}

String gradeLabel(CropGrade grade) => switch (grade) {
      CropGrade.a => 'A',
      CropGrade.b => 'B',
      CropGrade.c => 'C',
      CropGrade.unknown => 'UNKNOWN',
    };

// ---------------------------------------------------------------------------
// App entry point
// ---------------------------------------------------------------------------

Future<void> main() async {
  // Step 1: Binding must be initialised before any plugin or async work.
  WidgetsFlutterBinding.ensureInitialized();

  // Step 2: Initialise WorkManager.
  //   • callbackDispatcher is the @pragma('vm:entry-point') top-level function
  //     defined in sync_worker.dart.
  //   • isInDebugMode: true → WorkManager runs tasks immediately in debug
  //     (ignores frequency/constraint windows). Set to false in release.
  await Workmanager().initialize(
    callbackDispatcher,
    isInDebugMode: false, // flip to true during local development
  );

  // Step 3: Register the periodic sync task.
  //   Constraints:
  //     networkType: connected → Android JobScheduler only fires when the
  //     device has a working network connection. This is the primary
  //     "wait for connectivity" gate – no polling required.
  //
  //   Frequency: 15 minutes is the Android-enforced minimum for periodic tasks.
  //   existingWorkPolicy: keep → don't overwrite if already scheduled.
  await Workmanager().registerPeriodicTask(
    kSyncTaskUniqueName,         // unique name across app installs
    kSyncTaskName,               // task name passed to executeTask()
    frequency: const Duration(minutes: 15),
    constraints: Constraints(
      networkType: NetworkType.connected,
      requiresBatteryNotLow: false, // farmers may work on low battery – keep syncing
      requiresCharging: false,
      requiresDeviceIdle: false,    // sync even when active
      requiresStorageNotLow: false,
    ),
    existingWorkPolicy: ExistingWorkPolicy.keep,
    backoffPolicy: BackoffPolicy.exponential, // doubles wait time on failure
    backoffPolicyDelay: const Duration(minutes: 2),
  );

  runApp(const DemeterApp());
}

// ---------------------------------------------------------------------------
// Minimal App shell (replace with your actual routing/theming)
// ---------------------------------------------------------------------------

class DemeterApp extends StatelessWidget {
  const DemeterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Demeter – Farmer Edge',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF2E7D32), // agricultural green
      ),
      // Replace with your GoRouter / Navigator 2 routes.
      home: const Scaffold(
        body: Center(child: Text('Demeter – Farmer Edge Ingestion')),
      ),
    );
  }
}
