export type UserRole = 'STUDENT' | 'RIDER' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber: string;
  avatarUrl?: string;
  walletBalance: number;
}

export interface StudentProfile extends UserProfile {
  role: 'STUDENT';
  matricNumber: string;
  faculty: string;
  department: string;
  savedLocations: Array<{ name: string; latitude: number; longitude: number }>;
}

export interface RiderProfile extends UserProfile {
  role: 'RIDER';
  isOnline: boolean;
  preferredLanguage: 'en' | 'pidgin' | 'yo';
  verificationStatus: 'VERIFIED' | 'PENDING' | 'SUSPENDED';
  rating: number;
  completedRidesCount: number;
  todayEarnings: number;
  bikeModel: string;
  bikePlateNumber: string;
  helmetAvailable: boolean;
}
