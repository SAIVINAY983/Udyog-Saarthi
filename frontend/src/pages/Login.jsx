import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('auth_token', response.data.access_token);
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in">
      <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
        <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-[#FF9933] to-[#128807] bg-clip-text text-transparent">Welcome Back</h2>
        {error && <p className="text-red-500 mb-6 text-sm font-bold text-center bg-red-50 p-3 rounded-xl">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Email Address</label>
            <input
              type="email"
              placeholder="e.g. name@email.com"
              className="w-full p-5 rounded-2xl border-2 border-gray-50 focus:border-[#FF9933] outline-none bg-gray-50 transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest opacity-40 ml-4">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-5 rounded-2xl border-2 border-gray-50 focus:border-[#FF9933] outline-none bg-gray-50 transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-5 bg-[#FF9933] text-white rounded-3xl font-black text-xl shadow-2xl shadow-orange-500/30 transition-all transform hover:scale-102 active:scale-95 mt-4"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center font-bold opacity-60">
          New here? <Link to="/register" className="text-[#FF9933] hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
