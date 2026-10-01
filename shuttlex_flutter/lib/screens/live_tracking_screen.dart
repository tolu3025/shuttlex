import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import '../constants/theme.dart';
import '../models/ride.dart';
import '../widgets/mapbox_view.dart';

class LiveTrackingScreen extends StatefulWidget {
  final VehicleOption vehicle;

  const LiveTrackingScreen({
    super.key,
    required this.vehicle,
  });

  @override
  State<LiveTrackingScreen> createState() => _LiveTrackingScreenState();
}

class _LiveTrackingScreenState extends State<LiveTrackingScreen> {
  final TextEditingController _notesController = TextEditingController();
  final LatLng _pickupCoords = const LatLng(6.5173, 3.3884);
  final LatLng _destCoords = const LatLng(6.5160, 3.3930);
  final LatLng _riderCoords = const LatLng(6.5178, 3.3875);

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _sendNote() {
    if (_notesController.text.trim().isNotEmpty) {
      _notesController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Pickup note sent to ${widget.vehicle.isBike ? 'Babajide (Bike Rider)' : 'Alexander (Driver)'}!"),
          backgroundColor: ShuttleXColors.primary,
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final vehicle = widget.vehicle;
    final isBike = vehicle.isBike;
    final driverName = isBike ? "Babajide Okafor" : "Alexander";
    final vehicleModel = isBike ? (vehicle.bikeModel?.make ?? "Honda") + " " + (vehicle.bikeModel?.model ?? "Ace CB125") : "Toyota Corolla";
    final plateNumber = isBike ? (vehicle.bikeModel?.plateNumber ?? "KJA-482-XY") : "10B GMV";

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
        title: const Text(
          "Pickup",
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 17,
            letterSpacing: -0.4,
            color: ShuttleXColors.primary,
          ),
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
              child: const Icon(Icons.calendar_month_outlined, size: 16, color: ShuttleXColors.primary),
            ),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Stack(
        children: [
          // Real Mapbox Map View
          Positioned.fill(
            bottom: 270,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: ShuttleXMapboxView(
                pickup: _pickupCoords,
                destination: _destCoords,
                riderLocation: _riderCoords,
                isBike: isBike,
                height: double.infinity,
              ),
            ),
          ),

          // Floating Driver & Vehicle Status Card (Slide 2 Mockup)
          Positioned(
            left: 16,
            right: 16,
            bottom: 24,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: ShuttleXColors.border),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.12),
                    blurRadius: 30,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Title: Pickup in 2 min
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Pickup in 2 min",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.5,
                          color: ShuttleXColors.primary,
                        ),
                      ),
                      if (isBike)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: ShuttleXColors.cardBg,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: ShuttleXColors.border),
                          ),
                          child: Row(
                            children: const [
                              Icon(Icons.shield, size: 11, color: ShuttleXColors.accentGreen),
                              SizedBox(width: 4),
                              Text(
                                "Helmet Provided",
                                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Driver Details Row
                  Row(
                    children: [
                      // Driver Photo Avatar
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.grey[200],
                          border: Border.all(color: Colors.grey[300]!, width: 2),
                        ),
                        child: const Icon(Icons.person, color: ShuttleXColors.primary, size: 28),
                      ),
                      const SizedBox(width: 12),

                      // Name & Vehicle Details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              vehicleModel,
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "$plateNumber • $driverName",
                              style: const TextStyle(
                                fontSize: 12,
                                color: ShuttleXColors.textSecondary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Vehicle Icon
                      Icon(
                        isBike ? Icons.two_wheeler : Icons.directions_car,
                        size: 36,
                        color: ShuttleXColors.primary,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Any Pickup Notes Input Field
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(
                      color: ShuttleXColors.cardBg,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: ShuttleXColors.border),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _notesController,
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                            decoration: const InputDecoration(
                              hintText: "Any pickup notes?",
                              hintStyle: TextStyle(
                                fontSize: 12,
                                color: ShuttleXColors.textMuted,
                                fontWeight: FontWeight.w600,
                              ),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: EdgeInsets.symmetric(vertical: 12),
                            ),
                            onSubmitted: (_) => _sendNote(),
                          ),
                        ),
                        GestureDetector(
                          onTap: _sendNote,
                          child: Container(
                            width: 28,
                            height: 28,
                            decoration: const BoxDecoration(
                              color: ShuttleXColors.primary,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.near_me, size: 14, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Actions: Route, Edit, Cancel
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      TextButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.alt_route, size: 16, color: ShuttleXColors.textPrimary),
                        label: const Text(
                          "Route",
                          style: TextStyle(color: ShuttleXColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                      TextButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.edit_note, size: 16, color: ShuttleXColors.textPrimary),
                        label: const Text(
                          "Edit",
                          style: TextStyle(color: ShuttleXColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                      TextButton.icon(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.cancel_outlined, size: 16, color: Colors.red),
                        label: const Text(
                          "Cancel",
                          style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
