import React, { useState } from 'react';
import { MessageSquare, Send, X, User, Bot } from 'lucide-react';

const responses = {
  "hello": "Hello! I am your career mentor. How can I help you today?",
  "job": "You can find reserved jobs in the Dashboard. Would you like me to show you?",
  "training": "Training modules help you build skills. Start with 'Basic Computer Skills'!",
  "interview": "Practice makes perfect! Try our Interview Simulator to get ready.",
  "resume": "Use our AI Resume Builder to create a professional CV in minutes.",
  "default": "That's a great question! For specific guidance, you can also contact a coach at NIEPMD."
};

export default function MentorBot({ highContrast }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Udyog Saarthi Mentor. Ask me anything about jobs or training!", isBot: true }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isBot: false }];
    setMessages(newMessages);
    setInput('');

    // Simple keyword matching
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = responses.default;
      for (const key in responses) {
        if (lowerInput.includes(key)) {
          response = responses[key];
          break;
        }
      }
      setMessages([...newMessages, { text: response, isBot: true }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {isOpen ? (
        <div className={`w-80 h-96 flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden border ${highContrast ? 'bg-black border-yellow-300' : 'bg-white border-gray-100'}`}>
          <div className={`p-5 flex justify-between items-center ${highContrast ? 'bg-gray-900 border-b border-yellow-300' : 'bg-[#000080] text-white'}`}>
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
              <Bot size={20} /> Mentor Chat
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X size={20} /></button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                  m.isBot 
                    ? (highContrast ? 'bg-gray-800 text-yellow-300' : 'bg-white text-gray-800 border border-gray-100')
                    : (highContrast ? 'bg-yellow-300 text-black' : 'bg-[#128807] text-white')
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className={`p-4 flex gap-2 border-t bg-white ${highContrast ? 'border-yellow-300' : 'border-gray-100'}`}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              className={`flex-1 p-3 bg-gray-50 rounded-xl outline-none text-sm font-bold border-2 border-transparent focus:border-[#FF9933] transition-all ${highContrast ? 'placeholder-yellow-300/50' : ''}`}
            />
            <button type="submit" className={`p-3 rounded-xl transition-transform active:scale-90 ${highContrast ? 'text-yellow-300' : 'bg-[#FF9933] text-white shadow-lg shadow-orange-200'}`}>
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className={`p-5 rounded-full shadow-2xl transition transform hover:scale-110 active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white'}`}
          aria-label="Open mentor chat"
        >
          <MessageSquare size={32} />
        </button>
      )}
    </div>
  );
}
