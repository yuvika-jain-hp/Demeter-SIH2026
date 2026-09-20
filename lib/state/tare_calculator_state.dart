// lib/state/tare_calculator_state.dart
//
// Tare & Ledger State Manager — VLE Hub / Demeter Platform
// Uses: flutter (ChangeNotifier), no external state packages required.
//
// Architecture:
//   TareCalculatorState is a ChangeNotifier that:
//     1. Receives live gross_weight updates from BleScannerService.
//     2. Applies the tare formula: net = gross - (bag_count × BAG_TARE_KG).
//     3. Exposes a validated, nullable net weight (null until scale is stable).
//     4. Manages form inputs: bag_count and moisture_percentage.
//     5. Drives the AgriStack submission flow and surfaces its result.
//     6. Triggers Wi-Fi Direct fallback on connectivity failure.

import 'dart:async';

import 'package:flutter/foundation.dart';

import '../services/agristack_api_service.dart';
import '../services/ble_scale_service.dart';
import 'wifi_direct_tunnel.dart';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/// Standard tare weight of one jute sack used in Indian grain procurement.
/// Source: FCI Specification IS:1552 — 1.20 kg per empty gunny bag.
const double kBagTareKg = 1.20;

/// Maximum allowable moisture % for MSP procurement (varies by commodity).
const double kDefaultMoistureThreshold = 14.0;

// ---------------------------------------------------------------------------
// Enum: tracks the overall session state
// ---------------------------------------------------------------------------

enum ProcurementStatus {
  idle,
  scalePending, // Waiting for stable weight reading
  weightCaptured, // Stable reading received
  submitting, // API call in progress
  approved, // AgriStack returned approved = true
  rejected, // AgriStack returned approved = false
  tunneling, // API timed-out; Wi-Fi Direct active
  error, // Unrecoverable error
}

// ---------------------------------------------------------------------------
// State manager
// ---------------------------------------------------------------------------

final class TareCalculatorState extends ChangeNotifier {
  TareCalculatorState({
    required BleScannerService bleService,
    required AgriStackApiService apiService,
    required WifiDirectTunnel wifiTunnel,
  })  : _bleService = bleService,
        _apiService = apiService,
        _wifiTunnel = wifiTunnel {
    _subscribeToScale();
  }

  final BleScannerService _bleService;
  final AgriStackApiService _apiService;
  final WifiDirectTunnel _wifiTunnel;

  StreamSubscription<WeightReading>? _scaleSub;

  // -------------------------------------------------------------------------
  // Scale data
  // -------------------------------------------------------------------------

  WeightReading? _latestReading;
  WeightReading? get latestReading => _latestReading;

  /// Raw gross weight from the scale in kg. Null if no reading yet.
  double? get grossWeightKg => _latestReading?.grossKg;

  /// True when the scale reports a stable (locked) measurement.
  bool get isScaleStable => _latestReading?.isStable ?? false;

  // -------------------------------------------------------------------------
  // Tare inputs (set via UI form)
  // -------------------------------------------------------------------------

  int _bagCount = 0;
  int get bagCount => _bagCount;

  double _moisturePercent = 0.0;
  double get moisturePercent => _moisturePercent;

  String _farmerAgriId = '';
  String get farmerAgriId => _farmerAgriId;

  String _commodityCode = 'WHEAT';
  String get commodityCode => _commodityCode;

  // -------------------------------------------------------------------------
  // Derived calculations
  // -------------------------------------------------------------------------

  /// Total tare weight for all bags.
  double get totalTareKg => _bagCount * kBagTareKg;

  /// Net weight after tare deduction. Null if gross is unavailable.
  ///
  /// Formula: net_weight = gross_weight − (bag_count × 1.20)
  /// Guards against negative net (scale error or misconfigured bag count).
  double? get netWeightKg {
    final gross = grossWeightKg;
    if (gross == null) return null;
    final net = gross - totalTareKg;
    return net < 0 ? 0.0 : net;
  }

