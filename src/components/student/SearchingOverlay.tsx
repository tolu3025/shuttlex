import React from 'react';
import type { LocationPoint } from '../../types/ride';
import { Car, XCircle } from 'lucide-react';

interface SearchingOverlayProps {
  pickup: LocationPoint;
  destination: LocationPoint;
  onCancel: () => void;
}

export const SearchingOverlay: React.FC<SearchingOverlayProps> = ({
  pickup,
  destination,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-6 max-w-sm w-full shuttlex-shadow-lg text-center space-y-6 border border-[#EEEEEE] animate-in zoom-in-95 duration-200">
        {/* Animated Radar Pulse */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-black/5 animate-ping opacity-75"></div>
          <div className="absolute inset-2 rounded-full bg-black/10 animate-pulse"></div>
          <div className="relative z-10 w-20 h-20 rounded-full bg-[#010101] text-white flex items-center justify-center shadow-lg border-4 border-white">
            <Car className="w-9 h-9 animate-bounce" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-[#010101]">
            Finding nearest ShuttleX...
          </h3>
          <p className="text-xs text-[#666666] font-medium">
            Matching with verified top-rated drivers in your area.
          </p>
        </div>

        {/* Route summary box */}
        <div className="bg-[#F5F5F7] p-3 rounded-2xl border border-[#EEEEEE] text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#010101] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#010101]"></span>
            <span>From: {pickup.name}</span>
          </div>
          <div className="flex items-center gap-2 text-[#010101] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#666666]"></span>
            <span>To: {destination.name}</span>
          </div>
        </div>

        {/* Cancel Action */}
        <button
          onClick={onCancel}
          className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-2xl border border-red-200 transition-all flex items-center justify-center gap-1.5"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel Request</span>
        </button>
      </div>
    </div>
  );
};
