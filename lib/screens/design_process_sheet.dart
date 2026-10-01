import 'package:flutter/material.dart';
import '../constants/theme.dart';

class DesignProcessSheet extends StatelessWidget {
  const DesignProcessSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: ShuttleXColors.background,
        borderRadius: BorderRadius.vertical(top: Radius.circular(36)),
      ),
      padding: const EdgeInsets.all(24),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle bar
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Section 02 Design Process
            Row(
              children: [
                const Text("//", style: TextStyle(color: ShuttleXColors.textSecondary, fontWeight: FontWeight.bold)),
                const SizedBox(width: 6),
                const CircleAvatar(radius: 3, backgroundColor: ShuttleXColors.primary),
                const SizedBox(width: 6),
                Text(
                  "02 DESIGN PROCESS",
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            const Text(
              "Innovation Through\nDesign Process",
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w900,
                letterSpacing: -0.8,
              ),
            ),
            const SizedBox(height: 16),

            // Sprints Diagram (Strategy, Discovery, Solution)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: ShuttleXColors.border),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSprintColumn("Strategy", ["Goals", "Functional"], [true, false, false]),
                  const SizedBox(width: 8),
                  _buildSprintColumn("Discovery", ["Research", "Journey", "Branding"], [true, true, false]),
                  const SizedBox(width: 8),
                  _buildSprintColumn("Solution", ["Wireframe", "UI Design", "Prototype"], [true, true, true]),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Section 03 Typography & Color
            Row(
              children: [
                const Text("//", style: TextStyle(color: ShuttleXColors.textSecondary, fontWeight: FontWeight.bold)),
                const SizedBox(width: 6),
                const CircleAvatar(radius: 3, backgroundColor: ShuttleXColors.primary),
                const SizedBox(width: 6),
                Text(
                  "03 TYPOGRAPHY & COLOR",
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            const Text(
              "Transforming Ideas Into Visual Harmony",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: -0.5),
            ),
            const SizedBox(height: 14),

            // Lufga Typography & Palette
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: ShuttleXColors.border),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "Lufga",
                        style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900),
                      ),
                      Text(
                        "Clean geometric sans appearance",
                        style: TextStyle(fontSize: 11, color: ShuttleXColors.textSecondary),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      _buildColorDot(const Color(0xFF010101)),
                      _buildColorDot(const Color(0xFFFAFAFA), hasBorder: true),
                      _buildColorDot(const Color(0xFF666666)),
                      _buildColorDot(Colors.white, hasBorder: true),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Return Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: ShuttleXColors.primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: const Text(
                  "Return to ShuttleX App",
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSprintColumn(String title, List<String> items, List<bool> dots) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: dots.map((d) {
              return Container(
                margin: const EdgeInsets.only(right: 3),
                width: 5,
                height: 5,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: d ? ShuttleXColors.primary : Colors.grey[300],
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 4),
          Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
          const SizedBox(height: 6),
          ...items.map((i) => Container(
                margin: const EdgeInsets.only(bottom: 4),
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                decoration: BoxDecoration(
                  color: i == "Branding" || i == "UI Design" ? ShuttleXColors.primary : ShuttleXColors.cardBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  i,
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    color: i == "Branding" || i == "UI Design" ? Colors.white : ShuttleXColors.textPrimary,
                  ),
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildColorDot(Color color, {bool hasBorder = false}) {
    return Container(
      margin: const EdgeInsets.only(left: 4),
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: hasBorder ? Border.all(color: Colors.grey[300]!) : null,
      ),
    );
  }
}
