import React, { useState } from 'react';
import { backendStore } from '../../services/backendStore';
import type { StudentProfile as StudentProfileType } from '../../types/user';
import { MapPin, ShieldCheck } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const [profile] = useState<StudentProfileType>(backendStore.getStudentProfile());

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-[32px] p-5 shuttlex-shadow-sm border border-[#EEEEEE] flex items-center gap-4">
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#010101]/10"
        />
        <div className="space-y-0.5">
          <h2 className="font-extrabold text-lg text-[#010101]">{profile.name}</h2>
          <p className="text-xs text-[#666666] font-medium">{profile.email}</p>
          <span className="inline-block text-[10px] font-bold bg-[#F5F5F7] text-[#010101] px-2.5 py-0.5 rounded-full border border-[#EEEEEE] mt-1">
            Verified ShuttleX Passenger
          </span>
        </div>
      </div>

      {/* Account Verification Details Card */}
      <div className="bg-white rounded-[28px] p-5 shuttlex-shadow-sm border border-[#EEEEEE] space-y-3">
        <h3 className="font-extrabold text-sm text-[#010101] flex items-center gap-2 border-b border-[#EEEEEE] pb-2">
          <ShieldCheck className="w-4 h-4 text-[#010101]" />
          <span>Membership & Verification</span>
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#F5F5F7] p-3 rounded-2xl border border-[#EEEEEE]">
            <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
              Passenger ID
            </span>
            <span className="font-extrabold text-[#010101] pt-0.5 block font-mono">
              {profile.matricNumber || 'SX-89201'}
            </span>
          </div>

          <div className="bg-[#F5F5F7] p-3 rounded-2xl border border-[#EEEEEE]">
            <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
              Membership Tier
            </span>
            <span className="font-extrabold text-[#010101] pt-0.5 block">
              ShuttleX Pro
            </span>
          </div>
        </div>
      </div>

      {/* Saved Places */}
      <div className="bg-white rounded-[28px] p-5 shuttlex-shadow-sm border border-[#EEEEEE] space-y-3">
        <h3 className="font-extrabold text-sm text-[#010101] flex items-center gap-2 border-b border-[#EEEEEE] pb-2">
          <MapPin className="w-4 h-4 text-[#010101]" />
          <span>Saved Places</span>
        </h3>

        <div className="space-y-2">
          {profile.savedLocations.map((loc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-[#F5F5F7] rounded-2xl border border-[#EEEEEE] text-xs"
            >
              <div className="flex items-center gap-2 font-bold text-[#010101]">
                <span>📍</span>
                <span>{loc.name}</span>
              </div>
              <span className="text-[#666666] font-medium text-[11px]">Primary</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
