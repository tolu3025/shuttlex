import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import '../constants/theme.dart';
import '../models/ride.dart';
import '../widgets/isometric_map.dart';
import '../widgets/interactive_mapbox_map.dart';

class LiveTrackingScreen extends StatefulWidget {
  final VehicleOption vehicle;

  const LiveTrackingScreen({
    super.key,
    required this.vehicle,
  });

  @override
  State<LiveTrackingScreen> createState() => _LiveTrackingScreenState();
}

class _LiveTrackingScreenState extends State<LiveTrackingScreen>
    with SingleTickerProviderStateMixin {
  final TextEditingController _notesController = TextEditingController();
  final LatLng _pickupCoords = const LatLng(6.5173, 3.3884);
  final LatLng _destCoords = const LatLng(6.5160, 3.3930);
  final LatLng _riderCoords = const LatLng(6.5178, 3.3875);
  bool _useMapboxTiles = true;

  late AnimationController _slideCtrl;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _slideCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    )..forward();
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 1),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _slideCtrl, curve: Curves.easeOutCubic));
  }

  @override
  void dispose() {
    _notesController.dispose();
    _slideCtrl.dispose();
    super.dispose();
  }

  void _sendNote() {
    if (_notesController.text.trim().isNotEmpty) {
      _notesController.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            "Note sent to ${widget.vehicle.isBike ? 'Babajide (Bike Rider)' : 'Alexander (Driver)'}!",
          ),
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
    final vehicleModel = isBike
        ? "${vehicle.bikeModel?.make ?? 'Honda'} ${vehicle.bikeModel?.model ?? 'Ace CB125'}"
        : "Toyota Corolla";
    final plateNumber =
        isBike ? (vehicle.bikeModel?.plateNumber ?? "KJA-482-XY") : "10B GMV";

    return Scaffold(
      backgroundColor: ShuttleXColors.background,
      extendBodyBehindAppBar: true,
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
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.06),
                  blurRadius: 8,
                )
              ],
            ),
            child: const Icon(Icons.arrow_back,
                size: 16, color: ShuttleXColors.primary),
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
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 8,
                  )
                ],
              ),
              child: const Icon(Icons.calendar_month_outlined,
                  size: 16, color: ShuttleXColors.primary),
            ),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Stack(
        children: [
          // ── Map View (Mapbox HD or Isometric 3D) ───────────────────────────
          Positioned.fill(
            child: _useMapboxTiles
                ? InteractiveMapboxMap(
                    pickup: _pickupCoords,
                    destination: _destCoords,
                    riderLocation: _riderCoords,
                    isTracking: true,
                    height: double.infinity,
                  )
                : ShuttleXIsometricMap(
                    pickup: _pickupCoords,
                    destination: _destCoords,
                    vehicleLocation: _riderCoords,
                    isBike: isBike,
                    height: double.infinity,
                    showObjModel: isBike,
                  ),
          ),

          // ── Map Layer Floating Toggle ──────────────────────────────────────
          Positioned(
            top: 100,
            right: 16,
            child: GestureDetector(
              onTap: () => setState(() => _useMapboxTiles = !_useMapboxTiles),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: ShuttleXColors.border),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.12),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _useMapboxTiles ? Icons.view_in_ar : Icons.map,
                      size: 14,
                      color: ShuttleXColors.primary,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      _useMapboxTiles ? "3D Mode" : "Mapbox HD",
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        color: ShuttleXColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // ── Slide-up driver card (matches mockup exactly) ─────────────────
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: SlideTransition(
              position: _slideAnim,
              child: Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius:
                      BorderRadius.vertical(top: Radius.circular(36)),
                ),
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Drag handle
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: ShuttleXColors.border,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // "Pickup in 2 min" + optional badge
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          "Pickup in 2 min",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.6,
                            color: ShuttleXColors.primary,
                          ),
                        ),
                        if (isBike)
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: ShuttleXColors.cardBg,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: ShuttleXColors.border),
                            ),
                            child: Row(
                              children: const [
                                Icon(Icons.shield,
                                    size: 11,
                                    color: ShuttleXColors.accentGreen),
                                SizedBox(width: 4),
                                Text(
                                  "Helmet Provided",
                                  style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Driver row
                    Row(
                      children: [
                        // Avatar
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: const Color(0xFFF0F0F0),
                            border: Border.all(
                                color: ShuttleXColors.border, width: 2),
                          ),
                          child: const Icon(Icons.person,
                              color: ShuttleXColors.primary, size: 28),
                        ),
                        const SizedBox(width: 14),

                        // Name + vehicle
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                vehicleModel,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -0.4,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "$plateNumber  •  $driverName",
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: ShuttleXColors.textSecondary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Car/bike icon
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: ShuttleXColors.cardBg,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Icon(
                            isBike
                                ? Icons.two_wheeler
                                : Icons.directions_car_filled,
                            size: 28,
                            color: ShuttleXColors.primary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Notes input
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
                              style: const TextStyle(
                                  fontSize: 13, fontWeight: FontWeight.w600),
                              decoration: const InputDecoration(
                                hintText: "Any pickup notes?",
                                hintStyle: TextStyle(
                                  fontSize: 13,
                                  color: ShuttleXColors.textMuted,
                                  fontWeight: FontWeight.w500,
                                ),
                                border: InputBorder.none,
                                isDense: true,
                                contentPadding:
                                    EdgeInsets.symmetric(vertical: 14),
                              ),
                              onSubmitted: (_) => _sendNote(),
                            ),
                          ),
                          GestureDetector(
                            onTap: _sendNote,
                            child: Container(
                              width: 32,
                              height: 32,
                              decoration: const BoxDecoration(
                                color: ShuttleXColors.primary,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.near_me,
                                  size: 16, color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Route / Edit / Cancel actions
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _actionBtn(
                            Icons.alt_route, "Route", ShuttleXColors.textPrimary,
                            () {}),
                        _actionBtn(
                            Icons.edit_note, "Edit", ShuttleXColors.textPrimary,
                            () {}),
                        _actionBtn(Icons.cancel_outlined, "Cancel",
                            Colors.red, () => Navigator.pop(context)),
                      ],
                    ),
                    SizedBox(
                        height: MediaQuery.of(context).padding.bottom + 8),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _actionBtn(
      IconData icon, String label, Color color, VoidCallback onTap) {
    return TextButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 16, color: color),
      label: Text(
        label,
        style: TextStyle(
            color: color, fontWeight: FontWeight.bold, fontSize: 12),
      ),
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      ),
    );
  }
}
