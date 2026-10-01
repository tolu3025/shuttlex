import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../models/ride.dart';
import 'obj_model_painter.dart';

class VehicleCard extends StatelessWidget {
  final VehicleOption vehicle;
  final bool isSelected;
  final VoidCallback onTap;

  const VehicleCard({
    super.key,
    required this.vehicle,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? ShuttleXColors.primary : ShuttleXColors.border,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(isSelected ? 0.06 : 0.02),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            // Vehicle visual — OBJ model for bikes, icon for cars
            Container(
              width: 64,
              height: 48,
              decoration: BoxDecoration(
                color: ShuttleXColors.cardBg,
                borderRadius: BorderRadius.circular(16),
              ),
              child: vehicle.isBike
                  ? AnimatedObjModel(
                      assetPath: 'assets/models/moto_simple_1.obj',
                      width: 64,
                      height: 48,
                      fillColor: const Color(0xFFCCCCCC),
                      strokeColor: const Color(0xFF666666),
                      animate: isSelected,
                    )
                  : Icon(
                      Icons.directions_car_filled,
                      color: isSelected
                          ? ShuttleXColors.primary
                          : ShuttleXColors.textMuted,
                      size: 28,
                    ),
            ),
            const SizedBox(width: 14),

            // Vehicle Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        vehicle.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.3,
                        ),
                      ),
                      if (vehicle.isRecommended) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 7, vertical: 2),
                          decoration: BoxDecoration(
                            color: ShuttleXColors.primary,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            "TOP PICK",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    "${vehicle.etaMins} min • 👤 ${vehicle.seats} seat${vehicle.seats > 1 ? 's' : ''}",
                    style: const TextStyle(
                      fontSize: 12,
                      color: ShuttleXColors.textSecondary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    vehicle.description,
                    style: const TextStyle(
                      fontSize: 11,
                      color: ShuttleXColors.textMuted,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),

            // Price & status
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  "\$${vehicle.price.toStringAsFixed(2)}",
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.5,
                  ),
                ),
                if (isSelected)
                  Container(
                    margin: const EdgeInsets.only(top: 4),
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: ShuttleXColors.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(Icons.check, size: 11, color: Colors.white),
                        SizedBox(width: 3),
                        Text(
                          "Selected",
                          style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: Colors.white),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
