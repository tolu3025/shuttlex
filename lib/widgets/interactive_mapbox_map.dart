import 'package:flutter/material.dart' hide Path;
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../constants/theme.dart';
import '../constants/mapbox_config.dart';

class InteractiveMapboxMap extends StatefulWidget {
  final LatLng pickup;
  final LatLng destination;
  final LatLng? riderLocation;
  final bool isTracking;
  final double height;
  final List<LatLng>? nearbyBikes;

  const InteractiveMapboxMap({
    super.key,
    required this.pickup,
    required this.destination,
    this.riderLocation,
    this.isTracking = false,
    this.height = 240,
    this.nearbyBikes,
  });

  @override
  State<InteractiveMapboxMap> createState() => _InteractiveMapboxMapState();
}

class _InteractiveMapboxMapState extends State<InteractiveMapboxMap> {
  late final MapController _mapController;

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final centerLat = (widget.pickup.latitude + widget.destination.latitude) / 2;
    final centerLng = (widget.pickup.longitude + widget.destination.longitude) / 2;

    final markers = <Marker>[
      // Pickup Pin (A - Green)
      Marker(
        point: widget.pickup,
        width: 44,
        height: 44,
        child: Container(
          decoration: BoxDecoration(
            color: ShuttleXColors.primary,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 3),
            boxShadow: [
              BoxShadow(
                color: ShuttleXColors.primary.withOpacity(0.4),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: const Center(
            child: Text(
              "A",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w900,
                fontSize: 15,
              ),
            ),
          ),
        ),
      ),

      // Destination Pin (B - Dark Forest)
      Marker(
        point: widget.destination,
        width: 44,
        height: 44,
        child: Container(
          decoration: BoxDecoration(
            color: ShuttleXColors.forestDeep,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 3),
            boxShadow: [
              BoxShadow(
                color: ShuttleXColors.forestDeep.withOpacity(0.4),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: const Center(
            child: Text(
              "B",
              style: TextStyle(
                color: ShuttleXColors.accentAmber,
                fontWeight: FontWeight.w900,
                fontSize: 15,
              ),
            ),
          ),
        ),
      ),
    ];

    // Live Rider Marker
    if (widget.riderLocation != null) {
      markers.add(
        Marker(
          point: widget.riderLocation!,
          width: 50,
          height: 50,
          child: Container(
            decoration: BoxDecoration(
              color: ShuttleXColors.accentGreen,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
              boxShadow: [
                BoxShadow(
                  color: ShuttleXColors.accentGreen.withOpacity(0.5),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Icon(Icons.two_wheeler, color: Colors.white, size: 24),
          ),
        ),
      );
    }

    // Nearby Available Bikes
    if (widget.nearbyBikes != null) {
      for (final bikePos in widget.nearbyBikes!) {
        markers.add(
          Marker(
            point: bikePos,
            width: 32,
            height: 32,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: ShuttleXColors.primary, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.12),
                    blurRadius: 6,
                  ),
                ],
              ),
              child: const Icon(
                Icons.two_wheeler,
                size: 16,
                color: ShuttleXColors.primary,
              ),
            ),
          ),
        );
      }
    }

    return Container(
      height: widget.height,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: const Color(0xFFE8ECE9),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: ShuttleXColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: LatLng(centerLat, centerLng),
              initialZoom: 15.2,
              interactionOptions: const InteractionOptions(
                flags: InteractiveFlag.all,
              ),
            ),
            children: [
              // 1. Official Mapbox Streets v12 Vector/Raster Layer
              TileLayer(
                urlTemplate: MapboxConfig.streetsTilesUrl,
                userAgentPackageName: 'com.shuttlex.app',
                maxZoom: 19,
                tileSize: 256,
              ),

              // 2. Route Polyline
              PolylineLayer(
                polylines: [
                  Polyline(
                    points: [
                      widget.pickup,
                      LatLng(
                        (widget.pickup.latitude + widget.destination.latitude) / 2 + 0.0004,
                        (widget.pickup.longitude + widget.destination.longitude) / 2 - 0.0003,
                      ),
                      widget.destination,
                    ],
                    strokeWidth: 4.5,
                    color: ShuttleXColors.primary,
                    borderColor: Colors.white.withOpacity(0.8),
                    borderStrokeWidth: 1.5,
                  ),
                ],
              ),

              // 3. Markers Layer
              MarkerLayer(markers: markers),
            ],
          ),

          // Mapbox Attribution Tag & Live Badge
          Positioned(
            top: 10,
            left: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.92),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 6,
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                      color: ShuttleXColors.accentGreen,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    "Mapbox Streets HD",
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      color: ShuttleXColors.forestDeep,
                      letterSpacing: -0.2,
                    ),
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
