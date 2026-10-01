import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ShuttleXColors {
  static const Color primary = Color(0xFF0B6B4B); // Primary green
  static const Color primaryGreen = Color(0xFF0B6B4B);
  static const Color deepForest = Color(0xFF071F17); // Deep forest
  static const Color background = Color(0xFFF7F8F5); // Main background
  static const Color surface = Color(0xFFFFFFFF);
  static const Color softGreen = Color(0xFFDFF5EA);
  static const Color accentAmber = Color(0xFFF4B740);
  static const Color errorRed = Color(0xFFD94A4A);
  static const Color textPrimary = Color(0xFF14211B);
  static const Color textSecondary = Color(0xFF738078);
  static const Color textMuted = Color(0xFF738078);
  static const Color border = Color(0xFFE5EAE6);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color accentGreen = Color(0xFF0B6B4B);
}

class ShuttleXTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: ShuttleXColors.background,
      colorScheme: const ColorScheme.light(
        primary: ShuttleXColors.primary,
        secondary: ShuttleXColors.deepForest,
        surface: ShuttleXColors.surface,
        onSurface: ShuttleXColors.textPrimary,
        onPrimary: Colors.white,
      ),
      textTheme: GoogleFonts.interTextTheme().apply(
        bodyColor: ShuttleXColors.textPrimary,
        displayColor: ShuttleXColors.textPrimary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: ShuttleXColors.background,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: ShuttleXColors.textPrimary),
      ),
    );
  }
}
