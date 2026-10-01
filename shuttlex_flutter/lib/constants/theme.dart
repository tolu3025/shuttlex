import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ShuttleXColors {
  static const Color primary = Color(0xFF010101); // Pitch black
  static const Color secondary = Color(0xFF1A1A1A);
  static const Color background = Color(0xFFFAFAFA); // Off-white
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF010101);
  static const Color textSecondary = Color(0xFF666666);
  static const Color textMuted = Color(0xFF999999);
  static const Color border = Color(0xFFEEEEEE);
  static const Color cardBg = Color(0xFFF5F5F7);
  static const Color accentGreen = Color(0xFF10B981);
}

class ShuttleXTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: ShuttleXColors.background,
      colorScheme: const ColorScheme.light(
        primary: ShuttleXColors.primary,
        surface: ShuttleXColors.surface,
        onSurface: ShuttleXColors.textPrimary,
        onPrimary: Colors.white,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme().apply(
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
