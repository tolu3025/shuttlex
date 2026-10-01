import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart' hide Path;

import '../constants/theme.dart';
import 'obj_model_painter.dart';

// ─────────────────────────────────────────────────────────────────────────────
//  IsometricCityPainter — draws the white isometric city grid over the map
// ─────────────────────────────────────────────────────────────────────────────

class IsometricCityPainter extends CustomPainter {
  final Offset vehiclePos; // normalized 0..1 in canvas
  final Offset pickupPos;
  final Offset destPos;
  final double animT; // 0..1 pulse animation

  IsometricCityPainter({
    required this.vehiclePos,
    required this.pickupPos,
    required this.destPos,
    required this.animT,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final rng = Random(42); // stable seed for consistent city layout
    final w = size.width;
    final h = size.height;

    // ── Background ──────────────────────────────────────────────────────────
    canvas.drawRect(
      Rect.fromLTWH(0, 0, w, h),
      Paint()..color = const Color(0xFFF2F2EE),
    );

    // ── Road grid ───────────────────────────────────────────────────────────
    final roadPaint = Paint()..color = const Color(0xFFE8E8E4);
    const cols = 6;
    const rows = 8;
    final cellW = w / cols;
    final cellH = h / rows;

    for (int i = 0; i <= cols; i++) {
      canvas.drawRect(
        Rect.fromLTWH(i * cellW - 3, 0, 6, h),
        roadPaint,
      );
    }
    for (int j = 0; j <= rows; j++) {
      canvas.drawRect(
        Rect.fromLTWH(0, j * cellH - 2, w, 4),
        roadPaint,
      );
    }

    // ── Isometric buildings ──────────────────────────────────────────────────
    for (int col = 0; col < cols; col++) {
      for (int row = 0; row < rows; row++) {
        if (rng.nextDouble() < 0.3) continue; // random gaps
        final bx = col * cellW + cellW * 0.15;
        final by = row * cellH + cellH * 0.15;
        final bw = cellW * 0.7;
        final bh = cellH * 0.65;
        final height = 6.0 + rng.nextDouble() * 22;

        _drawIsoBuilding(canvas, bx, by, bw, bh, height, rng);
      }
    }

    // ── Green trees ─────────────────────────────────────────────────────────
    final treePaint = Paint()..color = const Color(0xFFB8D8B0);
    final treeSeedRng = Random(99);
    for (int i = 0; i < 14; i++) {
      final tx = treeSeedRng.nextDouble() * w;
      final ty = treeSeedRng.nextDouble() * h;
      canvas.drawCircle(Offset(tx, ty), 8 + treeSeedRng.nextDouble() * 5, treePaint);
    }

    // ── Dashed route line ────────────────────────────────────────────────────
    _drawDashedLine(
      canvas,
      Offset(pickupPos.dx * w, pickupPos.dy * h),
      Offset(destPos.dx * w, destPos.dy * h),
      const Color(0xFF010101),
    );

    // ── Pickup pin ───────────────────────────────────────────────────────────
    _drawPin(canvas, Offset(pickupPos.dx * w, pickupPos.dy * h),
        const Color(0xFF010101), 'P');

    // ── Destination pin ───────────────────────────────────────────────────────
    _drawPin(canvas, Offset(destPos.dx * w, destPos.dy * h),
        const Color(0xFFD32F2F), 'D');

    // ── Animated vehicle dot ─────────────────────────────────────────────────
    final vx = vehiclePos.dx * w;
    final vy = vehiclePos.dy * h;
    final pulse = 14.0 + animT * 6.0;
    canvas.drawCircle(
      Offset(vx, vy),
      pulse,
      Paint()..color = Colors.black.withOpacity(0.08),
    );
    canvas.drawCircle(Offset(vx, vy), 9, Paint()..color = Colors.white);
    canvas.drawCircle(Offset(vx, vy), 9,
        Paint()
          ..color = ShuttleXColors.primary
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2);
    canvas.drawCircle(Offset(vx, vy), 5, Paint()..color = ShuttleXColors.primary);
  }

  void _drawIsoBuilding(Canvas canvas, double x, double y, double bw, double bh,
      double elevation, Random rng) {
    // Top face
    final topPaint = Paint()..color = const Color(0xFFF8F8F6);
    final topPath = Path()
      ..moveTo(x + bw / 2, y - elevation)
      ..lineTo(x + bw, y + bh / 3 - elevation)
      ..lineTo(x + bw / 2, y + bh * 0.6 - elevation)
      ..lineTo(x, y + bh / 3 - elevation)
      ..close();
    canvas.drawPath(topPath, topPaint);

    // Right face
    final rightPaint = Paint()..color = const Color(0xFFDDDDDA);
    final rightPath = Path()
      ..moveTo(x + bw, y + bh / 3 - elevation)
      ..lineTo(x + bw, y + bh / 3)
      ..lineTo(x + bw / 2, y + bh * 0.6)
      ..lineTo(x + bw / 2, y + bh * 0.6 - elevation)
      ..close();
    canvas.drawPath(rightPath, rightPaint);

    // Left face
    final leftPaint = Paint()..color = const Color(0xFFE8E8E5);
    final leftPath = Path()
      ..moveTo(x, y + bh / 3 - elevation)
      ..lineTo(x, y + bh / 3)
      ..lineTo(x + bw / 2, y + bh * 0.6)
      ..lineTo(x + bw / 2, y + bh * 0.6 - elevation)
      ..close();
    canvas.drawPath(leftPath, leftPaint);

    // Outline
    final outlinePaint = Paint()
      ..color = const Color(0xFFCCCCC8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.5;
    canvas.drawPath(topPath, outlinePaint);
    canvas.drawPath(rightPath, outlinePaint);
    canvas.drawPath(leftPath, outlinePaint);
  }

  void _drawDashedLine(Canvas canvas, Offset p1, Offset p2, Color color) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.round;
    const dashLen = 8.0;
    const gapLen = 5.0;
    final dx = p2.dx - p1.dx;
    final dy = p2.dy - p1.dy;
    final total = sqrt(dx * dx + dy * dy);
    if (total == 0) return;
    final ux = dx / total;
    final uy = dy / total;
    double traveled = 0;
    bool drawing = true;
    while (traveled < total) {
      final segLen = drawing ? dashLen : gapLen;
      final end = min(traveled + segLen, total);
      if (drawing) {
        canvas.drawLine(
          Offset(p1.dx + ux * traveled, p1.dy + uy * traveled),
          Offset(p1.dx + ux * end, p1.dy + uy * end),
          paint,
        );
      }
      traveled = end;
      drawing = !drawing;
    }
  }

  void _drawPin(Canvas canvas, Offset pos, Color color, String label) {
    // Shadow
    canvas.drawCircle(
      pos + const Offset(0, 3),
      13,
      Paint()..color = Colors.black.withOpacity(0.12),
    );
    // Circle
    canvas.drawCircle(pos, 12, Paint()..color = color);
    // Label
    final tp = TextPainter(
      text: TextSpan(
        text: label,
        style: const TextStyle(
            color: Colors.white, fontSize: 9, fontWeight: FontWeight.w900),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    tp.paint(canvas, pos - Offset(tp.width / 2, tp.height / 2));
  }

  @override
  bool shouldRepaint(IsometricCityPainter old) =>
      old.animT != animT || old.vehiclePos != vehiclePos;
}

// ─────────────────────────────────────────────────────────────────────────────
//  ShuttleXIsometricMap — the full widget with flutter_map + isometric overlay
// ─────────────────────────────────────────────────────────────────────────────

class ShuttleXIsometricMap extends StatefulWidget {
  final LatLng pickup;
  final LatLng destination;
  final LatLng? vehicleLocation;
  final bool isBike;
  final double height;
  final bool showObjModel;

  const ShuttleXIsometricMap({
    super.key,
    required this.pickup,
    required this.destination,
    this.vehicleLocation,
    this.isBike = false,
    this.height = 220,
    this.showObjModel = false,
  });

  @override
  State<ShuttleXIsometricMap> createState() => _ShuttleXIsometricMapState();
}

class _ShuttleXIsometricMapState extends State<ShuttleXIsometricMap>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseCtrl;
  late Animation<double> _pulse;

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _pulse = Tween(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    super.dispose();
  }

  /// Map a LatLng to a normalised 0..1 position within the bounding box
  Offset _latLngToNorm(LatLng ll) {
    final minLat = min(widget.pickup.latitude, widget.destination.latitude) - 0.002;
    final maxLat = max(widget.pickup.latitude, widget.destination.latitude) + 0.002;
    final minLng = min(widget.pickup.longitude, widget.destination.longitude) - 0.002;
    final maxLng = max(widget.pickup.longitude, widget.destination.longitude) + 0.002;

    final nx = (ll.longitude - minLng) / (maxLng - minLng);
    final ny = 1.0 - (ll.latitude - minLat) / (maxLat - minLat);
    return Offset(nx.clamp(0.05, 0.95), ny.clamp(0.05, 0.95));
  }

  @override
  Widget build(BuildContext context) {
    final vehicleLL = widget.vehicleLocation ?? widget.pickup;
    final pickupNorm = _latLngToNorm(widget.pickup);
    final destNorm = _latLngToNorm(widget.destination);
    final vehicleNorm = _latLngToNorm(vehicleLL);

    return ClipRRect(
      borderRadius: BorderRadius.circular(28),
      child: SizedBox(
        height: widget.height,
        child: Stack(
          children: [
            // ── Real OSM map (light tiles) ───────────────────────────────────
            FlutterMap(
              options: MapOptions(
                initialCenter: LatLng(
                  (widget.pickup.latitude + widget.destination.latitude) / 2,
                  (widget.pickup.longitude + widget.destination.longitude) / 2,
                ),
                initialZoom: 15.5,
                interactionOptions: const InteractionOptions(
                  flags: InteractiveFlag.none,
                ),
              ),
              children: [
                TileLayer(
                  urlTemplate:
                      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.shuttlex.app',
                  tileBuilder: _whiteTileBuilder,
                ),
              ],
            ),

            // ── Isometric city overlay ────────────────────────────────────────
            AnimatedBuilder(
              animation: _pulse,
              builder: (_, __) => CustomPaint(
                painter: IsometricCityPainter(
                  vehiclePos: vehicleNorm,
                  pickupPos: pickupNorm,
                  destPos: destNorm,
                  animT: _pulse.value,
                ),
                child: const SizedBox.expand(),
              ),
            ),

            // ── OBJ model overlay (vehicle) ──────────────────────────────────
            if (widget.showObjModel)
              Positioned(
                left: vehicleNorm.dx *
                        (MediaQuery.of(context).size.width - 120) -
                    20,
                top: vehicleNorm.dy * (widget.height - 80) - 20,
                child: IgnorePointer(
                  child: AnimatedObjModel(
                    assetPath: 'assets/models/moto_simple_1.obj',
                    width: 80,
                    height: 60,
                    fillColor: const Color(0xFFD8D8D8),
                    strokeColor: const Color(0xFF666666),
                    animate: false,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // Tint tile to near-white to match the mockup's pale city aesthetic
  Widget _whiteTileBuilder(BuildContext context, Widget tile, TileImage tileImage) {
    return ColorFiltered(
      colorFilter: const ColorFilter.matrix([
        // Desaturate + brighten toward white
        0.8, 0.1, 0.1, 0, 40,
        0.1, 0.8, 0.1, 0, 40,
        0.1, 0.1, 0.8, 0, 40,
        0,   0,   0,   1, 0,
      ]),
      child: tile,
    );
  }
}
