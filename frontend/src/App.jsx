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
import api from './api';

// Accessibility Context could go here or we can just apply a class to document.body
function App() {
  const [highContrast, setHighContrast] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

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
        {/* Accessibility Toolbar */}
        <div className={`flex justify-between items-center p-2 shadow-inner ${highContrast ? 'bg-gray-900 border-b border-yellow-300' : 'bg-gradient-to-r from-[#FF9933] via-white to-[#128807] text-gray-800 border-b border-gray-100'}`}>
          <div className="flex space-x-4 px-4">
            <button 
              onClick={toggleTextToSpeech}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition ${highContrast ? 'bg-white/20' : 'bg-white/40 hover:bg-white/60 border border-gray-200 shadow-sm'}`}
              aria-label="Read page aloud"
            >
              <Volume2 size={20} /> <span className="hidden sm:inline">Read Aloud</span>
            </button>
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition ${highContrast ? 'bg-white/20' : 'bg-white/40 hover:bg-white/60 border border-gray-200 shadow-sm'}`}
              aria-label="Toggle High Contrast"
            >
              {highContrast ? <Sun size={20} /> : <Moon size={20} />} <span className="hidden sm:inline">High Contrast</span>
            </button>
            <button 
              onClick={() => setSimpleMode(!simpleMode)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition ${simpleMode ? (highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white') : (highContrast ? 'bg-white/20' : 'bg-white/40 hover:bg-white/60 border border-gray-200 shadow-sm')}`}
              aria-label="Toggle Simple Mode"
            >
              <CheckCircle size={20} /> <span className="hidden sm:inline">{simpleMode ? 'Simple Mode ON' : 'Easy Reading'}</span>
            </button>
          </div>
          <div className="px-4 text-[10px] font-bold uppercase tracking-widest opacity-50 hidden md:block">
            Udyog Saarthi • Dedicated to the Nation
          </div>
        </div>

        {/* Navigation */}
        <nav className={`p-4 sticky top-0 z-40 backdrop-blur-md ${highContrast ? 'bg-black border-b border-yellow-300' : 'bg-white/80 border-b border-gray-100'}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-black flex items-center gap-2 group">
              <div className={`p-2 rounded-xl transition-transform group-hover:rotate-12 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white'}`}>
                <Briefcase size={24} />
              </div>
              <span className={highContrast ? 'text-yellow-300' : 'bg-gradient-to-r from-[#FF9933] to-[#128807] bg-clip-text text-transparent'}>
                Udyog Saarthi
              </span>
            </Link>
            <div className="flex gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="px-4 py-2 font-bold hover:text-[#FF9933] transition">Dashboard</Link>
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition active:scale-95">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 font-bold hover:text-[#FF9933] transition">Login</Link>
                  <Link to="/register" className={`px-6 py-2 rounded-xl font-bold shadow-lg transition transform active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#FF9933] text-white hover:bg-[#cc7a29] shadow-orange-200'}`}>Register</Link>
                </>
              )}
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
      </div>
    </Router>
  );
}

export default App;
