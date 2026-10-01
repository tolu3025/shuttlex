import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../widgets/isometric_map.dart';
import 'package:latlong2/latlong.dart';

class RiderDispatcherScreen extends StatefulWidget {
  const RiderDispatcherScreen({super.key});

  @override
  State<RiderDispatcherScreen> createState() => _RiderDispatcherScreenState();
}

class _RiderDispatcherScreenState extends State<RiderDispatcherScreen>
    with SingleTickerProviderStateMixin {
  bool _isOnline = true;
  String _selectedLanguage = 'en'; // 'en', 'pidgin', 'yo'
  bool _hasIncomingOffer = true;
  bool _isAccepted = false;
  late AnimationController _pulseController;

  final Map<String, Map<String, String>> _voicePhrases = {
    'en': {
      'title': 'English',
      'alert': 'New ride! Student at Main Gate going to Faculty of Engineering. Fare is ₦500. Accept?',
      'accept': 'Ride Accepted! Starting navigation to Main Gate.',
      'decline': 'Ride declined. Searching for new campus trips.'
    },
    'pidgin': {
      'title': 'Nigerian Pidgin',
      'alert': 'You get new ride! Student dey Main Gate dey go Engineering. Fare na ₦500. You go carry am?',
      'accept': 'You don accept! Dey open map make you go pick student.',
      'decline': 'You decline. We go find another ride sharp sharp.'
    },
    'yo': {
      'title': 'Yorùbá',
      'alert': 'Ẹkú iṣẹ́ o! Akẹ́kọ̀ọ́ wà ní Main Gate ó ń lọ sí Faculty of Engineering. Owó jẹ́ ₦500. Ṣé o fẹ́ gbà á?',
      'accept': 'O ti gba ride náà! A ti ṣí maapu fún ọ láti lọ gbé akẹ́kọ̀ọ́.',
      'decline': 'O ti kọ̀. A ń wá ride mìíràn fún ọ.'
    },
  };

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _acceptRide() {
    setState(() {
      _isAccepted = true;
      _hasIncomingOffer = false;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_voicePhrases[_selectedLanguage]!['accept']!),
        backgroundColor: ShuttleXColors.accentGreen,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _declineRide() {
    setState(() {
      _hasIncomingOffer = false;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_voicePhrases[_selectedLanguage]!['decline']!),
        backgroundColor: ShuttleXColors.primary,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentPhrase = _voicePhrases[_selectedLanguage]!;

    return Scaffold(
      backgroundColor: ShuttleXColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: ShuttleXColors.border),
            ),
            child: const Icon(Icons.arrow_back, size: 16, color: ShuttleXColors.primary),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "AI Rider Dispatcher",
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 17,
            letterSpacing: -0.4,
            color: ShuttleXColors.primary,
          ),
        ),
        actions: [
          // Language selector pill
          PopupMenuButton<String>(
            onSelected: (val) => setState(() => _selectedLanguage = val),
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'en', child: Text('🇬🇧 English')),
              const PopupMenuItem(value: 'pidgin', child: Text('🇳🇬 Nigerian Pidgin')),
              const PopupMenuItem(value: 'yo', child: Text('🇳🇬 Yorùbá')),
            ],
            child: Container(
              margin: const EdgeInsets.only(right: 16),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: ShuttleXColors.border),
              ),
              child: Row(
                children: [
                  const Icon(Icons.record_voice_over, size: 14, color: ShuttleXColors.primary),
                  const SizedBox(width: 4),
                  Text(
                    _selectedLanguage == 'en'
                        ? 'EN'
                        : _selectedLanguage == 'pidgin'
                            ? 'PIDGIN'
                            : 'YOR',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: ShuttleXColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Status Bar (Online/Offline)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _isOnline ? ShuttleXColors.accentGreen : ShuttleXColors.primary,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: (_isOnline ? ShuttleXColors.accentGreen : ShuttleXColors.primary)
                          .withOpacity(0.3),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        color: _isOnline ? Colors.white : Colors.redAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _isOnline ? "DISPATCHER ONLINE" : "DISPATCHER OFFLINE",
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w900,
                              fontSize: 15,
                              letterSpacing: 0.5,
                            ),
                          ),
                          Text(
                            _isOnline
                                ? "Listening for student trip requests..."
                                : "Tap switch to go online and receive rides",
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.85),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Switch(
                      value: _isOnline,
                      onChanged: (val) => setState(() => _isOnline = val),
                      activeColor: Colors.white,
                      activeTrackColor: Colors.white.withOpacity(0.4),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // 2. Map & Voice Visualizer Orb
              Stack(
                alignment: Alignment.center,
                children: [
                  ShuttleXIsometricMap(
                    pickup: const LatLng(6.5173, 3.3884),
                    destination: const LatLng(6.5160, 3.3930),
                    isBike: true,
                    height: 180,
                    showObjModel: true,
                  ),
                  if (_isOnline && _hasIncomingOffer)
                    Positioned(
                      bottom: 12,
                      child: AnimatedBuilder(
                        animation: _pulseController,
                        builder: (context, child) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: ShuttleXColors.primary.withOpacity(0.95),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: ShuttleXColors.accentGreen,
                                width: 1 + _pulseController.value * 2,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: ShuttleXColors.accentGreen.withOpacity(0.4),
                                  blurRadius: 12 * _pulseController.value,
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: const [
                                Icon(Icons.mic, color: Colors.white, size: 16),
                                SizedBox(width: 8),
                                Text(
                                  "AI Dispatcher Speaking...",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                ],
              ),

              const SizedBox(height: 16),

              // 3. Spoken Announcement Card
              if (_hasIncomingOffer) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: ShuttleXColors.accentGreen, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: ShuttleXColors.accentGreen.withOpacity(0.08),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: const [
                              Icon(Icons.volume_up, color: ShuttleXColors.accentGreen, size: 20),
                              SizedBox(width: 6),
                              Text(
                                "VOICE DISPATCH ALERT",
                                style: TextStyle(
                                  color: ShuttleXColors.accentGreen,
                                  fontWeight: FontWeight.w900,
                                  fontSize: 12,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: ShuttleXColors.cardBg,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Text(
                              "₦500 Fare",
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 13,
                                color: ShuttleXColors.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "\"${currentPhrase['alert']}\"",
                        style: const TextStyle(
                          fontSize: 14,
                          fontStyle: FontStyle.italic,
                          fontWeight: FontWeight.w600,
                          color: ShuttleXColors.textPrimary,
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Action buttons
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: _declineRide,
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.redAccent,
                                side: const BorderSide(color: Colors.redAccent),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                              child: const Text(
                                "Decline (No)",
                                style: TextStyle(fontWeight: FontWeight.w900),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            flex: 2,
                            child: ElevatedButton.icon(
                              onPressed: _acceptRide,
                              icon: const Icon(Icons.check_circle, color: Colors.white, size: 18),
                              label: const Text(
                                "Accept (Yes / Mo gba)",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: ShuttleXColors.accentGreen,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                elevation: 0,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ] else if (_isAccepted) ...[
                // Accepted Trip Card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: ShuttleXColors.border),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.navigation, color: ShuttleXColors.accentGreen, size: 36),
                      const SizedBox(height: 8),
                      const Text(
                        "Trip Active • En Route to Main Gate",
                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 16,
                          color: ShuttleXColors.primary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        "Student: Toluwani (Faculty of Engineering)",
                        style: TextStyle(color: ShuttleXColors.textSecondary, fontSize: 13),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text("Launching Google Maps navigation to Main Gate..."),
                              backgroundColor: ShuttleXColors.primary,
                            ),
                          );
                        },
                        icon: const Icon(Icons.directions, color: Colors.white),
                        label: const Text(
                          "Open Google Maps Navigation",
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: ShuttleXColors.primary,
                          minimumSize: const Size(double.infinity, 48),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ] else ...[
                // Idle waiting state
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: ShuttleXColors.border),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.sensors, color: ShuttleXColors.textMuted, size: 36),
                      const SizedBox(height: 8),
                      const Text(
                        "No Active Offers",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        "AI Dispatcher is scanning campus requests...",
                        style: TextStyle(color: ShuttleXColors.textMuted, fontSize: 12),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => setState(() => _hasIncomingOffer = true),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: ShuttleXColors.cardBg,
                          foregroundColor: ShuttleXColors.primary,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Text("Simulate Incoming Campus Ride (₦500)"),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 16),

              // 4. Today's Earnings Summary
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: ShuttleXColors.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatItem("Today's Fares", "₦4,800", Icons.account_balance_wallet),
                    Container(width: 1, height: 40, color: ShuttleXColors.border),
                    _buildStatItem("Rides Done", "12", Icons.two_wheeler),
                    Container(width: 1, height: 40, color: ShuttleXColors.border),
                    _buildStatItem("Rating", "4.95 ★", Icons.star),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 18, color: ShuttleXColors.accentGreen),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            color: ShuttleXColors.primary,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: ShuttleXColors.textSecondary,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
