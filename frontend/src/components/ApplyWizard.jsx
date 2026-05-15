import React, { useState } from 'react';
import { X, CheckCircle, ChevronRight, ChevronLeft, Upload, Send } from 'lucide-react';
import api from '../api';

export default function ApplyWizard({ job, user, onClose, highContrast }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state for typing
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    coverLetter: ''
  });
  const [resumeSource, setResumeSource] = useState('ai'); // ai or upload
  const [uploadedFile, setUploadedFile] = useState(null);

  const steps = [
    { title: "Skill Analysis", desc: "See how well you match this role." },
    { title: "Personal Details", desc: "Confirm your contact info." },
    { title: "Attach Resume", desc: "Use your saved AI Resume." },
    { title: "Confirm & Send", desc: "Final review." }
  ];

  // Unique Feature: Skill Match Logic
  const userSkills = user?.profile?.skills?.toLowerCase().split(',').map(s => s.trim()) || [];
  const requiredSkills = job.skills_required?.toLowerCase().split(',').map(s => s.trim()) || [];
  const matchedSkills = requiredSkills.filter(s => userSkills.includes(s));
  const missingSkills = requiredSkills.filter(s => !userSkills.includes(s));
  const matchPercentage = requiredSkills.length > 0 
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
    : 100;

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    try {
      // Send resume type with application
      await api.post('/applications', { 
        job_posting_id: job.id,
        resume_type: resumeSource 
      });
      setStep(4); // Success step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className={`w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up ${highContrast ? 'bg-black border-2 border-yellow-300' : 'bg-white'}`}>
        <div className={`p-8 flex justify-between items-center ${highContrast ? 'bg-gray-900 border-b border-yellow-300' : 'bg-[#000080] text-white'}`}>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Assisted Application</h2>
            <p className="text-sm font-bold opacity-70 uppercase tracking-widest mt-1">Applying for: {job.title}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/20 rounded-full transition-transform hover:rotate-90"><X /></button>
        </div>

        <div className="p-10">
          {step < 4 && (
            <div className="mb-12 flex justify-between">
              {steps.map((s, i) => (
                <div key={i} className={`flex-1 flex flex-col items-center gap-2 ${step >= i ? 'opacity-100' : 'opacity-20'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${step >= i ? (highContrast ? 'bg-yellow-300 text-black' : 'bg-[#FF9933] text-white shadow-lg shadow-orange-200') : 'bg-gray-100'}`}>
                    {step > i ? <CheckCircle size={20} /> : i + 1}
                  </div>
                  <div className="hidden md:block text-[10px] font-black uppercase tracking-widest text-center">{s.title}</div>
                </div>
              ))}
            </div>
          )}

          <div className="min-h-[250px]">
            {step === 0 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-black">{steps[0].title}</h3>
                  <div className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${matchPercentage >= 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {matchPercentage}% Match
                  </div>
                </div>
                
                <div className={`p-6 rounded-[2.5rem] border-2 transition-all ${highContrast ? 'bg-black border-yellow-300' : 'bg-gray-50 border-gray-100 shadow-inner'}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black ${matchPercentage >= 70 ? 'bg-green-500 text-white' : 'bg-[#FF9933] text-white'}`}>
                      {matchPercentage}%
                    </div>
                    <div>
                      <p className="font-black text-xl leading-none">Compatibility Score</p>
                      <p className="text-sm opacity-60 font-bold mt-1">Based on your community profile skills.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {matchedSkills.map(s => (
                        <span key={s} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle size={12} /> {s}
                        </span>
                      ))}
                      {missingSkills.map(s => (
                        <span key={s} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-black uppercase tracking-widest">
                          Missing: {s}
                        </span>
                      ))}
                    </div>

                    {missingSkills.length > 0 && (
                      <div className={`mt-6 p-4 rounded-2xl border-2 border-dashed ${highContrast ? 'border-yellow-300/30' : 'border-orange-200 bg-orange-50/50'}`}>
                        <p className="text-sm font-black text-[#000080] mb-2 uppercase tracking-widest">💡 Skill Gap Tip</p>
                        <p className="text-sm font-medium leading-relaxed">
                          We recommend taking the <span className="font-black">"{missingSkills[0].toUpperCase()}"</span> module in the Training Hub to increase your chances!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-black">{steps[1].title}</h3>
                <p className="text-lg opacity-70 font-medium">{steps[1].desc}</p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-[#FF9933] outline-none bg-gray-50 transition-all font-bold text-gray-700" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-[#FF9933] outline-none bg-gray-50 transition-all font-bold text-gray-700" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-2">Why should we hire you? (Optional)</label>
                    <textarea 
                      className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-[#FF9933] outline-none bg-gray-50 transition-all font-bold text-gray-700 resize-none h-32" 
                      placeholder="Start typing your cover letter here..."
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-black">{steps[2].title}</h3>
                <p className="text-lg opacity-70 font-medium">{steps[2].desc}</p>
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => setResumeSource('ai')}
                    className={`p-8 rounded-3xl border-4 flex flex-col items-center gap-4 transition-all hover:scale-105 ${resumeSource === 'ai' ? (highContrast ? 'border-yellow-300 bg-yellow-300 text-black' : 'border-[#FF9933] bg-orange-50') : 'border-gray-50'}`}
                  >
                    <CheckCircle className={resumeSource === 'ai' ? (highContrast ? 'text-black' : 'text-[#FF9933]') : 'text-gray-300'} size={32} />
                    <span className="font-black text-lg">Use AI Resume</span>
                  </button>
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      id="resume-upload" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        setResumeSource('upload');
                        setUploadedFile(e.target.files[0]);
                      }}
                    />
                    <label 
                      htmlFor="resume-upload"
                      className={`p-8 rounded-3xl border-4 flex flex-col items-center gap-4 transition-all hover:scale-105 cursor-pointer h-full ${resumeSource === 'upload' ? (highContrast ? 'border-yellow-300 bg-yellow-300 text-black' : 'border-[#FF9933] bg-orange-50') : 'border-gray-50'}`}
                    >
                      <Upload className={resumeSource === 'upload' ? (highContrast ? 'text-black' : 'text-[#FF9933]') : 'text-gray-300'} size={32} />
                      <span className="font-black text-lg text-center">{uploadedFile ? uploadedFile.name : 'Upload PDF'}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in text-center py-8">
                <h3 className="text-3xl font-black">Ready to send?</h3>
                <p className="text-xl opacity-70 font-medium">Your application looks great! Click the button below to submit to the employer.</p>
                {error && <p className="text-red-500 font-bold bg-red-50 p-3 rounded-xl mt-4">{error}</p>}
                <button 
                  onClick={handleApply}
                  disabled={loading}
                  className={`mt-8 px-12 py-5 rounded-[2rem] font-black text-2xl shadow-2xl flex items-center gap-4 mx-auto transition-all transform hover:scale-105 ${loading ? 'opacity-50' : highContrast ? 'bg-yellow-300 text-black' : 'bg-[#128807] text-white shadow-green-200'}`}
                >
                  {loading ? 'Sending...' : <><Send size={28} /> Submit Application</>}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-8 py-10 animate-slide-up">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-xl ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#128807] text-white'}`}>
                  <CheckCircle size={56} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black">Success!</h2>
                  <p className="text-xl opacity-70 font-medium px-10 leading-relaxed">Your application for <span className="font-black text-[#000080]">{job.title}</span> has been sent. We'll notify you when the employer responds.</p>
                </div>
                <button 
                  onClick={onClose}
                  className={`px-10 py-4 rounded-2xl font-black text-lg transition-transform active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#FF9933] text-white shadow-xl shadow-orange-200'}`}
                >
                  Back to Jobs
                </button>
              </div>
            )}
          </div>

          {step < 3 && (
            <div className="mt-16 flex justify-between">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className={`px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition ${step === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-800'}`}
              >
                <ChevronLeft size={24} /> Previous
              </button>
              <button 
                onClick={() => setStep(s => s + 1)}
                className={`px-10 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl transform active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-blue-200'}`}
              >
                Next Step <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
