import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import '../constants/theme.dart';
import '../models/ride.dart';
import '../widgets/vehicle_card.dart';
import '../widgets/mapbox_view.dart';
import 'live_tracking_screen.dart';

class VehicleSelectionScreen extends StatefulWidget {
  final String pickupName;
  final String destinationName;

  const VehicleSelectionScreen({
    super.key,
    this.pickupName = 'Home',
    this.destinationName = 'Work',
  });

  @override
  State<VehicleSelectionScreen> createState() => _VehicleSelectionScreenState();
}

class _VehicleSelectionScreenState extends State<VehicleSelectionScreen> {
  String _selectedFilter = 'Recommended';
  VehicleOption _selectedVehicle = kDefaultVehicles.first;

  // Unilag Campus Sample coordinates for route
  final LatLng _pickupCoords = const LatLng(6.5173, 3.3884); // Main Gate
  final LatLng _destCoords = const LatLng(6.5160, 3.3930); // Library

  @override
  Widget build(BuildContext context) {
    final filtered = kDefaultVehicles.where((v) {
      if (_selectedFilter == 'Recommended') return true;
      if (_selectedFilter == 'Faster') return v.etaMins <= 4 || v.isBike;
      if (_selectedFilter == 'Cheaper') return v.price <= 7.5;
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: ShuttleXColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: ShuttleXColors.border),
            ),
            child: const Icon(Icons.arrow_back, size: 16, color: ShuttleXColors.primary),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          children: [
            Text(
              "${widget.pickupName}  →  ${widget.destinationName}",
              style: const TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 15,
                letterSpacing: -0.3,
                color: ShuttleXColors.primary,
              ),
            ),
            const Text(
              "Mapbox Navigation Options",
              style: TextStyle(fontSize: 10, color: ShuttleXColors.textSecondary, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: ShuttleXColors.border),
              ),
              child: const Icon(Icons.add, size: 16, color: ShuttleXColors.primary),
            ),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Real Mapbox Map View
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: ShuttleXMapboxView(
              pickup: _pickupCoords,
              destination: _destCoords,
              isBike: _selectedVehicle.isBike,
              height: 180,
            ),
          ),

          // Filter tabs: [Recommended], [Faster], [Cheaper]
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: ['Recommended', 'Faster', 'Cheaper'].map((f) {
                final isSelected = _selectedFilter == f;
                return GestureDetector(
                  onTap: () => setState(() => _selectedFilter = f),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? ShuttleXColors.primary : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: isSelected ? ShuttleXColors.primary : ShuttleXColors.border,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.12),
                                blurRadius: 10,
                                offset: const Offset(0, 3),
                              )
                            ]
                          : null,
                    ),
                    child: Text(
                      f,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: isSelected ? Colors.white : ShuttleXColors.primary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          // Vehicle List with Bike Model and Cars
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final veh = filtered[index];
                return VehicleCard(
                  vehicle: veh,
                  isSelected: _selectedVehicle.id == veh.id,
                  onTap: () => setState(() => _selectedVehicle = veh),
                );
              },
            ),
          ),

          // Bottom CTA
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: ShuttleXColors.border)),
            ),
            child: SafeArea(
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => LiveTrackingScreen(vehicle: _selectedVehicle),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: ShuttleXColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    elevation: 0,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        _selectedVehicle.isBike ? Icons.two_wheeler : Icons.directions_car,
                        color: Colors.white,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        "Confirm ShuttleX ${_selectedVehicle.name}",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward, color: Colors.white, size: 18),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
