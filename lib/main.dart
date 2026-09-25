import 'package:flutter/material.dart';
import 'services/agristack_api_service.dart';

void main() {
  runApp(const DemeterApp());
}

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

class DemeterHomePage extends StatefulWidget {
  const DemeterHomePage({super.key});

  @override
  State<DemeterHomePage> createState() => _DemeterHomePageState();
}

class _DemeterHomePageState extends State<DemeterHomePage> {
  final _agriIdController = TextEditingController();
  final _grossWeightController = TextEditingController();
  final _bagCountController = TextEditingController();
  final _moistureController = TextEditingController();

  String _commodity = 'WHEAT';

  double _tareWeight = 0;
  double _netWeight = 0;
  String _result = '';

  void _calculateWeight() {
    final grossWeight =
        double.tryParse(_grossWeightController.text.trim());

    final bagCount =
        int.tryParse(_bagCountController.text.trim());

    if (grossWeight == null || bagCount == null) {
      setState(() {
        _result = 'Please enter a valid gross weight and bag count.';
        _tareWeight = 0;
        _netWeight = 0;
      });
      return;
    }

    if (grossWeight < 0 || bagCount < 0) {
      setState(() {
        _result = 'Weight and bag count cannot be negative.';
        _tareWeight = 0;
        _netWeight = 0;
      });
      return;
    }

    // Demeter workflow:
    // Each bag contributes 1.2 kg of tare.
    final tare = bagCount * 1.2;
    final net = grossWeight - tare;

    setState(() {
      _tareWeight = tare;
      _netWeight = net < 0 ? 0 : net;
      _result = '';
    });
  }

  Future<void> _verifyFarmer() async {
    final agriId = _agriIdController.text.trim();
    final moisture =
        double.tryParse(_moistureController.text.trim());

    if (agriId.isEmpty) {
      setState(() {
        _result = 'Please enter the AgriStack ID.';
      });
      return;
    }

    if (_netWeight <= 0) {
      setState(() {
        _result = 'Please calculate the net weight first.';
      });
      return;
    }

    if (moisture == null) {
      setState(() {
        _result = 'Please enter a valid moisture percentage.';
      });
      return;
    }

    try {
      final service = AgriStackApiService();

      final request = FarmerVerificationRequest(
        agriId: agriId,
        netWeightKg: _netWeight,
        moisturePercent: moisture,
        commodityCode: _commodity,
      );

      final response = await service.verifyFarmerProduce(request);

      final payout = response.mspRatePerKg * _netWeight;

      setState(() {
        _result =
            'Farmer: ${response.farmerName}\n'
            'Status: ${response.approved ? "APPROVED" : "DENIED"}\n'
            'Net Weight: ${_netWeight.toStringAsFixed(2)} kg\n'
            'MSP: ₹${response.mspRatePerKg.toStringAsFixed(2)}/kg\n'
            'Estimated Payout: ₹${payout.toStringAsFixed(2)}\n'
            'Transaction: ${response.transactionRef}\n\n'
            '${response.message}';
      });
    } catch (e) {
      setState(() {
        _result = 'Error: $e';
      });
    }
  }

  @override
  void dispose() {
    _agriIdController.dispose();
    _grossWeightController.dispose();
    _bagCountController.dispose();
    _moistureController.dispose();
    super.dispose();
  }

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
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
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

                const SizedBox(height: 30),

                // Farmer ID
                TextField(
                  controller: _agriIdController,
                  decoration: const InputDecoration(
                    labelText: 'AgriStack ID',
                    hintText: 'AGRI-ID-A123',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 16),

                // Commodity
                DropdownButtonFormField<String>(
                  initialValue: _commodity,
                  decoration: const InputDecoration(
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
                      setState(() {
                        _commodity = value;
                      });
                    }
                  },
                ),

                const SizedBox(height: 16),

                // Gross weight
                TextField(
                  controller: _grossWeightController,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: const InputDecoration(
                    labelText: 'Gross Weight (kg)',
                    hintText: 'Example: 105',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 16),

                // Bag count
                TextField(
                  controller: _bagCountController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Number of Bags',
                    hintText: 'Example: 5',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 16),

                // Moisture
                TextField(
                  controller: _moistureController,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: const InputDecoration(
                    labelText: 'Moisture (%)',
                    hintText: 'Example: 12',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 24),

                ElevatedButton.icon(
                  onPressed: _calculateWeight,
                  icon: const Icon(Icons.scale),
                  label: const Padding(
                    padding: EdgeInsets.all(14),
                    child: Text(
                      'Calculate Net Weight',
                      style: TextStyle(fontSize: 17),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Weight calculation result
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        const Text(
                          'Weight Summary',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 15),

                        Row(
                          mainAxisAlignment:
                              MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Tare Weight'),
                            Text(
                              '${_tareWeight.toStringAsFixed(2)} kg',
                            ),
                          ],
                        ),

                        const Divider(),

                        Row(
                          mainAxisAlignment:
                              MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Net Weight',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '${_netWeight.toStringAsFixed(2)} kg',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
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

                ElevatedButton(
                  onPressed: _verifyFarmer,
                  child: const Padding(
                    padding: EdgeInsets.all(14),
                    child: Text(
                      'Verify Farmer & Calculate Payout',
                      style: TextStyle(fontSize: 17),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                if (_result.isNotEmpty)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text(
                        _result,
                        style: const TextStyle(fontSize: 16),
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