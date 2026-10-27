import { useTheme } from '../context/ThemeContext';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';

export default function AddVehicle() {
  const { darkMode } = useTheme(); // Hook active kar diya
  const [form, setForm] = useState({
    model: '',
    regNumber: '',
    type: 'SUV',
    fuelType: 'Diesel',
    status: 'Healthy',
    mileage: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/vehicles',
        form,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );
      navigate('/vehicles');
    } catch (err) {
      console.error("Full Error Details:", err.response);
      setError(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${darkMode ? 'bg-[#0B1F3A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Back Button */}
        <Link
          to="/vehicles"
          className={`inline-flex items-center gap-2 text-xs font-bold hover:underline ${darkMode ? 'text-[#FACC15]' : 'text-amber-600'}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Vehicles List
        </Link>

        {/* Header */}
        <div>
          <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <Car className={`w-8 h-8 ${darkMode ? 'text-[#FACC15]' : 'text-amber-500'}`} />
            Register New Vehicle
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Fill in the vehicle specifications to track maintenance and fleet health.
          </p>
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
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Vehicle Model Name
              </label>
              <input
                type="text"
                placeholder="e.g. Scorpio N"
                required
                value={form.model}
                className={`w-full border text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Registration Plate Number
              </label>
              <input
                type="text"
                placeholder="e.g. RJ-14-UK-4526"
                required
                value={form.regNumber}
                className={`w-full border text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
                onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Body Type
                </label>
                <select
                  value={form.type}
                  className={`w-full border text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Fuel Type
                </label>
                <select
                  value={form.fuelType}
                  className={`w-full border text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="EV">EV (Electric)</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Initial Status
                </label>
                <select
                  value={form.status}
                  className={`w-full border text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Service Due">Service Due</option>
                  <option value="In Repair">In Repair</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Odometer Reading
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50000"
                  value={form.mileage}
                  className={`w-full border text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
                  onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-extrabold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer mt-4 ${
                darkMode 
                  ? 'bg-[#FACC15] hover:bg-yellow-400 text-[#0B1F3A]' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {loading ? 'Adding Vehicle...' : 'Save & Register Vehicle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}