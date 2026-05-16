import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Users, 
  Video, 
  Calendar, 
  Brain, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  Target, 
  ListChecks, 
  Play, 
  FileText, 
  Layout, 
  BookOpen,
  ArrowUpRight,
  Award
} from 'lucide-react';
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
      const [jobsRes, trainingRes, profileRes, appsRes, progressRes] = await Promise.all([
        api.get('/jobs').catch(() => ({ data: [] })),
        api.get('/training').catch(() => ({ data: [] })),
        api.get('/profile').catch(() => ({ data: null })),
        api.get('/applications').catch(() => ({ data: [] })),
        api.get('/progress').catch(() => ({ data: [] }))
      ]);

      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setModules(Array.isArray(trainingRes.data) ? trainingRes.data : []);
      setProfile(profileRes.data);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
      setProgress(Array.isArray(progressRes.data) ? progressRes.data : []);

      if (user?.role === 'employer') {
        const talentRes = await api.get('/talent').catch(() => ({ data: [] }));
        setAllTalent(Array.isArray(talentRes.data) ? talentRes.data.filter(u => u.role === 'user') : []);
      }
    } catch (err) {
      setError('Failed to load dashboard data. Please check your connection.');
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
    } catch (err) { alert('Update failed'); }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-6">
      <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
      <p className="text-chakra font-black uppercase tracking-[0.3em] animate-pulse">Initializing Portal...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-slide-up">
      <div className="p-8 bg-red-50 text-red-600 rounded-full shadow-2xl shadow-red-100">
        <ShieldCheck size={64} />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-chakra-dark">System Authentication Required</h2>
        <p className="max-w-md font-medium text-chakra/60">{error}</p>
      </div>
      <button onClick={() => window.location.reload()} className="btn-primary">Reconnect to Server</button>
    </div>
  );

  return (
    <div className={`w-full min-h-screen pb-24 ${highContrast ? 'high-contrast' : ''}`}>
      
      {/* Header Section */}
      <header className="mb-12 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-saffron/10 text-saffron text-[10px] font-black uppercase tracking-widest border border-saffron/20">
              National Employment Portal
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-chakra-dark">
              {t('welcome')}, <span className="text-saffron">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-lg font-medium text-chakra/50 max-w-xl">
              {user.role === 'employer' 
                ? "Manage your inclusive workspace and discover top national talent."
                : "Your professional journey is moving forward. Here is your current status."}
            </p>
          </div>
          <div className="flex gap-4">
            {user.role === 'user' && (
              <Link to="/resume" className="btn-primary">
                <FileText size={20} /> {t('resumeBuilder')}
              </Link>
            )}
            {user.role === 'employer' && (
              <button onClick={() => setShowAddJob(true)} className="btn-primary">
                <Plus size={20} /> Post Opportunity
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {user.role === 'user' ? (
            <>
              <DashboardStat label="Applications" value={applications.length} icon={<Briefcase />} color="saffron" />
              <DashboardStat label="Skills Learned" value={progress.length} icon={<GraduationCap />} color="emerald" />
              <DashboardStat label="Interviews" value={applications.filter(a => a.status === 'interviewed').length} icon={<Video />} color="chakra" />
              <DashboardStat label="Profile Score" value={`${profile?.readiness_score || 0}%`} icon={<Target />} color="saffron" />
            </>
          ) : (
            <>
              <DashboardStat label="Open Postings" value={jobs.filter(j => j.employer_id === user.id).length} icon={<Briefcase />} color="chakra" />
              <DashboardStat label="Total Applicants" value={applications.length} icon={<Users />} color="saffron" />
              <DashboardStat label="Hiring Pipeline" value={applications.filter(a => a.status !== 'rejected').length} icon={<TrendingUp />} color="emerald" />
              <DashboardStat label="NIEPMD Rating" value="A+" icon={<Award />} color="saffron" />
            </>
          )}
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-chakra/5 rounded-3xl w-fit mb-10 border border-chakra/5">
        {(user.role === 'user' ? ['jobs', 'training', 'applications'] : ['jobs', 'talent']).map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${activeTab === tab ? 'bg-white shadow-xl text-saffron scale-105' : 'text-chakra/40 hover:text-chakra'}`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="animate-fade-in">
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobs.length === 0 ? (
              <EmptyState title="No Jobs Available" desc="Check back later for new opportunities from national institutions." icon={<Search />} />
            ) : jobs.map(job => (
              <JobCard key={job.id} job={job} user={user} onApply={() => setSelectedJob(job)} />
            ))}
          </div>
        )}

        {activeTab === 'training' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {modules.length === 0 ? (
              <EmptyState title="Learning Hub Empty" desc="Stay tuned for curated training modules tailored for your career." icon={<BookOpen />} />
            ) : modules.map(mod => (
              <TrainingCard key={mod.id} module={mod} />
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            {applications.length === 0 ? (
              <EmptyState title="No Applications Yet" desc="Start applying to verified jobs to see your progress here." icon={<FileText />} />
            ) : applications.map(app => (
              <ApplicationCard key={app.id} app={app} onTakeQuiz={() => setActiveAssessment(app)} onJoinMeeting={(link) => window.open(link)} />
            ))}
          </div>
        )}

        {activeTab === 'talent' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {allTalent.map(talent => (
              <TalentCard key={talent.id} talent={talent} onReview={() => setViewingResume(talent)} />
            ))}
          </div>
        )}
      </div>

      {/* Modals & Wizards */}
      {selectedJob && (
        <ApplyWizard 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
          onComplete={() => { setSelectedJob(null); fetchData(); }} 
        />
      )}

      {activeAssessment && (
        <AssessmentModal 
          application={activeAssessment} 
          onClose={() => setActiveAssessment(null)} 
          onComplete={() => { setActiveAssessment(null); fetchData(); }} 
        />
      )}

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="fixed inset-0 bg-chakra/20 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="w-full max-w-2xl bg-white p-12 rounded-[3.5rem] shadow-2xl animate-scale-up border-2 border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <span className="px-3 py-1 bg-saffron/10 text-saffron text-[10px] font-black uppercase tracking-widest rounded-full">Employer Studio</span>
                  <h2 className="text-4xl font-black text-chakra-dark mt-2">Post New Opportunity</h2>
                </div>
                <button onClick={() => setShowAddJob(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-chakra/30"><X size={24} /></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await api.post('/jobs', newJob);
                  setShowAddJob(false);
                  setNewJob({ title: '', description: '', location: '', job_type: 'Full-time', reservation_category: 'PWD', skills_required: '' });
                  fetchData();
                } catch (err) { alert('Post failed'); } finally { setIsSubmitting(false); }
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-chakra/30 ml-4">Job Title</label>
                  <input type="text" placeholder="e.g. Frontend Developer" className="w-full p-5 bg-chakra/5 rounded-2xl border-2 border-transparent focus:border-saffron focus:bg-white outline-none transition-all font-bold" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-chakra/30 ml-4">Location</label>
                    <input type="text" placeholder="City" className="w-full p-5 bg-chakra/5 rounded-2xl border-2 border-transparent focus:border-saffron focus:bg-white outline-none transition-all font-bold" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-chakra/30 ml-4">Job Type</label>
                    <select className="w-full p-5 bg-chakra/5 rounded-2xl border-2 border-transparent focus:border-saffron focus:bg-white outline-none transition-all font-bold" value={newJob.job_type} onChange={e => setNewJob({...newJob, job_type: e.target.value})}>
                      <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-chakra/30 ml-4">Required Skills</label>
                  <input type="text" placeholder="e.g. React, CSS, Node.js" className="w-full p-5 bg-chakra/5 rounded-2xl border-2 border-transparent focus:border-saffron focus:bg-white outline-none transition-all font-bold" value={newJob.skills_required} onChange={e => setNewJob({...newJob, skills_required: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-chakra/30 ml-4">Description</label>
                  <textarea className="w-full p-5 bg-chakra/5 rounded-3xl h-32 border-2 border-transparent focus:border-saffron focus:bg-white outline-none transition-all font-medium resize-none" placeholder="Describe the role..." value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} required></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-saffron text-white rounded-2xl font-black text-lg shadow-xl shadow-saffron/20 hover:scale-[1.02] transition-transform">
                  {isSubmitting ? 'Publishing...' : 'Deploy Opportunity'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-chakra/20 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="w-full max-w-2xl bg-white p-12 rounded-[3.5rem] shadow-2xl animate-scale-up border-2 border-white relative overflow-hidden">
            <div className="relative">
              <div className="flex justify-between items-start mb-10">
                <h2 className="text-4xl font-black text-chakra-dark">Update Posting</h2>
                <button onClick={() => setEditingJob(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-chakra/30"><X size={24} /></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await api.put(`/jobs/${editingJob.id}`, editingJob);
                  setEditingJob(null);
                  fetchData();
                } catch (err) { alert('Update failed'); } finally { setIsSubmitting(false); }
              }} className="space-y-6">
                <input type="text" className="w-full p-5 bg-chakra/5 rounded-2xl font-bold" value={editingJob.title} onChange={e => setEditingJob({...editingJob, title: e.target.value})} required />
                <textarea className="w-full p-5 bg-chakra/5 rounded-3xl h-32 font-medium" value={editingJob.description} onChange={e => setEditingJob({...editingJob, description: e.target.value})} required></textarea>
                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-chakra text-white rounded-2xl font-black text-lg shadow-xl">
                  {isSubmitting ? 'Saving...' : 'Sync Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Training Module Modal */}
      {showAddModule && (
        <div className="fixed inset-0 bg-chakra/20 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="w-full max-w-2xl bg-white p-12 rounded-[3.5rem] shadow-2xl animate-scale-up border-2 border-white relative overflow-hidden">
            <div className="relative">
              <div className="flex justify-between items-start mb-10">
                <h2 className="text-4xl font-black text-chakra-dark">Create Training Module</h2>
                <button onClick={() => setShowAddModule(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-chakra/30"><X size={24} /></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await api.post('/training', newModule);
                  setShowAddModule(false);
                  setNewModule({ title: '', description: '', module_type: 'Video', questions: [], file: null });
                  fetchData();
                } catch (err) { alert('Post failed'); } finally { setIsSubmitting(false); }
              }} className="space-y-6">
                <input type="text" placeholder="Module Title" className="w-full p-5 bg-chakra/5 rounded-2xl font-bold" value={newModule.title} onChange={e => setNewModule({...newModule, title: e.target.value})} required />
                <textarea className="w-full p-5 bg-chakra/5 rounded-3xl h-32 font-medium" placeholder="Module Description" value={newModule.description} onChange={e => setNewModule({...newModule, description: e.target.value})} required></textarea>
                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-emerald text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald/20">
                  {isSubmitting ? 'Creating...' : 'Publish Module'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Training Module Modal */}
      {editingModule && (
        <div className="fixed inset-0 bg-chakra/20 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="w-full max-w-2xl bg-white p-12 rounded-[3.5rem] shadow-2xl animate-scale-up border-2 border-white relative overflow-hidden">
            <div className="relative">
              <div className="flex justify-between items-start mb-10">
                <h2 className="text-4xl font-black text-chakra-dark">Edit Module</h2>
                <button onClick={() => setEditingModule(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-chakra/30"><X size={24} /></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await api.put(`/training/${editingModule.id}`, editingModule);
                  setEditingModule(null);
                  fetchData();
                } catch (err) { alert('Update failed'); } finally { setIsSubmitting(false); }
              }} className="space-y-6">
                <input type="text" className="w-full p-5 bg-chakra/5 rounded-2xl font-bold" value={editingModule.title} onChange={e => setEditingModule({...editingModule, title: e.target.value})} required />
                <textarea className="w-full p-5 bg-chakra/5 rounded-3xl h-32 font-medium" value={editingModule.description} onChange={e => setEditingModule({...editingModule, description: e.target.value})} required></textarea>
                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-chakra text-white rounded-2xl font-black text-lg shadow-xl">
                  {isSubmitting ? 'Saving...' : 'Sync Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function DashboardStat({ label, value, icon, color }) {
  const colorMap = {
    saffron: 'text-saffron bg-saffron/10 border-saffron/20',
    emerald: 'text-emerald bg-emerald/10 border-emerald/20',
    chakra: 'text-chakra bg-chakra/10 border-chakra/20'
  };

  return (
    <div className="glass-card p-8 flex items-center gap-6 border-transparent">
      <div className={`p-4 rounded-2xl ${colorMap[color]} border`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div>
        <div className="text-3xl font-black text-chakra-dark">{value}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-chakra/40">{label}</div>
      </div>
    </div>
  );
}

function JobCard({ job, user, onApply }) {
  return (
    <div className="glass-card p-10 group hover:border-saffron/20">
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 bg-chakra/5 text-chakra rounded-2xl group-hover:bg-saffron/10 group-hover:text-saffron transition-colors">
          <Briefcase size={32} />
        </div>
        <span className="px-4 py-1.5 bg-emerald/10 text-emerald rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald/20">
          {job.job_type}
        </span>
      </div>
      <h3 className="text-3xl font-black text-chakra-dark mb-2">{job.title}</h3>
      <div className="flex items-center gap-4 text-chakra/50 font-bold mb-6">
        <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</div>
        <div className="w-1 h-1 rounded-full bg-chakra/20"></div>
        <div className="flex items-center gap-1.5"><Building size={16} /> {job.employer?.name || 'National Inst.'}</div>
      </div>
      <p className="text-chakra/60 font-medium mb-10 line-clamp-2 leading-relaxed">{job.description}</p>
      <button onClick={onApply} className="w-full btn-primary group-hover:scale-105">
        Apply Now <ArrowUpRight size={20} />
      </button>
    </div>
  );
}

function TrainingCard({ module }) {
  return (
    <div className="glass-card p-8 group flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="p-4 bg-emerald/5 text-emerald rounded-2xl group-hover:bg-emerald group-hover:text-white transition-all duration-500">
            <GraduationCap size={28} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-chakra/30">{module.module_type}</span>
        </div>
        <h3 className="text-2xl font-black text-chakra-dark mb-3">{module.title}</h3>
        <p className="text-sm text-chakra/50 font-medium mb-8 line-clamp-2">{module.description}</p>
      </div>
      <Link to={`/training/${module.id}`} className="btn-secondary w-full">
        <Play size={18} /> Start Module
      </Link>
    </div>
  );
}

function ApplicationCard({ app, onTakeQuiz, onJoinMeeting }) {
  const statusColors = {
    applied: 'bg-saffron/10 text-saffron border-saffron/20',
    shortlisted: 'bg-blue-100 text-blue-700 border-blue-200',
    interviewed: 'bg-emerald/10 text-emerald border-emerald/20',
    hired: 'bg-emerald text-white border-emerald',
    rejected: 'bg-red-50 text-red-600 border-red-100'
  };

  return (
    <div className="glass-card p-8 flex flex-col md:flex-row justify-between items-center gap-8 border-l-8 border-l-saffron/30">
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-2xl font-black text-chakra-dark">{app.job_posting?.title}</h3>
          <p className="font-bold text-chakra/40">{app.job_posting?.employer?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          {['Applied', 'Quiz', 'Interview', 'Final'].map((label, idx) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${idx <= 1 ? 'bg-emerald text-white border-emerald' : 'bg-white text-chakra/10 border-chakra/10'}`}>
                {idx + 1}
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        {app.status === 'shortlisted' && app.assessment_status === 'pending' && (
          <button onClick={onTakeQuiz} className="btn-primary animate-bounce">
            <Brain size={18} /> Take Quiz
          </button>
        )}
        {app.meeting_link && app.status === 'interviewed' && (
          <button onClick={() => onJoinMeeting(app.meeting_link)} className="btn-secondary animate-pulse">
            <Video size={18} /> Join Meet
          </button>
        )}
        <span className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border ${statusColors[app.status] || 'bg-gray-50'}`}>
          {app.status}
        </span>
      </div>
    </div>
  );
}

function TalentCard({ talent, onReview }) {
  return (
    <div className="glass-card p-8 group hover:-translate-y-2">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-16 h-16 bg-chakra/5 text-chakra rounded-2xl flex items-center justify-center text-3xl font-black group-hover:bg-chakra group-hover:text-white transition-all">
          {talent.name?.charAt(0) || '?'}
        </div>
        <div>
          <h4 className="text-xl font-black text-chakra-dark">{talent.name}</h4>
          <span className="text-[10px] font-black text-emerald uppercase tracking-widest">
            {talent.profile?.readiness_score || 0}% Job Ready
          </span>
        </div>
      </div>
      <button onClick={onReview} className="btn-outline w-full py-3">View Profile</button>
    </div>
  );
}

function EmptyState({ title, desc, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 glass-card border-dashed">
      <div className="p-6 bg-chakra/5 text-chakra/20 rounded-full">
        {React.cloneElement(icon, { size: 48 })}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-chakra-dark">{title}</h3>
        <p className="max-w-xs text-chakra/40 font-medium">{desc}</p>
      </div>
    </div>
  );
}

function Building({ size }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>; }
