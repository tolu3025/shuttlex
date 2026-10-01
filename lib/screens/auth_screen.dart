import 'package:flutter/material.dart';
import '../constants/theme.dart';
import 'home_screen.dart';
import 'rider_dispatcher_screen.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isSignUp = false;
  String _selectedRole = 'STUDENT'; // 'STUDENT' or 'RIDER'
  String _selectedCampus = 'UNILAG (University of Lagos)';

  final TextEditingController _emailPhoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _matricPlateController = TextEditingController();
  bool _obscurePassword = true;

  final List<String> _campuses = [
    'UNILAG (University of Lagos)',
    'UI (University of Ibadan)',
    'OAU (Obafemi Awolowo University)',
    'UNN (University of Nigeria, Nsukka)',
    'FUTA (Federal University of Technology, Akure)',
    'LASU (Lagos State University)',
  ];

  @override
  void dispose() {
    _emailPhoneController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    _matricPlateController.dispose();
    super.dispose();
  }

  void _submitAuth() {
    // Navigate based on role
    if (_selectedRole == 'RIDER') {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const RiderDispatcherScreen()),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ShuttleXColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 12),

              // Brand Logomark & Title
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: ShuttleXColors.primary,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: ShuttleXColors.primary.withOpacity(0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(14),
                      child: Image.asset(
                        'assets/icon/app_icon.png',
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Icon(
                          Icons.two_wheeler,
                          color: Colors.white,
                          size: 26,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      RichText(
                        text: const TextSpan(
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.6,
                            color: ShuttleXColors.primary,
                          ),
                          children: [
                            TextSpan(text: "Shuttle"),
                            TextSpan(
                              text: "X",
                              style: TextStyle(color: ShuttleXColors.accentAmber),
                            ),
                          ],
                        ),
                      ),
                      const Text(
                        "Campus Ride-Hailing & AI Dispatch",
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: ShuttleXColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Greeting Header
              Text(
                _isSignUp ? "Create your account" : "Welcome back",
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.8,
                  color: ShuttleXColors.primary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                _isSignUp
                    ? "Join thousands of students and verified riders on campus."
                    : "Enter your details to access rides or dispatch agent.",
                style: const TextStyle(
                  fontSize: 13,
                  color: ShuttleXColors.textSecondary,
                ),
              ),

              const SizedBox(height: 24),

              // Role Selector Toggle (Student vs Rider)
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: ShuttleXColors.cardBg,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: ShuttleXColors.border),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedRole = 'STUDENT'),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _selectedRole == 'STUDENT'
                                ? ShuttleXColors.primary
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: _selectedRole == 'STUDENT'
                                ? [
                                    BoxShadow(
                                      color: ShuttleXColors.primary.withOpacity(0.3),
                                      blurRadius: 8,
                                    )
                                  ]
                                : [],
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.school,
                                size: 16,
                                color: _selectedRole == 'STUDENT'
                                    ? Colors.white
                                    : ShuttleXColors.textSecondary,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "Student Account",
                                style: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 13,
                                  color: _selectedRole == 'STUDENT'
                                      ? Colors.white
                                      : ShuttleXColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedRole = 'RIDER'),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _selectedRole == 'RIDER'
                                ? ShuttleXColors.primary
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: _selectedRole == 'RIDER'
                                ? [
                                    BoxShadow(
                                      color: ShuttleXColors.primary.withOpacity(0.3),
                                      blurRadius: 8,
                                    )
                                  ]
                                : [],
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.two_wheeler,
                                size: 16,
                                color: _selectedRole == 'RIDER'
                                    ? Colors.white
                                    : ShuttleXColors.textSecondary,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "Rider Partner",
                                style: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 13,
                                  color: _selectedRole == 'RIDER'
                                      ? Colors.white
                                      : ShuttleXColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Campus University Dropdown
              const Text(
                "Select Campus University",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: ShuttleXColors.textPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: ShuttleXColors.border),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedCampus,
                    isExpanded: true,
                    icon: const Icon(Icons.keyboard_arrow_down, color: ShuttleXColors.primary),
                    items: _campuses.map((String campus) {
                      return DropdownMenuItem<String>(
                        value: campus,
                        child: Text(
                          campus,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: ShuttleXColors.textPrimary,
                          ),
                        ),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedCampus = val);
                    },
                  ),
                ),
              ),

              const SizedBox(height: 16),

              if (_isSignUp) ...[
                // Full Name
                const Text(
                  "Full Name",
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                TextField(
                  controller: _nameController,
                  decoration: InputDecoration(
                    hintText: _selectedRole == 'STUDENT' ? "e.g., Toluwani Adams" : "e.g., Babajide Okafor",
                    hintStyle: const TextStyle(color: ShuttleXColors.textMuted, fontSize: 13),
                    filled: true,
                    fillColor: Colors.white,
                    prefixIcon: const Icon(Icons.person_outline, size: 18, color: ShuttleXColors.textSecondary),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: const BorderSide(color: ShuttleXColors.border),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: const BorderSide(color: ShuttleXColors.border),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Phone / Email Field
              const Text(
                "Phone Number or Student Email",
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _emailPhoneController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  hintText: _selectedRole == 'STUDENT' ? "0801 234 5678 or student@unilag.edu.ng" : "0803 456 7890",
                  hintStyle: const TextStyle(color: ShuttleXColors.textMuted, fontSize: 13),
                  filled: true,
                  fillColor: Colors.white,
                  prefixIcon: const Icon(Icons.phone_iphone, size: 18, color: ShuttleXColors.textSecondary),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: ShuttleXColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: ShuttleXColors.border),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Password Field
              const Text(
                "Password",
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  hintText: "••••••••",
                  hintStyle: const TextStyle(color: ShuttleXColors.textMuted, fontSize: 13),
                  filled: true,
                  fillColor: Colors.white,
                  prefixIcon: const Icon(Icons.lock_outline, size: 18, color: ShuttleXColors.textSecondary),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off : Icons.visibility,
                      size: 18,
                      color: ShuttleXColors.textSecondary,
                    ),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: ShuttleXColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: ShuttleXColors.border),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Primary Action Button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: _submitAuth,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: ShuttleXColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                    elevation: 0,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _isSignUp
                            ? (_selectedRole == 'STUDENT' ? "Join as Campus Student" : "Register as Rider Partner")
                            : (_selectedRole == 'STUDENT' ? "Sign In & Ride" : "Sign In & Open Dispatcher"),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.2,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward, color: Colors.white, size: 18),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Toggle Sign In vs Sign Up
              Center(
                child: TextButton(
                  onPressed: () => setState(() => _isSignUp = !_isSignUp),
                  child: RichText(
                    text: TextSpan(
                      style: const TextStyle(fontSize: 13, color: ShuttleXColors.textSecondary),
                      children: [
                        TextSpan(
                          text: _isSignUp ? "Already have an account? " : "New to ShuttleX? ",
                        ),
                        TextSpan(
                          text: _isSignUp ? "Sign In" : "Create Account",
                          style: const TextStyle(
                            color: ShuttleXColors.accentGreen,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Quick Demo Test Bypass
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: ShuttleXColors.cardBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: ShuttleXColors.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    TextButton.icon(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (_) => const HomeScreen()),
                        );
                      },
                      icon: const Icon(Icons.school, size: 14, color: ShuttleXColors.primary),
                      label: const Text(
                        "Demo Student",
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: ShuttleXColors.primary,
                        ),
                      ),
                    ),
                    Container(width: 1, height: 20, color: ShuttleXColors.border),
                    TextButton.icon(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (_) => const RiderDispatcherScreen()),
                        );
                      },
                      icon: const Icon(Icons.two_wheeler, size: 14, color: ShuttleXColors.accentGreen),
                      label: const Text(
                        "Demo Rider",
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: ShuttleXColors.accentGreen,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
