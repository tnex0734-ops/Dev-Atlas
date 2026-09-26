import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface Props {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T } ? T : any;

export const VoiceInput: React.FC<Props> = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied');
      } else if (event.error === 'no-speech') {
        setError('No speech detected');
      } else {
        setError('Voice input failed');
      }
      setTimeout(() => setError(null), 3000);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setError('Could not start voice input');
        setTimeout(() => setError(null), 3000);
      }
    }
  }, [isListening]);

  if (!isSupported) {
    return (
      <button
        disabled
        className="p-2 rounded-lg text-[#d4d4d8] cursor-not-allowed"
        title="Voice input not supported in this browser"
      >
        <MicOff className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`p-2 rounded-lg transition-all ${
          isListening
            ? 'bg-red-50 text-red-500 animate-pulse'
            : 'text-[#a1a1aa] hover:text-[#171717] hover:bg-[#f5f5f5]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isListening ? 'Stop recording' : 'Voice input'}
      >
        {isListening ? (
          <Mic className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
        ) : (
          <Mic className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
        )}
      </button>

      {error && (
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-[#171717] px-3 py-1.5 text-xs text-white shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};
