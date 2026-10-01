import React, { useState, useEffect } from 'react';
import { backendStore } from '../../services/backendStore';
import { voiceAgentEngine } from '../../services/voiceAgent';
import type { RiderProfile } from '../../types/user';
import type { RideRequest } from '../../types/ride';
import { VoiceAgentOrb } from './VoiceAgentOrb';
import { VoiceRideAlert } from './VoiceRideAlert';
import { RiderActionButtons } from './RiderActionButtons';
import { RiderEarnings } from './RiderEarnings';
import { Power, ShieldCheck } from 'lucide-react';
import type { VoiceLanguage } from '../../types/voice';

export const RiderHome: React.FC = () => {
  const [rider, setRider] = useState<RiderProfile>(backendStore.getRiderProfile());
  const [activeRide, setActiveRide] = useState<RideRequest | undefined>(
    backendStore.getActiveRideForRider()
  );
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [lastTranscript, setLastTranscript] = useState<string>('');

  useEffect(() => {
    setRider(backendStore.getRiderProfile());
    setActiveRide(backendStore.getActiveRideForRider());

    const unsubscribe = backendStore.subscribe(() => {
      const updatedRider = backendStore.getRiderProfile();
      const updatedRide = backendStore.getActiveRideForRider();
      setRider(updatedRider);
      setActiveRide(updatedRide);

      // Trigger proactive voice announcement when a new ride becomes OFFERED!
      if (updatedRide && updatedRide.status === 'OFFERED' && updatedRider.isOnline) {
        voiceAgentEngine.setLanguage(updatedRider.preferredLanguage);
        voiceAgentEngine.announceNewRide(updatedRide, updatedRider.preferredLanguage);
      }
    });

    // Voice callbacks
    voiceAgentEngine.setCallbacks(
      (result) => {
        setLastTranscript(result.rawSpeech);
      },
      (state) => {
        setIsListening(state.isListening);
        setIsSpeaking(state.isSpeaking);
      }
    );

    return unsubscribe;
  }, []);

  const handleToggleOnline = () => {
    const nextStatus = !rider.isOnline;
    backendStore.toggleRiderOnline(rider.id, nextStatus);
    if (!nextStatus) {
      voiceAgentEngine.stopListening();
    }
  };

  const handleLanguageChange = (lang: VoiceLanguage) => {
    backendStore.setRiderLanguage(rider.id, lang);
    voiceAgentEngine.setLanguage(lang);
  };

  const handleManualAccept = () => {
    if (activeRide) {
      voiceAgentEngine.executeVoiceIntentTool(
        {
          intent: 'ACCEPT_RIDE',
          confidence: 1.0,
          rideId: activeRide.id,
          rawSpeech: 'Manual Button Accept',
          language: rider.preferredLanguage,
          timestamp: new Date().toISOString()
        },
        activeRide
      );
    }
  };

  const handleManualDecline = () => {
    if (activeRide) {
      voiceAgentEngine.executeVoiceIntentTool(
        {
          intent: 'DECLINE_RIDE',
          confidence: 1.0,
          rideId: activeRide.id,
          rawSpeech: 'Manual Button Decline',
          language: rider.preferredLanguage,
          timestamp: new Date().toISOString()
        },
        activeRide
      );
    }
  };

  const handleReplayVoice = () => {
    if (activeRide) {
      voiceAgentEngine.announceNewRide(activeRide, rider.preferredLanguage);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto">
      {/* Rider Status & Language Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#E2E6E0] flex items-center justify-between">
        {/* Rider Profile Pill */}
        <div className="flex items-center gap-2.5">
          <img
            src={rider.avatarUrl}
            alt={rider.name}
            className="w-10 h-10 rounded-2xl object-cover border border-[#0B6B4B]"
          />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-extrabold text-sm text-[#071F17]">{rider.name}</h3>
              <ShieldCheck className="w-4 h-4 text-[#0B6B4B]" />
            </div>
            <p className="text-[11px] text-gray-800 font-medium">{rider.bikeModel}</p>
          </div>
        </div>

        {/* Preferred Language Selector */}
        <div className="flex items-center gap-1 bg-[#F7F8F5] p-1 rounded-2xl border border-[#E2E6E0]">
          {(['en', 'pidgin', 'yo'] as VoiceLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-2 py-1 rounded-xl text-[10px] font-extrabold uppercase transition-all ${
                rider.preferredLanguage === lang
                  ? 'bg-[#0B6B4B] text-white shadow-xs'
                  : 'text-gray-800 hover:text-black'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Large ONLINE / OFFLINE Status Control Toggle */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E6E0] space-y-4 text-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                rider.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'
              }`}
            ></span>
            <span className="font-extrabold text-sm text-[#071F17]">
              {rider.isOnline ? "You're Available" : 'Offline Mode'}
            </span>
          </div>

          <span className="text-xs text-gray-800 font-semibold">
            {rider.isOnline ? 'Listening for rides' : 'Go online to receive rides'}
          </span>
        </div>

        {/* GIANT ONLINE POWER TOGGLE */}
        <button
          onClick={handleToggleOnline}
          className={`w-full py-4 rounded-2xl font-black text-lg shadow-md transition-all flex items-center justify-center gap-3 border-2 ${
            rider.isOnline
              ? 'bg-[#0B6B4B] hover:bg-[#071F17] text-white border-[#DFF5EA]'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
          }`}
        >
          <Power className={`w-6 h-6 ${rider.isOnline ? 'text-[#DFF5EA]' : 'text-gray-800'}`} />
          <span>{rider.isOnline ? 'ONLINE - READY FOR DISPATCH' : 'GO ONLINE NOW'}</span>
        </button>
      </div>

      {/* CENTRAL VOICE-FIRST RIDE AGENT ENGINE */}
      {rider.isOnline && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#0B6B4B]/30 text-center space-y-4">
          <VoiceAgentOrb
            isListening={isListening}
            isSpeaking={isSpeaking}
            language={rider.preferredLanguage}
            onToggleMic={() => {
              if (isListening) {
                voiceAgentEngine.stopListening();
              } else {
                voiceAgentEngine.startListening();
              }
            }}
            statusText={
              lastTranscript
                ? `Heard: "${lastTranscript}"`
                : isSpeaking
                ? 'Speaking ride details out loud...'
                : isListening
                ? 'Listening for voice response ("Yes", "I go take am", "Mo gba")...'
                : 'Put your phone down. The AI agent will speak when a ride arrives.'
            }
          />
        </div>
      )}

      {/* PROACTIVE NEW RIDE ALERT OVERLAY (Triggered when ride status is OFFERED) */}
      {rider.isOnline && activeRide && activeRide.status === 'OFFERED' && (
        <VoiceRideAlert
          ride={activeRide}
          language={rider.preferredLanguage}
          onAccept={handleManualAccept}
          onDecline={handleManualDecline}
          onReplayVoice={handleReplayVoice}
        />
      )}

      {/* ACTIVE ACCEPTED / ARRIVED / TRIP STARTED CONTROLS */}
      {activeRide && ['ACCEPTED', 'RIDER_EN_ROUTE', 'ARRIVED', 'TRIP_STARTED'].includes(activeRide.status) && (
        <RiderActionButtons
          ride={activeRide}
          onArrived={() => voiceAgentEngine.executeVoiceIntentTool({ intent: 'ARRIVED', confidence: 1, rawSpeech: 'Button Tap', language: rider.preferredLanguage, timestamp: new Date().toISOString() }, activeRide)}
          onStartRide={() => voiceAgentEngine.executeVoiceIntentTool({ intent: 'START_RIDE', confidence: 1, rawSpeech: 'Button Tap', language: rider.preferredLanguage, timestamp: new Date().toISOString() }, activeRide)}
          onCompleteRide={() => voiceAgentEngine.executeVoiceIntentTool({ intent: 'COMPLETE_RIDE', confidence: 1, rawSpeech: 'Button Tap', language: rider.preferredLanguage, timestamp: new Date().toISOString() }, activeRide)}
        />
      )}

      {/* SECONDARY RIDER STATS & EARNINGS */}
      <RiderEarnings rider={rider} />
    </div>
  );
};
