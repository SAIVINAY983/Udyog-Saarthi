import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, Briefcase, TrendingUp, ShieldCheck, Clock, UserCheck, Users } from 'lucide-react';
import ApplyWizard from '../components/ApplyWizard';
import api from '../api';

export default function Dashboard({ user, highContrast, simpleMode }) {
  const [jobs, setJobs] = useState([]);
  const [modules, setModules] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState({ title: '', description: '', module_type: 'Video' });
  const [editingModule, setEditingModule] = useState(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', location: '', job_type: 'Full-time', reservation_category: 'PWD', skills_required: '' });
  const [editingJob, setEditingJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nearMe, setNearMe] = useState(false);

  useEffect(() => {
    fetchData();

    const handleSetTab = (e) => {
      if (e.detail === 'jobs' || e.detail === 'training') {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('set-tab', handleSetTab);
    return () => window.removeEventListener('set-tab', handleSetTab);
  }, []);

  const toggleNearMe = () => {
    if (!nearMe) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setNearMe(true);
          fetchData(position.coords.latitude, position.coords.longitude);
        });
      }
    } else {
      setNearMe(false);
      fetchData();
    }
  };

  const fetchData = async (lat = null, lng = null) => {
    setLoading(true);
    setError(null);
    try {
      const jobsParams = lat && lng ? { lat, lng } : {};
      const [jobsRes, modulesRes, profileRes] = await Promise.all([
        api.get('/jobs', { params: jobsParams }),
        api.get('/training'),
        api.get('/profile')
      ]);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setModules(Array.isArray(modulesRes.data) ? modulesRes.data : []);
      setProfile(profileRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
      setError('Failed to load data. Please make sure you are logged in.');
      setJobs([]);
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/training', newModule);
      alert('Module added successfully!');
      setShowAddModule(false);
      setNewModule({ title: '', description: '', module_type: 'Video' });
      fetchData(); // Refresh the data
    } catch (err) {
      console.error('Failed to add module', err);
      alert('Failed to add module. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditModule = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/training/${editingModule.id}`, editingModule);
      alert('Module updated successfully!');
      setEditingModule(null);
      fetchData();
    } catch (err) {
      console.error('Failed to update module', err);
      alert('Failed to update module. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await api.delete(`/training/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete module', err);
      alert('Failed to delete module. Please try again.');
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/jobs', newJob);
      alert('Job posted successfully!');
      setShowAddJob(false);
      setNewJob({ title: '', description: '', location: '', job_type: 'Full-time', reservation_category: 'PWD', skills_required: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to post job', err);
      alert('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/jobs/${editingJob.id}`, editingJob);
      alert('Job updated successfully!');
      setEditingJob(null);
      fetchData();
    } catch (err) {
      console.error('Failed to update job', err);
      alert('Failed to update job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete job', err);
      alert('Failed to delete job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#FF9933]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-[2.5rem] border-2 border-red-100 text-center animate-fade-in shadow-xl">
        <p className="text-3xl font-black mb-4">Oops!</p>
        <p className="text-lg font-bold opacity-70 mb-6">{error}</p>
        <button
          onClick={fetchData}
          className="px-10 py-4 bg-[#FF9933] text-white rounded-2xl font-black shadow-lg shadow-orange-200 transition transform active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render Admin View
  if (user?.role === 'admin') {
    return (
      <div className="w-full space-y-10 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black mb-2 tracking-tight">Admin Dashboard</h1>
            <p className="text-xl opacity-60 font-medium italic">System Control Center.</p>
          </div>
          <Link to="/admin" className={`px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl transition transform hover:scale-105 active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-red-600 text-white shadow-red-200'}`}>
            Admin Panel
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Total Platform Users" value="--" icon={<Users />} color="blue" highContrast={highContrast} />
          <StatCard title="Active Jobs" value={jobs.length} icon={<Briefcase />} color="orange" highContrast={highContrast} />
          <StatCard title="Modules" value={modules.length} icon={<GraduationCap />} color="green" highContrast={highContrast} />
        </div>

        <div className="bg-white p-12 rounded-[3.5rem] border-4 border-dashed border-gray-100 text-center space-y-6">
          <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-3xl font-black">Platform Security & Management</h2>
          <p className="text-xl opacity-60 max-w-2xl mx-auto font-medium">As an administrator, you have the power to manage users and monitor all platform activity.</p>
          <Link to="/admin" className="inline-block text-red-600 font-black text-lg hover:underline">
            Manage All Users →
          </Link>
        </div>
      </div>
    );
  }

  // Render Employer View
  if (user?.role === 'employer') {
    return (
      <div className="w-full space-y-10 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black mb-2 tracking-tight">Employer Dashboard</h1>
            <p className="text-xl opacity-60 font-medium italic">Welcome, {user.name}. Help build an inclusive workforce.</p>
          </div>
          <button 
            onClick={() => setShowAddJob(true)}
            className={`px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl transition transform hover:scale-105 active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-blue-200'}`}
          >
            + Post New Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Total Postings" value={jobs.filter(j => j.employer_id === user.id).length || "2"} icon={<Briefcase />} color="blue" highContrast={highContrast} />
          <StatCard title="New Applicants" value="12" icon={<UserCheck />} color="orange" highContrast={highContrast} />
          <StatCard title="Success Rate" value="92%" icon={<TrendingUp />} color="green" highContrast={highContrast} />
        </div>

        <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm">
          <h2 className="text-3xl font-black mb-8 border-l-8 border-[#FF9933] pl-6">Your Active Postings</h2>
          <div className="space-y-6">
            {jobs.filter(j => j.employer_id === user.id).length === 0 ? (
              <div className="p-10 text-center border-4 border-dashed border-gray-100 rounded-3xl opacity-40 italic font-bold">
                No active postings. Create one to start hiring.
              </div>
            ) : (
              jobs.filter(j => j.employer_id === user.id).map(job => (
                <div key={job.id} className="p-6 border-2 border-gray-50 rounded-2xl flex justify-between items-center hover:bg-gray-50 transition">
                  <div>
                    <h4 className="text-xl font-black">{job.title}</h4>
                    <p className="opacity-60 font-bold">{job.location} • Posted 2 days ago</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingJob(job)} className="px-6 py-2 bg-blue-50 text-[#000080] rounded-xl font-bold hover:bg-blue-100 transition">Edit</button>
                    <button onClick={() => handleDeleteJob(job.id)} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition">Delete</button>
                    <button className="px-6 py-2 bg-green-50 text-[#128807] rounded-xl font-black">4 Applicants</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Job Modal */}
        {showAddJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className={`w-full max-w-2xl my-8 p-10 rounded-[3rem] shadow-2xl animate-slide-up ${highContrast ? 'border-4 border-yellow-300 bg-black' : 'bg-white'}`}>
              <h2 className="text-4xl font-black mb-2">Post New Job</h2>
              <p className="text-lg opacity-60 mb-8 font-medium italic">Create an opportunity for inclusive hiring.</p>
              
              <form onSubmit={handleAddJob} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Job Title</label>
                  <input 
                    type="text" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#000080] outline-none transition-all font-bold text-gray-900"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Location</label>
                    <input 
                      type="text" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})}
                      className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#000080] outline-none transition-all font-bold text-gray-900"
                      placeholder="e.g. Remote, Chennai"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Job Type</label>
                    <select 
                      value={newJob.job_type} onChange={e => setNewJob({...newJob, job_type: e.target.value})}
                      className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#000080] outline-none transition-all font-bold text-gray-900"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Description</label>
                  <textarea 
                    required rows="4" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#000080] outline-none transition-all font-medium text-gray-900"
                    placeholder="Describe the role and responsibilities..."
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t-2 border-gray-50">
                  <button type="button" onClick={() => setShowAddJob(false)} className="px-8 py-4 rounded-[2rem] font-black text-lg text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className={`px-10 py-4 rounded-[2rem] font-black text-xl shadow-xl transition transform active:scale-95 ${isSubmitting ? 'opacity-50' : ''} ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-blue-200'}`}>
                    {isSubmitting ? 'Posting...' : 'Post Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Job Modal */}
        {editingJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className={`w-full max-w-2xl my-8 p-10 rounded-[3rem] shadow-2xl animate-slide-up ${highContrast ? 'border-4 border-yellow-300 bg-black' : 'bg-white'}`}>
              <h2 className="text-4xl font-black mb-2">Edit Job Posting</h2>
              <p className="text-lg opacity-60 mb-8 font-medium italic">Update the details of your job opportunity.</p>
              
              <form onSubmit={handleEditJob} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Job Title</label>
                  <input 
                    type="text" required value={editingJob.title} onChange={e => setEditingJob({...editingJob, title: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#000080] outline-none transition-all font-bold text-gray-900"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Location</label>
                    <input 
                      type="text" value={editingJob.location || ''} onChange={e => setEditingJob({...editingJob, location: e.target.value})}
                      className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#000080] outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Job Type</label>
                    <select 
                      value={editingJob.job_type} onChange={e => setEditingJob({...editingJob, job_type: e.target.value})}
                      className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#000080] outline-none transition-all font-bold text-gray-900"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Description</label>
                  <textarea 
                    required rows="4" value={editingJob.description} onChange={e => setEditingJob({...editingJob, description: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#000080] outline-none transition-all font-medium text-gray-900"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t-2 border-gray-50">
                  <button type="button" onClick={() => setEditingJob(null)} className="px-8 py-4 rounded-[2rem] font-black text-lg text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className={`px-10 py-4 rounded-[2rem] font-black text-xl shadow-xl transition transform active:scale-95 ${isSubmitting ? 'opacity-50' : ''} ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#000080] text-white shadow-blue-200'}`}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Trainer View
  if (user?.role === 'trainer') {
    return (
      <div className="w-full space-y-10 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black mb-2 tracking-tight">Trainer Dashboard</h1>
            <p className="text-xl opacity-60 font-medium italic">Coach {user.name}, your impact matters.</p>
          </div>
          <button 
            onClick={() => setShowAddModule(true)}
            className={`px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl transition transform hover:scale-105 active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#128807] text-white shadow-green-200'}`}
          >
            + Add Module
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Active Students" value="45" icon={<UserCheck />} color="blue" highContrast={highContrast} />
          <StatCard title="Modules Published" value={modules.length} icon={<GraduationCap />} color="green" highContrast={highContrast} />
          <StatCard title="Total Engagement" value="1.2k" icon={<TrendingUp />} color="orange" highContrast={highContrast} />
        </div>

        <div className="bg-white p-10 rounded-[3rem] border-2 border-gray-100 shadow-sm">
          <h2 className="text-3xl font-black mb-8 border-l-8 border-[#128807] pl-6">Your Training Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map(mod => (
              <div key={mod.id} className="p-8 border-2 border-gray-50 rounded-3xl hover:border-[#128807] transition group">
                <h4 className="text-2xl font-black mb-3 group-hover:text-[#128807]">{mod.title}</h4>
                <p className="opacity-60 font-medium mb-6">{mod.description}</p>
                <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest opacity-40 mt-4">
                  <span>340 Students</span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setEditingModule(mod)}
                      className="hover:text-[#128807] transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteModule(mod.id)}
                      className="hover:text-red-600 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Module Modal */}
        {showAddModule && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl animate-slide-up ${highContrast ? 'border-4 border-yellow-300 bg-black' : 'bg-white'}`}>
              <h2 className="text-4xl font-black mb-2">Create New Module</h2>
              <p className="text-lg opacity-60 mb-8 font-medium italic">Share your expertise with the community.</p>
              
              <form onSubmit={handleAddModule} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Module Title</label>
                  <input 
                    type="text" 
                    required
                    value={newModule.title}
                    onChange={e => setNewModule({...newModule, title: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#128807] outline-none transition-all font-bold text-gray-900"
                    placeholder="e.g. Basic Computer Skills"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Module Type</label>
                  <select 
                    value={newModule.module_type}
                    onChange={e => setNewModule({...newModule, module_type: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#128807] outline-none transition-all font-bold text-gray-900"
                  >
                    <option value="Video">Video Course</option>
                    <option value="Article">Reading Material</option>
                    <option value="Quiz">Interactive Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Description</label>
                  <textarea 
                    required
                    rows="4"
                    value={newModule.description}
                    onChange={e => setNewModule({...newModule, description: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#128807] outline-none transition-all font-medium text-gray-900"
                    placeholder="What will the users learn?"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t-2 border-gray-50">
                  <button 
                    type="button"
                    onClick={() => setShowAddModule(false)}
                    className="px-8 py-4 rounded-[2rem] font-black text-lg text-gray-500 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-10 py-4 rounded-[2rem] font-black text-xl shadow-xl transition transform active:scale-95 ${isSubmitting ? 'opacity-50' : ''} ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#128807] text-white shadow-green-200'}`}
                  >
                    {isSubmitting ? 'Creating...' : 'Publish Module'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Module Modal */}
        {editingModule && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl animate-slide-up ${highContrast ? 'border-4 border-yellow-300 bg-black' : 'bg-white'}`}>
              <h2 className="text-4xl font-black mb-2">Edit Module</h2>
              <p className="text-lg opacity-60 mb-8 font-medium italic">Update your training material.</p>
              
              <form onSubmit={handleEditModule} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Module Title</label>
                  <input 
                    type="text" 
                    required
                    value={editingModule.title}
                    onChange={e => setEditingModule({...editingModule, title: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#128807] outline-none transition-all font-bold text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Module Type</label>
                  <select 
                    value={editingModule.module_type}
                    onChange={e => setEditingModule({...editingModule, module_type: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#128807] outline-none transition-all font-bold text-gray-900"
                  >
                    <option value="Video">Video Course</option>
                    <option value="Article">Reading Material</option>
                    <option value="Quiz">Interactive Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest opacity-40 ml-4 mb-2">Description</label>
                  <textarea 
                    required
                    rows="4"
                    value={editingModule.description || ''}
                    onChange={e => setEditingModule({...editingModule, description: e.target.value})}
                    className="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-[#128807] outline-none transition-all font-medium text-gray-900"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t-2 border-gray-50">
                  <button 
                    type="button"
                    onClick={() => setEditingModule(null)}
                    className="px-8 py-4 rounded-[2rem] font-black text-lg text-gray-500 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-10 py-4 rounded-[2rem] font-black text-xl shadow-xl transition transform active:scale-95 ${isSubmitting ? 'opacity-50' : ''} ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#128807] text-white shadow-green-200'}`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: Job Seeker View
  return (
    <div className="w-full space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight leading-none">Welcome, <span className={highContrast ? 'text-yellow-300' : 'text-[#000080]'}>{user.name}</span>!</h1>
          <p className="text-2xl opacity-60 font-medium italic">Here's your roadmap to success.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/resume" className={`inline-flex items-center gap-3 px-10 py-4 rounded-[2rem] font-black text-lg shadow-2xl transition transform hover:scale-105 active:scale-95 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-[#FF9933] text-white shadow-orange-200'}`}>
              <UserCheck size={24} /> {simpleMode ? "Update Resume" : "Update Your AI Resume"}
            </Link>
          </div>
        </div>

        {profile && (
          <div className={`p-8 rounded-[3rem] shadow-2xl flex items-center gap-8 ${highContrast ? 'border-4 border-yellow-300 bg-black' : 'bg-white border-2 border-gray-50'}`}>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48" cy="48" r="42"
                  fill="transparent"
                  stroke={highContrast ? '#333' : '#f8fafc'}
                  strokeWidth="10"
                />
                <circle
                  cx="48" cy="48" r="42"
                  fill="transparent"
                  stroke={highContrast ? '#ffff00' : '#128807'}
                  strokeWidth="10"
                  strokeDasharray={263.9}
                  strokeDashoffset={263.9 - (263.9 * profile.readiness_score) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">
                {profile.readiness_score}%
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-2xl uppercase tracking-tighter">{simpleMode ? "Job Ready" : "Readiness Score"}</h3>
              <p className="text-sm font-black opacity-40 uppercase tracking-widest">
                {profile.readiness_score >= 80 ? "🚀 Career Ready!" : "💪 Keep growing!"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Modules Finished" value="3/5" icon={<GraduationCap />} color="orange" highContrast={highContrast} />
        <StatCard title="Applications" value="2" icon={<Briefcase />} color="green" highContrast={highContrast} />
        <Link to="/interview" className="block transform hover:scale-105 transition-all">
          <StatCard title="Mock Practice" value="Go" icon={<TrendingUp />} color="blue" highContrast={highContrast} />
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 border-b-4 border-gray-100">
        <div className="flex space-x-2 bg-gray-50 p-2 rounded-[2.5rem] border border-gray-100 shadow-inner">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-10 py-4 rounded-[2rem] font-black text-xl transition-all ${activeTab === 'jobs' ? (highContrast ? 'bg-yellow-300 text-black shadow-lg' : 'bg-white text-[#FF9933] shadow-xl') : 'text-gray-400 hover:text-gray-600'}`}
          >
            {simpleMode ? "Find Jobs" : "Opportunities"}
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-10 py-4 rounded-[2rem] font-black text-xl transition-all ${activeTab === 'training' ? (highContrast ? 'bg-yellow-300 text-black shadow-lg' : 'bg-white text-[#128807] shadow-xl') : 'text-gray-400 hover:text-gray-600'}`}
          >
            {simpleMode ? "Learn Skills" : "Training"}
          </button>
        </div>

        {activeTab === 'jobs' && (
          <button
            onClick={toggleNearMe}
            className={`flex items-center gap-3 px-10 py-4 rounded-[2rem] font-black text-lg transition-all border-4 transform active:scale-95 ${nearMe ? 'bg-[#128807] text-white border-[#128807] shadow-green-200' : 'bg-white border-gray-100 text-gray-500 hover:border-[#FF9933] hover:text-[#FF9933]'}`}
          >
            <MapPin size={24} />
            {nearMe ? (simpleMode ? "Nearby: ON" : "Showing Jobs Near You") : (simpleMode ? "Near Me" : "Show Jobs Near Me")}
          </button>
        )}
      </div>

      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {jobs.length === 0 ? (
            <div className="p-16 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 col-span-full text-center">
              <p className="text-2xl font-bold opacity-30 italic">Searching for the best opportunities for you...</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="p-10 bg-white rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border-2 border-gray-50 hover:shadow-2xl transition-all relative overflow-hidden group hover:border-[#FF9933]/20">
                {job.is_verified && (
                  <div className="absolute top-0 right-0 bg-[#000080] text-white px-6 py-3 text-[12px] font-black uppercase tracking-widest rounded-bl-[2rem] flex items-center gap-2 shadow-2xl">
                    <ShieldCheck size={18} /> Verified Org
                  </div>
                )}
                <h3 className="text-3xl font-black text-gray-900 mb-2 group-hover:text-[#FF9933] transition-colors">{job.title}</h3>
                <div className="flex items-center gap-2 mb-8 text-sm font-black text-[#000080] opacity-50 uppercase tracking-[0.2em]">
                  {job.employer?.name || 'Top Employer'}
                </div>
                <p className="opacity-70 mb-10 line-clamp-3 text-xl font-medium leading-relaxed italic">"{job.description}"</p>
                <div className="flex flex-wrap gap-4 mt-6">
                  {job.location && <span className="px-6 py-2 bg-gray-50 rounded-2xl text-sm font-black text-gray-500 border border-gray-100">📍 {job.location}</span>}
                  {job.reservation_category && <span className="px-6 py-2 bg-orange-50 text-[#FF9933] rounded-2xl text-sm font-black border border-orange-100 tracking-tight uppercase">Reservation: {job.reservation_category}</span>}
                </div>
                <button
                  onClick={() => setSelectedJob(job)}
                  className={`mt-12 w-full py-5 rounded-[2rem] font-black text-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 ${highContrast ? 'bg-yellow-300 text-black' : 'bg-gradient-to-r from-[#FF9933] to-[#cc7a29] text-white shadow-orange-200'}`}
                >
                  {simpleMode ? "Apply Now" : "Apply with Assistant"}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'training' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {modules.length === 0 ? (
            <div className="p-16 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 col-span-full text-center">
              <p className="text-2xl font-bold opacity-30 italic">New training modules coming soon...</p>
            </div>
          ) : (
            modules.map(mod => (
              <div key={mod.id} className="p-10 bg-white rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border-l-[12px] border-l-[#128807] hover:shadow-2xl transition-all group hover:bg-green-50/20">
                <h3 className="text-3xl font-black mb-6 group-hover:text-[#128807] transition-colors leading-tight">{mod.title}</h3>
                <p className="opacity-70 mb-8 text-xl font-medium line-clamp-3 leading-relaxed italic">"{mod.description}"</p>
                <div className="flex items-center gap-4 text-sm font-black opacity-40 mb-10 uppercase tracking-widest">
                  <Clock size={20} /> 10 MINS • {mod.module_type}
                </div>
                <Link 
                  to={`/training/${mod.id}`}
                  className={`block w-full text-center py-5 border-4 rounded-[2rem] font-black text-xl transition-all transform active:scale-95 ${highContrast ? 'border-yellow-300 text-yellow-300' : 'border-[#128807] text-[#128807] hover:bg-[#128807] hover:text-white shadow-lg'}`}
                >
                  {simpleMode ? "Start" : "Start Learning"}
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {selectedJob && (
        <ApplyWizard
          job={selectedJob}
          user={user}
          onClose={() => setSelectedJob(null)}
          highContrast={highContrast}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color, highContrast }) {
  const colors = {
    orange: 'bg-orange-50 text-[#FF9933] border-orange-100',
    green: 'bg-green-50 text-[#128807] border-green-100',
    blue: 'bg-blue-50 text-[#000080] border-blue-100',
  };

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex items-center gap-6 border transition-all hover:shadow-xl ${highContrast ? 'border-2 border-yellow-300 bg-black' : 'bg-white border-gray-100'}`}>
      <div className={`p-5 rounded-2xl border ${highContrast ? 'bg-yellow-300 text-black' : colors[color]}`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <div>
        <div className="text-3xl font-black">{value}</div>
        <div className="text-sm font-black opacity-40 uppercase tracking-widest">{title}</div>
      </div>
    </div>
  );
}

