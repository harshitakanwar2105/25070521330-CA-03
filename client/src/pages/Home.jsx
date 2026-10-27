import { useTheme } from '../context/ThemeContext';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // AuthContext import kiya
import { 
  Car, 
  Plus, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function Home() {
  const { darkMode } = useTheme();
  const { user } = useContext(AuthContext); // User data nikalne ke liye
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = user?.name || storedUser?.name || 'User';
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real vehicles from backend
useEffect(() => {
  const fetchVehicles = async () => {
    const token = localStorage.getItem('token');

    // 1. Agar token missing hai, toh unnecessary API call avoid karo
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // 2. Token ko proper Bearer format mein bhejo
      const res = await axios.get('http://localhost:5000/api/vehicles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard vehicles:', err);
      // Agar token invalid/expired ho jaye toh handle karo
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchVehicles();
}, []);

  // Calculate dynamic stats based on real data
  const totalVehicles = vehicles.length;
  const healthyCount = vehicles.filter(v => v.status === 'Healthy').length;
  const serviceDueCount = vehicles.filter(v => v.status === 'Service Due').length;
  const repairCount = vehicles.filter(v => v.status === 'In Repair').length;

  return (
    <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${darkMode ? 'bg-[#0B1F3A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Banner */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl shadow-2xl border transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${darkMode ? 'bg-[#FACC15]/20 text-[#FACC15] border-[#FACC15]/30' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
             DriveSync Dashboard
            </span>
            <h1 className={`text-3xl lg:text-4xl font-black tracking-tight mt-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
               Welcome back, {displayName}! 👋
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Monitor your real-time fleet health, service intervals, and active registrations.
            </p>
          </div>

          <Link
            to="/vehicles/add"
            className={`font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm shrink-0 cursor-pointer ${
              darkMode 
                ? 'bg-[#FACC15] hover:bg-yellow-400 text-[#0B1F3A]' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Register New Vehicle</span>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className={`p-6 rounded-2xl shadow-xl flex items-center justify-between border transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80' : 'bg-white border-slate-200'}`}>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Vehicles</p>
              <h3 className={`text-3xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{totalVehicles}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-[#FACC15]' : 'bg-slate-100 border-slate-300 text-amber-600'}`}>
              <Car className="w-6 h-6" />
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-xl flex items-center justify-between border transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80' : 'bg-white border-slate-200'}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Healthy Fleet</p>
              <h3 className={`text-3xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{healthyCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-xl flex items-center justify-between border transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80' : 'bg-white border-slate-200'}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-yellow-500">Service Due</p>
              <h3 className={`text-3xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{serviceDueCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-xl flex items-center justify-between border transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80' : 'bg-white border-slate-200'}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-500">In Repair</p>
              <h3 className={`text-3xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{repairCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Recent Vehicles Section */}
        <div className={`p-6 lg:p-8 rounded-3xl shadow-xl space-y-6 border transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Recent Fleet Additions</h2>
            <Link 
              to="/vehicles" 
              className={`text-xs font-bold hover:underline flex items-center gap-1 ${darkMode ? 'text-[#FACC15]' : 'text-amber-600'}`}
            >
              View All Vehicles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className={`text-center py-10 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Loading garage data...</div>
          ) : vehicles.length === 0 ? (
            <div className={`text-center py-12 border border-dashed rounded-2xl ${darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
              <Car className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className={`font-bold text-sm ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>No vehicles registered yet.</p>
              <p className="text-xs mt-1">Add your first vehicle to start tracking fleet health.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {vehicles.slice(0, 3).map((v) => (
                <div key={v._id} className={`p-5 rounded-2xl shadow-md space-y-3 border transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700/80 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base">{v.model}</h3>
                      <span className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{v.regNumber}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      v.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      v.status === 'Service Due' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${darkMode ? 'border-slate-700/60 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                    <span className={`uppercase font-semibold ${darkMode ? 'text-[#FACC15]' : 'text-amber-600'}`}>{v.type}</span>
                    <span>Fuel: {v.fuelType}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}