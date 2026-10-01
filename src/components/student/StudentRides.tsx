import React, { useState, useEffect } from 'react';
import type { RideRequest } from '../../types/ride';
import { backendStore } from '../../services/backendStore';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, ShieldCheck, Car } from 'lucide-react';

export const StudentRides: React.FC = () => {
  const [rides, setRides] = useState<RideRequest[]>([]);

  useEffect(() => {
    setRides(backendStore.getRides());
    const unsubscribe = backendStore.subscribe(() => {
      setRides(backendStore.getRides());
    });
    return unsubscribe;
  }, []);

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-extrabold text-[#010101] tracking-tight">Your Ride History</h2>
        <span className="text-xs font-bold text-[#666666] bg-white border border-[#EEEEEE] px-3 py-1 rounded-full shuttlex-shadow-sm">
          {rides.length} Total Rides
        </span>
      </div>

      {rides.length === 0 ? (
        <div className="bg-white rounded-[32px] p-8 text-center space-y-3 border border-[#EEEEEE] shuttlex-shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F5F5F7] text-[#010101] flex items-center justify-center mx-auto text-2xl font-bold">
            <Car className="w-8 h-8 text-[#010101]" />
          </div>
          <h3 className="font-extrabold text-base text-[#010101]">No Rides Yet</h3>
          <p className="text-xs text-[#666666] max-w-xs mx-auto">
            Book your first ShuttleX ride to see your trip receipts and live routes here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white rounded-[28px] p-4 shuttlex-shadow-sm border border-[#EEEEEE] space-y-3 hover:border-[#010101] transition-all"
            >
              <div className="flex items-center justify-between">
                <StatusBadge status={ride.status} />
                <span className="text-xs font-extrabold text-[#010101]">
                  ₦{ride.fare.totalFare.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#010101] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#010101] shrink-0"></span>
                  <span className="truncate">{ride.pickup.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#666666] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#999999] shrink-0"></span>
                  <span className="truncate">{ride.destination.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EEEEEE] text-[11px] text-[#666666]">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#999999]" />
                  {new Date(ride.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {ride.rider && (
                  <span className="font-bold text-[#010101] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#010101]" />
                    {ride.rider.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
