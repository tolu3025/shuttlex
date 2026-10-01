import React from 'react';

interface HeroRoadPerspectiveProps {
  onTapRide?: () => void;
  onTapSchedule?: () => void;
}

export const HeroRoadPerspective: React.FC<HeroRoadPerspectiveProps> = ({
  onTapRide,
  onTapSchedule
}) => {
  return (
    <div className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-b from-[#EAEBED] via-[#F2F3F5] to-[#FAFAFA] border border-[#E5E7EB] shuttlex-shadow-sm p-4 pt-6 space-y-4">
      {/* City Background Silhouette & Grid Horizon */}
      <div className="relative h-44 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#DFE2E6] to-[#ECEEF1]">
        {/* Subtle Perspective Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            perspective: '300px',
            transform: 'rotateX(55deg) scale(1.4)'
          }}
        />

        {/* Isometric 3D Road */}
        <div className="relative w-64 h-full flex items-center justify-center">
          {/* Road Surface */}
          <div 
            className="absolute bottom-0 w-44 h-40 bg-[#D4D8DD] border-x-4 border-white/80 shadow-inner"
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(180deg, #CCD1D7 0%, #B8BFC8 100%)'
            }}
          >
            {/* Center Dashed Road Lines */}
            <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-around opacity-75">
              <div className="w-1.5 h-4 bg-white rounded-full"></div>
              <div className="w-2 h-6 bg-white rounded-full"></div>
              <div className="w-2.5 h-8 bg-white rounded-full"></div>
            </div>

            {/* Blue Navigation Route Highlight on Road */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                clipPath: 'polygon(45% 0%, 55% 0%, 65% 100%, 35% 100%)',
                background: 'linear-gradient(180deg, #60A5FA 0%, #2563EB 100%)'
              }}
            />
          </div>

          {/* 3D ShuttleX White Car driving on road */}
          <div className="relative z-10 -bottom-3 animate-float flex flex-col items-center">
            {/* Rear Perspective 3D Car Vector */}
            <svg width="110" height="68" viewBox="0 0 120 75" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
              {/* Ground Shadow */}
              <ellipse cx="60" cy="70" rx="46" ry="6" fill="#000000" fillOpacity="0.25" />
              
              {/* Car Body Rear View */}
              <path d="M22 60C18 56 16 48 18 42C20 34 26 28 35 24C44 20 76 20 85 24C94 28 100 34 102 42C104 48 102 56 98 60C92 64 28 64 22 60Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
              
              {/* Rear Window */}
              <path d="M33 26C38 18 50 16 60 16C70 16 82 18 87 26C88 28 86 36 84 38C76 40 44 40 36 38C34 36 32 28 33 26Z" fill="#0F172A" />
              <path d="M40 20C48 18 72 18 80 20" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
              
              {/* Roof */}
              <path d="M36 18C44 14 76 14 84 18L87 24H33L36 18Z" fill="#FFFFFF" />
              
              {/* Rear Taillights (Red LED bar matching modern SUV/sedan) */}
              <rect x="22" y="44" width="22" height="6" rx="3" fill="#DC2626" />
              <rect x="76" y="44" width="22" height="6" rx="3" fill="#DC2626" />
              <path d="M44 46H76" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
              
              {/* ShuttleX License Plate */}
              <rect x="48" y="48" width="24" height="10" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="1" />
              <text x="60" y="55" fontSize="5" fontWeight="bold" fill="#0F172A" textAnchor="middle" fontFamily="sans-serif">SHUTTLEX</text>
              
              {/* Rear Bumper & Dual Exhaust / Diffuser */}
              <path d="M26 58C36 62 84 62 94 58V62C90 65 30 65 26 62V58Z" fill="#1E293B" />
              <circle cx="28" cy="65" r="5" fill="#0F172A" />
              <circle cx="92" cy="65" r="5" fill="#0F172A" />
            </svg>
          </div>
        </div>

        {/* Ambient Badge: Live Status */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#010101] shadow-xs flex items-center gap-1.5 border border-white/40">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>ShuttleX Live Route</span>
        </div>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#666666] shadow-xs flex items-center gap-1 border border-white/40">
          <span>⚡ High Availability</span>
        </div>
      </div>

      {/* Dual Quick Action Cards (Ride & Schedule) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Card 1: Ride (White) */}
        <button
          onClick={onTapRide}
          className="group text-left p-4 rounded-[24px] bg-white border border-[#EEEEEE] shuttlex-shadow-sm hover:border-[#010101] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#F5F5F7] text-[#010101] flex items-center justify-center mb-3 group-hover:bg-[#010101] group-hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div className="font-extrabold text-base text-[#010101] tracking-tight">
            Ride
          </div>
          <div className="text-xs text-[#666666] font-medium pt-0.5">
            Pickup in 3 min
          </div>
        </button>

        {/* Card 2: Schedule (Black) */}
        <button
          onClick={onTapSchedule}
          className="group text-left p-4 rounded-[24px] bg-[#010101] text-white shuttlex-shadow-pill hover:bg-[#1A1A1A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-black"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#222222] text-white flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-black transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <div className="font-extrabold text-base text-white tracking-tight">
            Schedule
          </div>
          <div className="text-xs text-[#999999] font-medium pt-0.5">
            Plan Ahead Now
          </div>
        </button>
      </div>
    </div>
  );
};
