import React, { useState, useEffect } from 'react';
import { BRANDING, ROLE_LABELS } from '../../constants/branding';
import type { UserRole } from '../../types/user';
import { User, Radio, WifiOff, Shield, Bike } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-[#071F17] text-white px-4 py-3 shadow-md border-b border-[#0B6B4B]/30">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#0B6B4B] text-white flex items-center justify-center font-black text-base shadow-sm border border-[#DFF5EA]/30">
            <Bike className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg tracking-tight leading-tight text-white">
                {BRANDING.appName}
              </h1>
              <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full bg-[#0B6B4B] text-[#DFF5EA] border border-[#DFF5EA]/20">
                CAMPUS
              </span>
            </div>
            <p className="text-[10px] text-[#DFF5EA]/80 font-medium hidden sm:block">
              {BRANDING.tagline}
            </p>
          </div>
        </div>

        {/* Network & Role Switcher Controls */}
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center gap-1 text-xs bg-[#D94A4A] text-white px-2.5 py-1 rounded-full font-bold">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {/* Role Switch Tabs */}
          <div className="flex bg-[#0B6B4B]/30 p-0.5 rounded-full border border-[#0B6B4B]/40">
            <button
              onClick={() => onRoleChange('STUDENT')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeRole === 'STUDENT' && !isSplitView
                  ? 'bg-white text-[#071F17] shadow-sm'
                  : 'text-[#DFF5EA]/70 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{ROLE_LABELS.STUDENT}</span>
            </button>

            <button
              onClick={() => onRoleChange('RIDER')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeRole === 'RIDER' && !isSplitView
                  ? 'bg-[#F4B740] text-[#071F17] shadow-sm'
                  : 'text-[#DFF5EA]/70 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Rider</span>
            </button>

            <button
              onClick={() => onRoleChange('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeRole === 'ADMIN' && !isSplitView
                  ? 'bg-white text-[#071F17] shadow-sm'
                  : 'text-[#DFF5EA]/70 hover:text-white'
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
            className={`px-3 py-1.5 rounded-full border text-xs font-extrabold transition-all ${
              isSplitView
                ? 'bg-[#F4B740] text-[#071F17] border-[#F4B740]'
                : 'bg-[#0B6B4B]/40 border-[#0B6B4B]/60 text-[#DFF5EA] hover:bg-[#0B6B4B]/70'
            }`}
          >
            {isSplitView ? '📱 Single View' : '📲 Dual Live Dispatch'}
          </button>
        </div>
      </div>
    </header>
  );
};
