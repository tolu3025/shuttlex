import React, { useState, useEffect } from 'react';
import { BRANDING } from '../../constants/branding';
import type { UserRole } from '../../types/user';
import { User, Radio, WifiOff, Car, Shield } from 'lucide-react';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isSplitView: boolean;
  onToggleSplitView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  isSplitView,
  onToggleSplitView
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#010101] text-white px-4 py-2.5 shadow-md border-b border-[#222222]">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white text-[#010101] flex items-center justify-center font-black text-base shadow-sm">
            <Car className="w-4 h-4 text-[#010101]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight leading-tight text-white">
                {BRANDING.appName}
              </h1>
              <span className="text-[9px] font-extrabold tracking-wider px-1.5 py-0.2 rounded-full bg-white/15 text-gray-200">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Network & Role Switcher Controls */}
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center gap-1 text-xs bg-red-900/80 text-red-200 px-2 py-0.5 rounded-md">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {/* Role Switch Tabs */}
          <div className="flex bg-[#1A1A1A] p-0.5 rounded-full border border-[#333333]">
            <button
              onClick={() => onRoleChange('STUDENT')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeRole === 'STUDENT' && !isSplitView
                  ? 'bg-white text-[#010101] shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Rider</span>
            </button>

            <button
              onClick={() => onRoleChange('RIDER')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeRole === 'RIDER' && !isSplitView
                  ? 'bg-white text-[#010101] shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Driver</span>
            </button>

            <button
              onClick={() => onRoleChange('ADMIN')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                activeRole === 'ADMIN' && !isSplitView
                  ? 'bg-white text-[#010101] shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </button>
          </div>

          {/* Toggle Split Dual-Simulator Mode */}
          <button
            onClick={onToggleSplitView}
            title="Toggle Dual Simulator"
            className={`px-2.5 py-1 rounded-full border text-xs font-extrabold transition-all ${
              isSplitView
                ? 'bg-white text-[#010101] border-white'
                : 'bg-[#1A1A1A] border-[#333333] text-gray-300 hover:text-white'
            }`}
          >
            {isSplitView ? '📱 Single' : '📲 Dual'}
          </button>
        </div>
      </div>
    </header>
  );
};
