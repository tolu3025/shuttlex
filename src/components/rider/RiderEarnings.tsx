import React from 'react';
import type { RiderProfile } from '../../types/user';
import { TrendingUp } from 'lucide-react';

interface RiderEarningsProps {
  rider: RiderProfile;
}

export const RiderEarnings: React.FC<RiderEarningsProps> = ({ rider }) => {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E6E0] space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-extrabold text-sm text-[#071F17] flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-[#0B6B4B]" />
          <span>Today's Rider Summary</span>
        </h3>
        <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
          {new Date().toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Today Earnings */}
        <div className="bg-[#DFF5EA] p-3 rounded-2xl border border-[#0B6B4B]/20 text-center">
          <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
            Today's Income
          </span>
          <span className="text-lg font-black text-[#0B6B4B] pt-0.5 block">
            ₦{rider.todayEarnings.toLocaleString()}
          </span>
        </div>

        {/* Rides Count */}
        <div className="bg-[#F7F8F5] p-3 rounded-2xl border border-[#E2E6E0] text-center">
          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
            Rides Done
          </span>
          <span className="text-lg font-black text-[#071F17] pt-0.5 block">
            {rider.completedRidesCount}
          </span>
        </div>

        {/* Wallet Payout */}
        <div className="bg-[#F7F8F5] p-3 rounded-2xl border border-[#E2E6E0] text-center">
          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
            Wallet Balance
          </span>
          <span className="text-lg font-black text-[#071F17] pt-0.5 block">
            ₦{rider.walletBalance.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
