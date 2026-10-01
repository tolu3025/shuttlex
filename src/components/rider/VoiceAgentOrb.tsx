import React from 'react';
import { Mic, Volume2, Sparkles, Radio } from 'lucide-react';

interface VoiceAgentOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  language: 'en' | 'pidgin' | 'yo';
  onToggleMic: () => void;
  statusText?: string;
}

export const VoiceAgentOrb: React.FC<VoiceAgentOrbProps> = ({
  isListening,
  isSpeaking,
  language,
  onToggleMic,
  statusText
}) => {
  const getLanguageLabel = () => {
    switch (language) {
      case 'pidgin':
        return 'Pidgin English';
      case 'yo':
        return 'Yorùbá';
      default:
        return 'English';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-4">
      {/* Voice Orb Container */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Aura Waves */}
        {(isListening || isSpeaking) && (
          <>
            <div
              className={`absolute w-44 h-44 rounded-full animate-ping opacity-30 ${
                isSpeaking ? 'bg-[#F4B740]' : 'bg-[#0B6B4B]'
              }`}
            ></div>
            <div
              className={`absolute w-36 h-36 rounded-full animate-pulse opacity-50 ${
                isSpeaking ? 'bg-[#F4B740]' : 'bg-[#0B6B4B]'
              }`}
            ></div>
          </>
        )}

        {/* Central Large Interactive Circular Button */}
        <button
          onClick={onToggleMic}
          className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all transform active:scale-95 border-4 ${
            isSpeaking
              ? 'bg-gradient-to-br from-[#F4B740] to-amber-600 border-white ring-8 ring-amber-200'
              : isListening
              ? 'bg-gradient-to-br from-[#0B6B4B] to-[#071F17] border-[#DFF5EA] ring-8 ring-emerald-200 animate-pulse'
              : 'bg-[#071F17] border-[#0B6B4B] hover:bg-[#0B6B4B]'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-10 h-10 animate-bounce text-white" />
          ) : isListening ? (
            <Radio className="w-10 h-10 animate-pulse text-[#DFF5EA]" />
          ) : (
            <Mic className="w-10 h-10 text-emerald-400" />
          )}

          <span className="text-[10px] font-extrabold uppercase tracking-wider pt-1">
            {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Tap to Speak'}
          </span>
        </button>
      </div>

      {/* Voice Status Text */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-[#DFF5EA] text-[#0B6B4B] text-xs font-extrabold px-3 py-1 rounded-full border border-[#0B6B4B]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Ride Agent ({getLanguageLabel()})</span>
        </div>
        <p className="text-xs text-gray-800 font-bold max-w-xs mx-auto">
          {statusText || (isListening ? 'Listening for your voice...' : 'Hands-free voice agent ready')}
        </p>
      </div>
    </div>
  );
};
