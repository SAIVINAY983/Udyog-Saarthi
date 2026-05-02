import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';

const VoiceNavigator = ({ setHighContrast, handleLogout, highContrast }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const navigate = useNavigate();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      setLastCommand(command);
      processCommand(command);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) recognition.start(); // Keep listening if active
    };

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const processCommand = (command) => {
    if (command.includes('show jobs') || command.includes('open jobs')) {
      navigate('/dashboard');
      window.dispatchEvent(new CustomEvent('set-tab', { detail: 'jobs' }));
    } else if (command.includes('start training') || command.includes('open training')) {
      navigate('/dashboard');
      window.dispatchEvent(new CustomEvent('set-tab', { detail: 'training' }));
    } else if (command.includes('high contrast')) {
      setHighContrast(prev => !prev);
    } else if (command.includes('logout')) {
      handleLogout();
    } else if (command.includes('home') || command.includes('go back')) {
      navigate('/');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!recognition) return null;

  return (
    <div className={`fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2 animate-bounce-slow`}>
      {lastCommand && (
        <div className={`px-6 py-2 rounded-2xl text-sm font-black shadow-2xl animate-fade-in border-2 ${highContrast ? 'bg-yellow-300 text-black border-yellow-400' : 'bg-orange-50 text-[#FF9933] border-orange-100'}`}>
          "{lastCommand}"
        </div>
      )}
      <button
        onClick={toggleListening}
        className={`p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all transform hover:scale-110 active:scale-95 flex items-center gap-3 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-blue-500/20'
        }`}
        aria-label={isListening ? "Stop voice control" : "Start voice control"}
      >
        <div className={`p-2 rounded-xl ${isListening ? 'bg-white/20' : 'bg-white/10'}`}>
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </div>
        <span className="font-black text-lg pr-2 uppercase tracking-widest">{isListening ? 'Listening...' : 'Voice Control'}</span>
      </button>
    </div>
  );
};

export default VoiceNavigator;
