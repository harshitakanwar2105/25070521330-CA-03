import { useTheme } from '../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Wrench, 
  Plus, 
  Trash2, 
  Calendar, 
  Car, 
  DollarSign, 
  Gauge, 
  FileText,
  ClipboardList
} from 'lucide-react';

export default function Logs() {
  const { darkMode } = useTheme(); // Hook active kar diya
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [serviceType, setServiceType] = useState('Routine Maintenance');
  const [cost, setCost] = useState('');
  const [odometer, setOdometer] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch vehicles for dropdown
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/vehicles', {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
        setVehicles(res.data);
        if (res.data.length > 0) {
          setSelectedVehicle(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
      }
    };
    fetchVehicles();
  }, []);

  // Fetch logs when vehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      fetchLogs();
    }
  }, [selectedVehicle]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/logs/vehicle/${selectedVehicle}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!cost || !odometer || !date || !selectedVehicle) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/logs', {
        vehicleId: selectedVehicle,
        serviceType,
        cost,
        odometer,
        date,
        notes
      }, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });

      // Reset form & reload logs
      setCost('');
      setOdometer('');
      setDate('');
      setNotes('');
      fetchLogs();
      alert('Service log added successfully!');
    } catch (err) {
      console.error('Failed to add log:', err);
      alert('Failed to add service log.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service log?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/logs/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setLogs(logs.filter(log => log._id !== id));
    } catch (err) {
      console.error('Failed to delete log:', err);
      alert('Failed to delete log.');
    }
  };

  return (
    <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${darkMode ? 'bg-[#0B1F3A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${darkMode ? 'border-slate-700/60' : 'border-slate-200'}`}>
          <div>
            <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Service & Repair Logs 
              <span className={`text-sm font-bold px-3 py-1 rounded-full border ${darkMode ? 'bg-[#102a4c] border-slate-700 text-[#FACC15]' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                Maintenance History
              </span>
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Track maintenance costs, part replacements, routine services, and odometer readings.
            </p>
          </div>

          {/* Vehicle Selector */}
          <div className={`flex items-center gap-3 p-2.5 rounded-2xl shadow-lg border transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700' : 'bg-white border-slate-200'}`}>
            <Car className={`w-5 h-5 ml-2 ${darkMode ? 'text-[#FACC15]' : 'text-amber-500'}`} />
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className={`text-sm rounded-xl px-3 py-2 border focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] text-white border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-300'}`}
            >
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.model} ({v.regNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Add Log Form */}
          <div className={`border p-6 rounded-3xl shadow-xl space-y-6 h-fit transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className={`text-xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <Wrench className={`w-5 h-5 ${darkMode ? 'text-[#FACC15]' : 'text-amber-500'}`} /> Add Service Entry
            </h2>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className={`w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                >
                  <option value="Routine Maintenance">Routine Maintenance</option>
                  <option value="Oil Change">Oil Change</option>
                  <option value="Major Repair">Major Repair</option>
                  <option value="Brake Inspection">Brake Inspection</option>
                  <option value="Tire Replacement">Tire Replacement</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Cost (₹ / $)</label>
                <input
                  type="number"
                  placeholder="e.g. 3500"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  required
                  className={`w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Odometer Reading</label>
                <input
                  type="text"
                  placeholder="e.g. 46,500 km"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  required
                  className={`w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Service Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={`w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Notes / Parts Replaced</label>
                <textarea
                  rows="3"
                  placeholder="Details of service performed..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`w-full text-sm rounded-xl p-4 border focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full font-extrabold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-4 ${
                  darkMode 
                    ? 'bg-[#FACC15] hover:bg-yellow-400 text-[#0B1F3A]' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{submitting ? 'Saving Log...' : 'Add Service Log'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Logs History List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className={`text-xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <ClipboardList className={`w-5 h-5 ${darkMode ? 'text-[#FACC15]' : 'text-amber-500'}`} /> Vehicle Maintenance Timeline
            </h2>

            {loading ? (
              <div className={`border rounded-2xl p-12 text-center transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                Fetching service records...
              </div>
            ) : logs.length === 0 ? (
              <div className={`border rounded-3xl p-12 text-center space-y-3 transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <Wrench className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold">No Service Logs Found</h3>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No maintenance entries recorded for this vehicle yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div 
                    key={log._id} 
                    className={`border p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                      darkMode ? 'bg-[#102a4c] border-slate-700/80 hover:border-[#FACC15]/40 text-white' : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-lg uppercase border ${darkMode ? 'bg-[#0B1F3A] text-[#FACC15] border-slate-700' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {log.serviceType}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Calendar className="w-3.5 h-3.5" /> {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>

                      {log.notes && (
                        <p className={`text-xs p-3 rounded-xl border mt-1 ${darkMode ? 'bg-[#0B1F3A]/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          {log.notes}
                        </p>
                      )}

                      <div className={`flex items-center gap-4 text-xs pt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span className={`flex items-center gap-1 font-mono font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          <Gauge className={`w-3.5 h-3.5 ${darkMode ? 'text-[#FACC15]' : 'text-amber-500'}`} /> {log.odometer}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-emerald-500 font-bold">
                          <DollarSign className="w-3.5 h-3.5" /> {log.cost}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(log._id)}
                      className={`p-2.5 border rounded-xl transition-all cursor-pointer self-end md:self-center ${
                        darkMode ? 'bg-[#0B1F3A] hover:bg-red-500/20 border-slate-700 hover:border-red-500/40 text-red-400' : 'bg-slate-100 hover:bg-red-50 border-slate-300 hover:border-red-300 text-red-600'
                      }`}
                      title="Delete Log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}