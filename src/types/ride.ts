export type RideStatus =
  | 'REQUESTED'
  | 'SEARCHING'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'RIDER_EN_ROUTE'
  | 'ARRIVED'
  | 'TRIP_STARTED'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED_BY_STUDENT'
  | 'CANCELLED_BY_RIDER'
  | 'EXPIRED'
  | 'DISPUTED';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  category: 'gate' | 'academic' | 'residence' | 'hub' | 'dining' | 'medical' | 'recreation' | 'faculty';
  description: string;
  latitude: number;
  longitude: number;
  isPopular: boolean;
}

export interface FareConfig {
  baseFare: number;
  pricePerKm: number;
  minimumFare: number;
  peakMultiplier: number;
  currency: string;
}

export interface FareEstimate {
  baseFare: number;
  distanceKm: number;
  durationMins: number;
  totalFare: number;
  currency: string;
}

export interface BikeInfo {
  id: string;
  make: string;      // e.g. "Honda"
  model: string;     // e.g. "Ace CB125"
  color: string;     // e.g. "Emerald Green"
  plateNumber: string; // e.g. "KJA-482-XY"
  helmetProvided: boolean;
}

export interface RiderInfo {
  id: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
  rating: number;
  totalRides: number;
  bike: BikeInfo;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  isVerified: boolean;
  preferredLanguage: 'en' | 'pidgin' | 'yo';
}

export interface StudentInfo {
  id: string;
  name: string;
  phoneNumber: string;
  matricNumber?: string;
  photoUrl?: string;
  walletBalance: number;
}

export interface RideRequest {
  id: string;
  studentId: string;
  student: StudentInfo;
  riderId?: string;
  rider?: RiderInfo;
  pickup: LocationPoint;
  destination: LocationPoint;
  fare: FareEstimate;
  status: RideStatus;
  createdAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  rating?: number;
  feedback?: string;
  paymentMethod: 'WALLET' | 'PAYSTACK' | 'CASH';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  cancellationReason?: string;
}

export interface RideStatusEvent {
  id: string;
  rideId: string;
  previousStatus: RideStatus | null;
  newStatus: RideStatus;
  triggeredBy: 'STUDENT' | 'RIDER' | 'VOICE_AGENT' | 'SYSTEM' | 'ADMIN';
  timestamp: string;
  metadata?: Record<string, any>;
}
