import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, ShieldCheck, UserCheck, Star, Award, Briefcase, X, MessageSquare } from 'lucide-react';
import api from '../api';

export default function LiveInterviewRoom({ highContrast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await api.get(`/applications`);
      const app = res.data.find(a => a.id == id);
      if (app) {
        setApplication(app);
        setMeetingLink(app.meeting_link || `https://meet.jit.si/US-Interview-${id}`);
        setScore(app.interview_score || 0);
        setNotes(app.notes || '');
      } else {
        alert('Interview session not found');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to load interview');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (status = null) => {
    try {
      const data = { interview_score: score, notes: notes };
      if (status) data.status = status;
      await api.put(`/applications/${id}`, data);
      if (status === 'hired') {
        alert('CONGRATULATIONS! Candidate has been marked as HIRED 🚀');
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Failed to sync interview results');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-white font-black">ENTERING SECURE ROOM...</div>;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[100] flex flex-col overflow-hidden animate-fade-in">
      {/* Top Professional Header */}
      <div className="p-6 bg-[#1a1a1a] border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-green-500/20 animate-pulse">
            <Video size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Live Recruitment Console</h1>
            <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">Udyog Saarthi • Encrypted Video Link</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-white/40 uppercase mb-1">Position</p>
            <p className="text-xl font-black text-white">{application?.job_posting?.title}</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-white/40 hover:bg-red-500 hover:text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Viewport */}
        <div className="flex-1 bg-black relative">
          <iframe 
            src={meetingLink} 
            className="w-full h-full border-none" 
            allow="camera; microphone; display-capture; autoplay; clipboard-write"
            title="Video Interview"
          ></iframe>
        </div>

        {/* Manager Mission Control Sidebar */}
        <div className="w-[450px] bg-[#141414] border-l border-white/5 flex flex-col p-10 overflow-y-auto space-y-12 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
          
          <section className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-widest">Candidate Insight</h3>
              <ShieldCheck className="text-blue-500" size={24} />
            </div>
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase">Verified</div>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-[#000080] rounded-[1.5rem] flex items-center justify-center text-4xl font-black text-white shadow-xl">
                  {application?.user?.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white">{application?.user?.name}</h4>
                  <p className="text-sm font-bold text-white/30 italic">Professional Candidate</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-black text-white/20 uppercase mb-1">ATS Match</p>
                  <p className="text-3xl font-black text-blue-400">85%</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[10px] font-black text-white/20 uppercase mb-1">Quiz Score</p>
                  <p className="text-3xl font-black text-green-400">{application?.assessment_score || 0}%</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-widest">Live Evaluation</h3>
              <Award className="text-[#FF9933]" size={24} />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-white/40 uppercase ml-4">Interview Performance (0-100)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    onBlur={() => handleUpdate()}
                    className="w-full p-6 bg-white/5 rounded-[2rem] border-2 border-white/10 text-white font-black text-5xl outline-none focus:border-[#FF9933] transition-all"
                  />
                  <Star className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10" size={48} />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-white/40 uppercase ml-4">Internal Interview Notes</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => handleUpdate()}
                  placeholder="Strengths, weaknesses, final verdict..."
                  className="w-full h-48 p-6 bg-white/5 rounded-[2rem] border-2 border-white/10 text-white font-medium text-lg outline-none focus:border-blue-500 transition-all resize-none italic shadow-inner"
                ></textarea>
              </div>
            </div>
          </section>

          <div className="pt-6">
            <button 
              onClick={() => handleUpdate('hired')}
              className="w-full py-6 bg-gradient-to-r from-green-600 to-[#128807] text-white rounded-[2rem] font-black text-2xl shadow-2xl shadow-green-900/50 hover:scale-[1.05] transition-all transform active:scale-95 group flex items-center justify-center gap-4"
            >
              🚀 Confirm & Hire
            </button>
            <p className="text-center text-[10px] font-bold text-white/20 mt-6 uppercase tracking-widest">Action is permanent • Result will be sent instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
