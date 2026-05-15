import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, ArrowLeft, BookOpen, FileText, Layout, ExternalLink, Brain } from 'lucide-react';
import api from '../api';

export default function TrainingCourse({ highContrast, simpleMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchModule();
  }, [id]);

  const fetchModule = async () => {
    try {
      const res = await api.get(`/training/${id}`);
      setModule(res.data);
    } catch (err) {
      console.error('Failed to fetch module');
      alert('Module not found.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await api.post('/progress', { training_module_id: id });
      setCompleted(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      alert('Error updating progress.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#128807]"></div></div>;

  if (!module || !module.id) {
    console.warn('Training module data is invalid or empty:', module);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center space-y-6">
        <div className="p-6 bg-red-50 text-red-600 rounded-full">
          <BookOpen size={60} />
        </div>
        <h2 className="text-3xl font-black text-gray-400">Module not found or failed to load.</h2>
        <p className="max-w-md opacity-60">This might be due to a connection issue or the module may have been removed.</p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-gray-100 rounded-2xl font-black">Go to Dashboard</button>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#128807] text-white rounded-2xl font-black shadow-lg">Retry Loading</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8 animate-fade-in">
      <button 
        onClick={() => navigate('/dashboard')}
        className={`flex items-center gap-2 font-bold opacity-60 hover:opacity-100 transition-all ${highContrast ? 'text-yellow-300' : 'text-gray-600'}`}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className={`p-12 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] ${highContrast ? 'border-2 border-yellow-300 bg-black' : 'bg-white border border-gray-100'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 pb-10 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <div className={`p-6 rounded-[2rem] ${highContrast ? 'bg-yellow-300 text-black' : 'bg-green-50 text-[#128807]'}`}>
              {module.module_type?.toLowerCase() === 'video' ? <Play size={40} /> : <BookOpen size={40} />}
            </div>
            <div>
              <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{module.module_type || 'General'} Module</span>
              <h1 className="text-5xl font-black tracking-tight mt-2">{module.title}</h1>
            </div>
          </div>
        </div>
        
        {/* Main Learning Viewport */}
        <div className="mb-12">
          {module.module_type?.toLowerCase() === 'video' ? (
            <div className="aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl border-4 border-gray-900 group relative">
              <iframe 
                src={(() => {
                  let url = module.content_url || '';
                  if (url.includes('youtube.com/watch?v=')) {
                    return url.replace('watch?v=', 'embed/').split('&')[0];
                  }
                  if (url.includes('youtu.be/')) {
                    const id = url.split('/').pop().split('?')[0];
                    return `https://www.youtube.com/embed/${id}`;
                  }
                  return url;
                })()} 
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={module.title}
              ></iframe>
            </div>
          ) : module.module_type?.toLowerCase() === 'quiz' ? (
            <div className="space-y-8">
              {module.questions && Array.isArray(module.questions) && module.questions.length > 0 ? (
                <div className="p-10 bg-white border-2 border-gray-50 rounded-[3rem] shadow-sm">
                  {!completed ? (
                    <div className="space-y-10">
                      <div className="flex justify-between items-center pb-6 border-b-2 border-gray-50">
                        <h3 className="text-3xl font-black text-[#000080]">Course Quiz</h3>
                        <span className="px-4 py-2 bg-blue-50 text-[#000080] rounded-xl font-black">{module.questions.length} Questions</span>
                      </div>
                      
                      <div className="space-y-12">
                        {module.questions.map((q, qIdx) => (
                          <div key={qIdx} className="space-y-6">
                            <p className="text-2xl font-black leading-tight">{qIdx + 1}. {q.question}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.options.map((opt, oIdx) => (
                                <button 
                                  key={oIdx} 
                                  className={`p-5 rounded-2xl border-2 text-left font-bold transition-all ${completed ? 'opacity-50 pointer-events-none' : 'hover:border-[#000080] hover:bg-blue-50/50'}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div className="pt-10">
                           <button 
                            onClick={handleComplete}
                            disabled={submitting}
                            className="w-full py-6 bg-[#000080] text-white rounded-[2rem] font-black text-2xl shadow-2xl hover:scale-105 transition"
                          >
                            {submitting ? 'Submitting...' : 'Submit Quiz Answers'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 space-y-6">
                      <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle size={48} />
                      </div>
                      <h3 className="text-4xl font-black">Quiz Completed!</h3>
                      <p className="text-xl opacity-60 font-medium">Great job! You have successfully finished this assessment.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-16 bg-blue-50/50 rounded-[3rem] border-4 border-dashed border-blue-100 text-center space-y-8">
                  <div className="w-24 h-24 bg-[#000080] text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
                    <Brain size={48} />
                  </div>
                  <h3 className="text-4xl font-black text-[#000080]">Interactive Knowledge Quiz</h3>
                  <p className="text-xl opacity-60 font-medium max-w-2xl mx-auto">This module contains an interactive assessment designed to test your understanding of the training material.</p>
                  <a 
                    href={module.content_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-4 px-12 py-5 bg-[#000080] text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-blue-200 hover:scale-105 transition transform"
                  >
                    Launch External Quiz <ExternalLink size={24} />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 bg-orange-50/50 rounded-[3rem] border-4 border-dashed border-orange-100 text-center space-y-8">
              <div className="w-24 h-24 bg-[#FF9933] text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
                <FileText size={48} />
              </div>
              <h3 className="text-4xl font-black text-[#FF9933]">Reading Material & Content</h3>
              <p className="text-xl opacity-60 font-medium max-w-2xl mx-auto">Please review the following learning materials to complete this module.</p>
              {module.content_url && (
                <a 
                  href={module.content_url.startsWith('/storage') ? `http://127.0.0.1:8000${module.content_url}` : module.content_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-4 px-12 py-5 bg-[#FF9933] text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-orange-200 hover:scale-105 transition transform"
                >
                  View Document <ExternalLink size={24} />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-10 border-t border-gray-100">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-30">Course Description</h2>
            <p className="text-2xl font-medium leading-relaxed opacity-70 italic">
              {module.description}
            </p>
          </div>
          
          <div className="flex flex-col justify-end">
            {completed ? (
              <div className="flex items-center justify-center gap-4 px-10 py-6 bg-green-50 text-[#128807] rounded-[2.5rem] font-black text-2xl shadow-inner animate-bounce">
                <CheckCircle size={32} /> SUCCESS!
              </div>
            ) : (
              <button 
                onClick={handleComplete}
                disabled={submitting}
                className={`flex items-center justify-center gap-4 px-10 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl transition transform hover:scale-105 active:scale-95 ${submitting ? 'opacity-50' : ''} ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#128807] text-white shadow-green-200'}`}
              >
                {submitting ? 'Saving...' : 'Finish Module'} <CheckCircle size={28} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
