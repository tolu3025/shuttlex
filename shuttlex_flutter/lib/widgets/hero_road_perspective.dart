import 'package:flutter/material.dart';
import '../constants/theme.dart';

class HeroRoadPerspective extends StatelessWidget {
  final VoidCallback onTapRide;
  final VoidCallback onTapSchedule;

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
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Isometric 3D Road Graphic
          Container(
            height: 170,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFDFE2E6), Color(0xFFECEEF1)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Road Trapezoid
                CustomPaint(
                  size: const Size(200, 160),
                  painter: RoadPerspectivePainter(),
                ),

                // Car illustration badge
                Positioned(
                  bottom: 12,
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.12),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(Icons.directions_car, color: ShuttleXColors.primary, size: 28),
                            SizedBox(width: 8),
                            Text(
                              "SHUTTLEX",
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 11,
                                letterSpacing: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Live status badge
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.95),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white.withOpacity(0.6)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        CircleAvatar(radius: 3, backgroundColor: ShuttleXColors.accentGreen),
                        SizedBox(width: 6),
                        Text(
                          "ShuttleX Live Route",
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Dual Quick Action Cards (Ride & Schedule)
          Row(
            children: [
              // Card 1: Ride (White)
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
                          child: const Icon(Icons.directions_car_outlined, size: 20, color: ShuttleXColors.primary),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          "Ride",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: -0.3),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          "Pickup in 3 min",
                          style: TextStyle(fontSize: 11, color: ShuttleXColors.textSecondary, fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // Card 2: Schedule (Black)
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
                          color: Colors.black.withOpacity(0.15),
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
                            color: const Color(0xFF222222),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(Icons.calendar_month_outlined, size: 20, color: Colors.white),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          "Schedule",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -0.3),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          "Plan Ahead Now",
                          style: TextStyle(fontSize: 11, color: Color(0xFF999999), fontWeight: FontWeight.w500),
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

class RoadPerspectivePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFCBD1D7)
      ..style = PaintingStyle.fill;

    // Road trapezoid
    final path = Path()
      ..moveTo(size.width * 0.30, 0)
      ..lineTo(size.width * 0.70, 0)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    canvas.drawPath(path, paint);

    // Blue route overlay
    final routePaint = Paint()
      ..color = const Color(0xFF3B82F6).withOpacity(0.4)
      ..style = PaintingStyle.fill;

    final routePath = Path()
      ..moveTo(size.width * 0.44, 0)
      ..lineTo(size.width * 0.56, 0)
      ..lineTo(size.width * 0.65, size.height)
      ..lineTo(size.width * 0.35, size.height)
      ..close();

    canvas.drawPath(routePath, routePaint);

    // Center Dashes
    final dashPaint = Paint()
      ..color = Colors.white.withOpacity(0.85)
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;

    canvas.drawLine(Offset(size.width * 0.5, 20), Offset(size.width * 0.5, 45), dashPaint);
    canvas.drawLine(Offset(size.width * 0.5, 65), Offset(size.width * 0.5, 100), dashPaint);
    canvas.drawLine(Offset(size.width * 0.5, 120), Offset(size.width * 0.5, 160), dashPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
