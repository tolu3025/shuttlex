import { DEFAULT_CAMPUS_LOCATIONS, DEFAULT_FARE_CONFIG } from '../constants/campus';
import type { CampusLocation, FareConfig, FareEstimate, RideRequest, RiderInfo } from '../types/ride';
import type { RiderProfile, StudentProfile, UserRole } from '../types/user';
import type { VoiceAgentEvent, VoiceLanguage } from '../types/voice';
import { validateStateTransition } from './rideStateMachine';

const STORAGE_KEY_RIDES = 'shuttlex_ride_requests_v1';
const STORAGE_KEY_LOCATIONS = 'shuttlex_campus_locations_v1';
const STORAGE_KEY_FARES = 'shuttlex_fare_config_v1';
const STORAGE_KEY_RIDERS = 'shuttlex_rider_profiles_v1';
const STORAGE_KEY_STUDENT = 'shuttlex_student_profile_v1';
const STORAGE_KEY_VOICE_LOGS = 'shuttlex_voice_agent_events_v1';
const CHANNEL_NAME = 'shuttlex_ride_broadcast_channel';

// Default Seed Rider (Alexander - Toyota Corolla / ShuttleX Vehicle from design mockup)
export const DEFAULT_RIDER: RiderInfo = {
  id: 'rider-001',
  name: 'Alexander',
  phoneNumber: '+44 7911 123456',
  photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  rating: 4.95,
  totalRides: 1420,
  bike: {
    id: 'car-001',
    make: 'Toyota',
    model: 'Corolla',
    color: 'Silver White',
    plateNumber: '10B GMV',
    helmetProvided: true
  },
  currentLocation: {
    latitude: 6.5170,
    longitude: 3.3890
  },
  isVerified: true,
  preferredLanguage: 'en'
};

// Default Seed Student
export const DEFAULT_STUDENT: StudentProfile = {
  id: 'student-001',
  email: 'student@unilag.edu.ng',
  name: 'Chidimma Adeleke',
  role: 'STUDENT',
  phoneNumber: '+234 812 987 6543',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  walletBalance: 6500,
  matricNumber: '210408012',
  faculty: 'Engineering',
  department: 'Computer Engineering',
  savedLocations: [
    { name: 'Main Gate', latitude: 6.5173, longitude: 3.3884 },
    { name: 'Library', latitude: 6.5160, longitude: 3.3930 }
  ]
};

type StoreListener = () => void;

class BackendStore {
  private rides: RideRequest[] = [];
  private locations: CampusLocation[] = [];
  private fareConfig: FareConfig = DEFAULT_FARE_CONFIG;
  private riderProfiles: RiderProfile[] = [];
  private studentProfile: StudentProfile = DEFAULT_STUDENT;
  private voiceLogs: VoiceAgentEvent[] = [];
  private listeners: Set<StoreListener> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private activeRole: UserRole = 'STUDENT';

