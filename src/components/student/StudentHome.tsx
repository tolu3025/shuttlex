import React, { useState, useEffect } from 'react';
import type { LocationPoint, CampusLocation, RideRequest, FareEstimate } from '../../types/ride';
import { backendStore } from '../../services/backendStore';
import { calculateFare } from '../../services/fareEngine';
import { MapView } from '../common/MapView';
import { HeroRoadPerspective } from '../common/HeroRoadPerspective';
import { VEHICLE_OPTIONS, VehicleIllustration, type VehicleTypeInfo } from '../common/VehicleIllustrations';
import { DesignProcessDrawer } from '../common/DesignProcessDrawer';
import { 
  MapPin, 
  Search, 
  ArrowRight, 
  ArrowLeft,
  Plus, 
  SlidersHorizontal, 
  Bell, 
  Menu, 
  Clock, 
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';

interface StudentHomeProps {
  onRequestRide: (pickup: LocationPoint, destination: LocationPoint, fare: FareEstimate) => void;
  activeRide?: RideRequest;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onRequestRide }) => {
  const [campusLocations, setCampusLocations] = useState<CampusLocation[]>([]);
  const [currentLocationName, setCurrentLocationName] = useState<string>('Green Park (UK)');
  
  const [pickup, setPickup] = useState<LocationPoint>({
    latitude: 6.5173,
    longitude: 3.3884,
    name: 'Home'
  });
  
  const [destination, setDestination] = useState<LocationPoint | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [fareEstimate, setFareEstimate] = useState<FareEstimate | null>(null);

  // Vehicle Selection State (Screen 1 & 3 from Design mockups)
  const [selectedCategory, setSelectedCategory] = useState<'Recommended' | 'Faster' | 'Cheaper'>('Recommended');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTypeInfo>(VEHICLE_OPTIONS[0]);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showProcessDrawer, setShowProcessDrawer] = useState<boolean>(false);
  const [notificationsCount, setNotificationsCount] = useState<number>(2);

  useEffect(() => {
    const locs = backendStore.getCampusLocations();
    setCampusLocations(locs);
    const unsubscribe = backendStore.subscribe(() => {
      setCampusLocations(backendStore.getCampusLocations());
    });
    return unsubscribe;
  }, []);

  // Recalculate fare estimation when locations change
  useEffect(() => {
    if (pickup && destination) {
      const fare = calculateFare(pickup, destination, backendStore.getFareConfig());
      setFareEstimate(fare);
    } else {
      setFareEstimate(null);
    }
  }, [pickup, destination]);

  const filteredLocations = campusLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDestination = (loc: CampusLocation) => {
    setDestination({
      latitude: loc.latitude,
      longitude: loc.longitude,
      name: loc.name
    });
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleMapLocationSelect = (point: LocationPoint) => {
    setDestination(point);
  };

  const filteredVehicles = VEHICLE_OPTIONS.filter((v) => {
    if (selectedCategory === 'Recommended') return true;
    if (selectedCategory === 'Faster') return v.etaMins <= 4 || v.type === 'comfort';
    if (selectedCategory === 'Cheaper') return v.price <= 7.5 || v.type === 'basic';
    return true;
  });

  const handleConfirmRide = () => {
    if (pickup && destination && fareEstimate) {
      // Adjust fare based on selected vehicle multiplier
      const multiplier = selectedVehicle.type === 'comfort' ? 1.25 : selectedVehicle.type === 'basic' ? 0.8 : 1.0;
      const adjustedFare: FareEstimate = {
        ...fareEstimate,
        totalFare: Math.round(fareEstimate.totalFare * multiplier)
      };
      onRequestRide(pickup, destination, adjustedFare);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Design Process & Showcase Drawer */}
      <DesignProcessDrawer
        isOpen={showProcessDrawer}
        onClose={() => setShowProcessDrawer(false)}
      />

      {/* TOP STATUS & NAVIGATION BAR (Slide 4 Mockup) */}
      <div className="flex items-center justify-between pt-1">
        {/* Hamburger Menu */}
        <button
          onClick={() => setShowProcessDrawer(true)}
          className="w-10 h-10 rounded-full bg-white text-[#010101] flex items-center justify-center shuttlex-shadow-sm border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-all"
          title="Open ShuttleX Design Process"
        >
          <Menu className="w-5 h-5 text-[#010101]" />
        </button>

        {/* Location Selector Pill */}
        <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full shuttlex-shadow-sm border border-[#EEEEEE]">
          <MapPin className="w-4 h-4 text-[#010101]" />
          <div className="text-left">
            <span className="text-[10px] text-[#666666] font-semibold block leading-tight">Location</span>
            <select
              value={currentLocationName}
              onChange={(e) => {
                setCurrentLocationName(e.target.value);
                const match = campusLocations.find(l => l.name === e.target.value);
                if (match) {
                  setPickup({ latitude: match.latitude, longitude: match.longitude, name: match.name });
                }
              }}
              className="text-xs font-extrabold text-[#010101] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Green Park (UK)">Green Park (UK)</option>
              {campusLocations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bell Notification Icon with Badge */}
        <button 
          onClick={() => setNotificationsCount(0)}
          className="relative w-10 h-10 rounded-full bg-white text-[#010101] flex items-center justify-center shuttlex-shadow-sm border border-[#EEEEEE] hover:bg-[#F5F5F7] transition-all"
        >
          <Bell className="w-5 h-5 text-[#010101]" />
          {notificationsCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#010101] ring-2 ring-white"></span>
          )}
        </button>
      </div>

      {/* VIEW A: DISCOVERY / MAIN HERO VIEW (When no destination selected yet) */}
      {!destination ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Main Slogan & Headline (From Design Slide 4) */}
          <div className="pt-2 px-1 space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-[#666666] font-bold tracking-wide">
              <span>Go When</span>
              <span className="text-sm">🚗</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#010101] leading-tight">
              You Want <span className="italic underline underline-offset-4 decoration-2 decoration-[#999999]">Anywhere.</span>
            </h1>
          </div>

          {/* Search Bar (Pill style with filter icon on right) */}
          <div className="relative">
            <div className="flex items-center gap-3 bg-white px-4 py-3.5 rounded-full shuttlex-shadow-sm border border-[#EEEEEE] focus-within:border-[#010101] transition-all">
              <Search className="w-5 h-5 text-[#666666] shrink-0" />
              <input
                type="text"
                placeholder="Where to?"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                }}
                onFocus={() => setIsSearching(true)}
                className="w-full bg-transparent text-sm font-bold text-[#010101] placeholder-[#999999] focus:outline-none"
              />
              <button
                onClick={() => setIsSearching(!isSearching)}
                className="w-8 h-8 rounded-full bg-[#010101] text-white flex items-center justify-center shrink-0 hover:bg-[#1A1A1A] transition-all"
                title="Filter locations"
              >
                <SlidersHorizontal className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Autocomplete Search Dropdown */}
            {isSearching && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shuttlex-shadow-lg border border-[#EEEEEE] max-h-64 overflow-y-auto z-30 divide-y divide-gray-100 p-2">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                  Suggestions & Recent Stops
                </div>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSelectDestination(loc)}
                      className="w-full text-left p-3 hover:bg-[#F5F5F7] rounded-2xl transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#F5F5F7] text-[#010101] flex items-center justify-center text-xs font-bold shrink-0">
                        📍
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-sm text-[#010101] truncate">{loc.name}</p>
                        <p className="text-xs text-[#666666] truncate">{loc.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#999999] shrink-0" />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#666666]">
                    No matching place found. Tap the map to set a pin.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3D Hero Perspective Road Component with Ride / Schedule Action Cards */}
          <HeroRoadPerspective
            onTapRide={() => {
              if (campusLocations.length > 0) {
                // Preselect first popular location (Work / Library / Hub)
                const target = campusLocations.find(l => l.isPopular) || campusLocations[0];
                handleSelectDestination(target);
              }
            }}
            onTapSchedule={() => setShowScheduleModal(true)}
          />

          {/* Recent & Popular Trips List */}
          <div className="bg-white rounded-[28px] p-4 border border-[#EEEEEE] shuttlex-shadow-sm space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold text-[#010101] uppercase tracking-wider">
                Popular Destinations
              </span>
              <button 
                onClick={() => setShowProcessDrawer(true)}
                className="text-[11px] font-bold text-[#666666] hover:text-[#010101] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#010101]" />
                <span>Design Story</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {campusLocations.slice(0, 4).map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelectDestination(loc)}
                  className="text-left p-3 rounded-2xl bg-[#FAFAFA] hover:bg-[#F5F5F7] border border-[#EEEEEE] transition-all flex items-center gap-2.5 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white text-[#010101] flex items-center justify-center text-xs font-bold border border-[#E5E7EB] group-hover:bg-[#010101] group-hover:text-white transition-colors">
                    📍
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-xs text-[#010101] truncate">{loc.name}</p>
                    <p className="text-[10px] text-[#666666] truncate">{loc.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW B: VEHICLE SELECTION & BOOKING OPTIONS (Slide 3 Mockup) */
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Header Bar: Back Button, Route Name, + Add Stop */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#EEEEEE] shuttlex-shadow-sm">
            <button
              onClick={() => {
                setDestination(null);
                setSearchQuery('');
              }}
              className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#010101] flex items-center justify-center hover:bg-gray-200 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">Selected Route</span>
              <h3 className="font-extrabold text-sm text-[#010101]">
                {pickup.name} → {destination.name}
              </h3>
            </div>

            <button
              onClick={() => setIsSearching(true)}
              className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#010101] flex items-center justify-center hover:bg-gray-200 transition-all"
              title="Add or Change Destination"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Grayscale Campus / City Map */}
          <div className="bg-white rounded-[28px] p-2 shuttlex-shadow-sm border border-[#EEEEEE]">
            <MapView
              pickup={pickup}
              destination={destination}
              campusLocations={campusLocations}
              onSelectMapLocation={handleMapLocationSelect}
              height="220px"
              vehicleType={selectedVehicle.type === 'bike' ? 'bike' : 'car'}
            />
          </div>

          {/* Category Filter Pills (Recommended / Faster / Cheaper) */}
          <div className="flex items-center gap-2 px-1">
            {(['Recommended', 'Faster', 'Cheaper'] as const).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#010101] text-white shuttlex-shadow-pill'
                      : 'bg-white text-[#010101] border border-[#EEEEEE] hover:bg-[#F5F5F7]'
                  }`}
                >
                  {cat === 'Faster' && <Clock className="w-3.5 h-3.5" />}
                  {cat === 'Cheaper' && <span>$</span>}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Vehicle Options List (Bolt / Basic / Comfort / Taxi) */}
          <div className="space-y-2">
            <div className="px-1 text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              Popular Vehicles
            </div>

            {filteredVehicles.map((veh) => {
              const isSelected = selectedVehicle.id === veh.id;
              // Compute dynamic price based on fare config or base formula
              const multiplier = veh.type === 'comfort' ? 1.25 : veh.type === 'basic' ? 0.8 : 1.0;
              const priceFormatted = fareEstimate 
                ? `₦${Math.round(fareEstimate.totalFare * multiplier).toLocaleString()}`
                : `$${veh.price.toFixed(2)}`;

              return (
                <div
                  key={veh.id}
                  onClick={() => setSelectedVehicle(veh)}
                  className={`p-4 rounded-[24px] border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-[#010101] ring-2 ring-[#010101] shuttlex-shadow-sm'
                      : 'bg-white border-[#EEEEEE] hover:border-gray-300'
                  }`}
                >
                  {/* Left: Vehicle Illustration & Details */}
                  <div className="flex items-center gap-3.5">
                    <VehicleIllustration type={veh.type} className="w-16 h-10" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-[#010101]">{veh.name}</h4>
                        {veh.isRecommended && (
                          <span className="text-[9px] font-bold bg-[#010101] text-white px-2 py-0.5 rounded-full">
                            TOP PICK
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666666] font-medium pt-0.5">
                        {veh.etaMins} min {veh.seats ? `• 👤 ${veh.seats}` : ''}
                      </p>
                      <p className="text-[11px] text-[#999999] font-medium">
                        {veh.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Pricing & Selection Indicator */}
                  <div className="text-right space-y-1">
                    <div className="font-extrabold text-lg text-[#010101] tracking-tight">
                      {priceFormatted}
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#010101] bg-[#F5F5F7] px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-[#010101]" /> Selected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Primary Action Button: Confirm & Request */}
          <button
            onClick={handleConfirmRide}
            className="w-full bg-[#010101] hover:bg-[#1A1A1A] active:scale-[0.99] text-white font-extrabold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-base"
          >
            <span>Confirm ShuttleX {selectedVehicle.name}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-4 border border-[#EEEEEE] shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-base text-[#010101]">
                <Calendar className="w-5 h-5 text-[#010101]" />
                <span>Schedule a ShuttleX</span>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-xs font-bold text-[#666666] hover:text-[#010101]"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-[#666666]">
              Choose your preferred pickup time. A verified ShuttleX driver will arrive promptly.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#666666] uppercase block mb-1">Date</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-2xl bg-[#F5F5F7] border border-[#EEEEEE] text-xs font-bold text-[#010101]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#666666] uppercase block mb-1">Time</label>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full p-3 rounded-2xl bg-[#F5F5F7] border border-[#EEEEEE] text-xs font-bold text-[#010101]"
                />
              </div>
            </div>

            <button
              onClick={() => {
                alert('Ride scheduled successfully with ShuttleX!');
                setShowScheduleModal(false);
              }}
              className="w-full py-3.5 bg-[#010101] text-white font-extrabold rounded-2xl shadow-md hover:bg-[#1A1A1A] transition-all text-sm"
            >
              Confirm Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
