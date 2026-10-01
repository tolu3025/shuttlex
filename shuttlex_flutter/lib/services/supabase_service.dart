import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/ride.dart';

class SupabaseService {
  static const String supabaseUrl = 'https://jqxsdojqvlsfjzqwxiqi.supabase.co';
  static const String supabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHNkb2pxdmxzZmp6cXd4aXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTU1MDQsImV4cCI6MjEwNjE5MTUwNH0.bzeCDBXdITWWwmCRLpWLxHVkX8zOp_X30kW8_LUDGwo';

  static Future<void> initialize() async {
    try {
      await Supabase.initialize(
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
      );
    } catch (e) {
      // Offline fallback handling
    }
  }

  static SupabaseClient get client => Supabase.instance.client;

  // 1. Fetch Campus Locations from ShuttleX database
  static Future<List<Map<String, dynamic>>> getCampusLocations() async {
    try {
      final data = await client
          .from('campus_locations')
          .select()
          .order('name');
      return List<Map<String, dynamic>>.from(data);
    } catch (_) {
      return [];
    }
  }

  // 2. Fetch Active Bikes from ShuttleX database
  static Future<List<Map<String, dynamic>>> getBikes() async {
    try {
      final data = await client
          .from('bikes')
          .select('*, rider_profiles(*)')
          .eq('is_active', true);
      return List<Map<String, dynamic>>.from(data);
    } catch (_) {
      return [];
    }
  }

  // 3. Create a Ride Request in ShuttleX database
  static Future<Map<String, dynamic>?> createRideRequest({
    required String studentId,
    required LocationPoint pickup,
    required LocationPoint destination,
    required double fare,
    required String vehicleCategory,
  }) async {
    try {
      final res = await client.from('rides').insert({
        'student_id': studentId,
        'pickup_name': pickup.name,
        'destination_name': destination.name,
        'pickup_lat': pickup.latitude,
        'pickup_lng': pickup.longitude,
        'destination_lat': destination.latitude,
        'destination_lng': destination.longitude,
        'total_fare': fare,
        'status': 'SEARCHING',
        'vehicle_category': vehicleCategory,
        'payment_method': 'WALLET',
      }).select().single();
      return res;
    } catch (_) {
      return null;
    }
  }
}
