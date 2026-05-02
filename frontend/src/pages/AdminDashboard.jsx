import React, { useEffect, useState } from 'react';
import { Users, Briefcase, GraduationCap, Trash2, ShieldCheck, TrendingUp, Search } from 'lucide-react';
import api from '../api';

export default function AdminDashboard({ highContrast }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('users'); // users, jobs, modules
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FF9933]"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Admin Command Center</h1>
          <p className="text-xl opacity-60 font-medium italic mt-2">Manage the Udyog Saarthi ecosystem.</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 font-black ${highContrast ? 'bg-yellow-300 text-black' : 'bg-red-50 text-red-600'}`}>
          <ShieldCheck /> System Administrator
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Total Users" value={stats?.total_users} icon={<Users />} color="blue" highContrast={highContrast} />
        <StatCard title="Job Postings" value={stats?.total_jobs} icon={<Briefcase />} color="orange" highContrast={highContrast} />
        <StatCard title="Modules" value={stats?.total_modules} icon={<GraduationCap />} color="green" highContrast={highContrast} />
        <StatCard title="Applications" value={stats?.total_applications} icon={<TrendingUp />} color="purple" highContrast={highContrast} />
      </div>

      <div className="bg-white rounded-[3.5rem] border-2 border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b-2 border-gray-50">
          <TabButton active={activeView === 'users'} onClick={() => setActiveView('users')} icon={<Users />} label="Manage Users" />
          {/* Add more tabs for jobs/modules if needed later */}
        </div>

        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black">User Directory</h2>
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-red-600 outline-none transition-all font-bold"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-black uppercase tracking-[0.2em] opacity-30">
                  <th className="pb-6 px-4">User</th>
                  <th className="pb-6 px-4">Role</th>
                  <th className="pb-6 px-4">Joined</th>
                  <th className="pb-6 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="group hover:bg-gray-50/50 transition">
                    <td className="py-6 px-4">
                      <div>
                        <div className="text-xl font-black">{user.name}</div>
                        <div className="text-sm opacity-60 font-medium">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-6 px-4 text-sm font-bold opacity-40">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-6 px-4 text-right">
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 size={24} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, highContrast }) {
  const colors = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className={`p-8 rounded-[2.5rem] flex items-center gap-6 border-2 transition-all hover:shadow-xl ${highContrast ? 'border-yellow-300 bg-black' : 'bg-white border-gray-50 shadow-sm'}`}>
      <div className={`p-5 rounded-2xl ${highContrast ? 'bg-yellow-300 text-black' : colors[color]}`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <div>
        <div className="text-3xl font-black">{value || '0'}</div>
        <div className="text-sm font-black opacity-40 uppercase tracking-widest">{title}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-10 py-6 font-black text-lg transition-all ${active ? 'border-b-4 border-red-600 text-red-600 bg-red-50/20' : 'text-gray-400 hover:text-gray-600'}`}
    >
      {React.cloneElement(icon, { size: 24 })}
      {label}
    </button>
  );
}

function getRoleColor(role) {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-700';
    case 'employer': return 'bg-blue-100 text-blue-700';
    case 'trainer': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
