import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/ride.dart';

class SupabaseService {
  static const String supabaseUrl = 'https://jqxsdojqvlsfjzqwxiqi.supabase.co';
  static const String supabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeHNkb2pxdmxzZmp6cXd4aXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTU1MDQsImV4cCI6MjEwNjE5MTUwNH0.bzeCDBXdITWWwmCRLpWLxHVkX8zOp_X30kW8_LUDGwo';

  static bool _isInitialized = false;

  static Future<void> initialize() async {
    try {
      await Supabase.initialize(
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        authOptions: const FlutterAuthClientOptions(
          authFlowType: AuthFlowType.implicit,
        ),
      );
      _isInitialized = true;
    } catch (e) {
      _isInitialized = false;
    }
  }

  static SupabaseClient? get client {
    if (_isInitialized) {
      try {
        return Supabase.instance.client;
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  // 1. Fetch Campus Locations from ShuttleX database with local fallback
  static Future<List<Map<String, dynamic>>> getCampusLocations() async {
    final c = client;
    if (c != null) {
      try {
        final data = await c
            .from('campus_locations')
            .select()
            .order('name');
        if (data.isNotEmpty) {
          return List<Map<String, dynamic>>.from(data);
        }
      } catch (_) {}
    }
    
    // Default campus landmarks (UNILAG University campus)
    return [
      {
        'id': 'loc-1',
        'name': 'Main Gate',
        'category': 'gate',
        'description': 'Main University Entrance & Shuttle Park',
        'latitude': 6.5173,
        'longitude': 3.3884,
        'is_popular': true
      },
      {
        'id': 'loc-2',
        'name': 'Faculty of Engineering',
        'category': 'academic',
        'description': 'Engineering Complex & Workshops',
        'latitude': 6.5165,
        'longitude': 3.3905,
        'is_popular': true
      },
      {
        'id': 'loc-3',
        'name': 'University Library',
        'category': 'academic',
        'description': 'Main University Library & Study Halls',
        'latitude': 6.5160,
        'longitude': 3.3930,
        'is_popular': true
      },
      {
        'id': 'loc-4',
        'name': 'Senate Building',
        'category': 'hub',
        'description': 'Administrative Complex & Council Chamber',
        'latitude': 6.5190,
        'longitude': 3.3970,
        'is_popular': true
      },
      {
        'id': 'loc-5',
        'name': 'Jaja Hostel / Medical Centre',
        'category': 'residence',
        'description': 'Student Residential Quad & Clinic',
        'latitude': 6.5140,
        'longitude': 3.3910,
        'is_popular': false
      },
      {
        'id': 'loc-6',
        'name': 'New Hall Complex',
        'category': 'residence',
        'description': 'Hostels, Food Court & Student Shops',
        'latitude': 6.5185,
        'longitude': 3.3925,
        'is_popular': true
      }
    ];
  }

  // 2. Fetch Active Bikes from ShuttleX database
  static Future<List<Map<String, dynamic>>> getBikes() async {
    final c = client;
    if (c != null) {
      try {
        final data = await c
            .from('bikes')
            .select('*, rider_profiles(*)')
            .eq('is_active', true);
        if (data.isNotEmpty) {
          return List<Map<String, dynamic>>.from(data);
        }
      } catch (_) {}
    }

    return [
      {
        'id': 'bike-001',
        'make': 'Bajaj',
        'model': 'Boxer 150',
        'color': 'Forest Green',
        'plate_number': 'LND-384-XY',
        'helmet_provided': true,
        'rider_name': 'Ibrahim Musa',
        'rating': 4.95
      }
    ];
  }

  // 3. Create a Ride Request in ShuttleX database
  static Future<Map<String, dynamic>?> createRideRequest({
    required String studentId,
    required LocationPoint pickup,
    required LocationPoint destination,
    required double fare,
    required String vehicleCategory,
  }) async {
    final c = client;
    if (c != null) {
      try {
        final res = await c.from('rides').insert({
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
      } catch (_) {}
    }
    return {
      'id': 'ride-${DateTime.now().millisecondsSinceEpoch}',
      'pickup_name': pickup.name,
      'destination_name': destination.name,
      'total_fare': fare,
      'status': 'SEARCHING',
    };
  }
}
