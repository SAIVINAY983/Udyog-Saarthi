import React, { useState, useEffect } from 'react';
import { Mic, MicOff, MessageSquare, Play, RefreshCw, CheckCircle, AlertCircle, Type } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const questions = [
  "Can you tell me a little bit about yourself?",
  "What are your greatest strengths?",
  "Why do you want to work for our company?",
  "How do you handle difficult situations at work?",
  "Do you have any questions for us?"
];

export default function InterviewSimulator({ highContrast }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(-1); // -1: Intro, 0-4: Questions, 5: Summary
  const [isListening, setIsListening] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [browserSupported, setBrowserSupported] = useState(true);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setCurrentAnswer(prev => prev + finalTranscript);
        }
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. You can still type your answers.');
        }
      };

      setRecognition(rec);
    } else {
      setBrowserSupported(false);
    }
  }, []);

  const startInterview = () => setCurrentStep(0);

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice recognition is not supported in this browser. Please type your answer.");
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Recognition already started", e);
      }
    }
  };

  const speakQuestion = (text) => {
    // Only speak if speech synthesis is supported
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (currentStep >= 0 && currentStep < questions.length) {
      speakQuestion(questions[currentStep]);
    }
    // Cleanup speech on unmount
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep]);

  const handleNext = () => {
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }

    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer('');
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateFeedback();
      setCurrentStep(5);
    }
  };

  const generateFeedback = () => {
    setFeedback({
      clarity: "Good",
      confidence: "High",
      suggestions: [
        "Try to give more specific examples from your past experience.",
        "Your tone was very professional and clear."
      ],
      score: 85
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className={`p-12 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] ${highContrast ? 'border-2 border-yellow-300 bg-black' : 'bg-white border border-gray-100'}`}>
        {currentStep === -1 && (
          <div className="text-center space-y-8">
            <div className={`w-28 h-28 mx-auto rounded-[2rem] flex items-center justify-center shadow-2xl ${highContrast ? 'bg-yellow-300 text-black' : 'bg-orange-50 text-[#FF9933]'}`}>
              <MessageSquare size={56} />
            </div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-[#FF9933] to-[#128807] bg-clip-text text-transparent">Interview Simulator</h1>
            <p className="text-xl opacity-70 font-medium px-10">Practice your interview skills in a safe environment. Use your voice to answer common questions and get instant feedback.</p>
            {!browserSupported && (
              <div className="p-4 bg-orange-50 text-orange-600 rounded-xl font-bold border border-orange-200">
                Note: Voice recognition is not supported in this browser, but you can still type your answers!
              </div>
            )}
            <button 
              onClick={startInterview}
              className={`px-12 py-5 rounded-3xl text-2xl font-black shadow-2xl transition transform hover:scale-105 active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#FF9933] text-white shadow-orange-200'}`}
            >
              Start Practice Session
            </button>
          </div>
        )}

        {currentStep >= 0 && currentStep < questions.length && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest opacity-40">Question {currentStep + 1} of {questions.length}</span>
              <div className="flex gap-2">
                {[...Array(questions.length)].map((_, i) => (
                  <div key={i} className={`w-12 h-3 rounded-full transition-all ${i <= currentStep ? (highContrast ? 'bg-yellow-300' : 'bg-[#128807]') : 'bg-gray-100'}`}></div>
                ))}
              </div>
            </div>

            <div className="text-4xl font-black leading-tight text-gray-900 bg-gray-50 p-10 rounded-[2.5rem] border-2 border-gray-100 italic shadow-inner relative group">
              "{questions[currentStep]}"
              <button 
                onClick={() => speakQuestion(questions[currentStep])}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                title="Replay audio"
              >
                <Play size={20} className="text-[#FF9933]" />
              </button>
            </div>

            <div className={`p-10 rounded-[2.5rem] h-[250px] border-4 border-dashed transition-all relative ${isListening ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-[#FF9933]'}`}>
              {!currentAnswer && !isListening && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none flex-col gap-2 italic font-bold">
                  <Type size={32} />
                  <span>Type your answer here or use your voice...</span>
                </div>
              )}
              <textarea
                className={`w-full h-full bg-transparent resize-none outline-none text-2xl font-medium leading-relaxed ${highContrast ? 'text-white' : 'text-gray-900'}`}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10">
              <button 
                onClick={toggleListening}
                className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-blue-200'
                }`}
              >
                {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                {isListening ? 'Stop Recording' : 'Answer with Voice'}
              </button>

              <button 
                onClick={handleNext}
                className={`px-10 py-5 rounded-[2rem] font-black text-xl border-4 transition-all hover:bg-gray-50 flex items-center gap-3 ${highContrast ? 'border-yellow-300 text-yellow-300' : 'border-gray-100 text-gray-500 hover:text-gray-900'}`}
              >
                Next Question <CheckCircle size={24} />
              </button>
            </div>
          </div>
        )}

        {currentStep === 5 && feedback && (
          <div className="space-y-10 animate-slide-up">
            <div className="text-center space-y-4">
              <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 shadow-2xl ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#128807] text-white'}`}>
                <CheckCircle size={56} />
              </div>
              <h2 className="text-5xl font-black tracking-tight">Session Complete!</h2>
              <div className="inline-block px-8 py-3 rounded-2xl bg-orange-50 text-[#FF9933] text-3xl font-black shadow-sm">
                Job Readiness: {feedback.score}%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-8 rounded-[2.5rem] shadow-sm ${highContrast ? 'border border-yellow-300' : 'bg-green-50/50 border-2 border-green-100'}`}>
                <h3 className="font-black text-xl mb-6 flex items-center gap-3 uppercase tracking-widest text-[#128807]">
                  <Play size={24} /> Key Strengths
                </h3>
                <div className="space-y-4 font-bold opacity-80">
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                    <span>Confidence</span>
                    <span className="text-[#128807]">{feedback.confidence}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                    <span>Clarity</span>
                    <span className="text-[#128807]">{feedback.clarity}</span>
                  </div>
                </div>
              </div>
              <div className={`p-8 rounded-[2.5rem] shadow-sm ${highContrast ? 'border border-yellow-300' : 'bg-orange-50/50 border-2 border-orange-100'}`}>
                <h3 className="font-black text-xl mb-6 flex items-center gap-3 uppercase tracking-widest text-[#FF9933]">
                  <AlertCircle size={24} /> Areas to Improve
                </h3>
                <ul className="space-y-4">
                  {feedback.suggestions.map((s, i) => (
                    <li key={i} className="bg-white p-4 rounded-2xl shadow-sm font-bold opacity-80 flex gap-3 italic">
                      <span className="text-[#FF9933]">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 pt-10">
              <button 
                onClick={() => {
                  setCurrentStep(-1);
                  setAnswers([]);
                  setCurrentAnswer('');
                }}
                className={`flex-1 py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl transform hover:scale-105 active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#FF9933] text-white shadow-orange-200'}`}
              >
                <RefreshCw size={24} /> Practice Again
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className={`flex-1 py-5 rounded-[2rem] font-black text-xl border-4 transition-all hover:bg-gray-50 flex items-center justify-center gap-3 ${highContrast ? 'border-yellow-300 text-yellow-300' : 'border-gray-100 text-gray-500 hover:text-gray-900'}`}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
