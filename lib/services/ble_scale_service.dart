// lib/services/ble_scale_service.dart
//
// BLE Scale Integration — VLE Hub / Demeter Platform
// Uses: flutter_blue_plus ^1.35.x
//
// Architecture:
//   BleScannerService is a singleton that manages the full BLE lifecycle:
//     1. Scan → 2. Connect → 3. Discover Services → 4. Subscribe to Characteristic
//   A StreamController exposes a typed [WeightReading] stream to the state layer.
//   Scanning is always stopped on connect / dispose to protect battery.

import 'dart:async';
import 'dart:typed_data';

import 'package:flutter_blue_plus/flutter_blue_plus.dart';

// ---------------------------------------------------------------------------
// Domain model
// ---------------------------------------------------------------------------

/// Immutable snapshot from the physical scale.
final class WeightReading {
  const WeightReading({
    required this.grossKg,
    required this.isStable,
    required this.timestamp,
  });

  final double grossKg;
  final bool isStable;
  final DateTime timestamp;

  @override
  String toString() =>
      'WeightReading(gross=${grossKg.toStringAsFixed(3)} kg, stable=$isStable)';
}

// ---------------------------------------------------------------------------
// Scale target configuration
// ---------------------------------------------------------------------------

/// Identifies the BLE scale by name prefix and its standard GATT UUIDs.
///
/// Most commodity digital scales advertise the Weight Scale GATT service
/// (0x181D) with the Weight Measurement characteristic (0x2A9D).
/// Override [serviceUuid] / [characteristicUuid] for proprietary scales.
final class ScaleProfile {
  const ScaleProfile({
    required this.namePrefix,
    this.serviceUuid = '0000181d-0000-1000-8000-00805f9b34fb',
    this.characteristicUuid = '00002a9d-0000-1000-8000-00805f9b34fb',
  });

  final String namePrefix;
  final String serviceUuid;
  final String characteristicUuid;

  static const ScaleProfile defaultScale = ScaleProfile(namePrefix: 'SCALE');
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/// Thread-safe singleton BLE service.
///
/// Usage:
/// ```dart
/// final ble = BleScannerService.instance;
/// ble.weightStream.listen((r) => print(r));
/// await ble.startScan(profile: ScaleProfile.defaultScale);
/// // ...later...
/// await ble.disconnect();
/// ```
final class BleScannerService {
  BleScannerService._();

  static final BleScannerService instance = BleScannerService._();

  // -------------------------------------------------------------------------
  // Public stream
  // -------------------------------------------------------------------------

  final StreamController<WeightReading> _weightController =
      StreamController<WeightReading>.broadcast();

  /// Real-time stream of [WeightReading] values parsed from the physical scale.
  Stream<WeightReading> get weightStream => _weightController.stream;

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  BluetoothDevice? _connectedDevice;
  BluetoothCharacteristic? _weightChar;
  StreamSubscription<List<int>>? _notifySub;
  StreamSubscription<BluetoothConnectionState>? _connStateSub;
  bool _isScanning = false;

  /// Whether a scale device is currently connected.
  bool get isConnected => _connectedDevice != null;

  // -------------------------------------------------------------------------
  // Scan & connect
  // -------------------------------------------------------------------------

  /// Starts a BLE scan for a scale matching [profile].
  ///
  /// Throws [BleScanException] if Bluetooth is unavailable or already scanning.
  /// Stops scanning automatically once the target device is found.
  Future<void> startScan({
    ScaleProfile profile = ScaleProfile.defaultScale,
    Duration timeout = const Duration(seconds: 15),
  }) async {
    if (_isScanning) throw const BleScanException('Scan already in progress.');

    final adapterState = await FlutterBluePlus.adapterState.first;
    if (adapterState != BluetoothAdapterState.on) {
      throw BleScanException(
        'Bluetooth adapter is $adapterState. Enable Bluetooth and retry.',
      );
    }

    _isScanning = true;

    // Guard: stop previous scan artefacts.
    if (FlutterBluePlus.isScanningNow) {
      await FlutterBluePlus.stopScan();
    }

    final completer = Completer<void>();
    StreamSubscription<List<ScanResult>>? scanSub;

    scanSub = FlutterBluePlus.onScanResults.listen(
      (results) async {
        for (final r in results) {
          final name = r.device.platformName;
          if (name.toUpperCase().startsWith(profile.namePrefix.toUpperCase())) {
            // Target found — stop scan immediately.
            await _stopScan(scanSub);
            await _connectToDevice(r.device, profile);
            if (!completer.isCompleted) completer.complete();
            return;
          }
        }
      },
      onError: (Object e) {
        if (!completer.isCompleted) {
          completer.completeError(BleScanException('Scan stream error: $e'));
        }
      },
    );

    await FlutterBluePlus.startScan(timeout: timeout);

    // Timeout fallback if scan ends without finding the device.
    FlutterBluePlus.isScanning.listen((scanning) async {
      if (!scanning && !completer.isCompleted) {
        await _stopScan(scanSub);
        completer.completeError(
          const BleScanException('Scale not found within scan window.'),
        );
      }
    });

    return completer.future;
  }

