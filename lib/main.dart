import 'package:flutter/material.dart';

import 'services/agristack_api_service.dart';
import 'database_helper.dart';

import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';

void main() {
  // Required for SQLite when running the Flutter web prototype.
  databaseFactory = databaseFactoryFfiWeb;

  runApp(const DemeterApp());
}

// ============================================================================
// APP
// ============================================================================

class DemeterApp extends StatelessWidget {
  const DemeterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Demeter',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.green,
        ),
        useMaterial3: true,
      ),
      home: const DemeterHomePage(),
    );
  }
}

// ============================================================================
// HOME PAGE
// ============================================================================

class DemeterHomePage extends StatefulWidget {
  const DemeterHomePage({super.key});

  @override
  State<DemeterHomePage> createState() => _DemeterHomePageState();
}

class _DemeterHomePageState extends State<DemeterHomePage> {
  // --------------------------------------------------------------------------
  // Controllers
  // --------------------------------------------------------------------------

  final _agriIdController = TextEditingController();
  final _grossWeightController = TextEditingController();
  final _bagCountController = TextEditingController();
  final _moistureController = TextEditingController();

  // --------------------------------------------------------------------------
  // Form state
  // --------------------------------------------------------------------------

  String _commodity = 'WHEAT';

  double _tareWeight = 0;
  double _netWeight = 0;

  String _result = '';

  // Farmer verification
  bool _farmerVerified = false;
  bool _isVerifying = false;

  double? _mspRate;
  double? _payout;

  String? _verifiedFarmerName;
  String? _transactionRef;

  String _verifiedGrade = 'UNKNOWN';

  // Database status
  int _pendingLots = 0;
  bool _isRefreshingDatabase = false;
  bool _isSyncingLots = false;

  // Prevent duplicate saves
  bool _lotSaved = false;

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  @override
  void initState() {
    super.initState();

    _refreshDatabaseStatus();
  }

  // --------------------------------------------------------------------------
  // Reset verification
  // --------------------------------------------------------------------------

  void _resetVerification() {
    if (!mounted) return;

    setState(() {
      _farmerVerified = false;
      _mspRate = null;
      _payout = null;

      _verifiedFarmerName = null;
      _transactionRef = null;

      _verifiedGrade = 'UNKNOWN';

      // New data means previous saved state is invalid.
      _lotSaved = false;
    });
  }

  // --------------------------------------------------------------------------
  // Database status
  // --------------------------------------------------------------------------

  Future<void> _refreshDatabaseStatus() async {
    if (_isRefreshingDatabase) return;

    setState(() {
      _isRefreshingDatabase = true;
    });

    try {
      final lots = await DatabaseHelper.instance.getPendingLots();

      if (!mounted) return;

      setState(() {
        _pendingLots = lots.length;
      });
    } finally {
      if (mounted) {
        setState(() {
          _isRefreshingDatabase = false;
        });
      }
    }
  }
// --------------------------------------------------------------------------
// Prototype sync
// --------------------------------------------------------------------------

Future<void> _syncPendingLots() async {
  if (_isSyncingLots) return;

  setState(() {
    _isSyncingLots = true;
  });

  try {
    final pendingLots =
        await DatabaseHelper.instance.getPendingLots();

    if (pendingLots.isEmpty) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No pending lots to sync.'),
        ),
      );

