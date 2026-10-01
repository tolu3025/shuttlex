import React, { useState } from 'react';
import type { RideRequest, RideStatus } from '../../types/ride';
import { MapView } from '../common/MapView';
import { RiderMatchedCard } from './RiderMatchedCard';
import { ArrowLeft, Calendar, Check } from 'lucide-react';

interface LiveRideTrackerProps {
  ride: RideRequest;
  onCancelRide: () => void;
}

const RIDE_STEPS: { status: RideStatus; label: string }[] = [
  { status: 'SEARCHING', label: 'Searching' },
  { status: 'ACCEPTED', label: 'Accepted' },
  { status: 'ARRIVED', label: 'Arrived' },
  { status: 'TRIP_STARTED', label: 'Trip Started' },
  { status: 'COMPLETED', label: 'Completed' }
];

export const LiveRideTracker: React.FC<LiveRideTrackerProps> = ({ ride, onCancelRide }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const getStepIndex = (currentStatus: RideStatus) => {
    switch (currentStatus) {
      case 'REQUESTED':
      case 'SEARCHING':
      case 'OFFERED':
        return 0;
      case 'ACCEPTED':
      case 'RIDER_EN_ROUTE':
        return 1;
      case 'ARRIVED':
        return 2;
      case 'TRIP_STARTED':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  const activeStep = getStepIndex(ride.status);

  // Simulated Rider Location moving smoothly between pickup and destination
  const riderLocation = ride.rider
    ? ride.status === 'TRIP_STARTED'
      ? {
          latitude: (ride.pickup.latitude + ride.destination.latitude) / 2,
          longitude: (ride.pickup.longitude + ride.destination.longitude) / 2
        }
      : ride.status === 'ARRIVED'
      ? { latitude: ride.pickup.latitude, longitude: ride.pickup.longitude }
      : {
          latitude: ride.pickup.latitude + 0.0015,
          longitude: ride.pickup.longitude - 0.0015
        }
    : undefined;

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto animate-in fade-in duration-300">
      {/* Top Bar (Slide 2 Mockup: Back, Pickup, Calendar Icon) */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#EEEEEE] shuttlex-shadow-sm">
        <button
          onClick={onCancelRide}
          className="w-9 h-9 rounded-full bg-[#F5F5F7] text-[#010101] flex items-center justify-center hover:bg-gray-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">Live Ride</span>
          <h3 className="font-extrabold text-base text-[#010101]">Pickup</h3>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-9 h-9 rounded-full bg-[#F5F5F7] text-[#010101] flex items-center justify-center hover:bg-gray-200 transition-all"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* Realtime 3D Map View */}
      <div className="bg-white rounded-[32px] p-2 shuttlex-shadow-sm border border-[#EEEEEE] relative overflow-hidden">
        <MapView
          pickup={ride.pickup}
          destination={ride.destination}
          riderLocation={riderLocation}
          height="320px"
          showLandmarks={false}
          vehicleType={ride.rider?.bike?.make?.toLowerCase().includes('honda') || ride.rider?.bike?.model?.toLowerCase().includes('ace') ? 'bike' : 'car'}
        />

        {/* Live ETA Floating Badge */}
        <div className="absolute top-5 left-5 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shuttlex-shadow-sm border border-[#EEEEEE] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-extrabold text-[#010101]">
            {ride.status === 'ARRIVED' ? 'Driver is at pickup' : 'Pickup in ~2 min'}
          </span>
        </div>
      </div>

      {/* Ride Progress Timeline Bar */}
      <div className="bg-white rounded-[24px] p-4 shuttlex-shadow-sm border border-[#EEEEEE] space-y-3">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#010101]">
          <span>Trip Status</span>
          <span className="text-[#666666] bg-[#F5F5F7] px-2.5 py-0.5 rounded-full font-bold">
            {ride.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Step Indicator */}
        <div className="relative flex items-center justify-between px-2 pt-2">
          {/* Timeline connecting line */}
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-200 -translate-y-1/2 z-0">
            <div
              className="h-full bg-[#010101] transition-all duration-500"
              style={{ width: `${(activeStep / (RIDE_STEPS.length - 1)) * 100}%` }}
            ></div>
          </div>

          {RIDE_STEPS.map((step, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;
            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-[#010101] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#010101] text-white ring-4 ring-gray-200 font-extrabold animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span
                  className={`text-[9px] font-bold mt-1.5 ${
                    isCurrent ? 'text-[#010101] font-extrabold' : 'text-[#999999]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matched Driver & Vehicle Floating Card (Slide 2 Mockup) */}
      {ride.rider && <RiderMatchedCard ride={ride} onCancelRide={onCancelRide} />}
    </div>
  );
};
