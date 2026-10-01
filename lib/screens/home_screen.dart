import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../widgets/hero_road_perspective.dart';
import 'vehicle_selection_screen.dart';
import 'design_process_sheet.dart';
import 'rider_dispatcher_screen.dart';
import 'wallet_earnings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _activeNavIndex = 0;
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, String>> _popularPlaces = [
    {"name": "Central Campus", "desc": "Main Gate & Terminal"},
    {"name": "Innovation Hub", "desc": "Engineering & Tech Labs"},
    {"name": "University Library", "desc": "Main Study Centre"},
    {"name": "Student Residence", "desc": "Hostel Quarters"},
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _openRideSelection([String destination = 'Work']) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => VehicleSelectionScreen(
          pickupName: 'Home',
          destinationName: destination,
        ),
      ),
    );
  }

  void _showDesignProcess() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const DesignProcessSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ShuttleXColors.background,
      body: SafeArea(
        child: Stack(
          children: [
            SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Status & Navigation Bar (Slide 4 Mockup)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Hamburger Menu
                      GestureDetector(
                        onTap: _showDesignProcess,
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            border: Border.all(color: ShuttleXColors.border),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.04),
                                blurRadius: 10,
                              ),
                            ],
                          ),
                          child: const Icon(Icons.menu, size: 20, color: ShuttleXColors.primary),
                        ),
                      ),

                      // Location Pill
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: ShuttleXColors.border),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                        child: Row(
                          children: const [
                            Icon(Icons.location_on, size: 16, color: ShuttleXColors.primary),
                            SizedBox(width: 6),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "Location",
                                  style: TextStyle(
                                    fontSize: 9,
                                    color: ShuttleXColors.textSecondary,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  "Green Park (UK)",
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w900,
                                    color: ShuttleXColors.primary,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      // Notification Bell
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(color: ShuttleXColors.border),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            const Icon(Icons.notifications_none, size: 22, color: ShuttleXColors.primary),
                            Positioned(
                              top: 11,
                              right: 12,
                              child: Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: ShuttleXColors.primary,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Headline: Go When \n You Want Anywhere.
                  Row(
                    children: const [
                      Text(
                        "Go When",
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: ShuttleXColors.textSecondary,
                          letterSpacing: 0.2,
                        ),
                      ),
                      SizedBox(width: 4),
                      Text("🚗", style: TextStyle(fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  RichText(
                    text: const TextSpan(
                      style: TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.w900,
                        color: ShuttleXColors.primary,
                        letterSpacing: -1.0,
                        height: 1.15,
                        fontFamily: 'Plus Jakarta Sans',
                      ),
                      children: [
                        TextSpan(text: "You Want "),
                        TextSpan(
                          text: "Anywhere.",
                          style: TextStyle(
                            fontStyle: FontStyle.italic,
                            decoration: TextDecoration.underline,
                            decorationThickness: 2,
                            decorationColor: Color(0xFF999999),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Search Bar: Where to?
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: ShuttleXColors.border),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 12,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.search, color: ShuttleXColors.textSecondary, size: 22),
                        const SizedBox(width: 10),
                        Expanded(
                          child: TextField(
                            controller: _searchController,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            decoration: const InputDecoration(
                              hintText: "Where to?",
                              hintStyle: TextStyle(color: ShuttleXColors.textMuted, fontWeight: FontWeight.bold),
                              border: InputBorder.none,
                            ),
                            onSubmitted: (val) {
                              if (val.trim().isNotEmpty) {
                                _openRideSelection(val.trim());
                              }
                            },
                          ),
                        ),
                        GestureDetector(
                          onTap: () => _openRideSelection(),
                          child: Container(
                            width: 34,
                            height: 34,
                            decoration: const BoxDecoration(
                              color: ShuttleXColors.primary,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.tune, color: Colors.white, size: 16),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  // 3D Hero Perspective Road Component
                  HeroRoadPerspective(
                    onTapRide: () => _openRideSelection("Campus Hub"),
                    onTapSchedule: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("Scheduling activated for tomorrow 9:00 AM!"),
                          backgroundColor: ShuttleXColors.primary,
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 18),

                  // Popular Destinations
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: ShuttleXColors.border),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.03),
                          blurRadius: 12,
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              "POPULAR DESTINATIONS",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 0.8,
                                color: ShuttleXColors.primary,
                              ),
                            ),
                            GestureDetector(
                              onTap: _showDesignProcess,
                              child: Row(
                                children: const [
                                  Icon(Icons.auto_awesome, size: 13, color: ShuttleXColors.primary),
                                  SizedBox(width: 4),
                                  Text(
                                    "Design Story",
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: ShuttleXColors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        ..._popularPlaces.map((p) {
                          return ListTile(
                            contentPadding: EdgeInsets.zero,
                            leading: Container(
                              width: 38,
                              height: 38,
                              decoration: BoxDecoration(
                                color: ShuttleXColors.cardBg,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.location_on_outlined, color: ShuttleXColors.primary, size: 18),
                            ),
                            title: Text(
                              p["name"]!,
                              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                            ),
                            subtitle: Text(
                              p["desc"]!,
                              style: const TextStyle(fontSize: 11, color: ShuttleXColors.textSecondary),
                            ),
                            trailing: const Icon(Icons.arrow_forward_ios, size: 12, color: Colors.grey),
                            onTap: () => _openRideSelection(p["name"]!),
                          );
                        }),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Floating Bottom Navigation Bar (Slide 4 Mockup)
            Positioned(
              left: 20,
              right: 20,
              bottom: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(36),
                  border: Border.all(color: ShuttleXColors.border),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.09),
                      blurRadius: 24,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildNavItem(0, Icons.home_filled, "Home"),
                    _buildNavItem(1, Icons.two_wheeler, "Ride"),
                    _buildNavItem(2, Icons.record_voice_over, "Dispatch"),
                    _buildNavItem(3, Icons.account_balance_wallet, "Wallet"),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _activeNavIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() => _activeNavIndex = index);
        if (index == 1) {
          _openRideSelection();
        } else if (index == 2) {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const RiderDispatcherScreen()),
          );
        } else if (index == 3) {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const WalletEarningsScreen()),
          );
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? ShuttleXColors.cardBg : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 22,
              color: isSelected ? ShuttleXColors.primary : ShuttleXColors.textMuted,
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                color: isSelected ? ShuttleXColors.primary : ShuttleXColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
