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
  final _weightController = TextEditingController();
  final _moistureController = TextEditingController();

  String _commodity = 'WHEAT';
  String _result = '';

  Future<void> _verifyFarmer() async {
    final agriId = _agriIdController.text.trim();
    final weight = double.tryParse(_weightController.text.trim());
    final moisture = double.tryParse(_moistureController.text.trim());

    if (agriId.isEmpty || weight == null || moisture == null) {
      setState(() {
        _result = 'Please enter all details correctly.';
      });
      return;
    }

    try {
      final service = AgriStackApiService();

      final request = FarmerVerificationRequest(
        agriId: agriId,
        netWeightKg: weight,
        moisturePercent: moisture,
        commodityCode: _commodity,
      );

      final response = await service.verifyFarmerProduce(request);

      setState(() {
        _result =
            'Farmer: ${response.farmerName}\n'
            'Status: ${response.approved ? "APPROVED" : "DENIED"}\n'
            'MSP: ₹${response.mspRatePerKg}/kg\n'
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
    _weightController.dispose();
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
          width: 500,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Farmer Verification',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 30),

                TextField(
                  controller: _agriIdController,
                  decoration: const InputDecoration(
                    labelText: 'AgriStack ID',
                    hintText: 'AGRI-ID-XXXX',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 16),

                DropdownButtonFormField<String>(
                  value: _commodity,
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

                TextField(
                  controller: _weightController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Net Weight (kg)',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 16),

                TextField(
                  controller: _moistureController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Moisture (%)',
                    border: OutlineInputBorder(),
                  ),
                ),

                const SizedBox(height: 24),

                ElevatedButton(
                  onPressed: _verifyFarmer,
                  child: const Padding(
                    padding: EdgeInsets.all(14),
                    child: Text(
                      'Verify Farmer',
                      style: TextStyle(fontSize: 18),
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