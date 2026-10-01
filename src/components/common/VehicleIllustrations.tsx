import React from 'react';

export interface VehicleTypeInfo {
  id: string;
  name: string;
  category: string;
  etaMins: number;
  seats: number;
  price: number;
  currency: string;
  description: string;
  isRecommended?: boolean;
  type: 'bolt' | 'basic' | 'comfort' | 'taxi' | 'bike';
  modelDetails?: {
    make: string;
    model: string;
    plateNumber: string;
    helmetProvided: boolean;
  };
}

export const VEHICLE_OPTIONS: VehicleTypeInfo[] = [
  {
    id: 'bike',
    name: 'Campus Bike',
    category: 'Faster',
    etaMins: 2,
    seats: 1,
    price: 3.50,
    currency: '$',
    description: 'Honda Ace CB125 • Helmet included',
    isRecommended: true,
    type: 'bike',
    modelDetails: {
      make: 'Honda',
      model: 'Ace CB125',
      plateNumber: 'KJA-482-XY',
      helmetProvided: true
    }
  },
  {
    id: 'bolt',
    name: 'Bolt',
    category: 'Recommended',
    etaMins: 5,
    seats: 4,
    price: 9.50,
    currency: '$',
    description: 'Mid-size cars',
    type: 'bolt',
    modelDetails: {
      make: 'Toyota',
      model: 'Corolla',
      plateNumber: '10B GMV',
      helmetProvided: false
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    category: 'Cheaper',
    etaMins: 8,
    seats: 4,
    price: 6.50,
    currency: '$',
    description: 'Affordable rides',
    type: 'basic'
  },
  {
    id: 'comfort',
    name: 'Comfort',
    category: 'Faster',
    etaMins: 2,
    seats: 4,
    price: 10.20,
    currency: '$',
    description: 'Full-size cars',
    type: 'comfort'
  },
  {
    id: 'taxi',
    name: 'Taxi',
    category: 'Cheaper',
    etaMins: 4,
    seats: 4,
    price: 9.50,
    currency: '$',
    description: 'Local taxi rides',
    type: 'taxi'
  }
];

export const VehicleIllustration: React.FC<{ type: string; className?: string }> = ({
  type,
  className = 'w-16 h-10'
}) => {
  if (type === 'bike') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Motorcycle Wheels */}
          <circle cx="22" cy="36" r="10" stroke="#010101" strokeWidth="3.5" fill="#E2E8F0" />
          <circle cx="22" cy="36" r="3" fill="#010101" />
          <circle cx="78" cy="36" r="10" stroke="#010101" strokeWidth="3.5" fill="#E2E8F0" />
          <circle cx="78" cy="36" r="3" fill="#010101" />

          {/* Bike Chassis / Frame */}
          <path d="M22 36L44 32L62 36L78 36" stroke="#010101" strokeWidth="3" strokeLinecap="round" />
          <path d="M44 32L54 20L72 16" stroke="#010101" strokeWidth="3" strokeLinecap="round" />
          <path d="M62 36L72 16" stroke="#010101" strokeWidth="3" strokeLinecap="round" />

          {/* Fuel Tank & Body (Emerald / Dark styling) */}
          <path d="M46 19C48 15 58 14 66 16L64 24C58 24 50 23 46 19Z" fill="#010101" />
          
          {/* Seat */}
          <path d="M34 22C38 20 48 20 52 23L48 27C44 26 38 25 34 22Z" fill="#334155" />

          {/* Handlebars */}
          <path d="M72 16L70 11L76 9" stroke="#010101" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Headlight */}
          <circle cx="77" cy="18" r="3" fill="#FACC15" />
          
          {/* Exhaust Pipe */}
          <path d="M46 36L70 38" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (type === 'basic') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Compact hatchback car */}
          <path d="M12 36C12 36 15 24 28 20C40 16 65 16 75 22C82 26 88 32 88 36L12 36Z" fill="#3B82F6" />
          <path d="M26 21L36 13C40 10 60 10 68 14L76 21H26Z" fill="#1E293B" opacity="0.85" />
          <path d="M38 14L32 20H48V13C44 13 41 13.5 38 14Z" fill="#93C5FD" opacity="0.7" />
          <path d="M52 13V20H68L63 14C60 13.5 56 13 52 13Z" fill="#93C5FD" opacity="0.7" />
          <rect x="8" y="32" width="84" height="6" rx="3" fill="#1E293B" />
          <circle cx="26" cy="38" r="7" fill="#0F172A" />
          <circle cx="26" cy="38" r="4" fill="#CBD5E1" />
          <circle cx="74" cy="38" r="7" fill="#0F172A" />
          <circle cx="74" cy="38" r="4" fill="#CBD5E1" />
          <rect x="85" y="31" width="4" height="3" rx="1" fill="#EF4444" />
          <rect x="10" y="31" width="4" height="3" rx="1" fill="#FDE047" />
        </svg>
      </div>
    );
  }

  if (type === 'comfort') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Executive luxury sedan */}
          <path d="M8 36C8 36 12 24 25 20C38 16 72 16 82 22C89 26 92 32 92 36L8 36Z" fill="#475569" />
          <path d="M24 21L36 12C42 9 66 9 75 13L84 21H24Z" fill="#0F172A" />
          <path d="M38 13L30 20H50V12C46 12 42 12.5 38 13Z" fill="#60A5FA" opacity="0.6" />
          <path d="M54 12V20H76L71 13C68 12.5 62 12 54 12Z" fill="#60A5FA" opacity="0.6" />
          <rect x="5" y="32" width="90" height="6" rx="3" fill="#0F172A" />
          <circle cx="24" cy="38" r="7.5" fill="#020617" />
          <circle cx="24" cy="38" r="4.5" fill="#E2E8F0" />
          <circle cx="76" cy="38" r="7.5" fill="#020617" />
          <circle cx="76" cy="38" r="4.5" fill="#E2E8F0" />
          <rect x="89" y="30" width="4" height="3" rx="1" fill="#EF4444" />
          <rect x="7" y="30" width="4" height="3" rx="1" fill="#F8FAFC" />
        </svg>
      </div>
    );
  }

  if (type === 'taxi') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Yellow / classic taxi */}
          <rect x="46" y="8" width="12" height="4" rx="1" fill="#010101" />
          <rect x="48" y="9" width="8" height="2" rx="0.5" fill="#FEF08A" />
          <path d="M10 36C10 36 14 24 26 20C38 16 68 16 78 22C85 26 90 32 90 36L10 36Z" fill="#FACC15" />
          <path d="M25 21L36 13C41 10 63 10 71 14L80 21H25Z" fill="#1E293B" opacity="0.9" />
          <path d="M38 14L32 20H48V13C44 13 41 13.5 38 14Z" fill="#BAE6FD" opacity="0.75" />
          <path d="M52 13V20H72L67 14C64 13.5 58 13 52 13Z" fill="#BAE6FD" opacity="0.75" />
          <rect x="8" y="32" width="84" height="6" rx="3" fill="#1E293B" />
          <circle cx="25" cy="38" r="7" fill="#0F172A" />
          <circle cx="25" cy="38" r="4" fill="#CBD5E1" />
          <circle cx="75" cy="38" r="7" fill="#0F172A" />
          <circle cx="75" cy="38" r="4" fill="#CBD5E1" />
          <rect x="87" y="31" width="4" height="3" rx="1" fill="#EF4444" />
          <rect x="9" y="31" width="4" height="3" rx="1" fill="#FEF08A" />
        </svg>
      </div>
    );
  }

  // Default: Bolt (White / Silver modern sedan)
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Modern Silver/White Sedan */}
        <path d="M10 36C10 36 14 24 26 19C38 15 68 15 78 21C85 25 90 32 90 36L10 36Z" fill="#E2E8F0" />
        <path d="M25 20L36 12C41 9 63 9 71 13L80 20H25Z" fill="#1E293B" opacity="0.85" />
        <path d="M38 13L32 19H48V12C44 12 41 12.5 38 13Z" fill="#93C5FD" opacity="0.6" />
        <path d="M52 12V19H72L67 13C64 12.5 58 12 52 12Z" fill="#93C5FD" opacity="0.6" />
        <rect x="8" y="32" width="84" height="6" rx="3" fill="#334155" />
        <circle cx="25" cy="38" r="7" fill="#0F172A" />
        <circle cx="25" cy="38" r="4" fill="#94A3B8" />
        <circle cx="75" cy="38" r="7" fill="#0F172A" />
        <circle cx="75" cy="38" r="4" fill="#94A3B8" />
        <rect x="87" y="31" width="4" height="3" rx="1" fill="#EF4444" />
        <rect x="9" y="31" width="4" height="3" rx="1" fill="#F8FAFC" />
      </svg>
    </div>
  );
};
