import { useTheme } from '../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  DollarSign, 
  Car, 
  FileText, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export default function Reports() {
  const { darkMode } = useTheme(); // Hook active kar diya
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/reports', {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
        setReportData(res.data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors ${darkMode ? 'bg-[#0B1F3A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'}`}>
        <div className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Generating fleet analytics report...</div>
      </div>
    );
  }

  const { totalVehicles, totalDocuments, totalLogs, totalSpend, fleetHealth, vehicles } = reportData || {};

  return (
    <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${darkMode ? 'bg-[#0B1F3A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${darkMode ? 'border-slate-700/60' : 'border-slate-200'}`}>
          <div>
            <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Fleet Analytics & Reports 
              <span className={`text-sm font-bold px-3 py-1 rounded-full border ${darkMode ? 'bg-[#102a4c] border-slate-700 text-[#FACC15]' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                Overview & Insights
              </span>
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Comprehensive financial overview, maintenance cost breakdown, and fleet health statistics.
            </p>
          </div>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`border p-6 rounded-3xl shadow-xl flex items-center justify-between transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/85' : 'bg-white border-slate-200'}`}>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Fleet Size</p>
              <h3 className={`text-3xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{totalVehicles || 0}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-[#FACC15]' : 'bg-slate-100 border-slate-300 text-amber-600'}`}>
              <Car className="w-6 h-6" />
            </div>
          </div>

          <div className={`border p-6 rounded-3xl shadow-xl flex items-center justify-between transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/85' : 'bg-white border-slate-200'}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Total Maintenance Spend</p>
              <h3 className={`text-3xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>₹{totalSpend?.toLocaleString() || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className={`border p-6 rounded-3xl shadow-xl flex items-center justify-between transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/85' : 'bg-white border-slate-200'}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-yellow-500">Service Logs Count</p>
              <h3 className={`text-3xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{totalLogs || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
              <Wrench className="w-6 h-6" />
            </div>
          </div>

          <div className={`border p-6 rounded-3xl shadow-xl flex items-center justify-between transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/85' : 'bg-white border-slate-200'}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-500">Secure Vault Docs</p>
              <h3 className={`text-3xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{totalDocuments || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Fleet Health Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Health Status Distribution */}
          <div className={`border p-8 rounded-3xl shadow-xl space-y-6 transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/85 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className={`text-xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <ShieldCheck className={`w-5 h-5 ${darkMode ? 'text-[#FACC15]' : 'text-amber-500'}`} /> Fleet Health Status Breakdown
            </h2>

            <div className="space-y-4">
              <div className={`border p-4 rounded-2xl flex items-center justify-between transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>Healthy Vehicles</span>
                </div>
                <span className="text-emerald-500 font-black text-lg">{fleetHealth?.healthy || 0}</span>
              </div>

              <div className={`border p-4 rounded-2xl flex items-center justify-between transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>Service Due</span>
                </div>
                <span className="text-yellow-500 font-black text-lg">{fleetHealth?.serviceDue || 0}</span>
              </div>

              <div className={`border p-4 rounded-2xl flex items-center justify-between transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>In Repair</span>
                </div>
                <span className="text-red-500 font-black text-lg">{fleetHealth?.inRepair || 0}</span>
              </div>
            </div>
          </div>

          {/* Fleet Inventory Summary */}
          <div className={`border p-8 rounded-3xl shadow-xl space-y-6 transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/85 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className={`text-xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-[#FACC15]' : 'text-amber-500'}`} /> Registered Fleet Summary
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {Array.isArray(vehicles) && vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <div key={v._id} className={`border p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="min-w-0">
                      <h4 className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{v.model}</h4>
                      <span className={`text-[10px] font-mono block truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{v.regNumber}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 border font-semibold rounded-lg uppercase shrink-0 transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700 text-[#FACC15]' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                      {v.type}
                    </span>
                  </div>
                ))
              ) : (
                <p className={`text-xs text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No vehicles registered in fleet.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}