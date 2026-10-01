import React from 'react';
import type { RideStatus } from '../../types/ride';
import { Clock, CheckCircle2, Navigation, AlertTriangle, XCircle, Search } from 'lucide-react';

interface StatusBadgeProps {
  status: RideStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getBadgeConfig = (): { label: string; bg: string; text: string; icon: React.ReactNode } => {
    switch (status) {
      case 'REQUESTED':
      case 'SEARCHING':
        return {
          label: 'Searching Nearby Rider...',
          bg: 'bg-amber-100 border-amber-300',
          text: 'text-amber-900',
          icon: <Search className="w-3.5 h-3.5 animate-spin" />
        };
      case 'OFFERED':
        return {
          label: 'Rider Match Found',
          bg: 'bg-emerald-100 border-emerald-300',
          text: 'text-emerald-900',
          icon: <Clock className="w-3.5 h-3.5 animate-pulse" />
        };
      case 'ACCEPTED':
        return {
          label: 'Ride Accepted',
          bg: 'bg-emerald-600 border-emerald-700',
          text: 'text-white',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case 'RIDER_EN_ROUTE':
        return {
          label: 'Rider Heading to You',
          bg: 'bg-[#0B6B4B] border-[#071F17]',
          text: 'text-white',
          icon: <Navigation className="w-3.5 h-3.5 animate-bounce" />
        };
      case 'ARRIVED':
        return {
          label: 'Rider Has Arrived!',
          bg: 'bg-amber-500 border-amber-600',
          text: 'text-white',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case 'TRIP_STARTED':
        return {
          label: 'Trip in Progress',
          bg: 'bg-blue-600 border-blue-700',
          text: 'text-white',
          icon: <Navigation className="w-3.5 h-3.5" />
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          bg: 'bg-[#0B6B4B] border-[#071F17]',
          text: 'text-white',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case 'DECLINED':
      case 'CANCELLED_BY_STUDENT':
      case 'CANCELLED_BY_RIDER':
        return {
          label: 'Cancelled',
          bg: 'bg-red-100 border-red-300',
          text: 'text-red-800',
          icon: <XCircle className="w-3.5 h-3.5" />
        };
      case 'DISPUTED':
        return {
          label: 'Disputed',
          bg: 'bg-red-600 border-red-700',
          text: 'text-white',
          icon: <AlertTriangle className="w-3.5 h-3.5" />
        };
      default:
        return {
          label: status,
          bg: 'bg-gray-100 border-gray-300',
          text: 'text-gray-800',
          icon: <Clock className="w-3.5 h-3.5" />
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs transition-all ${config.bg} ${config.text} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
