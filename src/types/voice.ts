export type VoiceLanguage = 'en' | 'pidgin' | 'yo';

export type VoiceIntent =
  | 'ACCEPT_RIDE'
  | 'DECLINE_RIDE'
  | 'ARRIVED'
  | 'START_RIDE'
  | 'COMPLETE_RIDE'
  | 'NAVIGATE'
  | 'QUERY_EARNINGS'
  | 'QUERY_STATUS'
  | 'UNKNOWN';

export interface StructuredVoiceResult {
  intent: VoiceIntent;
  confidence: number; // 0.0 - 1.0
  rideId?: string;
  rawSpeech: string;
  language: VoiceLanguage;
  timestamp: string;
}

export interface VoiceAgentSession {
  id: string;
  riderId: string;
  isActive: boolean;
  language: VoiceLanguage;
  isListening: boolean;
  isSpeaking: boolean;
  lastTranscript?: string;
  lastIntent?: VoiceIntent;
  lastResponseText?: string;
}

export interface VoiceAgentEvent {
  id: string;
  riderId: string;
  rideId?: string;
  eventCategory: 'ANNOUNCEMENT' | 'SPEECH_RECOGNIZED' | 'TOOL_EXECUTED' | 'NAVIGATION_LAUNCHED';
  inputSpeech?: string;
  detectedIntent?: VoiceIntent;
  confidence?: number;
  agentResponse: string;
  language: VoiceLanguage;
  timestamp: string;
}
