import { useTheme } from '../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Car, 
  Plus, 
  Search, 
  Calendar, 
  Wrench, 
  Fuel, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Trash2
} from 'lucide-react';

export default function Vehicles() {
  const { darkMode } = useTheme(); // Hook active kar diya
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/vehicles', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from the fleet?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setVehicles(vehicles.filter(v => v._id !== id));
    } catch (err) {
      console.error('Failed to delete vehicle:', err);
      alert('Failed to delete vehicle.');
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = (v.model || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (v.regNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || v.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${darkMode ? 'bg-[#0B1F3A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${darkMode ? 'border-slate-700/60' : 'border-slate-200'}`}>
          <div>
            <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Fleet Vehicles <span className={`text-sm font-bold px-3 py-1 rounded-full border ${darkMode ? 'bg-[#102a4c] border-slate-700 text-[#FACC15]' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>{vehicles.length} Total</span>
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Manage vehicle status, service schedules, and registration details.
            </p>
          </div>

          <Link
            to="/vehicles/add"
            className={`font-extrabold px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
              darkMode 
                ? 'bg-[#FACC15] hover:bg-yellow-400 text-[#0B1F3A]' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </Link>
        </div>

        {/* Controls Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl shadow-xl border transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <div className="relative w-full sm:w-96">
            <Search className={`w-5 h-5 absolute left-3.5 top-3.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search by model or plate number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full text-sm rounded-xl pl-11 pr-4 py-2.5 border focus:outline-none transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500 focus:border-[#FACC15]' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600'}`}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Healthy', 'Service Due', 'In Repair'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === tab
                    ? darkMode ? 'bg-[#FACC15] text-[#0B1F3A] shadow-md' : 'bg-indigo-600 text-white shadow-md'
                    : darkMode ? 'bg-[#0B1F3A] text-slate-300 border border-slate-700 hover:border-slate-500' : 'bg-slate-100 text-slate-700 border border-slate-300 hover:border-slate-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className={`border rounded-2xl p-12 text-center transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
            Loading vehicles from garage...
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className={`border rounded-2xl p-12 text-center transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold">No Vehicles Found</h3>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Try adjusting your search term or add a new vehicle.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((v) => (
              <div
                key={v._id}
                className={`border p-6 rounded-2xl shadow-xl transition-all flex flex-col justify-between group ${
                  darkMode ? 'bg-[#102a4c] border-slate-700/80 hover:border-[#FACC15]/40 text-white' : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-[#FACC15]' : 'bg-slate-100 border-slate-300 text-amber-600'}`}>
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg tracking-tight">{v.model}</h3>
                        <span className={`inline-block text-xs font-mono px-2 py-0.5 rounded border mt-0.5 ${darkMode ? 'bg-[#0B1F3A] text-slate-400 border-slate-700/60' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                          {v.regNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                      v.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      v.status === 'Service Due' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                      'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {v.status === 'Healthy' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {v.status === 'Service Due' && <Clock className="w-3.5 h-3.5" />}
                      {v.status === 'In Repair' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {v.status}
                    </span>
                    <span className={`border text-xs px-2.5 py-1 rounded-full font-medium uppercase ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
                      {v.type}
                    </span>
                  </div>

                  <div className={`space-y-2.5 pt-4 border-t text-xs ${darkMode ? 'border-slate-700/60 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><Fuel className="w-4 h-4" /> Fuel Type</span>
                      <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{v.fuelType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><Calendar className="w-4 h-4" /> Last Service</span>
                      <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{v.lastService || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><Wrench className="w-4 h-4" /> Odometer</span>
                      <span className={`font-mono font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{v.mileage || '0'} km</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer with Delete Button */}
                <div className={`mt-6 pt-4 border-t flex items-center justify-between gap-3 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
                  <Link
                    to={`/vehicles/${v._id}`}
                    className={`w-full border font-bold text-xs py-2.5 rounded-xl transition-all text-center block ${
                      darkMode ? 'bg-[#0B1F3A] hover:bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    }`}
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className={`p-2.5 border rounded-xl transition-all cursor-pointer ${
                      darkMode ? 'bg-[#0B1F3A] hover:bg-red-500/20 border-slate-700 hover:border-red-500/40 text-red-400' : 'bg-slate-100 hover:bg-red-50 border-slate-300 hover:border-red-300 text-red-600'
                    }`}
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}