  constructor() {
    this.loadFromStorage();
    this.initBroadcastChannel();
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      this.broadcastChannel.onmessage = (event) => {
        if (event.data === 'SYNC_STATE') {
          this.loadFromStorage();
          this.notify();
        }
      };
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_RIDES, JSON.stringify(this.rides));
      localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(this.locations));
      localStorage.setItem(STORAGE_KEY_FARES, JSON.stringify(this.fareConfig));
      localStorage.setItem(STORAGE_KEY_RIDERS, JSON.stringify(this.riderProfiles));
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(this.studentProfile));
      localStorage.setItem(STORAGE_KEY_VOICE_LOGS, JSON.stringify(this.voiceLogs));
      
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage('SYNC_STATE');
      }
    } catch (err) {
      console.error('Failed to save ShuttleX state to storage:', err);
    }
  }

  private loadFromStorage() {
    try {
      const storedRides = localStorage.getItem(STORAGE_KEY_RIDES);
      const storedLocs = localStorage.getItem(STORAGE_KEY_LOCATIONS);
      const storedFares = localStorage.getItem(STORAGE_KEY_FARES);
      const storedRiders = localStorage.getItem(STORAGE_KEY_RIDERS);
      const storedStudent = localStorage.getItem(STORAGE_KEY_STUDENT);
      const storedVoiceLogs = localStorage.getItem(STORAGE_KEY_VOICE_LOGS);

      this.rides = storedRides ? JSON.parse(storedRides) : [];
      this.locations = storedLocs ? JSON.parse(storedLocs) : DEFAULT_CAMPUS_LOCATIONS;
      this.fareConfig = storedFares ? JSON.parse(storedFares) : DEFAULT_FARE_CONFIG;
      this.voiceLogs = storedVoiceLogs ? JSON.parse(storedVoiceLogs) : [];

      this.studentProfile = storedStudent ? JSON.parse(storedStudent) : DEFAULT_STUDENT;

      if (storedRiders) {
        this.riderProfiles = JSON.parse(storedRiders);
      } else {
        this.riderProfiles = [
          {
            id: DEFAULT_RIDER.id,
            email: 'rider@unilag.edu.ng',
            name: DEFAULT_RIDER.name,
            role: 'RIDER',
            phoneNumber: DEFAULT_RIDER.phoneNumber,
            avatarUrl: DEFAULT_RIDER.photoUrl,
            walletBalance: 14200,
            isOnline: true,
            preferredLanguage: 'en',
            verificationStatus: 'VERIFIED',
            rating: DEFAULT_RIDER.rating,
            completedRidesCount: DEFAULT_RIDER.totalRides,
            todayEarnings: 8500,
            bikeModel: `${DEFAULT_RIDER.bike.make} ${DEFAULT_RIDER.bike.model}`,
            bikePlateNumber: DEFAULT_RIDER.bike.plateNumber,
            helmetAvailable: true
          }
        ];
      }
    } catch (err) {
      console.error('Error loading ShuttleX state:', err);
    }
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // --- ROLE MANAGEMENT ---
  public getActiveRole(): UserRole {
    return this.activeRole;
  }

  public setActiveRole(role: UserRole) {
    this.activeRole = role;
    this.notify();
  }

  // --- DATA GETTERS ---
  public getRides(): RideRequest[] {
    return [...this.rides];
  }

  public getActiveRideForStudent(studentId: string = DEFAULT_STUDENT.id): RideRequest | undefined {
    return this.rides.find(
      (r) =>
        r.studentId === studentId &&
        !['COMPLETED', 'DECLINED', 'CANCELLED_BY_STUDENT', 'CANCELLED_BY_RIDER', 'EXPIRED'].includes(r.status)
    );
  }

  public getActiveRideForRider(riderId: string = DEFAULT_RIDER.id): RideRequest | undefined {
    return this.rides.find(
      (r) =>
        (r.riderId === riderId || (r.status === 'OFFERED' && (!r.riderId || r.riderId === riderId))) &&
        !['COMPLETED', 'DECLINED', 'CANCELLED_BY_STUDENT', 'CANCELLED_BY_RIDER', 'EXPIRED'].includes(r.status)
    );
  }

  public getPendingOfferedRide(): RideRequest | undefined {
    return this.rides.find((r) => r.status === 'OFFERED' || r.status === 'SEARCHING');
  }

  public getCampusLocations(): CampusLocation[] {
    return [...this.locations];
  }

  public getFareConfig(): FareConfig {
    return { ...this.fareConfig };
  }

  public updateFareConfig(newConfig: FareConfig) {
    this.fareConfig = newConfig;
    this.saveToStorage();
    this.notify();
  }

  public getStudentProfile(): StudentProfile {
    return { ...this.studentProfile };
  }

  public getRiderProfile(riderId: string = DEFAULT_RIDER.id): RiderProfile {
    const rider = this.riderProfiles.find((r) => r.id === riderId);
    if (rider) return { ...rider };
    return {
      id: riderId,
      email: 'rider@unilag.edu.ng',
      name: DEFAULT_RIDER.name,
      role: 'RIDER',
      phoneNumber: DEFAULT_RIDER.phoneNumber,
      avatarUrl: DEFAULT_RIDER.photoUrl,
      walletBalance: 14200,
      isOnline: true,
      preferredLanguage: 'en',
      verificationStatus: 'VERIFIED',
      rating: DEFAULT_RIDER.rating,
      completedRidesCount: DEFAULT_RIDER.totalRides,
      todayEarnings: 8500,
      bikeModel: 'Honda Ace CB125',
      bikePlateNumber: 'KJA-482-XY',
      helmetAvailable: true
    };
  }

  public getVoiceLogs(): VoiceAgentEvent[] {
    return [...this.voiceLogs];
  }

  public logVoiceEvent(event: Omit<VoiceAgentEvent, 'id' | 'timestamp'>) {
    const newEvent: VoiceAgentEvent = {
      ...event,
      id: `voice-evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.voiceLogs.unshift(newEvent);
    if (this.voiceLogs.length > 50) this.voiceLogs.pop();
    this.saveToStorage();
    this.notify();
  }

  public toggleRiderOnline(riderId: string = DEFAULT_RIDER.id, isOnline: boolean) {
    const index = this.riderProfiles.findIndex((r) => r.id === riderId);
    if (index !== -1) {
      this.riderProfiles[index].isOnline = isOnline;
    } else {
      this.riderProfiles.push({
        ...this.getRiderProfile(riderId),
        isOnline
      });
    }
    this.saveToStorage();
    this.notify();
  }

  public setRiderLanguage(riderId: string = DEFAULT_RIDER.id, language: VoiceLanguage) {
    const index = this.riderProfiles.findIndex((r) => r.id === riderId);
    if (index !== -1) {
      this.riderProfiles[index].preferredLanguage = language;
      this.saveToStorage();
      this.notify();
    }
  }

  // --- CONTROLLED BACKEND TOOLS (SPEC REQUIRED) ---

  /**
   * 1. requestRide - Student requests a new ride
   */
  public requestRide(
    studentId: string,
    pickup: RideRequest['pickup'],
    destination: RideRequest['destination'],
    fare: FareEstimate,
    paymentMethod: RideRequest['paymentMethod'] = 'WALLET'
  ): RideRequest {
    const newRide: RideRequest = {
      id: `ride-${Date.now().toString().slice(-6)}`,
      studentId,
      student: {
        id: this.studentProfile.id,
        name: this.studentProfile.name,
        phoneNumber: this.studentProfile.phoneNumber,
        matricNumber: this.studentProfile.matricNumber,
        photoUrl: this.studentProfile.avatarUrl,
        walletBalance: this.studentProfile.walletBalance
      },
      pickup,
      destination,
      fare,
      status: 'SEARCHING',
      createdAt: new Date().toISOString(),
      paymentMethod,
      paymentStatus: 'PENDING'
    };

    this.rides.unshift(newRide);
    this.saveToStorage();
    this.notify();

    // Automatically transition to OFFERED to assign available online rider after 1.5 seconds
    setTimeout(() => {
      this.autoAssignRiderToRide(newRide.id);
    }, 1500);

    return newRide;
  }

  private autoAssignRiderToRide(rideId: string) {
    const ride = this.rides.find((r) => r.id === rideId);
    if (ride && ride.status === 'SEARCHING') {
      try {
        validateStateTransition(ride.status, 'OFFERED');
        ride.status = 'OFFERED';
        ride.riderId = DEFAULT_RIDER.id;
        ride.rider = DEFAULT_RIDER;
        this.saveToStorage();
        this.notify();
      } catch (err) {
        console.error('State transition error during auto-assign:', err);
      }
    }
  }

  /**
   * 2. accept_ride(ride_id) - Controlled backend function called by Voice Agent or UI
   */
  public accept_ride(rideId: string, riderId: string = DEFAULT_RIDER.id): RideRequest {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) throw new Error(`Ride ${rideId} not found.`);
    
    validateStateTransition(ride.status, 'ACCEPTED');

    ride.status = 'ACCEPTED';
    ride.riderId = riderId;
    ride.rider = DEFAULT_RIDER;
    ride.acceptedAt = new Date().toISOString();

    this.saveToStorage();
    this.notify();
    return ride;
  }

  /**
   * 3. decline_ride(ride_id) - Controlled backend function
   */
  public decline_ride(rideId: string, _riderId: string = DEFAULT_RIDER.id): RideRequest {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) throw new Error(`Ride ${rideId} not found.`);

    validateStateTransition(ride.status, 'DECLINED');

    ride.status = 'DECLINED';
    this.saveToStorage();
    this.notify();
    return ride;
  }

  /**
   * 4. mark_rider_arrived(ride_id) - Controlled backend function
   */
  public mark_rider_arrived(rideId: string): RideRequest {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) throw new Error(`Ride ${rideId} not found.`);

    // Support ARRIVED transition directly from ACCEPTED or RIDER_EN_ROUTE
    if (ride.status === 'ACCEPTED') {
      ride.status = 'RIDER_EN_ROUTE';
    }
    validateStateTransition(ride.status, 'ARRIVED');

    ride.status = 'ARRIVED';
    ride.arrivedAt = new Date().toISOString();

    this.saveToStorage();
    this.notify();
    return ride;
  }

  /**
   * 5. start_ride(ride_id) - Controlled backend function
   */
  public start_ride(rideId: string): RideRequest {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) throw new Error(`Ride ${rideId} not found.`);

    validateStateTransition(ride.status, 'TRIP_STARTED');

    ride.status = 'TRIP_STARTED';
    ride.startedAt = new Date().toISOString();

    this.saveToStorage();
    this.notify();
    return ride;
  }

  /**
   * 6. complete_ride(ride_id) - Controlled backend function
   */
  public complete_ride(rideId: string): RideRequest {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) throw new Error(`Ride ${rideId} not found.`);

    validateStateTransition(ride.status, 'COMPLETED');

    ride.status = 'COMPLETED';
    ride.completedAt = new Date().toISOString();
    ride.paymentStatus = 'PAID';

    // Update wallet and rider earnings
    const fareAmount = ride.fare.totalFare;
    if (this.studentProfile.walletBalance >= fareAmount) {
      this.studentProfile.walletBalance -= fareAmount;
    }

    const riderProfile = this.getRiderProfile(ride.riderId || DEFAULT_RIDER.id);
    riderProfile.todayEarnings += fareAmount;
    riderProfile.walletBalance += fareAmount * 0.85; // 85% rider payout, 15% platform fee
    riderProfile.completedRidesCount += 1;

    const index = this.riderProfiles.findIndex((r) => r.id === riderProfile.id);
    if (index !== -1) {
      this.riderProfiles[index] = riderProfile;
    }

    this.saveToStorage();
    this.notify();
    return ride;
  }

  /**
   * 7. cancel_ride - Cancel ride by student
   */
  public cancelRide(rideId: string, reason: string = 'Changed mind'): RideRequest {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) throw new Error(`Ride ${rideId} not found.`);

    validateStateTransition(ride.status, 'CANCELLED_BY_STUDENT');
    ride.status = 'CANCELLED_BY_STUDENT';
    ride.cancellationReason = reason;

    this.saveToStorage();
    this.notify();
    return ride;
  }

  /**
   * 8. rate_ride - Rate completed ride
   */
  public rateRide(rideId: string, rating: number, feedback?: string) {
    const ride = this.rides.find((r) => r.id === rideId);
    if (ride) {
      ride.rating = rating;
      ride.feedback = feedback;
      this.saveToStorage();
      this.notify();
    }
  }

  /**
   * 9. topUpWallet - Student tops up wallet balance
   */
  public topUpWallet(amount: number) {
    this.studentProfile.walletBalance += amount;
    this.saveToStorage();
    this.notify();
  }

  /**
   * 10. CRUD Campus Locations for Admin
   */
  public addCampusLocation(loc: Omit<CampusLocation, 'id'>) {
    const newLoc: CampusLocation = {
      ...loc,
      id: `loc-${Date.now()}`
    };
    this.locations.push(newLoc);
    this.saveToStorage();
    this.notify();
  }

  public deleteCampusLocation(id: string) {
    this.locations = this.locations.filter((l) => l.id !== id);
    this.saveToStorage();
    this.notify();
  }
}

export const backendStore = new BackendStore();
