import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, Briefcase, TrendingUp, ShieldCheck, Clock, UserCheck, Users, Video, Calendar, Brain, Search, Filter, Plus, Edit, Trash2, ChevronRight, ChevronLeft, Target, ListChecks, Play, FileText, Layout, BookOpen } from 'lucide-react';
import ApplyWizard from '../components/ApplyWizard';
import AssessmentModal from '../components/AssessmentModal';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard({ user, highContrast, simpleMode }) {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState([]);
  const [modules, setModules] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState({ title: '', description: '', module_type: 'Video', questions: [], file: null });
  const [editingModule, setEditingModule] = useState(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', location: '', job_type: 'Full-time', reservation_category: 'PWD', skills_required: '' });
  const [editingJob, setEditingJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [progress, setProgress] = useState([]);
  const [allTalent, setAllTalent] = useState([]);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingResume, setViewingResume] = useState(null); 
  const [activeMeeting, setActiveMeeting] = useState(null); 
  const [activeAssessment, setActiveAssessment] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const handleSetTab = (e) => {
      if (['jobs', 'training', 'applications'].includes(e.detail)) setActiveTab(e.detail);
    };
    window.addEventListener('set-tab', handleSetTab);
    return () => window.removeEventListener('set-tab', handleSetTab);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Load Jobs
      try {
        const res = await api.get('/jobs');
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (e) { console.error("Jobs load failed"); }

      // Load Training
      try {
        const res = await api.get('/training');
        setModules(Array.isArray(res.data) ? res.data : []);
      } catch (e) { console.error("Training load failed"); }

      // Load Profile
      try {
        const res = await api.get('/profile');
        setProfile(res.data);
      } catch (e) { console.error("Profile load failed"); }

      // Load Applications
      try {
        const res = await api.get('/applications');
        setApplications(Array.isArray(res.data) ? res.data : []);
      } catch (e) { console.error("Applications load failed"); }

      // Load Progress
      try {
        const res = await api.get('/progress');
        setProgress(Array.isArray(res.data) ? res.data : []);
      } catch (e) { console.error("Progress load failed"); }

      // Load Talent (Employer only)
      if (user?.role === 'employer') {
        try {
          const res = await api.get('/talent');
          setAllTalent(Array.isArray(res.data) ? res.data.filter(u => u.role === 'user') : []);
        } catch (e) { console.error("Talent load failed"); }
      }
    } catch (err) {
      setError('Failed to load some dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, data) => {
    try {
      await api.put(`/applications/${appId}`, typeof data === 'string' ? { status: data } : data);
      fetchData();
      if (selectedJobApplicants) {
        const updated = selectedJobApplicants.map(a => a.id === appId ? { ...a, ...(typeof data === 'string' ? { status: data } : data) } : a);
        setSelectedJobApplicants(updated);
      }
    } catch (err) { alert('Failed to update'); }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/jobs', newJob);
      setShowAddJob(false);
      setNewJob({ title: '', description: '', location: '', job_type: 'Full-time', reservation_category: 'PWD', skills_required: '' });
      fetchData();
    } catch (err) { alert('Failed to post job'); } finally { setIsSubmitting(false); }
  };

  const handleEditJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/jobs/${editingJob.id}`, editingJob);
      setEditingJob(null);
      fetchData();
    } catch (err) { alert('Failed to update job'); } finally { setIsSubmitting(false); }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Delete this job?")) {
      try { await api.delete(`/jobs/${id}`); fetchData(); } catch (err) { alert('Delete failed'); }
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', newModule.title);
      formData.append('description', newModule.description);
      formData.append('module_type', newModule.module_type);
      if (newModule.content_url) formData.append('content_url', newModule.content_url);
      if (newModule.order_index) formData.append('order_index', newModule.order_index);
      if (newModule.questions?.length > 0) formData.append('questions', JSON.stringify(newModule.questions));
      if (newModule.file) formData.append('file', newModule.file);

      await api.post('/training', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAddModule(false);
      setNewModule({ title: '', description: '', module_type: 'Video', questions: [], file: null });
      fetchData();
    } catch (err) { alert('Failed to add module: ' + (err.response?.data?.message || err.message)); } finally { setIsSubmitting(false); }
  };

  const handleEditModule = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/training/${editingModule.id}`, editingModule);
      setEditingModule(null);
      fetchData();
    } catch (err) { alert('Failed to update module'); } finally { setIsSubmitting(false); }
  };

  const openResumeViewer = async (userId) => {
    try {
      const res = await api.get(`/resume?user_id=${userId}`);
      if (res.data) {
        setViewingResume(res.data);
      } else {
        alert('Could not load detailed profile, showing basic info.');
      }
    } catch (err) {
      console.error('Profile fetch failed');
      alert('Unable to load full profile. Please check candidate details manually.');
    }
  };

  const generateMeeting = (appId) => {
    const link = `https://meet.jit.si/US-${appId}-${Math.random().toString(36).substring(7)}`;
    handleUpdateStatus(appId, { meeting_link: link });
  };

  const calculateMatch = (app) => {
    if (!app || !app.job_posting) return 0;
    const jobSkills = (app.job_posting?.skills_required || "").split(',').map(s => s.trim().toLowerCase()).filter(s => s !== "");
    if (jobSkills.length === 0) return 0;

    const candidate = app.user?.resume || {};
    const candidateSkills = (app.user?.profile?.skills || "").toLowerCase();
    const candidateExperience = (candidate.experience || "").toLowerCase();
    const candidateSummary = (candidate.summary || "").toLowerCase();
    const candidateEducation = (candidate.education || "").toLowerCase();

    // 1. Core Skills Match (60% weight)
    const skillMatches = jobSkills.filter(s => 
      candidateSkills.includes(s) || 
      candidateExperience.includes(s) || 
      candidateSummary.includes(s)
    );
    const skillScore = (skillMatches.length / jobSkills.length) * 60;

    // 2. Experience & Summary Keyword Match (30% weight) - Bonus for appearing in multiple sections
    const experienceMatches = jobSkills.filter(s => 
      (candidateExperience.includes(s) ? 1 : 0) + (candidateSummary.includes(s) ? 1 : 0) >= 1
    );
    const experienceScore = (experienceMatches.length / jobSkills.length) * 30;

    // 3. Education Check (10% weight)
    const eduKeywords = ['degree', 'bachelor', 'master', 'diploma', 'graduate', 'certified', 'b.tech', 'm.tech', 'school', 'college'];
    const hasEdu = eduKeywords.some(k => candidateEducation.includes(k));
    const educationScore = hasEdu ? 10 : 0;

    return Math.min(100, Math.round(skillScore + experienceScore + educationScore));
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#FF9933]"></div></div>;

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="p-6 bg-red-50 text-red-600 rounded-full animate-bounce">
        <ShieldCheck size={60} />
      </div>
      <h2 className="text-3xl font-black text-red-600">System Sync Failure</h2>
      <p className="max-w-md font-bold opacity-60">{error}</p>
      <button onClick={() => window.location.reload()} className="px-10 py-4 bg-[#000080] text-white rounded-[2rem] font-black shadow-xl">Retry Connection</button>
    </div>
  );

  return (
    <div className={`w-full min-h-screen pb-20 ${highContrast ? 'bg-black text-yellow-300' : 'bg-white'}`}>
      
      {/* 1. ADMIN VIEW */}
      {user?.role === 'admin' && (
        <div className="space-y-10 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-black">Admin Console</h1>
            <Link to="/admin" className="px-10 py-5 bg-red-600 text-white rounded-[2rem] font-black text-xl shadow-xl">System Management</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard title="Platform Jobs" value={jobs.length} icon={<Briefcase />} color="orange" highContrast={highContrast} />
            <StatCard title="Training Modules" value={modules.length} icon={<GraduationCap />} color="green" highContrast={highContrast} />
            <StatCard title="Active Users" value={allTalent.length || "--"} icon={<Users />} color="blue" highContrast={highContrast} />
          </div>
        </div>
      )}

      {/* 2. EMPLOYER VIEW */}
      {(user?.role === 'employer' || user?.role === 'admin') && (
        <div className="space-y-10 animate-fade-in pt-10 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-black tracking-tight">Job Management</h1>
            <button onClick={() => setShowAddJob(true)} className="px-10 py-5 bg-[#000080] text-white rounded-[2rem] font-black text-xl shadow-2xl flex items-center gap-3 hover:scale-105 transition"><Plus size={24} /> Post New Job</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="My Job Postings" value={jobs.filter(j => j.employer_id === user.id).length} icon={<Briefcase />} color="blue" highContrast={highContrast} />
            <StatCard title="Candidate Applications" value={applications.length} icon={<UserCheck />} color="orange" highContrast={highContrast} />
            <StatCard title="In Interview Stage" value={applications.filter(a => a.status === 'interviewed').length} icon={<Video />} color="green" highContrast={highContrast} />
            <StatCard title="Total Platform Talent" value={allTalent.length} icon={<Users />} color="blue" highContrast={highContrast} />
          </div>

          <div className="flex gap-4 bg-gray-50 p-2 rounded-[2.5rem] w-fit border border-gray-200">
            <button onClick={() => setActiveTab('jobs')} className={`px-10 py-4 rounded-[2rem] font-black text-xl transition-all ${activeTab === 'jobs' ? 'bg-white shadow-xl text-[#000080]' : 'text-gray-400'}`}>{t('myOpenings')}</button>
            <button onClick={() => setActiveTab('talent')} className={`px-10 py-4 rounded-[2rem] font-black text-xl transition-all ${activeTab === 'talent' ? 'bg-white shadow-xl text-[#128807]' : 'text-gray-400'}`}>{t('talentDiscovery')}</button>
          </div>

          {activeTab === 'jobs' ? (
            <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-50 shadow-sm">
              <div className="space-y-6">
                {console.log('User ID:', user.id, 'Total Jobs:', jobs.length, 'Matched:', jobs.filter(j => String(j.employer_id) === String(user.id)).length)}
                {jobs.filter(j => String(j.employer_id) === String(user.id)).length === 0 ? (
                  <div className="text-center py-20 opacity-30 italic font-bold">
                    No jobs found for your account. (Found {jobs.length} total platform jobs)
                  </div>
                ) : jobs.filter(j => String(j.employer_id) === String(user.id)).map(job => (
                  <div key={job.id} className="p-8 border-2 border-gray-50 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-gray-50 transition">
                    <div>
                      <h4 className="text-3xl font-black mb-2">{job.title}</h4>
                      <p className="font-bold opacity-40">{job.location} • {applications.filter(a => a.job_posting_id === job.id).length} Active Candidates</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setEditingJob(job)} className="p-4 bg-blue-50 text-[#000080] rounded-2xl hover:bg-blue-100 transition"><Edit size={20} /></button>
                      <button onClick={() => handleDeleteJob(job.id)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition"><Trash2 size={20} /></button>
                      <button onClick={() => setSelectedJobApplicants(applications.filter(a => a.job_posting_id == job.id))} className="px-8 py-4 bg-[#000080] text-white rounded-2xl font-black shadow-lg hover:scale-105 transition">Manage Candidates</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {allTalent.map(talent => (
                <div key={talent.id} className="p-8 bg-white border-2 border-gray-50 rounded-[3rem] hover:shadow-2xl transition-all group">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-blue-50 text-[#000080] rounded-[1.5rem] flex items-center justify-center text-4xl font-black">{talent.name?.charAt(0) || '?'}</div>
                    <div>
                      <h4 className="text-2xl font-black">{talent.name}</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase">{talent.profile?.readiness_score || 0}% Job Ready</span>
                    </div>
                  </div>
                  <button onClick={() => openResumeViewer(talent.id)} className="w-full py-5 bg-gray-50 hover:bg-[#000080] hover:text-white rounded-[1.5rem] font-black text-lg transition-all">Review Profile</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. JOB SEEKER VIEW */}
      {user?.role === 'user' && (
        <div className="space-y-10 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-black">{t('welcome')}, {user.name}</h1>
            <Link to="/resume" className="px-10 py-5 bg-[#FF9933] text-white rounded-[2rem] font-black text-xl shadow-xl shadow-orange-100">{t('resumeBuilder')}</Link>
          </div>
          <div className="flex gap-4 bg-gray-50 p-2 rounded-[2.5rem] w-fit border border-gray-100">
            {['jobs', 'training', 'applications'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-10 py-4 rounded-[2rem] font-black text-xl transition-all ${activeTab === tab ? 'bg-white shadow-xl text-[#000080]' : 'text-gray-400'}`}>{t(tab)}</button>
            ))}
          </div>

          {activeTab === 'jobs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {jobs.map(job => (
                <div key={job.id} className="p-10 bg-white border-2 border-gray-50 rounded-[3.5rem] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between mb-6"><div className="p-4 bg-blue-50 text-[#000080] rounded-2xl"><Briefcase size={32} /></div><span className="px-4 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black">{job.job_type}</span></div>
                    <h3 className="text-3xl font-black mb-2">{job.title}</h3>
                    <p className="text-lg font-bold opacity-40 mb-6">{job.location}</p>
                    <p className="text-lg opacity-70 mb-8 line-clamp-3">{job.description}</p>
                  </div>
                  <button onClick={() => setSelectedJob(job)} className="w-full py-5 bg-[#000080] text-white rounded-[2rem] font-black text-xl">Apply Now</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'training' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
              {modules.length === 0 ? (
                <div className="md:col-span-3 text-center py-20 opacity-30 italic font-bold">
                  No training modules available at the moment.
                </div>
              ) : modules.map(mod => (
                <div key={mod.id} className="p-8 bg-white border-2 border-gray-50 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="p-4 bg-green-50 text-[#128807] rounded-2xl">
                        <GraduationCap size={32} />
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase">
                        {mod.module_type}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-3">{mod.title}</h3>
                    <p className="text-sm font-medium opacity-60 mb-8 line-clamp-2">{mod.description}</p>
                  </div>
                  <div className="space-y-4">
                    <Link 
                      to={`/training/${mod.id}`} 
                      className="w-full py-4 bg-[#128807] text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:scale-[1.02] transition transform"
                    >
                      <Play size={20} /> Start Learning
                    </Link>
                    
                    {(user?.role === 'admin' || user?.role === 'trainer') && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingModule(mod)}
                          className="flex-1 py-2 bg-blue-50 text-[#000080] rounded-xl font-black text-sm hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm(`Admin Action: Permanently delete "${mod.title}"?`)) {
                              api.delete(`/training/${mod.id}`)
                                .then(() => {
                                  setModules(prev => prev.filter(m => String(m.id) !== String(mod.id)));
                                  alert('Module Deleted Successfully! 🚀');
                                })
                                .catch(err => alert('Delete Failed: ' + (err.response?.data?.message || err.message)));
                            }
                          }}
                          className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl font-black text-sm hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              {applications.map(app => (
                <div key={app.id} className="p-8 bg-white border-2 border-gray-50 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
                  <div>
                    <h3 className="text-2xl font-black">{app.job_posting?.title}</h3>
                    <p className="font-bold opacity-40 mb-6">{app.job_posting?.employer?.name}</p>
                    <div className="flex items-center gap-3">
                      {['Applied', 'Shortlist', 'Quiz', 'Interview', 'Final'].map((label, idx) => (
                        <div key={label} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${idx <= ['applied', 'shortlisted', 'shortlisted', 'interviewed', 'hired'].indexOf(app.status) + 1 ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-300 border-gray-100'}`}>{idx + 1}</div>
                          <span className="text-[8px] mt-1 font-black opacity-40 uppercase">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {app.status === 'shortlisted' && app.assessment_status === 'pending' && <button onClick={() => setActiveAssessment(app)} className="px-8 py-3 bg-[#000080] text-white rounded-2xl font-black animate-bounce shadow-lg shadow-blue-100 flex items-center gap-2"><Brain size={18} /> Start Quiz</button>}
                    {app.meeting_link && app.status === 'interviewed' && <button onClick={() => setActiveMeeting(app.meeting_link)} className="px-8 py-3 bg-[#FF9933] text-white rounded-2xl font-black animate-pulse shadow-lg flex items-center gap-2"><Video size={18} /> Join Interview</button>}
                    <span className="px-8 py-3 bg-gray-50 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-400">{app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TRAINER HUB (MANAGEMENT) */}
      {(user?.role === 'trainer' || user?.role === 'admin') && (
        <div className="space-y-12 animate-fade-in py-16 border-t-2 border-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-3">
              <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit"><ShieldCheck size={12} /> Management Console</span>
              <h1 className="text-6xl font-black tracking-tighter text-[#000080]">Training Command Center</h1>
              <p className="text-xl opacity-40 font-medium max-w-xl">Oversee your educational ecosystem, monitor student engagement, and publish new content to the talent pool.</p>
            </div>
            <button 
              onClick={() => setShowAddModule(true)} 
              className="px-12 py-6 bg-gradient-to-br from-[#128807] to-[#0e6b05] text-white rounded-[2.5rem] font-black text-2xl shadow-[0_20px_50px_rgba(18,136,7,0.3)] flex items-center gap-4 hover:scale-105 active:scale-95 transition group"
            >
              <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-90 transition-transform"><Plus size={28} /></div> 
              Publish New Module
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-6">
              <StatCard title="Active Modules" value={modules.length} icon={<GraduationCap />} color="green" highContrast={highContrast} />
              <div className="p-8 bg-gradient-to-br from-blue-600 to-[#000080] rounded-[3rem] text-white space-y-4 shadow-xl">
                <Brain size={40} className="opacity-50" />
                <h4 className="text-2xl font-black">AI Insights</h4>
                <p className="text-sm font-medium opacity-80">Students are 40% more engaged with Video modules this week.</p>
              </div>
            </div>
            
            <div className="md:col-span-3 bg-white/50 backdrop-blur-xl border-2 border-white rounded-[4rem] p-12 shadow-2xl shadow-gray-100/50">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black">Module Inventory</h3>
                <div className="relative w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={20} />
                  <input type="text" placeholder="Search modules..." className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 ring-green-100 transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {modules.map(mod => (
                  <div key={mod.id} className="group p-8 bg-white border-2 border-gray-50 rounded-[2.5rem] hover:border-[#128807]/20 hover:shadow-xl transition-all flex justify-between items-center">
                    <div className="flex items-center gap-8">
                      <div className={`p-6 rounded-[2rem] transition-colors ${mod.module_type === 'Video' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {mod.module_type === 'Video' ? <Play size={32} /> : <BookOpen size={32} />}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black group-hover:text-[#128807] transition-colors">{mod.title}</h4>
                        <p className="text-sm font-bold opacity-30 mt-1 uppercase tracking-widest">{mod.module_type} &bull; Created {mod.created_at ? new Date(mod.created_at).toLocaleDateString() : 'Recently'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setEditingModule(mod)}
                        className="p-4 bg-gray-50 text-gray-400 hover:bg-[#000080] hover:text-white rounded-2xl transition"
                        title="Edit Module"
                      >
                        <ShieldCheck size={24} />
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm(`PERMANENT ACTION: Delete "${mod.title}"?`)) {
                            api.delete(`/training/${mod.id}`)
                              .then(() => {
                                setModules(prev => prev.filter(m => String(m.id) !== String(mod.id)));
                                alert('Module Expunged Successfully! 🧹');
                              })
                              .catch(err => alert('System Error: ' + (err.response?.data?.message || err.message)));
                          }
                        }}
                        className="p-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition shadow-sm"
                        title="Delete Module"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL MODALS (Restored) */}
      
      {/* Add Module Modal (Content Studio Upgrade) */}
      {showAddModule && (
        <div className="fixed inset-0 bg-[#000080]/20 backdrop-blur-2xl flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="w-full max-w-3xl bg-white/90 p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] animate-scale-up border-2 border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
            
            <div className="relative">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-2">
                  <span className="px-4 py-1 bg-green-50 text-[#128807] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Publishing Studio</span>
                  <h2 className="text-5xl font-black tracking-tight text-gray-900">Create Master Module</h2>
                </div>
                <button onClick={() => setShowAddModule(false)} className="p-4 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><Trash2 size={24} /></button>
              </div>

              <form onSubmit={handleAddModule} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest opacity-30 ml-2">Module Identity</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Advanced JavaScript Mastery" 
                    className="w-full p-8 bg-gray-50/50 rounded-[2.5rem] border-2 border-transparent focus:border-[#128807] focus:bg-white outline-none transition-all text-2xl font-black placeholder:opacity-20"
                    value={newModule.title} 
                    onChange={e => setNewModule({...newModule, title: e.target.value})} 
                  />
                </div>

                <div className="space-y-6">
                  <label className="text-xs font-black uppercase tracking-widest opacity-30 ml-2">Learning Format</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { id: 'Video', label: 'Video', icon: <Play /> },
                      { id: 'Quiz', label: 'Quiz', icon: <Brain /> },
                      { id: 'PDF', label: 'Document', icon: <FileText /> },
                      { id: 'Hands-on', label: 'Lab', icon: <Layout /> }
                    ].map(type => (
                      <button 
                        key={type.id}
                        type="button"
                        onClick={() => setNewModule({...newModule, module_type: type.id})}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${newModule.module_type === type.id ? 'bg-[#128807] border-[#128807] text-white shadow-xl shadow-green-100' : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'}`}
                      >
                        {React.cloneElement(type.icon, { size: 32 })}
                        <span className="font-black text-[10px] uppercase tracking-widest">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest opacity-30 ml-2">{newModule.module_type === 'PDF' ? 'Upload Document' : 'Content Connection'}</label>
                    {newModule.module_type === 'PDF' ? (
                      <input 
                        type="file" 
                        className="w-full p-5 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 hover:border-[#128807] transition-all font-bold text-sm"
                        onChange={e => setNewModule({...newModule, file: e.target.files[0]})} 
                      />
                    ) : (
                      <input 
                        type="text" 
                        placeholder="Paste Video URL or Link..." 
                        className="w-full p-6 bg-gray-50/50 rounded-3xl border-2 border-transparent focus:border-[#128807] focus:bg-white outline-none transition-all font-bold"
                        value={newModule.content_url || ''} 
                        onChange={e => setNewModule({...newModule, content_url: e.target.value})} 
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest opacity-30 ml-2">Display Order</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1" 
                      className="w-full p-6 bg-gray-50/50 rounded-3xl border-2 border-transparent focus:border-[#128807] focus:bg-white outline-none transition-all font-bold"
                      value={newModule.order_index || 0} 
                      onChange={e => setNewModule({...newModule, order_index: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest opacity-30 ml-2">Curriculum Description</label>
                  <textarea 
                    className="w-full p-8 bg-gray-50/50 rounded-[3rem] h-40 border-2 border-transparent focus:border-[#128807] focus:bg-white outline-none transition-all font-medium leading-relaxed resize-none"
                    placeholder="What will the students learn in this module?"
                    value={newModule.description} 
                    onChange={e => setNewModule({...newModule, description: e.target.value})}
                  ></textarea>
                </div>

                {/* QUIZ BUILDER SECTION */}
                {newModule.module_type === 'Quiz' && (
                  <div className="p-10 bg-blue-50/30 rounded-[3rem] border-2 border-dashed border-blue-100 space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-[#000080]">Internal Quiz Builder</h3>
                      <button 
                        type="button"
                        onClick={() => setNewModule({...newModule, questions: [...newModule.questions, { question: '', options: ['', '', '', ''], correct: 0 }]})}
                        className="px-6 py-3 bg-[#000080] text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition"
                      >
                        <Plus size={18} /> Add Question
                      </button>
                    </div>

                    {newModule.questions.length === 0 && (
                      <p className="text-center py-10 opacity-30 italic font-bold">No questions added yet. Add one to create an internal quiz, or use the URL above for an external quiz.</p>
                    )}

                    <div className="space-y-10">
                      {newModule.questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-8 bg-white rounded-[2rem] shadow-sm space-y-6 relative group">
                          <button 
                            type="button" 
                            onClick={() => {
                              const qs = [...newModule.questions];
                              qs.splice(qIdx, 1);
                              setNewModule({...newModule, questions: qs});
                            }}
                            className="absolute -top-3 -right-3 p-3 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                          
                          <input 
                            type="text" 
                            placeholder={`Question ${qIdx + 1}`}
                            className="w-full p-4 bg-gray-50 rounded-xl border-none font-bold text-lg outline-none focus:ring-2 ring-blue-100"
                            value={q.question}
                            onChange={(e) => {
                              const qs = [...newModule.questions];
                              qs[qIdx].question = e.target.value;
                              setNewModule({...newModule, questions: qs});
                            }}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            {q.options.map((opt, oIdx) => (
                              <input 
                                key={oIdx}
                                type="text" 
                                placeholder={`Option ${oIdx + 1}`}
                                className="w-full p-3 bg-gray-50/50 rounded-xl border-none text-sm font-medium outline-none focus:bg-white transition"
                                value={opt}
                                onChange={(e) => {
                                  const qs = [...newModule.questions];
                                  qs[qIdx].options[oIdx] = e.target.value;
                                  setNewModule({...newModule, questions: qs});
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-6 pt-6">
                  <button type="button" onClick={() => setShowAddModule(false)} className="px-10 py-5 font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">Dismiss</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="px-14 py-6 bg-gradient-to-r from-[#128807] to-[#000080] text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 hover:scale-105 transition-all transform active:scale-95 flex items-center gap-3"
                  >
                    {isSubmitting ? 'Syncing...' : <><Plus size={24} /> Deploy Module</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Module Modal */}
      {editingModule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white p-10 rounded-[3rem] shadow-2xl animate-slide-up">
            <h2 className="text-4xl font-black mb-8">Edit Module</h2>
            <form onSubmit={handleEditModule} className="space-y-6">
              <Input label="Module Title" value={editingModule.title} onChange={v => setEditingModule({...editingModule, title: v})} />
              <div className="space-y-3">
                <label className="text-xs font-black uppercase opacity-40 ml-4">Module Category</label>
                <select className="w-full p-5 bg-gray-50 rounded-2xl font-bold" value={editingModule.module_type} onChange={e => setEditingModule({...editingModule, module_type: e.target.value})}>
                  <option value="Video">Video Course</option>
                  <option value="PDF">Reading Material (PDF)</option>
                  <option value="Quiz">Interactive Quiz</option>
                  <option value="Hands-on">Hands-on Lab</option>
                </select>
              </div>
              <Input label="Video / Content URL" value={editingModule.content_url || ''} onChange={v => setEditingModule({...editingModule, content_url: v})} />
              <textarea className="w-full p-6 bg-gray-50 rounded-3xl h-[150px] font-medium" value={editingModule.description} onChange={e => setEditingModule({...editingModule, description: e.target.value})}></textarea>

              {/* EDITING QUIZ BUILDER */}
              {editingModule.module_type === 'Quiz' && (
                <div className="p-8 bg-blue-50/30 rounded-[2.5rem] border-2 border-dashed border-blue-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-[#000080]">Update Quiz Questions</h3>
                    <button 
                      type="button"
                      onClick={() => setEditingModule({...editingModule, questions: [...(editingModule.questions || []), { question: '', options: ['', '', '', ''], correct: 0 }]})}
                      className="px-4 py-2 bg-[#000080] text-white rounded-xl font-black text-xs"
                    >
                      + Add Question
                    </button>
                  </div>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                    {(editingModule.questions || []).map((q, qIdx) => (
                      <div key={qIdx} className="p-6 bg-white rounded-2xl shadow-sm space-y-4 relative group">
                        <button 
                          type="button" 
                          onClick={() => {
                            const qs = [...editingModule.questions];
                            qs.splice(qIdx, 1);
                            setEditingModule({...editingModule, questions: qs});
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                        <input 
                          type="text" 
                          placeholder="Question Title"
                          className="w-full p-3 bg-gray-50 rounded-xl border-none font-bold text-sm outline-none"
                          value={q.question}
                          onChange={(e) => {
                            const qs = [...editingModule.questions];
                            qs[qIdx].question = e.target.value;
                            setEditingModule({...editingModule, questions: qs});
                          }}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          {q.options.map((opt, oIdx) => (
                            <input 
                              key={oIdx}
                              type="text" 
                              placeholder={`Option ${oIdx + 1}`}
                              className="w-full p-2 bg-gray-50/50 rounded-lg border-none text-xs outline-none"
                              value={opt}
                              onChange={(e) => {
                                const qs = [...editingModule.questions];
                                qs[qIdx].options[oIdx] = e.target.value;
                                setEditingModule({...editingModule, questions: qs});
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setEditingModule(null)} className="px-8 py-4 font-black">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-10 py-4 bg-[#000080] text-white rounded-2xl font-black shadow-xl">
                  {isSubmitting ? 'Saving...' : 'Update Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white p-10 rounded-[3rem] shadow-2xl animate-slide-up">
            <h2 className="text-4xl font-black mb-8">Post New Job</h2>
            <form onSubmit={handleAddJob} className="space-y-6">
              <Input label="Job Title" value={newJob.title} onChange={v => setNewJob({...newJob, title: v})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Location" value={newJob.location} onChange={v => setNewJob({...newJob, location: v})} />
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase opacity-40 ml-4">Type</label>
                  <select className="w-full p-5 bg-gray-50 rounded-2xl font-bold" value={newJob.job_type} onChange={e => setNewJob({...newJob, job_type: e.target.value})}>
                    <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
                <Input label="Required Skills (Comma separated)" placeholder="e.g. React, Node.js, SQL" value={newJob.skills_required} onChange={v => setNewJob({...newJob, skills_required: v})} />
                <textarea className="w-full p-6 bg-gray-50 rounded-3xl h-[150px] font-medium" placeholder="Job Description..." value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
              <div className="flex justify-end gap-4"><button type="button" onClick={() => setShowAddJob(false)} className="px-8 py-4 font-black">Cancel</button><button type="submit" className="px-10 py-4 bg-[#000080] text-white rounded-2xl font-black shadow-xl">Post Opportunity</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white p-10 rounded-[3rem] shadow-2xl animate-slide-up">
            <h2 className="text-4xl font-black mb-8">Edit Posting</h2>
            <form onSubmit={handleEditJob} className="space-y-6">
              <Input label="Job Title" value={editingJob.title} onChange={v => setEditingJob({...editingJob, title: v})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Location" value={editingJob.location} onChange={v => setEditingJob({...editingJob, location: v})} />
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase opacity-40 ml-4">Type</label>
                  <select className="w-full p-5 bg-gray-50 rounded-2xl font-bold" value={editingJob.job_type} onChange={e => setEditingJob({...editingJob, job_type: e.target.value})}>
                    <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
                <Input label="Required Skills (Comma separated)" value={editingJob.skills_required || ''} onChange={v => setEditingJob({...editingJob, skills_required: v})} />
                <textarea className="w-full p-6 bg-gray-50 rounded-3xl h-[150px] font-medium" value={editingJob.description} onChange={e => setEditingJob({...editingJob, description: e.target.value})}></textarea>
              <div className="flex justify-end gap-4"><button type="button" onClick={() => setEditingJob(null)} className="px-8 py-4 font-black">Cancel</button><button type="submit" className="px-10 py-4 bg-[#000080] text-white rounded-2xl font-black shadow-xl">Save Changes</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Applicant Management Modal */}
      {selectedJobApplicants && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-5xl my-8 p-12 bg-white rounded-[3.5rem] shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-10"><h2 className="text-4xl font-black tracking-tight">Manage Candidates</h2><button onClick={() => setSelectedJobApplicants(null)} className="text-4xl font-black opacity-20 hover:opacity-100 transition">&times;</button></div>
            <div className="space-y-8">
              {selectedJobApplicants.length === 0 ? <p className="text-center py-20 opacity-30 italic font-bold">No applications yet for this position.</p> : selectedJobApplicants.map(app => (
                <div key={app.id} className="p-8 border-2 border-gray-50 rounded-[2.5rem] bg-white shadow-sm space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-blue-50 text-[#000080] rounded-[1.5rem] flex items-center justify-center text-4xl font-black">{app.user?.name?.charAt(0)}</div>
                      <div><h4 className="text-3xl font-black">{app.user?.name}</h4><p className="font-bold opacity-30">{app.user?.email}</p></div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black opacity-20 uppercase mb-1">ATS Skill Match</p>
                      <div className="flex items-center gap-3">
                        <p className="text-4xl font-black text-[#000080]">{calculateMatch(app)}%</p>
                        {calculateMatch(app) >= 70 && app.status === 'applied' && (
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase animate-pulse shadow-lg"
                          >
                            Automate Shortlist
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <button 
                      onClick={() => openResumeViewer(app.user_id || app.user?.id)} 
                      className="px-8 py-4 bg-[#000080] text-white rounded-2xl font-black flex-1 shadow-lg shadow-blue-100 hover:scale-105 transition"
                    >
                      View Candidate Profile
                    </button>
                    {app.resume_path && <a href={`http://127.0.0.1:8000/storage/${app.resume_path}`} target="_blank" rel="noreferrer" className="px-8 py-4 bg-green-600 text-white rounded-2xl font-black flex-1 text-center shadow-lg shadow-green-100 hover:scale-105 transition">Download CV</a>}
                    <select value={app.status} onChange={(e) => handleUpdateStatus(app.id, e.target.value)} className="px-8 py-4 border-2 border-gray-200 rounded-2xl font-black outline-none flex-1">
                      <option value="applied">Status: Applied</option><option value="shortlisted">Status: Shortlist</option><option value="interviewed">Status: Interview</option><option value="hired">Status: Hired 🚀</option><option value="rejected">Status: Rejected</option>
                    </select>
                  </div>
                  {app.status === 'shortlisted' && (
                    <div className={`p-8 rounded-[2.5rem] border-2 flex justify-between items-center ${app.assessment_status === 'qualified' ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                      <div><p className="text-xs font-black opacity-30 uppercase mb-2">Round 1: Online Quiz</p><p className="text-2xl font-black capitalize">{app.assessment_status || 'In Progress'}</p></div>
                      {app.assessment_score && <div className="text-right"><p className="text-xs font-black opacity-30 uppercase mb-1">Score</p><p className="text-4xl font-black">{app.assessment_score}%</p></div>}
                    </div>
                  )}
                  {(app.assessment_status === 'qualified' || app.status === 'interviewed') && (
                    <div className="grid grid-cols-2 gap-6 pt-10 border-t border-gray-100">
                      <div className="space-y-3">
                        <label className="text-xs font-black opacity-30 uppercase ml-4">1-on-1 Interview</label>
                        {app.meeting_link ? (
                          <button 
                            onClick={() => navigate(`/interview-room/${app.id}`)} 
                            className="w-full py-5 bg-green-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-green-100 hover:scale-105 transition"
                          >
                            <Video size={24} /> Enter Room
                          </button>
                        ) : (
                          <button 
                            onClick={() => generateMeeting(app.id)} 
                            className="w-full py-5 bg-[#FF9933] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-orange-100 hover:scale-105 transition"
                          >
                            <Video size={24} /> Create Room
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black opacity-30 uppercase ml-4">Scheduled Time</label>
                        <input type="datetime-local" className="w-full p-5 border-2 border-gray-100 rounded-2xl font-black outline-none focus:border-[#000080]" defaultValue={app.interview_time?.substring(0, 16)} onBlur={(e) => handleUpdateStatus(app.id, { interview_time: e.target.value })} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile/Resume Viewer Modal */}
      {viewingResume && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-[3.5rem] p-16 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setViewingResume(null)} className="absolute top-10 right-10 text-5xl font-black opacity-20 hover:opacity-100 transition">&times;</button>
            
            {/* Resume Header */}
            <div className="flex items-center gap-12 border-b-8 border-[#000080] pb-12 mb-12">
              <div className="w-40 h-40 bg-[#000080] text-white rounded-[2.5rem] flex items-center justify-center text-7xl font-black shadow-2xl">
                {(viewingResume.name || viewingResume.user?.name || 'C').charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-7xl font-black tracking-tighter mb-2">
                  {viewingResume.name || viewingResume.user?.name || 'Candidate Profile'}
                </h2>
                <div className="flex gap-6 text-xl font-bold opacity-40 italic">
                  <span>{viewingResume.user?.email || 'verified@udyogsaarthi.in'}</span>
                  <span>•</span>
                  <span>{viewingResume.phone || 'Contact Verified'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {/* Left Column: Summary & Skills */}
              <div className="md:col-span-2 space-y-16">
                <section>
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#000080] mb-6 flex items-center gap-3">
                    <UserCheck size={24} /> Professional Summary
                  </h4>
                  <p className="text-2xl font-medium leading-relaxed text-gray-700">
                    {viewingResume.summary || "This candidate is a verified member of the Udyog Saarthi community. They are currently setting up their professional details and career goals."}
                  </p>
                </section>

                <section>
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#000080] mb-6 flex items-center gap-3">
                    <Briefcase size={24} /> Experience & Internships
                  </h4>
                  <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-gray-100 italic font-medium text-xl whitespace-pre-wrap">
                    {viewingResume.experience || "Fresh Talent - Eager to learn and contribute to professional projects."}
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#000080] mb-6 flex items-center gap-3">
                    <Target size={24} /> Key Projects
                  </h4>
                  <div className="bg-gray-50 p-8 rounded-[2.5rem] border-2 border-gray-100 italic font-medium text-xl whitespace-pre-wrap">
                    {viewingResume.projects || "Projects in progress. Currently focusing on building professional skills through Udyog Saarthi training modules."}
                  </div>
                </section>
              </div>

              {/* Right Column: Education & Skills */}
              <div className="space-y-16">
                <section>
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#FF9933] mb-6 flex items-center gap-3">
                    <GraduationCap size={24} /> Education
                  </h4>
                  <div className="bg-orange-50 p-6 rounded-[2rem] border-2 border-orange-100 font-bold text-lg whitespace-pre-wrap">
                    {viewingResume.education || "Verified Educational Background"}
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#128807] mb-6 flex items-center gap-3">
                    <ListChecks size={24} /> Core Competencies
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {(viewingResume.skills || 'General Skills, Professionalism, Communication').split(',').map(s => (
                      <span key={s} className="px-6 py-3 bg-green-50 text-[#128807] rounded-2xl font-black text-sm shadow-sm border border-green-100">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="pt-10 border-t-4 border-gray-50">
                  <div className="p-8 bg-blue-50 rounded-[2.5rem] border-2 border-blue-100">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black uppercase tracking-widest text-[#000080]">ATS Intelligence</h4>
                      <ShieldCheck className="text-[#000080]" size={28} />
                    </div>
                    
                    <div className="text-center mb-8">
                      <div className="text-6xl font-black text-[#000080]">
                        {selectedJobApplicants?.find(a => a.user_id === viewingResume.user_id || a.user_id === viewingResume.user?.id) 
                          ? calculateMatch(selectedJobApplicants.find(a => a.user_id === viewingResume.user_id || a.user_id === viewingResume.user?.id))
                          : 0}%
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest opacity-40 mt-1">Profile Compatibility Score</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-white/50 rounded-2xl">
                        <p className="text-[10px] font-black uppercase text-green-600 mb-2">Matching Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {(viewingResume.skills || '').split(',').map(s => (
                            <span key={s} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold">{s.trim()}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] font-bold opacity-30 italic px-2">* Based on job requirements and candidate profile skills.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Meeting Modal */}
      {activeMeeting && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
          {/* Top Control Bar */}
          <div className="p-6 bg-[#1a1a1a] border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                <Video size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Secure Recruitment Console</h2>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Live Video Interview Room • Encrypted</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveMeeting(null)} 
              className="px-10 py-3 bg-red-600 text-white rounded-xl font-black text-sm shadow-xl hover:bg-red-700 transition transform active:scale-95"
            >
              End Interview
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Main Video Pane */}
            <div className="flex-1 bg-[#0a0a0a] relative">
              <iframe 
                src={activeMeeting} 
                className="w-full h-full border-none" 
                allow="camera; microphone; display-capture; autoplay; clipboard-write"
              ></iframe>
            </div>

            {/* Manager Sidebar Console */}
            <div className="w-[400px] bg-[#1a1a1a] border-l border-white/10 flex flex-col p-8 overflow-y-auto space-y-10 custom-scrollbar">
              <section className="space-y-6">
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Candidate Insight</h3>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[#000080] rounded-2xl flex items-center justify-center text-2xl font-black text-white">
                      {applications.find(a => a.meeting_link === activeMeeting)?.user?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white">{applications.find(a => a.meeting_link === activeMeeting)?.user?.name || 'Candidate'}</h4>
                      <p className="text-xs font-bold text-white/30 italic">Verified Applicant</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <p className="text-[10px] font-black text-white/30 uppercase">Skill Match</p>
                      <p className="text-xl font-black text-blue-400">{calculateMatch(applications.find(a => a.meeting_link === activeMeeting) || {})}%</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <p className="text-[10px] font-black text-white/30 uppercase">Exam Score</p>
                      <p className="text-xl font-black text-green-400">{applications.find(a => a.meeting_link === activeMeeting)?.assessment_score || '0'}%</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6 flex-1">
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Live Scorecard</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase ml-2">Interview performance (0-100)</label>
                    <input 
                      type="number" 
                      placeholder="Enter score..."
                      className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white font-black text-2xl outline-none focus:border-blue-500 transition-all"
                      onChange={(e) => {
                        const app = applications.find(a => a.meeting_link === activeMeeting);
                        if (app) handleUpdateStatus(app.id, { interview_score: e.target.value });
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase ml-2">Manager's Internal Notes</label>
                    <textarea 
                      placeholder="Candidate strengths, weaknesses..."
                      className="w-full h-40 p-4 bg-white/5 rounded-2xl border border-white/10 text-white font-medium text-sm outline-none focus:border-blue-500 transition-all resize-none"
                      onBlur={(e) => {
                        const app = applications.find(a => a.meeting_link === activeMeeting);
                        if (app) handleUpdateStatus(app.id, { notes: e.target.value });
                      }}
                    ></textarea>
                  </div>
                </div>
              </section>

              <button 
                onClick={() => {
                  const app = applications.find(a => a.meeting_link === activeMeeting);
                  if (app) handleUpdateStatus(app.id, 'hired');
                  setActiveMeeting(null);
                }}
                className="w-full py-5 bg-[#128807] text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-green-900/40 hover:scale-[1.02] transition transform"
              >
                🚀 Confirm & Hire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other components */}
      {selectedJob && <ApplyWizard job={selectedJob} user={user} onClose={() => setSelectedJob(null)} highContrast={highContrast} onSuccess={fetchData} />}
      {activeAssessment && <AssessmentModal application={activeAssessment} onClose={() => setActiveAssessment(null)} onSuccess={() => { setActiveAssessment(null); fetchData(); }} highContrast={highContrast} />}
    </div>
  );
}

function StatCard({ title, value, icon, color, highContrast }) {
  const colors = { orange: 'bg-orange-50 text-[#FF9933]', green: 'bg-green-50 text-[#128807]', blue: 'bg-blue-50 text-[#000080]' };
  return (
    <div className={`p-10 rounded-[3.5rem] shadow-sm border-2 flex items-center gap-8 hover:shadow-2xl transition-all ${highContrast ? 'bg-black border-yellow-300 text-yellow-300' : 'bg-white border-gray-50'}`}>
      <div className={`p-6 rounded-[2rem] ${highContrast ? 'bg-yellow-300 text-black' : colors[color]}`}>{React.cloneElement(icon, { size: 40 })}</div>
      <div><div className="text-5xl font-black tracking-tighter mb-1">{value}</div><div className="text-xs font-black uppercase tracking-widest opacity-30">{title}</div></div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-black uppercase opacity-40 ml-4">{label}</label>
      <input type={type} className="w-full p-5 bg-gray-50 border-2 border-gray-50 rounded-2xl font-black outline-none focus:bg-white focus:border-[#000080] transition-all" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
