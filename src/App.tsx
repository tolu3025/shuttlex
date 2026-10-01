import { useState, useEffect } from 'react';
import type { UserRole } from './types/user';
import type { RideRequest, LocationPoint, FareEstimate } from './types/ride';
import { backendStore } from './services/backendStore';

import { Header } from './components/common/Header';
import { StudentHome } from './components/student/StudentHome';
import { SearchingOverlay } from './components/student/SearchingOverlay';
import { LiveRideTracker } from './components/student/LiveRideTracker';
import { StudentCompletion } from './components/student/StudentCompletion';
import { StudentRides } from './components/student/StudentRides';
import { StudentWallet } from './components/student/StudentWallet';
import { StudentProfileView } from './components/student/StudentProfile';

import { RiderHome } from './components/rider/RiderHome';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { Home, Car, User, Wallet } from 'lucide-react';

export function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('STUDENT');
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [studentTab, setStudentTab] = useState<'home' | 'rides' | 'wallet' | 'profile'>('home');

  const [activeRide, setActiveRide] = useState<RideRequest | undefined>(
    backendStore.getActiveRideForStudent()
  );
  const [searchingRideInfo, setSearchingRideInfo] = useState<{
    pickup: LocationPoint;
    destination: LocationPoint;
    fare: FareEstimate;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = backendStore.subscribe(() => {
      const currentRide = backendStore.getActiveRideForStudent();
      setActiveRide(currentRide);

      if (currentRide && currentRide.status !== 'SEARCHING') {
        setSearchingRideInfo(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleRequestRide = (pickup: LocationPoint, destination: LocationPoint, fare: FareEstimate) => {
    setSearchingRideInfo({ pickup, destination, fare });
    backendStore.requestRide(
      backendStore.getStudentProfile().id,
      pickup,
      destination,
      fare,
      'WALLET'
    );
  };

  const handleCancelRequest = () => {
    if (activeRide) {
      backendStore.cancelRide(activeRide.id, 'Cancelled by student');
    }
    setSearchingRideInfo(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#010101] flex flex-col font-sans selection:bg-[#010101] selection:text-white">
      {/* Sticky App Header */}
      <Header
        activeRole={activeRole}
        onRoleChange={(role) => {
          setActiveRole(role);
          setIsSplitView(false);
        }}
        isSplitView={isSplitView}
        onToggleSplitView={() => setIsSplitView(!isSplitView)}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {/* DUAL SPLIT-VIEW SIMULATOR MODE */}
        {isSplitView ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student App Phone Frame */}
            <div className="bg-white rounded-[36px] p-4 shadow-2xl border-4 border-[#010101] relative overflow-hidden space-y-4">
              <div className="bg-[#010101] text-white px-3.5 py-1.5 rounded-full text-[11px] font-extrabold flex items-center justify-between">
                <span>📱 PASSENGER APP</span>
                <span>ShuttleX</span>
              </div>
              <StudentHome onRequestRide={handleRequestRide} activeRide={activeRide} />
            </div>

            {/* Rider App Phone Frame */}
            <div className="bg-white rounded-[36px] p-4 shadow-2xl border-4 border-gray-800 relative overflow-hidden space-y-4">
              <div className="bg-[#1A1A1A] text-amber-400 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold flex items-center justify-between">
                <span>🎙️ DRIVER VOICE AGENT</span>
                <span>AI Live Dispatch</span>
              </div>
              <RiderHome />
            </div>
          </div>
        ) : (
          /* SINGLE ROLE VIEW */
          <div>
            {/* 1. STUDENT ROLE EXPERIENCE */}
            {activeRole === 'STUDENT' && (
              <div>
                {/* Searching Modal */}
                {searchingRideInfo && activeRide?.status === 'SEARCHING' && (
                  <SearchingOverlay
                    pickup={searchingRideInfo.pickup}
                    destination={searchingRideInfo.destination}
                    onCancel={handleCancelRequest}
                  />
                )}

                {/* Ride Completion View */}
                {activeRide?.status === 'COMPLETED' && (
                  <StudentCompletion
                    ride={activeRide}
                    onDone={() => {
                      setStudentTab('home');
                    }}
                  />
                )}

                {/* Active Live Ride Tracking View */}
                {activeRide &&
                  ['SEARCHING', 'OFFERED', 'ACCEPTED', 'RIDER_EN_ROUTE', 'ARRIVED', 'TRIP_STARTED'].includes(
                    activeRide.status
                  ) && (
                    <LiveRideTracker
                      ride={activeRide}
                      onCancelRide={handleCancelRequest}
                    />
                  )}

                {/* Standard Student Navigation Screens (When no active live ride) */}
                {(!activeRide || activeRide.status === 'COMPLETED') && (
                  <div>
                    {studentTab === 'home' && (
                      <StudentHome
                        onRequestRide={handleRequestRide}
                        activeRide={activeRide}
                      />
                    )}
                    {studentTab === 'rides' && <StudentRides />}
                    {studentTab === 'wallet' && <StudentWallet />}
                    {studentTab === 'profile' && <StudentProfileView />}
                  </div>
                )}
              </div>
            )}

            {/* 2. RIDER ROLE EXPERIENCE */}
            {activeRole === 'RIDER' && <RiderHome />}

            {/* 3. ADMIN ROLE EXPERIENCE */}
            {activeRole === 'ADMIN' && <AdminDashboard />}
          </div>
        )}
      </main>

      {/* STUDENT / PASSENGER MOBILE BOTTOM NAVIGATION BAR (Slide 4 Mockup) */}
      {activeRole === 'STUDENT' && !isSplitView && (
        <nav className="fixed bottom-3 left-0 right-0 z-40 max-w-sm mx-auto px-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-full border border-[#EEEEEE] shuttlex-shadow-lg p-1.5 flex items-center justify-around">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'rides', label: 'Ride', icon: Car },
              { id: 'wallet', label: 'Wallet', icon: Wallet },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = studentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStudentTab(tab.id as any)}
                  className={`flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-full transition-all duration-200 relative ${
                    isActive
                      ? 'text-[#010101] font-extrabold bg-[#F5F5F7]'
                      : 'text-[#666666] font-semibold hover:text-[#010101]'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                  <span className="text-[10px] tracking-tight">{tab.label}</span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#010101] absolute bottom-1"></span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;
