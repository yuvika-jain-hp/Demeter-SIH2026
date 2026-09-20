// lib/state/wifi_direct_tunnel.dart
//
// Wi-Fi Direct Offline Fallback — VLE Hub / Demeter Platform
// Uses: nearby_connections ^4.x
//
// Architecture:
//   WifiDirectTunnel uses the Nearby Connections API (P2P Wi-Fi / Bluetooth
//   Advertising) to broadcast a payload to a nearby driver device when the
//   AgriStack API is unreachable.
//
//   Flow (Advertiser mode — VLE Hub):
//     1. broadcastPayload(json) → stages bytes, starts advertising.
//     2. Driver's app (in Discoverer mode) connects.
//     3. Hub sends the procurement record as a bytes payload.
//     4. Driver replies with UTF-8 "ACK" → Completer resolves.
//     5. Advertising is stopped automatically.
//
//   The public API is a single async call so TareCalculatorState can await it
//   without owning any Nearby Connections lifecycle.

import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'package:nearby_connections/nearby_connections.dart';

// ---------------------------------------------------------------------------
// Domain model — tunnel lifecycle events
// ---------------------------------------------------------------------------

sealed class TunnelEvent {}

final class TunnelAdvertising extends TunnelEvent {
  const TunnelAdvertising(this.serviceId);
  final String serviceId;
}

final class TunnelPeerConnected extends TunnelEvent {
  const TunnelPeerConnected(this.endpointId, this.peerName);
  final String endpointId;
  final String peerName;
}

final class TunnelPayloadSent extends TunnelEvent {
  const TunnelPayloadSent(this.endpointId, this.payloadId);
  final String endpointId;
  final int payloadId;
}

final class TunnelAcknowledged extends TunnelEvent {
  const TunnelAcknowledged(this.endpointId);
  final String endpointId;
}

final class TunnelPeerDisconnected extends TunnelEvent {
  const TunnelPeerDisconnected(this.endpointId);
  final String endpointId;
}

final class TunnelError extends TunnelEvent {
  const TunnelError(this.message);
  final String message;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/// Singleton Wi-Fi Direct tunnel.
///
/// Advertises the VLE Hub to nearby driver devices and forwards the
/// procurement payload when a connection is established.
final class WifiDirectTunnel {
  WifiDirectTunnel._();

  static final WifiDirectTunnel instance = WifiDirectTunnel._();

  // -------------------------------------------------------------------------
  // Constants
  // -------------------------------------------------------------------------

  /// Must match the same constant in the driver app.
  static const String _serviceId = 'in.gov.demeter.vle.tunnel';

  /// Human-readable name broadcast to nearby drivers.
  static const String _localEndpointName = 'VLE-HUB';

  // -------------------------------------------------------------------------
  // Internal state
  // -------------------------------------------------------------------------

  final Nearby _nearby = Nearby();
  bool _isAdvertising = false;

  final StreamController<TunnelEvent> _eventController =
      StreamController<TunnelEvent>.broadcast();

  /// Real-time stream of [TunnelEvent] lifecycle updates.
  Stream<TunnelEvent> get events => _eventController.stream;

  /// Active peer connections: endpointId → peer display name.
  final Map<String, String> _connectedPeers = {};

  /// Bytes staged before advertising starts so the connection callback
  /// can send them immediately on peer connect.
  Uint8List? _pendingPayloadBytes;

  /// Resolved when driver acknowledges receipt with "ACK".
  Completer<void>? _ackCompleter;

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /// Serialises [payload] to JSON bytes, starts advertising via Nearby
  /// Connections, and waits for a driver device to connect and acknowledge.
  ///
  /// Throws [WifiDirectException] if:
  ///   - Permissions are missing.
  ///   - No driver connects within [peerTimeout].
  ///   - The underlying Nearby API throws.
  ///
  /// Automatically stops advertising on success or timeout.
  Future<void> broadcastPayload(
    Map<String, dynamic> payload, {
    Duration peerTimeout = const Duration(seconds: 60),
  }) async {
    if (_isAdvertising) {
      throw const WifiDirectException(
        'Tunnel already active. Call stopAdvertising() first.',
      );
    }

    final hasPermissions = await _checkPermissions();
    if (!hasPermissions) {
      throw const WifiDirectException(
        'Required permissions not granted. '
        'Grant Location and Nearby Devices permissions and retry.',
      );
    }

    // Stage encoded payload before advertising begins.
    _pendingPayloadBytes = Uint8List.fromList(
      utf8.encode(jsonEncode(payload)),
    );
    _ackCompleter = Completer<void>();

    await _startAdvertising();

    try {
      await _ackCompleter!.future.timeout(peerTimeout);
    } on TimeoutException {
      final msg = 'Tunnel timed out after ${peerTimeout.inSeconds}s: '
          'no driver responded.';
      _eventController.add(TunnelError(msg));
      throw WifiDirectException(msg);
    } finally {
      _pendingPayloadBytes = null;
      await stopAdvertising();
    }
  }

