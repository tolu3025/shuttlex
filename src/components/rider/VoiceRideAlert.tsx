import React from 'react';
import type { RideRequest } from '../../types/ride';
import { CheckCircle2, XCircle, Volume2 } from 'lucide-react';

interface VoiceRideAlertProps {
  ride: RideRequest;
  language: 'en' | 'pidgin' | 'yo';
  onAccept: () => void;
  onDecline: () => void;
  onReplayVoice: () => void;
}

export const VoiceRideAlert: React.FC<VoiceRideAlertProps> = ({
  ride,
  language,
  onAccept,
  onDecline,
  onReplayVoice
}) => {
  const getPromptText = () => {
    const pickup = ride.pickup.name;
    const dest = ride.destination.name;
    const fare = ride.fare.totalFare;

    if (language === 'pidgin') {
      return `You get new ride! Student dey ${pickup} and e wan go ${dest}. The fare na ₦${fare}. You wan accept am?`;
    }
    if (language === 'yo') {
      return `Ride tuntun wa fun e! Akeko wa ni ${pickup}, o fe lo si ${dest}. Owo ride naa je ₦${fare}. Se o fe gba?`;
    }
    return `New Ride Request! Student is at ${pickup} and wants to go to ${dest}. The fare is ₦${fare}. Would you like to accept?`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#071F17]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 border-4 border-[#F4B740] animate-in zoom-in-95 duration-200">
        {/* Alert Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="font-extrabold text-lg text-[#071F17]">NEW RIDE ALERT</h3>
          </div>
          <button
            onClick={onReplayVoice}
            className="flex items-center gap-1 text-xs font-bold text-[#0B6B4B] bg-[#DFF5EA] px-2.5 py-1 rounded-xl border border-[#0B6B4B]/20"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>

        {/* Localized Agent Speech Banner */}
        <div className="bg-[#071F17] text-[#DFF5EA] p-3.5 rounded-2xl text-xs font-semibold space-y-1 shadow-inner">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
            🔊 Agent Announcement ({language.toUpperCase()})
          </span>
          <p className="leading-relaxed">"{getPromptText()}"</p>
        </div>

        {/* Ride Fare & Locations Card */}
        <div className="bg-[#F7F8F5] p-4 rounded-2xl border border-[#E2E6E0] space-y-3">
          <div className="text-center border-b border-gray-200 pb-2">
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
              Ride Fare
            </span>
            <div className="text-3xl font-black text-[#0B6B4B] tracking-tight">
              ₦{ride.fare.totalFare.toLocaleString()}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#071F17]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B6B4B]"></span>
              <span>Pickup: {ride.pickup.name}</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-[#071F17]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D94A4A]"></span>
              <span>Dropoff: {ride.destination.name}</span>
            </div>
          </div>
        </div>

        {/* Voice Hint */}
        <p className="text-center text-xs font-bold text-gray-800 animate-pulse">
          🗣️ Say <span className="text-[#0B6B4B] underline">"Yes"</span> or <span className="text-[#0B6B4B] underline">"I go take am"</span> or tap button below:
        </p>

        {/* GIANT HIGH-CONTRAST TOUCH ACTION BUTTONS */}
        <div className="space-y-3 pt-1">
          <button
            onClick={onAccept}
            className="w-full bg-[#0B6B4B] hover:bg-[#071F17] active:scale-95 text-white font-black text-xl py-5 rounded-2xl shadow-xl border-2 border-[#DFF5EA] transition-all flex items-center justify-center gap-3"
          >
            <CheckCircle2 className="w-7 h-7 text-[#DFF5EA]" />
            <span>ACCEPT RIDE</span>
          </button>

          <button
            onClick={onDecline}
            className="w-full bg-red-50 hover:bg-red-100 text-[#D94A4A] font-bold text-sm py-3 rounded-xl border border-red-200 transition-all flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>Decline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
