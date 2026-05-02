import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Register({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register', { name, email, password, role });
      localStorage.setItem('auth_token', response.data.access_token);
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in">
      <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
        <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-[#FF9933] to-[#128807] bg-clip-text text-transparent">Join Us Today</h2>
        {error && <p className="text-red-500 mb-6 text-sm font-bold text-center bg-red-50 p-3 rounded-xl">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-[#FF9933] outline-none bg-gray-50 transition-all font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Email Address</label>
            <input
              type="email"
              placeholder="e.g. rahul@email.com"
              className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-[#FF9933] outline-none bg-gray-50 transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Create Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-[#FF9933] outline-none bg-gray-50 transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">I am a...</label>
            <select
              className="w-full p-4 rounded-2xl border-2 border-gray-50 focus:border-[#FF9933] outline-none bg-gray-50 transition-all font-bold text-gray-700"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="trainer">Trainer / Coach</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full py-5 bg-[#FF9933] text-white rounded-3xl font-black text-xl shadow-2xl shadow-orange-500/30 transition-all transform hover:scale-102 active:scale-95 mt-4"
          >
            Create Account
          </button>
        </form>
        <p className="mt-8 text-center font-bold opacity-60">
          Already have an account? <Link to="/login" className="text-[#FF9933] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
