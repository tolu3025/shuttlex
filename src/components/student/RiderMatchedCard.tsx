import React, { useState } from 'react';
import type { RideRequest } from '../../types/ride';
import { Phone, MessageSquare, Star, Send, ShieldCheck, XCircle } from 'lucide-react';
import { VehicleIllustration } from '../common/VehicleIllustrations';

interface RiderMatchedCardProps {
  ride: RideRequest;
  onCancelRide: () => void;
}

export const RiderMatchedCard: React.FC<RiderMatchedCardProps> = ({ ride, onCancelRide }) => {
  const [pickupNote, setPickupNote] = useState<string>('');
  const [noteSent, setNoteSent] = useState<boolean>(false);
  const rider = ride.rider;
  if (!rider) return null;

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickupNote.trim()) {
      setNoteSent(true);
      setTimeout(() => setNoteSent(false), 3000);
      setPickupNote('');
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-5 shuttlex-shadow-lg border border-[#EEEEEE] space-y-4 animate-in slide-in-from-bottom-3 duration-300">
      {/* Top Header: Pickup in 2 min */}
      <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
        <div>
          <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
            Estimated Arrival
          </span>
          <h3 className="text-xl font-extrabold text-[#010101] tracking-tight">
            Pickup in 2 min
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
            Fare
          </span>
          <div className="text-lg font-extrabold text-[#010101]">
            ₦{ride.fare.totalFare.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Driver & Vehicle Information Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Driver Avatar & Text Details */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={rider.photoUrl}
              alt={rider.name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-black/10 shadow-xs"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 ring-2 ring-white">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="space-y-0.5">
            <h4 className="font-extrabold text-base text-[#010101] flex items-center gap-1.5">
              <span>{rider.bike?.make || 'Toyota'} {rider.bike?.model || 'Corolla'}</span>
            </h4>
            <p className="text-xs text-[#666666] font-semibold">
              {rider.bike?.plateNumber || '10B GMV'} • {rider.name}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#666666] font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{rider.rating.toFixed(2)}</span>
              <span>•</span>
              <span>{rider.totalRides} trips</span>
            </div>
          </div>
        </div>

        {/* Right: Modern Vehicle Illustration */}
        <div className="shrink-0 pl-2">
          <VehicleIllustration type="comfort" className="w-18 h-12" />
        </div>
      </div>

      {/* Chat Prompt / Notes to Driver: "Any pickup notes?" */}
      <form onSubmit={handleSendNote} className="relative">
        <div className="flex items-center gap-2 bg-[#F5F5F7] px-4 py-2.5 rounded-full border border-[#EEEEEE] focus-within:border-[#010101] transition-all">
          <input
            type="text"
            placeholder={noteSent ? "Note sent to driver!" : "Any pickup notes?"}
            value={pickupNote}
            onChange={(e) => setPickupNote(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-[#010101] placeholder-[#999999] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!pickupNote.trim()}
            className="w-7 h-7 rounded-full bg-[#010101] text-white flex items-center justify-center shrink-0 hover:bg-[#1A1A1A] disabled:opacity-40 transition-all"
            title="Send note"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </form>

      {/* Action Footer: Call, Message, Route, Cancel */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        <a
          href={`tel:${rider.phoneNumber}`}
          className="flex flex-col items-center justify-center gap-1 py-2 rounded-2xl bg-[#F5F5F7] text-[#010101] font-bold text-[11px] hover:bg-gray-200 transition-all border border-[#EEEEEE]"
        >
          <Phone className="w-4 h-4 text-[#010101]" />
          <span>Call</span>
        </a>

        <a
          href={`sms:${rider.phoneNumber}`}
          className="flex flex-col items-center justify-center gap-1 py-2 rounded-2xl bg-[#F5F5F7] text-[#010101] font-bold text-[11px] hover:bg-gray-200 transition-all border border-[#EEEEEE]"
        >
          <MessageSquare className="w-4 h-4 text-[#010101]" />
          <span>Message</span>
        </a>

        <button
          onClick={() => alert(`Active Route: From ${ride.pickup.name} to ${ride.destination.name}`)}
          className="flex flex-col items-center justify-center gap-1 py-2 rounded-2xl bg-[#F5F5F7] text-[#010101] font-bold text-[11px] hover:bg-gray-200 transition-all border border-[#EEEEEE]"
        >
          <span className="text-sm leading-none">🗺️</span>
          <span>Route</span>
        </button>

        <button
          onClick={onCancelRide}
          className="flex flex-col items-center justify-center gap-1 py-2 rounded-2xl bg-red-50 text-red-600 font-bold text-[11px] hover:bg-red-100 transition-all border border-red-100"
        >
          <XCircle className="w-4 h-4 text-red-600" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};
