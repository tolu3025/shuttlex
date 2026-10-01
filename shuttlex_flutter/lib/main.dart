import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'constants/theme.dart';
import 'services/supabase_service.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set status bar icons to dark
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  // Initialize Supabase client
  await SupabaseService.initialize();

  runApp(const ShuttleXApp());
}

class ShuttleXApp extends StatelessWidget {
  const ShuttleXApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShuttleX',
      debugShowCheckedModeBanner: false,
      theme: ShuttleXTheme.lightTheme,
      home: const HomeScreen(),
    );
  }
}
