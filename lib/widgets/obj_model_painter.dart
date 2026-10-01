import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Lightweight OBJ parser — extracts vertices and triangle faces.
class ObjMesh {
  final List<List<double>> vertices; // Each: [x, y, z]
  final List<List<int>> faces; // Each: [v0, v1, v2] (0-indexed)

  ObjMesh({required this.vertices, required this.faces});

  static Future<ObjMesh> loadFromAsset(String assetPath) async {
    final raw = await rootBundle.loadString(assetPath);
    final verts = <List<double>>[];
    final faces = <List<int>>[];

    for (final line in raw.split('\n')) {
      final parts = line.trim().split(RegExp(r'\s+'));
      if (parts.isEmpty) continue;

      if (parts[0] == 'v' && parts.length >= 4) {
        verts.add([
          double.tryParse(parts[1]) ?? 0,
          double.tryParse(parts[2]) ?? 0,
          double.tryParse(parts[3]) ?? 0,
        ]);
      } else if (parts[0] == 'f' && parts.length >= 4) {
        // Face indices (1-based, handle v/vt/vn format)
        int parseIdx(String s) =>
            (int.tryParse(s.split('/')[0]) ?? 1) - 1;
        // Fan-triangulate polygon faces
        final idxs = parts.sublist(1).map(parseIdx).toList();
        for (int i = 1; i < idxs.length - 1; i++) {
          faces.add([idxs[0], idxs[i], idxs[i + 1]]);
        }
      }
    }

    return ObjMesh(vertices: verts, faces: faces);
  }

  /// Bounding box: returns [minX, minY, minZ, maxX, maxY, maxZ]
  List<double> get bounds {
    if (vertices.isEmpty) return [0, 0, 0, 1, 1, 1];
    double minX = vertices[0][0], maxX = vertices[0][0];
    double minY = vertices[0][1], maxY = vertices[0][1];
    double minZ = vertices[0][2], maxZ = vertices[0][2];
    for (final v in vertices) {
      if (v[0] < minX) minX = v[0];
      if (v[0] > maxX) maxX = v[0];
      if (v[1] < minY) minY = v[1];
      if (v[1] > maxY) maxY = v[1];
      if (v[2] < minZ) minZ = v[2];
      if (v[2] > maxZ) maxZ = v[2];
    }
    return [minX, minY, minZ, maxX, maxY, maxZ];
  }
}

/// Isometric projection painter for an OBJ mesh.
/// Projects 3D vertices onto a 2D canvas using a standard isometric transform.
class ObjIsometricPainter extends CustomPainter {
  final ObjMesh mesh;
  final Color fillColor;
  final Color strokeColor;
  final double scale;
  final double rotationY; // radians, for rotating the model

  ObjIsometricPainter({
    required this.mesh,
    this.fillColor = const Color(0xFFE0E0E0),
    this.strokeColor = const Color(0xFF888888),
    this.scale = 1.0,
    this.rotationY = 0.0,
  });

  Offset _project(double x, double y, double z, Size size) {
    // Rotate around Y axis
    final cosR = cos(rotationY);
    final sinR = sin(rotationY);
    final rx = x * cosR + z * sinR;
    final rz = -x * sinR + z * cosR;

    // Standard isometric transform
    const angle = pi / 6; // 30 degrees
    final sx = (rx - rz) * cos(angle);
    final sy = (rx + rz) * sin(angle) - y;

    return Offset(
      size.width / 2 + sx * scale,
      size.height / 2 + sy * scale,
    );
  }

