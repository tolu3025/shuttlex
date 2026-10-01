import type { CampusLocation, FareConfig } from '../types/ride';

/**
 * Campus locations seeded for the database & campus map
 */
export const DEFAULT_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc-1',
    name: 'Main Gate',
    category: 'gate',
    description: 'Main Campus Entrance & Bus Stop',
    latitude: 6.5173,
    longitude: 3.3884,
    isPopular: true
  },
  {
    id: 'loc-2',
    name: 'Central Library',
    category: 'academic',
    description: 'University Main Library & Study Centre',
    latitude: 6.5160,
    longitude: 3.3930,
    isPopular: true
  },
  {
    id: 'loc-3',
    name: 'Faculty of Engineering',
    category: 'faculty',
    description: 'Engineering Complex & Workshops',
    latitude: 6.5145,
    longitude: 3.3955,
    isPopular: true
  },
  {
    id: 'loc-4',
    name: 'Hostel A (Biobaku)',
    category: 'residence',
    description: 'Male Student Residence Hall',
    latitude: 6.5195,
    longitude: 3.3912,
    isPopular: true
  },
  {
    id: 'loc-5',
    name: 'Hostel B (Moremi)',
    category: 'residence',
    description: 'Female Student Residence Hall',
    latitude: 6.5210,
    longitude: 3.3890,
    isPopular: true
  },
  {
    id: 'loc-6',
    name: '1000-Seat Lecture Theatre',
    category: 'academic',
    description: 'Main Auditorium & Event Centre',
    latitude: 6.5180,
    longitude: 3.3940,
    isPopular: true
  },
  {
    id: 'loc-7',
    name: 'Student Union Building (SUB)',
    category: 'hub',
    description: 'Student Affairs, Shops & Food Court',
    latitude: 6.5165,
    longitude: 3.3915,
    isPopular: true
  },
  {
    id: 'loc-8',
    name: 'Campus Central Cafeteria',
    category: 'dining',
    description: 'Popular Dining Spot & Eatery',
    latitude: 6.5178,
    longitude: 3.3925,
    isPopular: false
  },
  {
    id: 'loc-9',
    name: 'Campus Medical Centre',
    category: 'medical',
    description: 'Health Centre & Pharmacy',
    latitude: 6.5140,
    longitude: 3.3895,
    isPopular: false
  },
  {
    id: 'loc-10',
    name: 'Sports Complex & Pavilion',
    category: 'recreation',
    description: 'Stadium, Gym & Basketball Court',
    latitude: 6.5225,
    longitude: 3.3945,
    isPopular: false
  }
];

export const DEFAULT_FARE_CONFIG: FareConfig = {
  baseFare: 300,        // ₦300 base fee
  pricePerKm: 150,      // ₦150 per km
  minimumFare: 400,     // ₦400 minimum ride price
  peakMultiplier: 1.0,  // Standard 1.0 (surge multiplier editable by admin)
  currency: 'NGN'
};
