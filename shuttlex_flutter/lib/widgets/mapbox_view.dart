import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../constants/theme.dart';

class ShuttleXMapboxView extends StatelessWidget {
  final LatLng pickup;
  final LatLng destination;
  final LatLng? riderLocation;
  final bool isBike;
  final double height;

  // Token is injected at build time via --dart-define=MAPBOX_TOKEN=<your_token>
  static const String mapboxToken =
      String.fromEnvironment('MAPBOX_TOKEN', defaultValue: '');
  static const String mapboxUrl =
      'https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/256/{z}/{x}/{y}@2x?access_token=$mapboxToken';

  const ShuttleXMapboxView({
    super.key,
    required this.pickup,
    required this.destination,
    this.riderLocation,
    this.isBike = true,
    this.height = 200,
  });

  @override
  Widget build(BuildContext context) {
    final markers = <Marker>[
      // Pickup Marker
      Marker(
        point: pickup,
        width: 32,
        height: 32,
        child: Container(
          decoration: BoxDecoration(
            color: ShuttleXColors.primary,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 2.5),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 6),
            ],
          ),
          child: const Center(
            child: Text(
              "A",
              style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900),
            ),
          ),
        ),
      ),

      // Destination Marker
      Marker(
        point: destination,
        width: 32,
        height: 32,
        child: Container(
          decoration: BoxDecoration(
            color: ShuttleXColors.primary,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 2.5),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 6),
            ],
          ),
          child: const Center(
            child: Text(
              "B",
              style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900),
            ),
          ),
        ),
      ),
    ];

    if (riderLocation != null) {
      markers.add(
        Marker(
          point: riderLocation!,
          width: 38,
          height: 38,
          child: Container(
            decoration: BoxDecoration(
              color: ShuttleXColors.primary,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 8),
              ],
            ),
            child: Icon(
              isBike ? Icons.two_wheeler : Icons.directions_car,
              color: Colors.white,
              size: 20,
            ),
          ),
        ),
      );
    }

    return Container(
      height: height,
      decoration: BoxDecoration(
        color: const Color(0xFFE5E7EB),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: ShuttleXColors.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          FlutterMap(
            options: MapOptions(
              initialCenter: LatLng(
                (pickup.latitude + destination.latitude) / 2,
                (pickup.longitude + destination.longitude) / 2,
              ),
              initialZoom: 14.5,
              interactionOptions: const InteractionOptions(flags: InteractiveFlag.all),
            ),
            children: [
              TileLayer(
                urlTemplate: mapboxUrl,
                additionalOptions: const {
                  'accessToken': mapboxToken,
                },
                userAgentPackageName: 'com.shuttlex.app',
              ),
              PolylineLayer(
                polylines: [
                  Polyline(
                    points: [pickup, destination],
                    color: ShuttleXColors.primary,
                    strokeWidth: 3.5,
                    isDotted: true,
                  ),
                ],
              ),
              MarkerLayer(markers: markers),
            ],
          ),

          // Mapbox Engine Badge
          Positioned(
            bottom: 8,
            left: 8,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.92),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withOpacity(0.6)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  CircleAvatar(radius: 2.5, backgroundColor: ShuttleXColors.primary),
                  SizedBox(width: 4),
                  Text(
                    "Mapbox Engine",
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900),
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