  @override
  void paint(Canvas canvas, Size size) {
    if (mesh.vertices.isEmpty || mesh.faces.isEmpty) return;

    final b = mesh.bounds;
    final cx = (b[0] + b[3]) / 2;
    final cy = (b[1] + b[4]) / 2;
    final cz = (b[2] + b[5]) / 2;
    final maxExtent = max(b[3] - b[0], max(b[4] - b[1], b[5] - b[2]));
    final autoScale = (min(size.width, size.height) * 0.38) /
        (maxExtent > 0 ? maxExtent : 1) *
        scale;

    final fillPaint = Paint()
      ..color = fillColor
      ..style = PaintingStyle.fill;
    final strokePaint = Paint()
      ..color = strokeColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.6;

    for (final face in mesh.faces) {
      if (face.length < 3) continue;
      final v0 = mesh.vertices[face[0]];
      final v1 = mesh.vertices[face[1]];
      final v2 = mesh.vertices[face[2]];

      final p0 = _projectCentered(v0, cx, cy, cz, autoScale, size);
      final p1 = _projectCentered(v1, cx, cy, cz, autoScale, size);
      final p2 = _projectCentered(v2, cx, cy, cz, autoScale, size);

      final path = Path()
        ..moveTo(p0.dx, p0.dy)
        ..lineTo(p1.dx, p1.dy)
        ..lineTo(p2.dx, p2.dy)
        ..close();

      canvas.drawPath(path, fillPaint);
      canvas.drawPath(path, strokePaint);
    }
  }

  Offset _projectCentered(List<double> v, double cx, double cy, double cz,
      double s, Size size) {
    final x = v[0] - cx;
    final y = v[1] - cy;
    final z = v[2] - cz;

    final cosR = cos(rotationY);
    final sinR = sin(rotationY);
    final rx = x * cosR + z * sinR;
    final rz = -x * sinR + z * cosR;

    const angle = pi / 6;
    final sx = (rx - rz) * cos(angle);
    final sy = (rx + rz) * sin(angle) - y;

    return Offset(size.width / 2 + sx * s, size.height / 2 + sy * s);
  }

  @override
  bool shouldRepaint(ObjIsometricPainter old) =>
      old.rotationY != rotationY || old.scale != scale;
}

/// Widget that loads the OBJ model and renders it with an animated Y-rotation.
class AnimatedObjModel extends StatefulWidget {
  final String assetPath;
  final double width;
  final double height;
  final Color fillColor;
  final Color strokeColor;
  final bool animate;

  const AnimatedObjModel({
    super.key,
    required this.assetPath,
    this.width = 120,
    this.height = 80,
    this.fillColor = const Color(0xFFD0D0D0),
    this.strokeColor = const Color(0xFF888888),
    this.animate = false,
  });

  @override
  State<AnimatedObjModel> createState() => _AnimatedObjModelState();
}

class _AnimatedObjModelState extends State<AnimatedObjModel>
    with SingleTickerProviderStateMixin {
  ObjMesh? _mesh;
  late AnimationController _ctrl;
  late Animation<double> _rotation;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..repeat();
    _rotation = Tween(begin: 0.0, end: 2 * pi).animate(_ctrl);
    _loadMesh();
  }

  Future<void> _loadMesh() async {
    try {
      final m = await ObjMesh.loadFromAsset(widget.assetPath);
      if (mounted) setState(() => _mesh = m);
    } catch (_) {
      // Fallback: show icon if OBJ can't load
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_mesh == null) {
      return SizedBox(
        width: widget.width,
        height: widget.height,
        child: const Center(
          child: Icon(Icons.two_wheeler, size: 40, color: Color(0xFF888888)),
        ),
      );
    }

    if (!widget.animate) {
      return CustomPaint(
        size: Size(widget.width, widget.height),
        painter: ObjIsometricPainter(
          mesh: _mesh!,
          fillColor: widget.fillColor,
          strokeColor: widget.strokeColor,
          rotationY: -pi / 6, // static 3/4 angle
        ),
      );
    }

    return AnimatedBuilder(
      animation: _rotation,
      builder: (_, __) => CustomPaint(
        size: Size(widget.width, widget.height),
        painter: ObjIsometricPainter(
          mesh: _mesh!,
          fillColor: widget.fillColor,
          strokeColor: widget.strokeColor,
          rotationY: _rotation.value,
        ),
      ),
    );
  }
}