      return;
    }

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Syncing ${pendingLots.length} lot(s)...',
        ),
      ),
    );

    // Simulate a short upload delay for the prototype.
    await Future.delayed(
      const Duration(seconds: 2),
    );

    final ids = pendingLots
        .map((lot) => lot.id)
        .toList();

    await DatabaseHelper.instance.markLotsAsSynced(ids);

    await _refreshDatabaseStatus();

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '✓ ${pendingLots.length} lot(s) synced successfully.',
        ),
      ),
    );
  } catch (e) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Sync failed: $e',
        ),
      ),
    );
  } finally {
    if (mounted) {
      setState(() {
        _isSyncingLots = false;
      });
    }
  }
}
  // --------------------------------------------------------------------------
  // Open saved lots
  // --------------------------------------------------------------------------

  Future<void> _openSavedLots() async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const SavedLotsPage(),
      ),
    );

    // Refresh pending count when coming back.
    await _refreshDatabaseStatus();
  }

  // --------------------------------------------------------------------------
  // Save lot to SQLite
  // --------------------------------------------------------------------------

  Future<void> _saveLotToDatabase() async {
    if (_lotSaved) {
      setState(() {
        _result =
            '⚠️ This lot has already been saved.\n\n'
            'Start a new lot if you want to create another record.';
      });
      return;
    }

    // Farmer must be verified first.
    if (!_farmerVerified) {
      setState(() {
        _result =
            '⚠️ Please verify the farmer successfully before saving the lot.';
      });
      return;
    }

    // Net weight must exist.
    if (_netWeight <= 0) {
      setState(() {
        _result = 'Please calculate the net weight first.';
      });
      return;
    }

    final moisture =
        double.tryParse(_moistureController.text.trim());

    if (moisture == null || moisture < 0 || moisture > 100) {
      setState(() {
        _result =
            'Please enter a valid moisture percentage between 0 and 100.';
      });
      return;
    }

    final grossWeight =
        double.tryParse(_grossWeightController.text.trim());

    final bagCount =
        int.tryParse(_bagCountController.text.trim());

    if (grossWeight == null || grossWeight <= 0) {
      setState(() {
        _result = 'Please enter a valid gross weight.';
      });
      return;
    }

    if (bagCount == null || bagCount <= 0) {
      setState(() {
        _result = 'Please enter a valid number of bags.';
      });
      return;
    }

    final now = DateTime.now().millisecondsSinceEpoch;

    final lot = MicroLot(
      id: now.toString(),

      // Audio module will be connected later.
      audioFilePath: '',

      // Current prototype uses verified grade as the grade hint.
      tfliteGradeHint: _verifiedGrade,

      timestamp: now,

      farmerId: _agriIdController.text.trim(),
      commodity: _commodity,

      grossWeightKg: grossWeight,
      bagCount: bagCount,

      tareWeightKg: _tareWeight,
      netWeightKg: _netWeight,

      moisturePercent: moisture,

      verifiedGrade: _verifiedGrade,
    );

    try {
      await DatabaseHelper.instance.insertLot(lot);

      if (!mounted) return;

      setState(() {
        _lotSaved = true;

        _result =
            '✅ LOT SAVED SUCCESSFULLY\n\n'
            'Lot ID: ${lot.id}\n'
            'Farmer: ${lot.farmerId}\n'
            'Commodity: ${lot.commodity}\n'
            'Gross Weight: '
            '${lot.grossWeightKg?.toStringAsFixed(2)} kg\n'
            'Tare Weight: '
            '${lot.tareWeightKg?.toStringAsFixed(2)} kg\n'
            'Net Weight: '
            '${lot.netWeightKg?.toStringAsFixed(2)} kg\n'
            'Moisture: '
            '${lot.moisturePercent?.toStringAsFixed(2)}%\n'
            'Grade: ${lot.verifiedGrade}\n'
            'Sync Status: PENDING';
      });

      await _refreshDatabaseStatus();

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Lot saved successfully to local SQLite database.',
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _result = '❌ DATABASE ERROR\n\n$e';
      });
    }
  }

  // --------------------------------------------------------------------------
  // Weight calculation
  // --------------------------------------------------------------------------

  void _calculateWeight() {
    final grossWeight =
        double.tryParse(_grossWeightController.text.trim());

    final bagCount =
        int.tryParse(_bagCountController.text.trim());

    if (grossWeight == null || bagCount == null) {
      setState(() {
        _result =
            'Please enter a valid gross weight and bag count.';
        _tareWeight = 0;
        _netWeight = 0;
      });
      return;
    }

    if (grossWeight <= 0) {
      setState(() {
        _result = 'Gross weight must be greater than zero.';
        _tareWeight = 0;
        _netWeight = 0;
      });
      return;
    }

    if (bagCount <= 0) {
      setState(() {
        _result = 'Number of bags must be greater than zero.';
        _tareWeight = 0;
        _netWeight = 0;
      });
      return;
    }

    // Prototype workflow:
    // Each bag contributes 1.2 kg of tare.
    final tare = bagCount * 1.2;

    final net = grossWeight - tare;

    if (net <= 0) {
      setState(() {
        _tareWeight = tare;
        _netWeight = 0;

        _result =
            '❌ Net weight is zero or negative.\n'
            'Please check the gross weight and number of bags.';
      });

      return;
    }

    _resetVerification();

    setState(() {
      _tareWeight = tare;
      _netWeight = net;
      _result = '';
    });
  }

  // --------------------------------------------------------------------------
  // Farmer verification + payout calculation
  // --------------------------------------------------------------------------

  Future<void> _verifyFarmer() async {
    final agriId =
        _agriIdController.text.trim();

    final moisture =
        double.tryParse(_moistureController.text.trim());

    if (agriId.isEmpty) {
      setState(() {
        _result = 'Please enter the AgriStack ID.';
        _farmerVerified = false;
      });

      return;
    }

    if (_netWeight <= 0) {
      setState(() {
        _result = 'Please calculate the net weight first.';
        _farmerVerified = false;
      });

      return;
    }

    if (moisture == null || moisture < 0 || moisture > 100) {
      setState(() {
        _result =
            'Please enter a valid moisture percentage between 0 and 100.';
        _farmerVerified = false;
      });

      return;
    }

    setState(() {
      _isVerifying = true;
      _farmerVerified = false;
      _result = '🔄 Verifying farmer...';
    });

    try {
      final service = AgriStackApiService();

      final request = FarmerVerificationRequest(
        agriId: agriId,
        netWeightKg: _netWeight,
        moisturePercent: moisture,
        commodityCode: _commodity,
      );

      final response =
          await service.verifyFarmerProduce(request);

      final payout =
          response.mspRatePerKg * _netWeight;

      if (!mounted) return;

      setState(() {
        _isVerifying = false;

        _farmerVerified = response.approved;

        _verifiedFarmerName =
            response.farmerName;

        _mspRate =
            response.mspRatePerKg;

        _payout = payout;

        _transactionRef =
            response.transactionRef;

        _verifiedGrade =
            response.approved ? 'A' : 'UNKNOWN';

        _lotSaved = false;

        _result =
            'Farmer: ${response.farmerName}\n'
            'Status: '
            '${response.approved ? "✅ APPROVED" : "❌ DENIED"}\n'
            'Net Weight: '
            '${_netWeight.toStringAsFixed(2)} kg\n'
            'MSP: ₹'
            '${response.mspRatePerKg.toStringAsFixed(2)}/kg\n'
            'Estimated Payout: ₹'
            '${payout.toStringAsFixed(2)}\n'
            'Transaction: '
            '${response.transactionRef}\n\n'
            '${response.message}';
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isVerifying = false;
        _farmerVerified = false;

        _result =
            '❌ VERIFICATION ERROR\n\n$e';
      });
    }
  }

  // --------------------------------------------------------------------------
  // Start a new lot
  // --------------------------------------------------------------------------

  void _startNewLot() {
    setState(() {
      _agriIdController.clear();
      _grossWeightController.clear();
      _bagCountController.clear();
      _moistureController.clear();

      _commodity = 'WHEAT';

      _tareWeight = 0;
      _netWeight = 0;

      _result = '';

      _farmerVerified = false;
      _isVerifying = false;

      _mspRate = null;
      _payout = null;

      _verifiedFarmerName = null;
      _transactionRef = null;

      _verifiedGrade = 'UNKNOWN';

      _lotSaved = false;
    });
  }

  // --------------------------------------------------------------------------
  // Dispose
  // --------------------------------------------------------------------------

  @override
  void dispose() {
    _agriIdController.dispose();
    _grossWeightController.dispose();
    _bagCountController.dispose();
    _moistureController.dispose();

    super.dispose();
  }

  // --------------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🌾 Demeter'),
        centerTitle: true,
      ),

      body: Center(
        child: SizedBox(
          width: 550,

          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),

            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.stretch,

              children: [
                // ============================================================
                // HEADER
                // ============================================================

                const Text(
                  'VLE Hub',
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 8),

                const Text(
                  'Farmer Verification & Weighing',
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 24),

                // ============================================================
                // DATABASE STATUS
                // ============================================================

                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),

                    child: Column(
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.storage,
                              color: Colors.green,
                            ),

                            const SizedBox(width: 12),

                            Expanded(
                              child: Column(
                                crossAxisAlignment:
                                    CrossAxisAlignment.start,

                                children: [
                                  const Text(
                                    'Local Database',
                                    style: TextStyle(
                                      fontWeight:
                                          FontWeight.bold,
                                    ),
                                  ),

                                  const SizedBox(height: 4),

                                  Text(
                                    '$_pendingLots '
                                    'lot(s) pending sync',
                                  ),
                                ],
                              ),
                            ),

                            IconButton(
                              tooltip: 'Refresh',
                              onPressed:
                                  _refreshDatabaseStatus,

                              icon:
                                  _isRefreshingDatabase
                                      ? const SizedBox(
                                          width: 20,
                                          height: 20,
                                          child:
                                              CircularProgressIndicator(
                                            strokeWidth: 2,
                                          ),
                                        )
                                      : const Icon(
                                          Icons.refresh,
                                        ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 12),

                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: _openSavedLots,

                            icon: const Icon(
                              Icons.folder_open,
                            ),

                            label: const Text(
                              'View Saved Lots',
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),

SizedBox(
  width: double.infinity,
  child: ElevatedButton.icon(
    onPressed:
        (_pendingLots > 0 && !_isSyncingLots)
            ? _syncPendingLots
            : null,
    icon: _isSyncingLots
        ? const SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(
              strokeWidth: 2,
            ),
          )
        : const Icon(
            Icons.cloud_upload,
          ),
    label: Padding(
      padding: const EdgeInsets.all(12),
      child: Text(
        _isSyncingLots
            ? 'Syncing Lots...'
            : 'Sync Pending Lots',
        style: const TextStyle(
          fontSize: 16,
        ),
      ),
    ),
  ),
),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // ============================================================
                // FARMER ID
                // ============================================================

                TextField(
                  controller: _agriIdController,

                  onChanged: (_) {
                    _resetVerification();
                  },

                  decoration:
                      const InputDecoration(
                    labelText: 'AgriStack ID',
                    hintText: 'AGRI-ID-A123',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 16),

                // ============================================================
                // COMMODITY
                // ============================================================

                DropdownButtonFormField<String>(
                  value: _commodity,

                  decoration:
                      const InputDecoration(
                    labelText: 'Commodity',
                    border: OutlineInputBorder(),
                  ),

                  items: const [
                    DropdownMenuItem(
                      value: 'WHEAT',
                      child: Text('Wheat'),
                    ),
                    DropdownMenuItem(
                      value: 'PADDY',
                      child: Text('Paddy'),
                    ),
                    DropdownMenuItem(
                      value: 'SOYBEAN',
                      child: Text('Soybean'),
                    ),
                    DropdownMenuItem(
                      value: 'MAIZE',
                      child: Text('Maize'),
                    ),
                    DropdownMenuItem(
                      value: 'COTTON',
                      child: Text('Cotton'),
                    ),
                  ],

                  onChanged: (value) {
                    if (value != null) {
                      _resetVerification();

                      setState(() {
                        _commodity = value;
                      });
                    }
                  },
                ),

                const SizedBox(height: 16),

                // ============================================================
                // GROSS WEIGHT
                // ============================================================

                TextField(
                  controller:
                      _grossWeightController,

                  onChanged: (_) {
                    _resetVerification();
                  },

                  keyboardType:
                      const TextInputType.numberWithOptions(
                    decimal: true,
                  ),

                  decoration:
                      const InputDecoration(
                    labelText: 'Gross Weight (kg)',
                    hintText: 'Example: 105',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 16),

                // ============================================================
                // BAG COUNT
                // ============================================================

                TextField(
                  controller: _bagCountController,

                  onChanged: (_) {
                    _resetVerification();
                  },

                  keyboardType:
                      TextInputType.number,

                  decoration:
                      const InputDecoration(
                    labelText: 'Number of Bags',
                    hintText: 'Example: 5',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 16),

                // ============================================================
                // MOISTURE
                // ============================================================

                TextField(
                  controller: _moistureController,

                  onChanged: (_) {
                    _resetVerification();
                  },

                  keyboardType:
                      const TextInputType.numberWithOptions(
                    decimal: true,
                  ),

                  decoration:
                      const InputDecoration(
                    labelText: 'Moisture (%)',
                    hintText: 'Example: 12',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 24),

                // ============================================================
                // CALCULATE WEIGHT
                // ============================================================

                ElevatedButton.icon(
                  onPressed: _calculateWeight,

                  icon: const Icon(
                    Icons.scale,
                  ),

                  label: const Padding(
                    padding: EdgeInsets.all(14),

                    child: Text(
                      'Calculate Net Weight',
                      style: TextStyle(
                        fontSize: 17,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // ============================================================
                // WEIGHT SUMMARY
                // ============================================================

                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),

                    child: Column(
                      children: [
                        const Text(
                          'Weight Summary',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight:
                                FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 15),

                        Row(
                          mainAxisAlignment:
                              MainAxisAlignment
                                  .spaceBetween,

                          children: [
                            const Text(
                              'Tare Weight',
                            ),

                            Text(
                              '${_tareWeight.toStringAsFixed(2)} kg',
                            ),
                          ],
                        ),

                        const Divider(),

                        Row(
                          mainAxisAlignment:
                              MainAxisAlignment
                                  .spaceBetween,

                          children: [
                            const Text(
                              'Net Weight',
                              style: TextStyle(
                                fontWeight:
                                    FontWeight.bold,
                              ),
                            ),

                            Text(
                              '${_netWeight.toStringAsFixed(2)} kg',

                              style:
                                  const TextStyle(
                                fontWeight:
                                    FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // ============================================================
                // VERIFY FARMER
                // ============================================================

                ElevatedButton(
                  onPressed:
                      _isVerifying
                          ? null
                          : _verifyFarmer,

                  child: Padding(
                    padding:
                        const EdgeInsets.all(14),

                    child:
                        _isVerifying
                            ? const Row(
                                mainAxisAlignment:
                                    MainAxisAlignment
                                        .center,

                                children: [
                                  SizedBox(
                                    width: 20,
                                    height: 20,

                                    child:
                                        CircularProgressIndicator(
                                      strokeWidth: 2,
                                    ),
                                  ),

                                  SizedBox(
                                    width: 12,
                                  ),

                                  Text(
                                    'Verifying Farmer...',
                                    style:
                                        TextStyle(
                                      fontSize: 17,
                                    ),
                                  ),
                                ],
                              )
                            : const Text(
                                'Verify Farmer & '
                                'Calculate Payout',

                                style:
                                    TextStyle(
                                  fontSize: 17,
                                ),
                              ),
                  ),
                ),

                const SizedBox(height: 12),

                // ============================================================
                // VERIFICATION SUMMARY
                // ============================================================

                if (_farmerVerified &&
                    _verifiedFarmerName != null)
                  Card(
                    child: Padding(
                      padding:
                          const EdgeInsets.all(18),

                      child: Column(
                        crossAxisAlignment:
                            CrossAxisAlignment.start,

                        children: [
                          const Text(
                            '✅ Farmer Verified',
                            style: TextStyle(
                              fontSize: 19,
                              fontWeight:
                                  FontWeight.bold,
                            ),
                          ),

                          const SizedBox(height: 12),

                          Text(
                            'Farmer: '
                            '$_verifiedFarmerName',
                          ),

                          const SizedBox(height: 6),

                          Text(
                            'Farmer ID: '
                            '${_agriIdController.text.trim()}',
                          ),

                          const SizedBox(height: 6),

                          Text(
                            'Commodity: $_commodity',
                          ),

                          const SizedBox(height: 6),

                          Text(
                            'MSP: ₹'
                            '${_mspRate?.toStringAsFixed(2)}/kg',
                          ),

                          const SizedBox(height: 6),

                          Text(
                            'Estimated Payout: '
                            '₹${_payout?.toStringAsFixed(2)}',

                            style:
                                const TextStyle(
                              fontWeight:
                                  FontWeight.bold,
                              fontSize: 17,
                            ),
                          ),

                          const SizedBox(height: 6),

                          Text(
                            'Grade: $_verifiedGrade',
                          ),

                          const SizedBox(height: 6),

                          Text(
                            'Transaction: '
                            '$_transactionRef',

                            style:
                                const TextStyle(
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                if (_farmerVerified)
                  const SizedBox(height: 12),

                // ============================================================
                // SAVE
                // ============================================================

                OutlinedButton.icon(
                  onPressed:
                      _farmerVerified &&
                              !_lotSaved
                          ? _saveLotToDatabase
                          : null,

                  icon: const Icon(
                    Icons.save,
                  ),

                  label: Padding(
                    padding:
                        const EdgeInsets.all(14),

                    child: Text(
                      _lotSaved
                          ? 'Lot Already Saved'
                          : 'Save Lot to Local Database',

                      style:
                          const TextStyle(
                        fontSize: 17,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                // ============================================================
                // START NEW LOT
                // ============================================================

                if (_lotSaved)
                  OutlinedButton.icon(
                    onPressed: _startNewLot,

                    icon: const Icon(
                      Icons.add,
                    ),

                    label: const Padding(
                      padding:
                          EdgeInsets.all(14),

                      child: Text(
                        'Start New Lot',
                        style: TextStyle(
                          fontSize: 17,
                        ),
                      ),
                    ),
                  ),

                const SizedBox(height: 24),

                // ============================================================
                // RESULT
                // ============================================================

                if (_result.isNotEmpty)
                  Card(
                    child: Padding(
                      padding:
                          const EdgeInsets.all(16),

                      child: Text(
                        _result,

                        style:
                            const TextStyle(
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ============================================================================
// SAVED LOTS PAGE
// ============================================================================

class SavedLotsPage extends StatefulWidget {
  const SavedLotsPage({super.key});

  @override
  State<SavedLotsPage> createState() =>
      _SavedLotsPageState();
}

class _SavedLotsPageState
    extends State<SavedLotsPage> {
  List<MicroLot> _lots = [];

  bool _loading = true;

  String? _error;

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  @override
  void initState() {
    super.initState();

    _loadLots();
  }

  // --------------------------------------------------------------------------
  // Load all lots
  // --------------------------------------------------------------------------

  Future<void> _loadLots() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final lots =
          await DatabaseHelper.instance.getAllLots();

      if (!mounted) return;

      setState(() {
        _lots = lots;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _loading = false;
        _error = e.toString();
      });
    }
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  String _formatDate(int timestamp) {
    final date =
        DateTime.fromMillisecondsSinceEpoch(
      timestamp,
    );

    String two(int value) =>
        value.toString().padLeft(2, '0');

    return '${two(date.day)}/'
        '${two(date.month)}/'
        '${date.year} '
        '${two(date.hour)}:'
        '${two(date.minute)}';
  }

  String _syncStatusText(
    SyncStatus status,
  ) {
    switch (status) {
      case SyncStatus.pending:
        return 'PENDING SYNC';

      case SyncStatus.synced:
        return 'SYNCED';

      case SyncStatus.failed:
        return 'FAILED';
    }
  }

  Color _syncStatusColor(
    SyncStatus status,
  ) {
    switch (status) {
      case SyncStatus.pending:
        return Colors.orange;

      case SyncStatus.synced:
        return Colors.green;

      case SyncStatus.failed:
        return Colors.red;
    }
  }

  // --------------------------------------------------------------------------
  // Lot card
  // --------------------------------------------------------------------------

  Widget _buildLotCard(MicroLot lot) {
    final statusColor =
        _syncStatusColor(lot.syncStatus);

    return Card(
      margin: const EdgeInsets.only(
        bottom: 16,
      ),

      child: Padding(
        padding: const EdgeInsets.all(18),

        child: Column(
          crossAxisAlignment:
              CrossAxisAlignment.start,

          children: [
            // ---------------------------------------------------------------
            // Header
            // ---------------------------------------------------------------

            Row(
              children: [
                const Icon(
                  Icons.inventory_2,
                  color: Colors.green,
                ),

                const SizedBox(width: 10),

                Expanded(
                  child: Text(
                    'Lot ${lot.id}',

                    style:
                        const TextStyle(
                      fontWeight:
                          FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),

                Container(
                  padding:
                      const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),

                  decoration: BoxDecoration(
                    color: statusColor
                        .withOpacity(0.12),

                    borderRadius:
                        BorderRadius.circular(
                      20,
                    ),
                  ),

                  child: Text(
                    _syncStatusText(
                      lot.syncStatus,
                    ),

                    style: TextStyle(
                      color: statusColor,
                      fontWeight:
                          FontWeight.bold,
                      fontSize: 11,
                    ),
                  ),
                ),
              ],
            ),

            const Divider(height: 24),

            // ---------------------------------------------------------------
            // Farmer
            // ---------------------------------------------------------------

            _infoRow(
              'Farmer ID',
              lot.farmerId ?? 'N/A',
            ),

            _infoRow(
              'Commodity',
              lot.commodity ?? 'N/A',
            ),

            _infoRow(
              'Gross Weight',
              lot.grossWeightKg == null
                  ? 'N/A'
                  : '${lot.grossWeightKg!.toStringAsFixed(2)} kg',
            ),

            _infoRow(
              'Bag Count',
              lot.bagCount?.toString() ?? 'N/A',
            ),

            _infoRow(
              'Tare Weight',
              lot.tareWeightKg == null
                  ? 'N/A'
                  : '${lot.tareWeightKg!.toStringAsFixed(2)} kg',
            ),

            _infoRow(
              'Net Weight',
              lot.netWeightKg == null
                  ? 'N/A'
                  : '${lot.netWeightKg!.toStringAsFixed(2)} kg',
            ),

            _infoRow(
              'Moisture',
              lot.moisturePercent == null
                  ? 'N/A'
                  : '${lot.moisturePercent!.toStringAsFixed(2)}%',
            ),

            _infoRow(
              'Grade',
              lot.verifiedGrade ?? 'UNKNOWN',
            ),

            _infoRow(
              'Created',
              _formatDate(lot.timestamp),
            ),

            const SizedBox(height: 8),

            // ---------------------------------------------------------------
            // Audio status
            // ---------------------------------------------------------------

            Row(
              children: [
                Icon(
                  lot.audioFilePath.isEmpty
                      ? Icons.mic_off
                      : Icons.audiotrack,

                  size: 18,

                  color:
                      lot.audioFilePath.isEmpty
                          ? Colors.grey
                          : Colors.green,
                ),

                const SizedBox(width: 8),

                Expanded(
                  child: Text(
                    lot.audioFilePath.isEmpty
                        ? 'Audio not integrated yet'
                        : 'Audio attached',

                    style:
                        const TextStyle(
                      color: Colors.grey,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(
    String label,
    String value,
  ) {
    return Padding(
      padding:
          const EdgeInsets.only(bottom: 8),

      child: Row(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [
          SizedBox(
            width: 120,

            child: Text(
              label,

              style:
                  const TextStyle(
                color: Colors.grey,
              ),
            ),
          ),

          Expanded(
            child: Text(
              value,

              style:
                  const TextStyle(
                fontWeight:
                    FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --------------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Saved Lots',
        ),

        actions: [
          IconButton(
            tooltip: 'Refresh',

            onPressed:
                _loading
                    ? null
                    : _loadLots,

            icon: const Icon(
              Icons.refresh,
            ),
          ),
        ],
      ),

      body: Center(
        child: ConstrainedBox(
          constraints:
              const BoxConstraints(
            maxWidth: 650,
          ),

          child: _loading
              ? const Center(
                  child:
                      CircularProgressIndicator(),
                )

              : _error != null
                  ? Center(
                      child: Padding(
                        padding:
                            const EdgeInsets.all(
                          24,
                        ),

                        child: Column(
                          mainAxisSize:
                              MainAxisSize.min,

                          children: [
                            const Icon(
                              Icons.error_outline,
                              size: 48,
                              color: Colors.red,
                            ),

                            const SizedBox(
                              height: 12,
                            ),

                            const Text(
                              'Could not load saved lots.',
                              textAlign:
                                  TextAlign.center,
                            ),

                            const SizedBox(
                              height: 8,
                            ),

                            Text(
                              _error!,
                              textAlign:
                                  TextAlign.center,
                            ),

                            const SizedBox(
                              height: 16,
                            ),

                            ElevatedButton(
                              onPressed:
                                  _loadLots,

                              child:
                                  const Text(
                                'Try Again',
                              ),
                            ),
                          ],
                        ),
                      ),
                    )

                  : _lots.isEmpty
                      ? Center(
                          child: Padding(
                            padding:
                                const EdgeInsets.all(
                              24,
                            ),

                            child: Column(
                              mainAxisSize:
                                  MainAxisSize.min,

                              children: [
                                const Icon(
                                  Icons.inventory_2_outlined,
                                  size: 64,
                                  color: Colors.grey,
                                ),

                                const SizedBox(
                                  height: 16,
                                ),

                                const Text(
                                  'No lots saved yet.',
                                  style:
                                      TextStyle(
                                    fontSize: 18,
                                    fontWeight:
                                        FontWeight.bold,
                                  ),
                                ),

                                const SizedBox(
                                  height: 8,
                                ),

                                const Text(
                                  'Create and save a lot '
                                  'from the VLE Hub.',
                                  textAlign:
                                      TextAlign.center,
                                ),

                                const SizedBox(
                                  height: 20,
                                ),

                                ElevatedButton.icon(
                                  onPressed: () {
                                    Navigator.pop(
                                      context,
                                    );
                                  },

                                  icon:
                                      const Icon(
                                    Icons.add,
                                  ),

                                  label:
                                      const Text(
                                    'Create First Lot',
                                  ),
                                ),
                              ],
                            ),
                          ),
                        )

                      : RefreshIndicator(
                          onRefresh: _loadLots,

                          child: ListView(
                            padding:
                                const EdgeInsets.all(
                              20,
                            ),

                            children: [
                              // ------------------------------------------------
                              // Summary
                              // ------------------------------------------------

                              Card(
                                child: Padding(
                                  padding:
                                      const EdgeInsets
                                          .all(
                                    18,
                                  ),

                                  child: Row(
                                    children: [
                                      const Icon(
                                        Icons.storage,
                                        color:
                                            Colors.green,
                                        size: 32,
                                      ),

                                      const SizedBox(
                                        width: 14,
                                      ),

                                      Expanded(
                                        child:
                                            Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment
                                                  .start,

                                          children: [
                                            const Text(
                                              'Local Lot History',

                                              style:
                                                  TextStyle(
                                                fontWeight:
                                                    FontWeight
                                                        .bold,
                                                fontSize:
                                                    18,
                                              ),
                                            ),

                                            const SizedBox(
                                              height: 4,
                                            ),

                                            Text(
                                              '${_lots.length} '
                                              'lot(s) stored locally',
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),

                              const SizedBox(
                                height: 20,
                              ),

                              // ------------------------------------------------
                              // Lots
                              // ------------------------------------------------

                              ..._lots.map(
                                _buildLotCard,
                              ),
                            ],
                          ),
                        ),
        ),
      ),
    );
  }
}