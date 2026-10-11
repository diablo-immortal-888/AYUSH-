// Web Speech API for Text-to-Speech and Speech-to-Text in AYUSH+
import { Language } from '../types';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      const loadVoices = () => {
        if (this.synth) {
          this.voices = this.synth.getVoices();
        }
      };
      loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = loadVoices;
      }
    }
  }

  speak(text: string, lang: Language = 'en', onEnd?: () => void) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    this.stop();

    // Clean markdown/symbols for pristine voice speech
    const cleanText = text
      .replace(/[#*_~`]/g, '')
      .replace(/•/g, ', ')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Voice language mapping
    const langCodes: Record<Language, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN'
    };
    utterance.lang = langCodes[lang] || 'en-IN';
    utterance.rate = 0.92; // gentle, professional pace for healthcare
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
    const targetPrefix = utterance.lang.slice(0, 2);
    const matchedVoice = this.voices.find(v => v.lang.startsWith(targetPrefix)) ||
      this.voices.find(v => v.lang.includes('IN')) ||
      this.voices.find(v => v.lang.startsWith('en'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  // Speech-to-text listener
  startListening(
    lang: Language = 'en',
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Speech recognition is not supported in this browser. Please type your message.');
      return null;
    }

    try {
      const rec = new SpeechRecognition();
      const langCodes: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN'
      };
      rec.lang = langCodes[lang] || 'en-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      rec.onerror = (event: any) => {
        onError(event.error || 'Speech input error');
      };

      rec.onend = () => {
        onEnd();
      };

      rec.start();
      this.recognition = rec;
      return rec;
    } catch (e: any) {
      onError(e.message || 'Could not start voice recognition');
      return null;
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }
  }
}

export const speechService = new SpeechService();
