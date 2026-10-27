import { useTheme } from '../context/ThemeContext';
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, MapPin, Lock, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { darkMode } = useTheme();
  const { user, login } = useContext(AuthContext);

  // Stored user from LocalStorage as initial state
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [form, setForm] = useState({
    name: user?.name || storedUser?.name || '',
    email: user?.email || storedUser?.email || '',
    city: user?.city || storedUser?.city || '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user || storedUser) {
      setForm({
        name: user?.name || storedUser?.name || '',
        email: user?.email || storedUser?.email || '',
        city: user?.city || storedUser?.city || '',
        password: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // API call to update profile details
      const res = await axios.put(
        'http://localhost:5000/api/auth/profile',
        form,
        {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        }
      );

      const updatedUser = res.data.user || res.data;
      
      // Update local storage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login({ user: updatedUser, token });

      setMessage('Profile details updated successfully!');
      setForm(prev => ({ ...prev, password: '' })); // clear password input
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${darkMode ? 'bg-[#0B1F3A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'}`}>
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Page Header */}
        <div className={`pb-6 border-b ${darkMode ? 'border-slate-700/60' : 'border-slate-200'}`}>
          <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Account & Profile Settings
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Manage your personal garage profile details, location, and security credentials.
          </p>
        </div>

        {/* Profile Card */}
        <div className={`border p-8 rounded-3xl shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          
          {/* Success Message */}
          {message && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <User className={`w-5 h-5 absolute left-3.5 top-3.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="text"
                  required
                  value={form.name}
                  className={`w-full border text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white focus:border-[#FACC15]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'}`}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`w-5 h-5 absolute left-3.5 top-3.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="email"
                  required
                  value={form.email}
                  className={`w-full border text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white focus:border-[#FACC15]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'}`}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                City / Garage Location
              </label>
              <div className="relative">
                <MapPin className={`w-5 h-5 absolute left-3.5 top-3.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="text"
                  required
                  value={form.city}
                  className={`w-full border text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white focus:border-[#FACC15]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'}`}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                New Password (Leave blank to keep unchanged)
              </label>
              <div className="relative">
                <Lock className={`w-5 h-5 absolute left-3.5 top-3.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  className={`w-full border text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white focus:border-[#FACC15]' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'}`}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-extrabold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-4 ${
                darkMode 
                  ? 'bg-[#FACC15] hover:bg-yellow-400 text-[#0B1F3A]' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Security Info Banner */}
        <div className={`flex items-center justify-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <ShieldCheck className={`w-4 h-4 ${darkMode ? 'text-[#FACC15]' : 'text-indigo-600'}`} />
          <span>Your personal profile information is encrypted and stored securely.</span>
        </div>

      </div>
    </div>
  );
}