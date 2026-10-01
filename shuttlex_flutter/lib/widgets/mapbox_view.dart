// mapbox_view.dart — now wraps ShuttleXIsometricMap
// (Mapbox token removed; using OpenStreetMap + isometric overlay)
import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import 'isometric_map.dart';

class ShuttleXMapboxView extends StatelessWidget {
  final LatLng pickup;
  final LatLng destination;
  final LatLng? riderLocation;
  final bool isBike;
  final double height;

  const ShuttleXMapboxView({
    super.key,
    required this.pickup,
    required this.destination,
    this.riderLocation,
    this.isBike = false,
    this.height = 220,
  });

  @override
  Widget build(BuildContext context) {
    return ShuttleXIsometricMap(
      pickup: pickup,
      destination: destination,
      vehicleLocation: riderLocation,
      isBike: isBike,
      height: height,
      showObjModel: isBike, // show the .obj model for bike rides
    );
  }
}
