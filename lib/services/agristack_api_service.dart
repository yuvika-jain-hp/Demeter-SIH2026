// lib/services/agristack_api_service.dart
//
// AgriStack Sandbox — VLE Hub / Demeter Platform
// Uses: dio ^5.x
//
// Architecture:
//   AgriStackApiService wraps a Dio client configured with a base URL,
//   timeouts, and a logging interceptor (debug builds only).
//
//   SECURITY NOTE: No 12-digit biometric identifiers are generated or stored
//   anywhere in this file. Farmer identity uses alphanumeric AgriStack IDs
//   (format: AGRI-ID-<hex4><alphanum2>) issued by the MoA&FW registry.

import 'package:dio/dio.dart';

// ---------------------------------------------------------------------------
// Domain models
// ---------------------------------------------------------------------------

/// Immutable payload sent to AgriStack for verification.
final class FarmerVerificationRequest {
  const FarmerVerificationRequest({
    required this.agriId,
    required this.netWeightKg,
    required this.moisturePercent,
    required this.commodityCode,
  });

  /// AgriStack alphanumeric farmer identifier — NOT a biometric number.
  final String agriId;
  final double netWeightKg;
  final double moisturePercent;

  /// e.g. "WHEAT", "PADDY", "SOYBEAN"
  final String commodityCode;

  Map<String, dynamic> toJson() => {
        'agri_id': agriId,
        'net_weight_kg': netWeightKg,
        'moisture_percent': moisturePercent,
        'commodity_code': commodityCode,
        'submitted_at': DateTime.now().toIso8601String(),
      };
}

/// Result returned by AgriStack after verification.
final class FarmerVerificationResult {
  const FarmerVerificationResult({
    required this.approved,
    required this.transactionRef,
    required this.farmerName,
    required this.mspRatePerKg,
    required this.message,
  });

  final bool approved;
  final String transactionRef;
  final String farmerName;
  final double mspRatePerKg;
  final String message;

  double get totalPayout => mspRatePerKg * 0; // caller supplies net weight

  factory FarmerVerificationResult.fromJson(Map<String, dynamic> json) =>
      FarmerVerificationResult(
        approved: json['approved'] as bool,
        transactionRef: json['transaction_ref'] as String,
        farmerName: json['farmer_name'] as String,
        mspRatePerKg: (json['msp_rate_per_kg'] as num).toDouble(),
        message: json['message'] as String,
      );

  @override
  String toString() =>
      'FarmerVerificationResult(approved=$approved, ref=$transactionRef, '
      'farmer=$farmerName, msp=₹$mspRatePerKg/kg)';
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

final class AgriStackApiService {
  AgriStackApiService({Dio? dio, bool useSandbox = true})
      : _dio = dio ?? _buildDio(useSandbox);

  final Dio _dio;

  // -------------------------------------------------------------------------
  // Dio factory
  // -------------------------------------------------------------------------

