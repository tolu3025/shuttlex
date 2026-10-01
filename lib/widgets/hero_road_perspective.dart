import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import '../constants/theme.dart';
import 'isometric_map.dart';
import 'obj_model_painter.dart';

/// Hero section on the HomeScreen — isometric city map + Ride/Schedule cards.
/// Matches the mockup: large isometric map view at the top, two quick-action
/// cards (white "Ride" + black "Plan Ahead Now") at the bottom.
class HeroRoadPerspective extends StatelessWidget {
  final VoidCallback onTapRide;
  final VoidCallback onTapSchedule;

  // Unilag sample coordinates
  static const _pickup = LatLng(6.5173, 3.3884);
  static const _dest = LatLng(6.5160, 3.3930);

  const HeroRoadPerspective({
    super.key,
    required this.onTapRide,
    required this.onTapSchedule,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: ShuttleXColors.surface,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: ShuttleXColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Isometric map hero ─────────────────────────────────────────────
          Stack(
            children: [
              ShuttleXIsometricMap(
                pickup: _pickup,
                destination: _dest,
                height: 200,
                isBike: false,
                showObjModel: false,
              ),

              // "ShuttleX Live Route" badge top-left
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.92),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: ShuttleXColors.border),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.06),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      CircleAvatar(
                          radius: 3,
                          backgroundColor: ShuttleXColors.accentGreen),
                      SizedBox(width: 6),
                      Text(
                        "ShuttleX Live Route",
                        style: TextStyle(
                            fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),

              // OBJ moto model badge — bottom-right of map
              Positioned(
                bottom: 10,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: ShuttleXColors.border),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: 54,
                        height: 36,
                        child: AnimatedObjModel(
                          assetPath: 'assets/models/moto_simple_1.obj',
                          width: 54,
                          height: 36,
                          fillColor: const Color(0xFFCCCCCC),
                          strokeColor: const Color(0xFF777777),
                          animate: true,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        "SHUTTLEX",
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 10,
                          letterSpacing: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // ── Two quick-action cards ─────────────────────────────────────────
          Row(
            children: [
              // Card 1 — Ride (white)
              Expanded(
                child: GestureDetector(
                  onTap: onTapRide,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: ShuttleXColors.border),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.03),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: ShuttleXColors.cardBg,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(Icons.directions_car_outlined,
                              size: 20, color: ShuttleXColors.primary),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          "Ride",
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.3),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          "Pickup in 3 min",
                          style: TextStyle(
                              fontSize: 11,
                              color: ShuttleXColors.textSecondary,
                              fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // Card 2 — Schedule (black, as per mockup)
              Expanded(
                child: GestureDetector(
                  onTap: onTapSchedule,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: ShuttleXColors.primary,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.18),
                          blurRadius: 14,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: const Color(0xFF1A1A1A),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(Icons.calendar_month_outlined,
                              size: 20, color: Colors.white),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          "Schedule",
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: -0.3),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          "Plan Ahead Now",
                          style: TextStyle(
                              fontSize: 11,
                              color: Color(0xFF999999),
                              fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// Keep old RoadPerspectivePainter for compatibility (unused now)
class RoadPerspectivePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {}
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
