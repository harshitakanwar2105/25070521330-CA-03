import { useTheme } from '../context/ThemeContext';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wrench, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle'; // ThemeToggle import kiya

export default function Login() {
  const { darkMode } = useTheme();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token || res.data); 
      const userData = res.data.user || res.data;
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 transition-colors duration-300 ${darkMode ? 'bg-[#0B1F3A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Top-Right Separate Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${darkMode ? 'bg-yellow-500/5' : 'bg-indigo-500/10'}`}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-xl mb-4 transition-colors ${darkMode ? 'bg-[#FACC15] text-[#0B1F3A] shadow-yellow-500/10' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}>
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>DriveSync</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Professional Fleet & Vehicle Intelligence</p>
        </div>

        {/* Form Card */}
        <div className={`border p-8 rounded-2xl shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
              <div className="relative">
                <Mail className={`w-5 h-5 absolute left-3.5 top-3.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className={`w-full border text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none transition-all ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500 focus:border-[#FACC15]' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600'}`}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
              <div className="relative">
                <Lock className={`w-5 h-5 absolute left-3.5 top-3.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className={`w-full border text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none transition-all ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500 focus:border-[#FACC15]' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600'}`}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-extrabold py-3.5 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 mt-2 cursor-pointer ${
                darkMode ? 'bg-[#FACC15] hover:bg-yellow-400 text-[#0B1F3A]' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? <span>Signing in...</span> : <><span>Sign In</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <div className={`mt-8 pt-6 border-t text-center ${darkMode ? 'border-slate-700/80 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
            <p className="text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className={`font-bold transition-colors hover:underline ${darkMode ? 'text-[#FACC15]' : 'text-indigo-600'}`}>
                Create one now
              </Link>
            </p>
          </div>
        </div>

        <div className={`mt-6 flex items-center justify-center gap-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <ShieldCheck className={`w-4 h-4 ${darkMode ? 'text-[#FACC15]' : 'text-indigo-600'}`} />
          <span>Secure Garage Authentication & Database</span>
        </div>
      </div>
    </div>
  );
}