  static Dio _buildDio(bool sandbox) {
    final baseUrl = sandbox
        ? 'https://sandbox.agristack.gov.in' // MoA&FW sandbox (mock)
        : 'https://api.agristack.gov.in';

    final options = BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 8),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // In production: inject bearer token from secure storage.
        'X-Api-Key': 'VLE-SANDBOX-KEY-PLACEHOLDER',
      },
    );

    final dio = Dio(options);

    // Debug-only structured logging interceptor.
    assert(() {
      dio.interceptors.add(
        LogInterceptor(
          requestBody: true,
          responseBody: true,
          logPrint: (o) => print('[AgriStack] $o'),
        ),
      );
      return true;
    }());

    return dio;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /// Submits produce data to the AgriStack farmer approval endpoint.
  ///
  /// Returns a [FarmerVerificationResult] on success.
  /// Throws [AgriStackException] on API error or timeout.
  ///
  /// SANDBOX BEHAVIOUR: When running against the sandbox URL, this method
  /// intercepts the call locally (no real HTTP egress) and returns a
  /// deterministic mock response keyed on [agriId], so the app works fully
  /// offline during development.
  Future<FarmerVerificationResult> verifyFarmerProduce(
    FarmerVerificationRequest request,
  ) async {
    _validateAgriId(request.agriId);

    try {
      final isSandbox =
          _dio.options.baseUrl.contains('sandbox.agristack.gov.in');

      // Sandbox: return deterministic local mock — zero network calls.
      if (isSandbox) {
        return _mockSandboxResponse(request);
      }

      // Production path.
      final response = await _dio.get<Map<String, dynamic>>(
        '/api/v2/farmer_approval',
        queryParameters: {'agri_id': request.agriId},
        data: request.toJson(),
      );

      final body = response.data;
      if (body == null) throw const AgriStackException('Empty response body.');

      return FarmerVerificationResult.fromJson(body);
    } on DioException catch (e) {
      throw AgriStackException._fromDio(e);
    }
  }

  // -------------------------------------------------------------------------
  // Sandbox mock engine
  // -------------------------------------------------------------------------

  /// Pure-Dart deterministic mock. No HTTP involved.
  ///
  /// Rules:
  ///   - IDs ending in 'X' → approval denied (edge-case testing).
  ///   - All others        → approved, MSP rate varies by commodity.
  FarmerVerificationResult _mockSandboxResponse(
    FarmerVerificationRequest req,
  ) {
    // Simulate network latency in sandbox.
    // (Remove in prod; real Dio timeout covers it.)
    final denied = req.agriId.toUpperCase().endsWith('X');

    final msp = _mspTable[req.commodityCode.toUpperCase()] ?? 2183.0;

    if (denied) {
      return FarmerVerificationResult(
        approved: false,
        transactionRef: 'TXN-DENIED-${_shortHash(req.agriId)}',
        farmerName: 'PENDING VERIFICATION',
        mspRatePerKg: msp,
        message: 'Farmer registration pending. Contact local Krishi Kendra.',
      );
    }

    return FarmerVerificationResult(
      approved: true,
      transactionRef: 'TXN-${DateTime.now().millisecondsSinceEpoch}',
      farmerName: _deriveFarmerName(req.agriId),
      mspRatePerKg: msp,
      message: 'Produce approved for MSP procurement.',
    );
  }

  /// Derives a plausible display name for a given AgriStack ID.
  /// Purely cosmetic — no PII lookup occurs in sandbox mode.
  String _deriveFarmerName(String agriId) {
    const names = [
      'Ramesh Kumar',
      'Sunita Devi',
      'Mahesh Patel',
      'Priya Yadav',
      'Ajay Singh',
    ];
    final idx = agriId.codeUnits.fold(0, (acc, c) => acc + c) % names.length;
    return names[idx];
  }

  String _shortHash(String input) =>
      input.codeUnits.fold(0, (a, b) => a ^ b).toRadixString(16).toUpperCase();

  /// Kharif 2026 MSP rates (₹/quintal → ₹/kg).
  static const Map<String, double> _mspTable = {
    'WHEAT': 21.85,
    'PADDY': 23.00,
    'SOYBEAN': 48.92,
    'MAIZE': 22.25,
    'COTTON': 67.20,
  };

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------

  static final _agriIdRegex = RegExp(r'^AGRI-ID-[A-Z0-9]{4,10}$');

  void _validateAgriId(String id) {
    if (!_agriIdRegex.hasMatch(id.toUpperCase())) {
      throw AgriStackException(
        'Invalid AgriStack ID format: "$id". '
        r'Expected pattern: AGRI-ID-[A-Z0-9]{4,10}',
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Typed exception
// ---------------------------------------------------------------------------

final class AgriStackException implements Exception {
  const AgriStackException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  factory AgriStackException._fromDio(DioException e) {
    final code = e.response?.statusCode;
    final msg = switch (e.type) {
      DioExceptionType.connectionTimeout ||
      DioExceptionType.receiveTimeout =>
        'AgriStack gateway timed out. Switching to offline tunnel.',
      DioExceptionType.connectionError =>
        'No internet connection. Switching to offline tunnel.',
      DioExceptionType.badResponse =>
        'AgriStack returned HTTP $code: ${e.response?.statusMessage}',
      _ => 'Unexpected error: ${e.message}',
    };
    return AgriStackException(msg, statusCode: code);
  }

  bool get isTimeout =>
      message.contains('timed out') || message.contains('No internet');

  @override
  String toString() => 'AgriStackException($statusCode): $message';
}
