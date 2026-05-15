import React, { useEffect, useState } from 'react';
import { Users, Briefcase, GraduationCap, Trash2, ShieldCheck, TrendingUp, Search, BarChart3, PieChart, FileText, Download, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import api from '../api';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7D794', '#778BEB', '#786FA6'];

export default function AdminDashboard({ highContrast }) {
  const [users, setUsers] = useState([]);
  const [adminJobs, setAdminJobs] = useState([]);
  const [adminModules, setAdminModules] = useState([]);
  const [adminApplications, setAdminApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeView, setActiveView] = useState('analytics'); // analytics, users, jobs, modules, applications
  const [searchTerm, setSearchTerm] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, jobsRes, modsRes, appsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/jobs'),
        api.get('/admin/modules'),
        api.get('/admin/applications')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setAdminJobs(jobsRes.data);
      setAdminModules(modsRes.data);
      setAdminApplications(appsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert('USER ROLE UPDATED ⚡');
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastData.title || !broadcastData.message) return alert('Please fill in all fields');
    setIsSubmitting(true);
    try {
      await api.post('/admin/broadcast', broadcastData);
      alert('BROADCAST SENT SUCCESSFULLY 📢');
      setIsBroadcasting(false);
      setBroadcastData({ title: '', message: '', type: 'info' });
    } catch (err) {
      alert('Failed to send broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`CRITICAL ACTION: Are you sure you want to permanently delete this ${type}?`)) return;
    try {
      if (type === 'user') {
        await api.delete(`/admin/users/${id}`);
        setUsers(prev => prev.filter(u => String(u.id) !== String(id)));
      } else if (type === 'job') {
        await api.delete(`/jobs/${id}`);
        setAdminJobs(prev => prev.filter(j => String(j.id) !== String(id)));
      } else if (type === 'module') {
        await api.delete(`/training/${id}`);
        setAdminModules(prev => prev.filter(m => String(m.id) !== String(id)));
      }
      
      alert(`${type.toUpperCase()} deleted successfully! 🚀`);
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('ADMIN DELETE ERROR:', err);
      const msg = err.response?.data?.message || err.message;
      alert(`ADMIN ERROR: Failed to delete ${type}. Reason: ${msg}`);
    }
  };

  const exportToCSV = () => {
    let data = [];
    let filename = `${activeView}_export.csv`;
    
    if (activeView === 'users') {
      data = users.map(u => ({ Name: u.name, Email: u.email, Role: u.role, Joined: u.created_at }));
    } else if (activeView === 'jobs') {
      data = adminJobs.map(j => ({ Title: j.title, Employer: j.employer?.name, Location: j.location, Date: j.created_at }));
    } else if (activeView === 'applications') {
      data = adminApplications.map(a => ({ Applicant: a.user?.name, Job: a.job_posting?.title, Status: a.status, Date: a.created_at }));
    }

    if (data.length === 0) return alert('No data to export');

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeView === 'users') return users.filter(u => u.name?.toLowerCase()?.includes(term) || u.email?.toLowerCase()?.includes(term));
    if (activeView === 'jobs') return adminJobs.filter(j => j.title?.toLowerCase()?.includes(term) || j.employer?.name?.toLowerCase()?.includes(term));
    if (activeView === 'modules') return adminModules.filter(m => m.title?.toLowerCase()?.includes(term) || m.trainer?.name?.toLowerCase()?.includes(term));
    if (activeView === 'applications') return adminApplications.filter(a => a.user?.name?.toLowerCase()?.includes(term) || a.job_posting?.title?.toLowerCase()?.includes(term));
    return [];
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-red-600"></div>
        <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-red-600">LOADING</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-7xl mx-auto pt-16 px-6 space-y-12 animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">System v2.0</span>
              <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Administrator Dashboard</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-tight">Command <span className="text-red-600">Center</span></h1>
            <p className="text-lg text-slate-500 font-medium max-w-lg mt-2">Oversee the Udyog Saarthi ecosystem, monitor growth, and manage global operations.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsBroadcasting(true)}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-red-600 transition-all shadow-xl shadow-slate-200 group"
            >
              <Activity className="group-hover:animate-pulse" size={18} />
              Global Broadcast
            </button>
            <button 
              onClick={() => alert("ROOT ACCESS VERIFIED 🛡️\nUser: System Administrator\nStatus: Online & Secured")}
              className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-black border-2 transition-all active:scale-95 group ${highContrast ? 'bg-yellow-300 border-yellow-400 text-black' : 'bg-white border-slate-100 text-slate-900 hover:shadow-xl hover:border-red-100'}`}
            >
              <ShieldCheck className="text-red-600 group-hover:scale-110 transition-transform" /> Root Admin
            </button>

          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats?.total_users} icon={<Users />} color="blue" highContrast={highContrast} trend="+12% from last month" />
          <StatCard title="Active Jobs" value={stats?.total_jobs} icon={<Briefcase />} color="orange" highContrast={highContrast} trend="5 New Today" />
          <StatCard title="Learning Modules" value={stats?.total_modules} icon={<GraduationCap />} color="green" highContrast={highContrast} trend="98% Completion Rate" />
          <StatCard title="Total Applications" value={stats?.total_applications} icon={<TrendingUp />} color="purple" highContrast={highContrast} trend="+40% this week" />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden min-h-[600px] flex flex-col">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap border-b border-slate-50 bg-slate-50/50">
            <TabButton active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} icon={<BarChart3 />} label="Analytics" />
            <TabButton active={activeView === 'users'} onClick={() => setActiveView('users')} icon={<Users />} label="Users" />
            <TabButton active={activeView === 'jobs'} onClick={() => setActiveView('jobs')} icon={<Briefcase />} label="Jobs" />
            <TabButton active={activeView === 'modules'} onClick={() => setActiveView('modules')} icon={<GraduationCap />} label="Modules" />
            <TabButton active={activeView === 'applications'} onClick={() => setActiveView('applications')} icon={<FileText />} label="Applications" />
            
            {activeView !== 'analytics' && (
              <button 
                onClick={exportToCSV}
                className="ml-auto mr-8 my-4 px-5 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition"
              >
                <Download size={14} /> Export CSV
              </button>
            )}
          </div>

          <div className="p-10 flex-1">
            {activeView === 'analytics' ? (
              <AnalyticsDashboard stats={stats} />
            ) : (
              <div className="space-y-8 animate-slide-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 capitalize">{activeView} Management</h2>
                    <p className="text-slate-500 font-medium mt-1">Search, monitor, and manage all platform {activeView}.</p>
                  </div>
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder={`Search ${activeView}...`}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-red-600/5 focus:border-red-600 outline-none transition-all font-bold"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-100">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/80">
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <th className="py-6 px-8">{activeView === 'users' ? 'Identity' : (activeView === 'applications' ? 'Applicant' : 'Title')}</th>
                        <th className="py-6 px-8">{activeView === 'users' ? 'Privilege' : (activeView === 'jobs' ? 'Employer' : (activeView === 'applications' ? 'Job Details' : 'Trainer'))}</th>
                        <th className="py-6 px-8">{activeView === 'applications' ? 'Status' : 'Created'}</th>
                        <th className="py-6 px-8 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredItems().map(item => (
                        <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:from-red-50 group-hover:to-red-100 group-hover:text-red-600 transition-all">
                                {activeView === 'users' ? item.name?.charAt(0) : (activeView === 'applications' ? item.user?.name?.charAt(0) : item.title?.charAt(0))}
                              </div>
                              <div>
                                <div className="text-lg font-black text-slate-900">{activeView === 'users' ? item.name : (activeView === 'applications' ? item.user?.name : item.title)}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{activeView === 'users' ? item.email : (activeView === 'applications' ? item.user?.email : (item.location || item.module_type))}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-8">
                            {activeView === 'users' ? (
                              <select 
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none outline-none cursor-pointer shadow-sm ${getRoleColor(item.role)}`}
                                value={item.role}
                                onChange={(e) => updateUserRole(item.id, e.target.value)}
                              >
                                <option value="user">USER</option>
                                <option value="employer">EMPLOYER</option>
                                <option value="trainer">TRAINER</option>
                                <option value="admin">ADMIN</option>
                              </select>
                            ) : activeView === 'applications' ? (
                              <div>
                                <div className="font-black text-slate-900">{item.job_posting?.title}</div>
                                <div className="text-xs text-slate-400 font-bold">{item.job_posting?.employer?.name}</div>
                              </div>
                            ) : (
                              <div className="font-bold text-slate-600">{item.employer?.name || item.trainer?.name || 'External'}</div>
                            )}
                          </td>
                          <td className="py-6 px-8">
                            {activeView === 'applications' ? (
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                item.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                                item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {item.status}
                              </span>
                            ) : (
                              <div className="text-sm font-bold text-slate-400">
                                {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '---'}
                              </div>
                            )}
                          </td>
                          <td className="py-6 px-8 text-right">
                            {activeView !== 'applications' && (
                              <button 
                                onClick={() => deleteItem(activeView === 'users' ? 'user' : (activeView === 'jobs' ? 'job' : 'module'), item.id)}
                                className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isBroadcasting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-fade-in">
          <div className="w-full max-w-xl bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white animate-scale-up">
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Global Broadcast</h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Instant notification to all users.</p>
                </div>
                <button onClick={() => setIsBroadcasting(false)} className="p-4 hover:bg-slate-100 rounded-full transition-colors text-slate-400 font-bold">&times;</button>
              </div>

              <form onSubmit={handleBroadcast} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Alert Category</label>
                  <select 
                    className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-red-600 outline-none transition"
                    value={broadcastData.type}
                    onChange={e => setBroadcastData({...broadcastData, type: e.target.value})}
                  >
                    <option value="info">System Update (Blue)</option>
                    <option value="success">Opportunity Alert (Green)</option>
                    <option value="warning">Maintenance (Orange)</option>
                    <option value="error">Critical Alert (Red)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Headline</label>
                  <input 
                    type="text" 
                    placeholder="Brief summary of the announcement"
                    className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-red-600 outline-none transition"
                    value={broadcastData.title}
                    onChange={e => setBroadcastData({...broadcastData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Message</label>
                  <textarea 
                    className="w-full p-5 bg-slate-50 rounded-2xl font-medium border-2 border-transparent focus:border-red-600 outline-none transition h-32 resize-none"
                    placeholder="Elaborate on the broadcast details here..."
                    value={broadcastData.message}
                    onChange={e => setBroadcastData({...broadcastData, message: e.target.value})}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={() => setIsBroadcasting(false)} className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-xs">Dismiss</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl shadow-red-200 hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'TRANSMITTING...' : 'SEND BROADCAST'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsDashboard({ stats }) {
  if (!stats) return null;

  const roleData = stats.users_by_role?.map(r => ({ name: r.role.toUpperCase(), value: r.count })) || [];
  const statusData = stats.applications_by_status?.map(s => ({ name: s.status.toUpperCase(), value: s.count })) || [];
  const locationData = stats.jobs_by_location?.map(l => ({ name: l.location, count: l.count })) || [];
  const registrationData = stats.recent_registrations?.map(r => ({ date: r.date, count: r.count })) || [];

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Top Row: User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900">User Growth</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Last 30 Days Trend</p>
            </div>
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-black text-xs">+24% ↑</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: '800' }}
                />
                <Area type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-2">User Roles</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Platform Demographics</p>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={roleData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontWeight: '800', fontSize: '10px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Jobs & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Job Hotspots</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Top Locations for Hire</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: '800', fill: '#94a3b8', fontSize: '10px' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontWeight: '800', fill: '#94a3b8', fontSize: '10px' }} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: '800' }} />
                <Bar dataKey="count" fill="#4ECDC4" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Application Success</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Status Distribution</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, highContrast, trend }) {
  const colors = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200/50 ${highContrast ? 'border-yellow-300 bg-black' : 'bg-white border-slate-50 shadow-sm'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-5 rounded-2xl ${highContrast ? 'bg-yellow-300 text-black' : colors[color]}`}>
          {React.cloneElement(icon, { size: 28 })}
        </div>
        <div className="text-[10px] font-black text-green-500 uppercase tracking-tighter bg-green-50 px-3 py-1 rounded-full">
          {trend}
        </div>
      </div>
      <div>
        <div className={`text-4xl font-black ${highContrast ? 'text-white' : 'text-slate-900'}`}>{value || '0'}</div>
        <div className="text-xs font-black opacity-40 uppercase tracking-[0.2em] mt-1">{title}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-10 py-6 font-black text-sm transition-all relative ${active ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {React.cloneElement(icon, { size: 18 })}
      {label}
      {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 animate-slide-in"></div>}
    </button>
  );
}

function getRoleColor(role) {
  switch (role) {
    case 'admin': return 'bg-red-50 text-red-600';
    case 'employer': return 'bg-blue-50 text-blue-600';
    case 'trainer': return 'bg-green-50 text-green-600';
    default: return 'bg-slate-100 text-slate-600';
  }
}