  // -------------------------------------------------------------------------
  // Advertising lifecycle
  // -------------------------------------------------------------------------

  Future<void> _startAdvertising() async {
    try {
      await _nearby.startAdvertising(
        _localEndpointName,
        Strategy.P2P_POINT_TO_POINT,
        onConnectionInitiated: _onConnectionInitiated,
        onConnectionResult: _onConnectionResult,
        onDisconnected: _onDisconnected,
        serviceId: _serviceId,
      );

      _isAdvertising = true;
      _eventController.add(const TunnelAdvertising(_serviceId));
    } catch (e) {
      _pendingPayloadBytes = null;
      throw WifiDirectException('Failed to start advertising: $e');
    }
  }

  /// Stops advertising and disconnects all active peers.
  Future<void> stopAdvertising() async {
    _isAdvertising = false;
    _connectedPeers.clear();
    try {
      await _nearby.stopAdvertising();
    } catch (_) {
      // Best-effort — Nearby may already be stopped.
    }
  }

  // -------------------------------------------------------------------------
  // Nearby Connections callbacks
  // -------------------------------------------------------------------------

  void _onConnectionInitiated(String endpointId, ConnectionInfo info) {
    _connectedPeers[endpointId] = info.endpointName;

    // Accept all inbound connections. P2P_POINT_TO_POINT limits exposure.
    _nearby.acceptConnection(
      endpointId,
      onPayLoadRecieved: _onPayloadReceived,
      onPayloadTransferUpdate: _onPayloadTransferUpdate,
    );
  }

  void _onConnectionResult(String endpointId, Status status) {
    if (status == Status.CONNECTED) {
      final peerName = _connectedPeers[endpointId] ?? endpointId;
      _eventController.add(TunnelPeerConnected(endpointId, peerName));

      // Send staged payload immediately on connect.
      final bytes = _pendingPayloadBytes;
      if (bytes != null) {
        _dispatchBytesPayload(endpointId, bytes);
      }
    } else {
      _connectedPeers.remove(endpointId);
      _eventController.add(
        TunnelError('Connection to $endpointId failed with status: $status'),
      );
    }
  }

  void _onDisconnected(String endpointId) {
    _connectedPeers.remove(endpointId);
    _eventController.add(TunnelPeerDisconnected(endpointId));
  }

  // -------------------------------------------------------------------------
  // Payload dispatch
  // -------------------------------------------------------------------------

  void _dispatchBytesPayload(String endpointId, Uint8List bytes) {
    // Fire-and-forget; transfer result arrives in _onPayloadTransferUpdate.
    _nearby.sendBytesPayload(endpointId, bytes).catchError((Object e) {
      _eventController.add(TunnelError('Payload dispatch error: $e'));
      final completer = _ackCompleter;
      if (completer != null && !completer.isCompleted) {
        completer.completeError(
          WifiDirectException('Payload send failed: $e'),
        );
      }
    });
  }

  // -------------------------------------------------------------------------
  // Incoming payload (ACK from driver)
  // -------------------------------------------------------------------------

  void _onPayloadReceived(String endpointId, Payload payload) {
    if (payload.type != PayloadType.BYTES) return;
    final raw = payload.bytes;
    if (raw == null) return;

    final message = utf8.decode(raw).trim();
    if (message == 'ACK') {
      _eventController.add(TunnelAcknowledged(endpointId));
      final completer = _ackCompleter;
      if (completer != null && !completer.isCompleted) {
        completer.complete();
      }
    }
  }

  void _onPayloadTransferUpdate(
    String endpointId,
    PayloadTransferUpdate update,
  ) {
    switch (update.status) {
      case PayloadStatus.SUCCESS:
        _eventController.add(TunnelPayloadSent(endpointId, update.id));
      case PayloadStatus.FAILURE:
        _eventController.add(
          TunnelError('Payload ${update.id} to $endpointId failed.'),
        );
      default:
        // IN_PROGRESS — no event needed.
        break;
    }
  }

  // -------------------------------------------------------------------------
  // Permissions
  // -------------------------------------------------------------------------

  Future<bool> _checkPermissions() async {
    try {
      final location = await _nearby.checkLocationPermission();
      final bluetooth = await _nearby.checkBluetoothPermission();
      return location && bluetooth;
    } catch (_) {
      return false;
    }
  }

  // -------------------------------------------------------------------------
  // Dispose
  // -------------------------------------------------------------------------

  Future<void> dispose() async {
    await stopAdvertising();
    await _eventController.close();
  }
}

// ---------------------------------------------------------------------------
// Typed exception
// ---------------------------------------------------------------------------

final class WifiDirectException implements Exception {
  const WifiDirectException(this.message);
  final String message;

  @override
  String toString() => 'WifiDirectException: $message';
}