  /// Moisture-adjusted effective weight.
  ///
  /// Formula: effective_kg = net_kg × (1 − moisture% / 100)
  double? get effectiveWeightKg {
    final net = netWeightKg;
    if (net == null) return null;
    return net * (1.0 - (_moisturePercent / 100.0));
  }

  /// Whether moisture is within the MSP-acceptable threshold.
  bool get isMoistureAcceptable => _moisturePercent <= kDefaultMoistureThreshold;

  /// Estimated payout at the current MSP rate (populated post-approval).
  double? get estimatedPayoutInr {
    if (_verificationResult == null || netWeightKg == null) return null;
    if (!_verificationResult!.approved) return null;
    return _verificationResult!.mspRatePerKg * netWeightKg!;
  }

  // -------------------------------------------------------------------------
  // Session status & results
  // -------------------------------------------------------------------------

  ProcurementStatus _status = ProcurementStatus.idle;
  ProcurementStatus get status => _status;

  FarmerVerificationResult? _verificationResult;
  FarmerVerificationResult? get verificationResult => _verificationResult;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  bool get isSubmitting => _status == ProcurementStatus.submitting;
  bool get isTunneling => _status == ProcurementStatus.tunneling;

  // -------------------------------------------------------------------------
  // Ledger snapshot (immutable record of captured values)
  // -------------------------------------------------------------------------

  _LedgerSnapshot? _ledger;
  _LedgerSnapshot? get ledger => _ledger;

  // -------------------------------------------------------------------------
  // Scale stream subscription
  // -------------------------------------------------------------------------

  void _subscribeToScale() {
    _scaleSub = _bleService.weightStream.listen(
      _onWeightReading,
      onError: _onScaleError,
    );
    _setStatus(ProcurementStatus.scalePending);
  }

  void _onWeightReading(WeightReading reading) {
    _latestReading = reading;

    if (reading.isStable && _status == ProcurementStatus.scalePending) {
      _setStatus(ProcurementStatus.weightCaptured);
    }

    notifyListeners();
  }

  void _onScaleError(Object error) {
    _errorMessage = error.toString();
    _setStatus(ProcurementStatus.error);
    notifyListeners();
  }

  // -------------------------------------------------------------------------
  // Mutators (called from UI)
  // -------------------------------------------------------------------------

  void setBagCount(int count) {
    assert(count >= 0, 'Bag count cannot be negative.');
    _bagCount = count.clamp(0, 9999);
    notifyListeners();
  }

  void setMoisturePercent(double value) {
    assert(value >= 0 && value <= 100, 'Moisture must be 0–100%.');
    _moisturePercent = value.clamp(0.0, 100.0);
    notifyListeners();
  }

  void setFarmerAgriId(String id) {
    _farmerAgriId = id.trim().toUpperCase();
    notifyListeners();
  }

  void setCommodityCode(String code) {
    _commodityCode = code.trim().toUpperCase();
    notifyListeners();
  }

  // -------------------------------------------------------------------------
  // Primary action: submit to AgriStack
  // -------------------------------------------------------------------------

  /// Validates inputs, captures a ledger snapshot, and submits to AgriStack.
  ///
  /// Falls back to [WifiDirectTunnel] if [AgriStackException.isTimeout].
  Future<void> submitProduce() async {
    final validationError = _validate();
    if (validationError != null) {
      _errorMessage = validationError;
      _setStatus(ProcurementStatus.error);
      notifyListeners();
      return;
    }

    // Capture immutable snapshot at moment of submission.
    _ledger = _LedgerSnapshot(
      agriId: _farmerAgriId,
      grossKg: grossWeightKg!,
      bagCount: _bagCount,
      totalTareKg: totalTareKg,
      netKg: netWeightKg!,
      moisturePercent: _moisturePercent,
      commodityCode: _commodityCode,
      capturedAt: DateTime.now(),
    );

    _setStatus(ProcurementStatus.submitting);
    notifyListeners();

    try {
      final request = FarmerVerificationRequest(
        agriId: _farmerAgriId,
        netWeightKg: netWeightKg!,
        moisturePercent: _moisturePercent,
        commodityCode: _commodityCode,
      );

      final result = await _apiService.verifyFarmerProduce(request);
      _verificationResult = result;
      _errorMessage = null;
      _setStatus(
        result.approved
            ? ProcurementStatus.approved
            : ProcurementStatus.rejected,
      );
    } on AgriStackException catch (e) {
      if (e.isTimeout) {
        await _activateWifiDirectFallback();
      } else {
        _errorMessage = e.message;
        _setStatus(ProcurementStatus.error);
      }
    } catch (e) {
      _errorMessage = 'Unexpected error: $e';
      _setStatus(ProcurementStatus.error);
    } finally {
      notifyListeners();
    }
  }

