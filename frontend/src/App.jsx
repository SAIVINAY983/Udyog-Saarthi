import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Volume2, Moon, Sun, User, Briefcase, GraduationCap, CheckCircle } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import InterviewSimulator from './pages/InterviewSimulator';
import ResumeBuilder from './pages/ResumeBuilder';
import TrainingCourse from './pages/TrainingCourse';
import AdminDashboard from './pages/AdminDashboard';
import VoiceNavigator from './components/VoiceNavigator';
import MentorBot from './components/MentorBot';
import NotificationCenter from './components/NotificationCenter';
import LiveInterviewRoom from './pages/LiveInterviewRoom';
import api from './api';
import { Bell, Languages } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
  const { t, language, setLanguage } = useLanguage();
  const [highContrast, setHighContrast] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await api.get('/user');
          setUser(response.data);
        } catch (err) {
          console.error('Token verification failed', err);
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setCheckingAuth(false);
    };

    verifyUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        try {
          const res = await api.get('/notifications');
          if (Array.isArray(res.data)) {
            setUnreadCount(res.data.filter(n => !n.is_read).length);
          }
        } catch (err) {
          console.error('Failed to fetch unread notifications');
        }
      };
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000); // Check every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const toggleTextToSpeech = () => {
    const text = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9933]"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen ${highContrast ? 'bg-black text-yellow-300' : 'bg-white text-gray-900'} transition-colors duration-300 pb-20`}>
        {/* Accessibility Toolbar - Premium Style */}
        <div className={`flex justify-between items-center py-2 px-6 border-b transition-all duration-500 ${highContrast ? 'bg-black border-yellow-300' : 'bg-chakra text-white/90 border-white/10'}`}>
          <div className="flex space-x-3">
            <button 
              onClick={toggleTextToSpeech}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-xs font-bold uppercase tracking-wider"
              aria-label="Read page aloud"
            >
              <Volume2 size={16} /> <span className="hidden sm:inline">Audio</span>
            </button>
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-xs font-bold uppercase tracking-wider"
              aria-label="Toggle High Contrast"
            >
              {highContrast ? <Sun size={16} /> : <Moon size={16} />} <span className="hidden sm:inline">Contrast</span>
            </button>
            <button 
              onClick={() => setSimpleMode(!simpleMode)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${simpleMode ? 'bg-saffron text-white shadow-lg shadow-saffron/20' : 'bg-white/10 hover:bg-white/20'}`}
              aria-label="Toggle Simple Mode"
            >
              <CheckCircle size={16} /> <span className="hidden sm:inline">{simpleMode ? 'Easy Mode ON' : 'Easy Mode'}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Languages size={14} className="opacity-50" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent font-black text-[10px] uppercase tracking-[0.2em] outline-none cursor-pointer p-1"
              >
                <option value="en" className="text-black">EN</option>
                <option value="hi" className="text-black">HI</option>
                <option value="ta" className="text-black">TA</option>
                <option value="te" className="text-black">TE</option>
              </select>
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hidden md:block">
              Dedicated to the Nation
            </div>
          </div>
        </div>

        {/* Navigation - Ultra Premium */}
        <nav className={`p-5 sticky top-0 z-50 transition-all duration-500 ${highContrast ? 'bg-black border-b border-yellow-300' : 'bg-white/70 backdrop-blur-2xl border-b border-chakra/5'}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-chakra flex items-center justify-center text-white shadow-2xl shadow-chakra/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <Briefcase size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none text-chakra-dark">Udyog Saarthi</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-saffron leading-none mt-1">Charioteer of Employment</span>
              </div>
            </Link>

            <div className="flex items-center gap-8">
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/interview" className="nav-link">Training</Link>
                <Link to="/resume" className="nav-link">Resume</Link>
              </div>

              <div className="h-6 w-px bg-chakra/10 mx-2"></div>

              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <button 
                      onClick={() => setShowNotifications(true)}
                      className="p-2.5 rounded-xl text-chakra/60 hover:text-saffron hover:bg-saffron/5 transition-all relative"
                    >
                      <Bell size={22} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-saffron text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white ring-2 ring-saffron/20 animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    <Link to="/dashboard" className="px-5 py-2.5 text-sm font-bold text-chakra hover:text-saffron transition-colors">Portal</Link>
                    <button onClick={handleLogout} className="px-6 py-2.5 bg-red-500/10 text-red-600 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5 active:scale-95 border border-red-500/20">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-chakra hover:text-saffron transition-colors">Sign In</Link>
                    <Link to="/register" className="px-8 py-3 bg-saffron text-white rounded-2xl font-bold text-sm shadow-xl shadow-saffron/20 hover:bg-saffron-dark hover:shadow-saffron/40 transition-all active:scale-95">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-4 py-8">
          <Routes>
            <Route path="/" element={<Landing user={user} highContrast={highContrast} simpleMode={simpleMode} />} />
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} highContrast={highContrast} simpleMode={simpleMode} /> : <Navigate to="/login" />} />
            <Route path="/interview" element={user ? <InterviewSimulator highContrast={highContrast} /> : <Navigate to="/login" />} />
            <Route path="/interview-room/:id" element={user ? <LiveInterviewRoom highContrast={highContrast} /> : <Navigate to="/login" />} />
            <Route path="/resume" element={user ? <ResumeBuilder highContrast={highContrast} user={user} /> : <Navigate to="/login" />} />
            <Route path="/training/:id" element={user ? <TrainingCourse highContrast={highContrast} simpleMode={simpleMode} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard highContrast={highContrast} /> : <Navigate to="/dashboard" />} />
          </Routes>
        </main>

        <VoiceNavigator 
          setHighContrast={setHighContrast} 
          handleLogout={handleLogout}
          highContrast={highContrast}
        />
        <MentorBot highContrast={highContrast} />
        {showNotifications && (
          <NotificationCenter 
            user={user} 
            highContrast={highContrast} 
            onClose={() => {
              setShowNotifications(false);
              // Trigger a refresh of unread count
              api.get('/notifications').then(res => setUnreadCount(res.data.filter(n => !n.is_read).length));
            }} 
          />
        )}
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
