import { Language } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;

const LANG_VOICE_MAP: Record<Language, string> = {
  hi: 'hi-IN',
  en: 'en-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
};

export function speakText(text: string, lang: Language, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Text-to-speech is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_VOICE_MAP[lang] || 'hi-IN';
  utterance.rate = 0.92; // Slightly slower pace for easy understanding
  utterance.pitch = 1.0;

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