  Future<void> _stopScan(StreamSubscription<List<ScanResult>>? sub) async {
    _isScanning = false;
    await sub?.cancel();
    if (FlutterBluePlus.isScanningNow) {
      await FlutterBluePlus.stopScan();
    }
  }

  // -------------------------------------------------------------------------
  // GATT connection & characteristic subscription
  // -------------------------------------------------------------------------

  Future<void> _connectToDevice(
    BluetoothDevice device,
    ScaleProfile profile,
  ) async {
    await device.connect(autoConnect: false, mtu: null);
    _connectedDevice = device;

    // Monitor connection drops.
    _connStateSub = device.connectionState.listen((state) async {
      if (state == BluetoothConnectionState.disconnected) {
        await _cleanupConnection();
        _weightController.addError(
          const BleConnectionLostException('Scale disconnected unexpectedly.'),
        );
      }
    });

    // Discover GATT services.
    final services = await device.discoverServices();
    final targetService = services.where((s) {
      return s.uuid.str128.toLowerCase() ==
          profile.serviceUuid.toLowerCase();
    }).firstOrNull;

    if (targetService == null) {
      throw BleScanException(
        'Weight Scale service (${profile.serviceUuid}) not found on device.',
      );
    }

    final targetChar = targetService.characteristics.where((c) {
      return c.uuid.str128.toLowerCase() ==
          profile.characteristicUuid.toLowerCase();
    }).firstOrNull;

    if (targetChar == null) {
      throw BleScanException(
        'Weight Measurement characteristic (${profile.characteristicUuid}) '
        'not found.',
      );
    }

    _weightChar = targetChar;

    // Subscribe to notifications.
    await targetChar.setNotifyValue(true);
    _notifySub = targetChar.onValueReceived.listen(
      (raw) {
        final reading = _parseWeightCharacteristic(Uint8List.fromList(raw));
        if (reading != null) {
          _weightController.add(reading);
        }
      },
      onError: (Object e) {
        _weightController.addError(e);
      },
    );
  }

  // -------------------------------------------------------------------------
  // Bluetooth SIG Weight Measurement (0x2A9D) parser
  // Reference: https://www.bluetooth.com/specifications/assigned-numbers/
  //
  // Byte 0 — Flags field
  //   bit 0: Weight unit (0 = SI/kg, 1 = Imperial/lb)
  //   bit 1: Time stamp present
  //   bit 2: User ID present
  //   bit 3: BMI & Height present
  //   bit 7: Measurement Unsuccessful
  //
  // Bytes 1-2 — Weight (uint16, resolution 0.005 kg for SI)
  // -------------------------------------------------------------------------

  WeightReading? _parseWeightCharacteristic(Uint8List bytes) {
    if (bytes.length < 3) return null;

    final flags = bytes[0];
    final isImperial = (flags & 0x01) != 0;
    final isUnsuccessful = (flags & 0x80) != 0;
    // bit 4 (stable) is vendor-specific; many scales set it when weight is stable.
    final isStable = (flags & 0x10) != 0;

    if (isUnsuccessful) return null;

    // Weight is little-endian uint16.
    final rawWeight = bytes[1] | (bytes[2] << 8);

    // SI: resolution 0.005 kg | Imperial: resolution 0.01 lb → convert to kg.
    final double grossKg = isImperial
        ? (rawWeight * 0.01) * 0.453592 // lb → kg
        : rawWeight * 0.005;

    return WeightReading(
      grossKg: grossKg,
      isStable: isStable,
      timestamp: DateTime.now(),
    );
  }

  // -------------------------------------------------------------------------
  // Disconnect
  // -------------------------------------------------------------------------

  /// Gracefully unsubscribe, disconnect, and release all resources.
  Future<void> disconnect() async {
    await _cleanupConnection();
  }

  Future<void> _cleanupConnection() async {
    await _notifySub?.cancel();
    _notifySub = null;

    try {
      await _weightChar?.setNotifyValue(false);
    } catch (_) {
      // Best-effort — device may already be gone.
    }
    _weightChar = null;

    await _connStateSub?.cancel();
    _connStateSub = null;

    try {
      await _connectedDevice?.disconnect();
    } catch (_) {}
    _connectedDevice = null;
  }

  /// Call in app dispose to close the broadcast stream.
  Future<void> dispose() async {
    await disconnect();
    await _weightController.close();
  }
}

// ---------------------------------------------------------------------------
// Typed exceptions
// ---------------------------------------------------------------------------

final class BleScanException implements Exception {
  const BleScanException(this.message);
  final String message;

  @override
  String toString() => 'BleScanException: $message';
}

final class BleConnectionLostException implements Exception {
  const BleConnectionLostException(this.message);
  final String message;

  @override
  String toString() => 'BleConnectionLostException: $message';
}
