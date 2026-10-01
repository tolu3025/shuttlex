import React from 'react';
import type { RideRequest } from '../../types/ride';
import { voiceAgentEngine } from '../../services/voiceAgent';
import { Navigation, CheckCircle2, Play, Flag, ExternalLink } from 'lucide-react';

interface RiderActionButtonsProps {
  ride: RideRequest;
  onArrived: () => void;
  onStartRide: () => void;
  onCompleteRide: () => void;
}

export const RiderActionButtons: React.FC<RiderActionButtonsProps> = ({
  ride,
  onArrived,
  onStartRide,
  onCompleteRide
}) => {
  const handleOpenGoogleMaps = () => {
    voiceAgentEngine.openGoogleMapsNavigation(ride.pickup.latitude, ride.pickup.longitude);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-[#0B6B4B]/30 space-y-4">
      {/* Active Trip Info Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B6B4B] bg-[#DFF5EA] px-2.5 py-0.5 rounded-md">
            Active Passenger Trip
          </span>
          <h3 className="font-extrabold text-base text-[#071F17] pt-0.5">
            Student: {ride.student.name}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-800 font-semibold block">Fare</span>
          <span className="text-2xl font-black text-[#0B6B4B]">
            ₦{ride.fare.totalFare.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Pickup & Destination Summary */}
      <div className="bg-[#F7F8F5] p-3 rounded-2xl border border-[#E2E6E0] space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#071F17]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B6B4B]"></span>
          <span>Pickup: {ride.pickup.name}</span>
        </div>
        <div className="flex items-center gap-2 font-bold text-[#071F17]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D94A4A]"></span>
          <span>Destination: {ride.destination.name}</span>
        </div>
      </div>

      {/* Google Maps Deep Link Trigger */}
      <button
        onClick={handleOpenGoogleMaps}
        className="w-full bg-[#071F17] hover:bg-[#0B6B4B] text-[#DFF5EA] font-extrabold py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm border border-[#0B6B4B]/50"
      >
        <Navigation className="w-4 h-4 text-emerald-400" />
        <span>Open Google Maps Navigation</span>
        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
      </button>

      {/* Rider Voice / Giant Touch Buttons driven by Ride Status */}
      <div className="pt-2">
        {['ACCEPTED', 'RIDER_EN_ROUTE'].includes(ride.status) && (
          <div className="space-y-1 text-center">
            <p className="text-xs font-bold text-gray-800 pb-1">
              🗣️ Say <span className="text-[#0B6B4B] underline">"I don reach"</span> or tap:
            </p>
            <button
              onClick={onArrived}
              className="w-full bg-[#0B6B4B] hover:bg-[#071F17] active:scale-95 text-white font-black text-lg py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-6 h-6 text-[#DFF5EA]" />
              <span>I'VE ARRIVED AT PICKUP</span>
            </button>
          </div>
        )}

        {ride.status === 'ARRIVED' && (
          <div className="space-y-1 text-center">
            <p className="text-xs font-bold text-gray-800 pb-1">
              🗣️ Say <span className="text-[#0B6B4B] underline">"Let's go"</span> or tap:
            </p>
            <button
              onClick={onStartRide}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-lg py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>START TRIP</span>
            </button>
          </div>
        )}

        {ride.status === 'TRIP_STARTED' && (
          <div className="space-y-1 text-center">
            <p className="text-xs font-bold text-gray-800 pb-1">
              🗣️ Say <span className="text-[#0B6B4B] underline">"I don drop am"</span> or tap:
            </p>
            <button
              onClick={onCompleteRide}
              className="w-full bg-[#0B6B4B] hover:bg-[#071F17] active:scale-95 text-white font-black text-lg py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Flag className="w-6 h-6 text-[#DFF5EA]" />
              <span>COMPLETE TRIP & COLLECT FARE</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
