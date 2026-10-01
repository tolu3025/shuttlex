import type { RideRequest } from '../types/ride';
import type { StructuredVoiceResult, VoiceIntent, VoiceLanguage } from '../types/voice';
import { backendStore } from './backendStore';

// Type definitions for SpeechRecognition Web API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class VoiceAgentEngine {
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private recognition: any = null;
  private currentLanguage: VoiceLanguage = 'en';
  private onSpeechRecognizedCallback?: (result: StructuredVoiceResult) => void;
  private onStateChangeCallback?: (state: { isListening: boolean; isSpeaking: boolean }) => void;

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-NG'; // Default to Nigerian English locale

        this.recognition.onstart = () => {
          this.isListening = true;
          this.notifyStateChange();
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.notifyStateChange();
        };

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence || 0.92;
          this.processRecognizedSpeech(transcript, confidence);
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition event:', event.error);
          this.isListening = false;
          this.notifyStateChange();
        };
      }
    }
  }

  public setCallbacks(
    onSpeechRecognized: (result: StructuredVoiceResult) => void,
    onStateChange: (state: { isListening: boolean; isSpeaking: boolean }) => void
  ) {
    this.onSpeechRecognizedCallback = onSpeechRecognized;
    this.onStateChangeCallback = onStateChange;
  }

  private notifyStateChange() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        isListening: this.isListening,
        isSpeaking: this.isSpeaking
      });
    }
  }

  public setLanguage(lang: VoiceLanguage) {
    this.currentLanguage = lang;
    if (this.recognition) {
      if (lang === 'yo') {
        this.recognition.lang = 'yo-NG';
      } else {
        this.recognition.lang = 'en-NG';
      }
    }
  }

  // --- TEXT TO SPEECH (PROACTIVE AGENT SPEECH) ---
  public speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly clear & deliberate speed for clarity
    utterance.pitch = 1.0;

    // Try to pick an English voice
    const voices = window.speechSynthesis.getVoices();
    const ngVoice = voices.find((v) => v.lang.includes('ng') || v.name.includes('Nigeria')) ||
                    voices.find((v) => v.lang.startsWith('en'));
    if (ngVoice) utterance.voice = ngVoice;

    this.isSpeaking = true;
    this.notifyStateChange();

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notifyStateChange();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notifyStateChange();
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  // --- PROACTIVE ANNOUNCEMENTS ---

  /**
   * Generates localized speech for incoming ride request
   */
  public announceNewRide(ride: RideRequest, language: VoiceLanguage = 'en') {
    let announcement = '';
    const fare = ride.fare.totalFare;
    const pickup = ride.pickup.name;
    const dest = ride.destination.name;

    if (language === 'pidgin') {
      announcement = `You get new ride. Student dey ${pickup} and e wan go ${dest}. The fare na ${fare} naira. You wan accept am?`;
    } else if (language === 'yo') {
      announcement = `Ride tuntun wa fun e. Akeko wa ni ${pickup}, o fe lo si ${dest}. Owo ride naa je ${fare} naira. Se o fe gba?`;
    } else {
      announcement = `You have a new ride request. The student is at ${pickup} and wants to go to ${dest}. The fare is ${fare} naira. Would you like to accept this ride?`;
    }

    backendStore.logVoiceEvent({
      riderId: ride.riderId || 'rider-001',
      rideId: ride.id,
      eventCategory: 'ANNOUNCEMENT',
      agentResponse: announcement,
      language
    });

    this.speak(announcement, () => {
      // Start listening for rider's voice reply automatically after speaking!
      this.startListening();
    });
  }

  // --- SPEECH RECOGNITION CONTROLS ---

  public startListening() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Speech recognition start failed or already active:', e);
      }
    } else if (!this.recognition) {
      console.warn('Web Speech Recognition not supported in this browser environment.');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // --- INTENT CLASSIFICATION & PARSING (NIGERIAN MULTILINGUAL NLP) ---

  public classifyIntent(rawSpeech: string): { intent: VoiceIntent; confidence: number } {
    const text = rawSpeech.toLowerCase().trim();

    // 1. ACCEPT_RIDE Intent Patterns
    const acceptPatterns = [
      'yes', 'yeah', 'yea', 'yep', 'ok', 'okay', 'accept', 'take', 'accept ride',
      'i go take am', 'i dey go', 'go take am', 'make we go', 'alright',
      'mo gba', 'gba', 'se daadaa', 'o ya', 'mo fe gba'
    ];
    if (acceptPatterns.some((p) => text.includes(p))) {
      return { intent: 'ACCEPT_RIDE', confidence: 0.96 };
    }

    // 2. DECLINE_RIDE Intent Patterns
    const declinePatterns = [
      'no', 'nope', 'decline', 'reject', 'cancel', 'not today', "can't", 'cannot',
      'i no fit', 'i no dey available', 'i no wan take am', 'no dey go',
      'mi o le gba', 'mi o fe', 'rada'
    ];
    if (declinePatterns.some((p) => text.includes(p))) {
      return { intent: 'DECLINE_RIDE', confidence: 0.95 };
    }

    // 3. ARRIVED Intent Patterns
    const arrivedPatterns = [
      'arrived', "i've arrived", 'here', 'i am here',
      'i don reach', 'don reach', 'i reach', 'i dey here',
      'mo ti de', 'de', 'ti de'
    ];
    if (arrivedPatterns.some((p) => text.includes(p))) {
      return { intent: 'ARRIVED', confidence: 0.94 };
    }

    // 4. START_RIDE Intent Patterns
    const startPatterns = [
      'start', 'start ride', 'start trip', "let's go", 'lets go', 'moving',
      'we dey go', 'we don start',
      'a ti bere', 'bere', 'o ya lets go'
    ];
    if (startPatterns.some((p) => text.includes(p))) {
      return { intent: 'START_RIDE', confidence: 0.94 };
    }

    // 5. COMPLETE_RIDE Intent Patterns
    const completePatterns = [
      'complete', 'finish', 'dropped', 'drop', 'done',
      'i don drop am', 'don drop', 'we don reach',
      'mo ti gbe e de', 'gbe de', 'mo ti drop e'
    ];
    if (completePatterns.some((p) => text.includes(p))) {
      return { intent: 'COMPLETE_RIDE', confidence: 0.95 };
    }

    return { intent: 'UNKNOWN', confidence: 0.40 };
  }

  /**
   * Processes speech transcript, invokes controlled backend tools, and responds verbally
   */
  public processRecognizedSpeech(rawSpeech: string, confidence: number = 0.95): StructuredVoiceResult {
    const { intent, confidence: intentConfidence } = this.classifyIntent(rawSpeech);
    const activeRide = backendStore.getPendingOfferedRide() || backendStore.getActiveRideForRider();

    const result: StructuredVoiceResult = {
      intent,
      confidence: Math.min(confidence, intentConfidence),
      rideId: activeRide?.id,
      rawSpeech,
      language: this.currentLanguage,
      timestamp: new Date().toISOString()
    };

    if (this.onSpeechRecognizedCallback) {
      this.onSpeechRecognizedCallback(result);
    }

    // Execute backend actions according to intent & ride state
    this.executeVoiceIntentTool(result, activeRide);

    return result;
  }

  /**
   * Controlled Agent Tools Invocation Layer
   */
  public executeVoiceIntentTool(result: StructuredVoiceResult, activeRide?: RideRequest) {
    const lang = this.currentLanguage;

    if (result.intent === 'ACCEPT_RIDE' && activeRide && activeRide.status === 'OFFERED') {
      // 1. Controlled tool call
      backendStore.accept_ride(activeRide.id);

      // 2. Localized agent confirmation speech
      let confirmationText = "Okay, I've accepted the ride. Opening map to pickup location.";
      if (lang === 'pidgin') {
        confirmationText = "Correct! I don accept the ride. I dey open map to student pickup point.";
      } else if (lang === 'yo') {
        confirmationText = "O da, mo ti gba ride naa. Mo fe si map si ibi ti akeko wa.";
      }

      backendStore.logVoiceEvent({
        riderId: activeRide.riderId || 'rider-001',
        rideId: activeRide.id,
        eventCategory: 'TOOL_EXECUTED',
        inputSpeech: result.rawSpeech,
        detectedIntent: 'ACCEPT_RIDE',
        confidence: result.confidence,
        agentResponse: confirmationText,
        language: lang
      });

      this.speak(confirmationText, () => {
        // 3. Launch Google Maps navigation deep link to student's pickup coordinates!
        this.openGoogleMapsNavigation(activeRide.pickup.latitude, activeRide.pickup.longitude);
      });

    } else if (result.intent === 'DECLINE_RIDE' && activeRide && activeRide.status === 'OFFERED') {
      backendStore.decline_ride(activeRide.id);

      let declineText = "Ride declined. I will look for another passenger for you.";
      if (lang === 'pidgin') declineText = "No p, I don decline am. I go look for another ride for you.";
      if (lang === 'yo') declineText = "Kosi wahala, mo ti fofo ride naa. Mo n wa elomiran fun e.";

      backendStore.logVoiceEvent({
        riderId: activeRide.riderId || 'rider-001',
        rideId: activeRide.id,
        eventCategory: 'TOOL_EXECUTED',
        inputSpeech: result.rawSpeech,
        detectedIntent: 'DECLINE_RIDE',
        confidence: result.confidence,
        agentResponse: declineText,
        language: lang
      });

      this.speak(declineText);

    } else if (result.intent === 'ARRIVED' && activeRide && (activeRide.status === 'ACCEPTED' || activeRide.status === 'RIDER_EN_ROUTE')) {
      backendStore.mark_rider_arrived(activeRide.id);

      let arrivedText = "Arrived marked. The student has been notified.";
      if (lang === 'pidgin') arrivedText = "Correct! Student don get alert say you don reach.";
      if (lang === 'yo') arrivedText = "O da. Akeko ti gba ifese nipa pe o ti de.";

      backendStore.logVoiceEvent({
        riderId: activeRide.riderId || 'rider-001',
        rideId: activeRide.id,
        eventCategory: 'TOOL_EXECUTED',
        inputSpeech: result.rawSpeech,
        detectedIntent: 'ARRIVED',
        confidence: result.confidence,
        agentResponse: arrivedText,
        language: lang
      });

      this.speak(arrivedText);

    } else if (result.intent === 'START_RIDE' && activeRide && activeRide.status === 'ARRIVED') {
      backendStore.start_ride(activeRide.id);

      let startText = "Trip started! Drive safely.";
      if (lang === 'pidgin') startText = "Oya! Trip don start. Ride safe o!";
      if (lang === 'yo') startText = "A ti bere ride naa! Wa okada pelu sora.";

      backendStore.logVoiceEvent({
        riderId: activeRide.riderId || 'rider-001',
        rideId: activeRide.id,
        eventCategory: 'TOOL_EXECUTED',
        inputSpeech: result.rawSpeech,
        detectedIntent: 'START_RIDE',
        confidence: result.confidence,
        agentResponse: startText,
        language: lang
      });

      this.speak(startText);

    } else if (result.intent === 'COMPLETE_RIDE' && activeRide && activeRide.status === 'TRIP_STARTED') {
      backendStore.complete_ride(activeRide.id);

      let completeText = `Ride completed! You earned ${activeRide.fare.totalFare} naira.`;
      if (lang === 'pidgin') completeText = `Nice work! You don earn ${activeRide.fare.totalFare} naira for this ride.`;
      if (lang === 'yo') completeText = `Ese o! O ti pa owo ${activeRide.fare.totalFare} naira lori ride yi.`;

      backendStore.logVoiceEvent({
        riderId: activeRide.riderId || 'rider-001',
        rideId: activeRide.id,
        eventCategory: 'TOOL_EXECUTED',
        inputSpeech: result.rawSpeech,
        detectedIntent: 'COMPLETE_RIDE',
        confidence: result.confidence,
        agentResponse: completeText,
        language: lang
      });

      this.speak(completeText);
    } else {
      let unknownText = "I didn't quite catch that. Please repeat or use the screen buttons.";
      if (lang === 'pidgin') unknownText = "I no get dat one clear. Abeg talk am again or press button.";
      if (lang === 'yo') unknownText = "Mi o gbo daadaa. E jowo so si tabi te bọtini.";

      this.speak(unknownText);
    }
  }

  /**
   * Opens Google Maps Navigation Deep Link to specified destination coordinates
   */
  public openGoogleMapsNavigation(latitude: number, longitude: number) {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  }
}

export const voiceAgentEngine = new VoiceAgentEngine();