  // -------------------------------------------------------------------------
  // Wi-Fi Direct fallback
  // -------------------------------------------------------------------------

  Future<void> _activateWifiDirectFallback() async {
    _setStatus(ProcurementStatus.tunneling);
    notifyListeners();

    final payload = _ledger!.toTunnelPayload();

    try {
      await _wifiTunnel.broadcastPayload(payload);
      // Tunnel started — status remains `tunneling` until driver device acks.
    } on WifiDirectException catch (e) {
      _errorMessage = 'Wi-Fi Direct fallback failed: ${e.message}';
      _setStatus(ProcurementStatus.error);
      notifyListeners();
    }
  }

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------

  String? _validate() {
    if (grossWeightKg == null) return 'No weight reading from scale yet.';
    if (!isScaleStable) return 'Scale reading is not stable. Wait for it to settle.';
    if (_bagCount <= 0) return 'Bag count must be at least 1.';
    if (_farmerAgriId.isEmpty) return 'Farmer AgriStack ID is required.';
    if (netWeightKg != null && netWeightKg! <= 0) {
      return 'Net weight is zero or negative. Check bag count.';
    }
    if (!isMoistureAcceptable) {
      return 'Moisture ${_moisturePercent.toStringAsFixed(1)}% exceeds '
          'the ${kDefaultMoistureThreshold.toStringAsFixed(0)}% MSP threshold.';
    }
    return null;
  }

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------

  /// Resets to a clean state, keeping scale connection alive.
  void reset() {
    _bagCount = 0;
    _moisturePercent = 0.0;
    _farmerAgriId = '';
    _verificationResult = null;
    _errorMessage = null;
    _ledger = null;
    _setStatus(
      grossWeightKg != null
          ? ProcurementStatus.weightCaptured
          : ProcurementStatus.scalePending,
    );
    notifyListeners();
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  void _setStatus(ProcurementStatus s) => _status = s;

  @override
  void dispose() {
    _scaleSub?.cancel();
    super.dispose();
  }
}

// ---------------------------------------------------------------------------
// Internal ledger snapshot — immutable record of one procurement transaction.
// ---------------------------------------------------------------------------

final class _LedgerSnapshot {
  const _LedgerSnapshot({
    required this.agriId,
    required this.grossKg,
    required this.bagCount,
    required this.totalTareKg,
    required this.netKg,
    required this.moisturePercent,
    required this.commodityCode,
    required this.capturedAt,
  });

  final String agriId;
  final double grossKg;
  final int bagCount;
  final double totalTareKg;
  final double netKg;
  final double moisturePercent;
  final String commodityCode;
  final DateTime capturedAt;

  /// Serialised payload for the Wi-Fi Direct tunnel.
  Map<String, dynamic> toTunnelPayload() => {
        'farmer_id': agriId,
        'net_weight': netKg,
        'moisture': moisturePercent,
        'commodity': commodityCode,
        'gross_weight': grossKg,
        'bag_count': bagCount,
        'tare_kg': totalTareKg,
        'captured_at': capturedAt.toIso8601String(),
      };

  @override
  String toString() =>
      '_LedgerSnapshot(id=$agriId, gross=$grossKg, tare=$totalTareKg, '
      'net=$netKg, moisture=$moisturePercent%, commodity=$commodityCode)';
}
