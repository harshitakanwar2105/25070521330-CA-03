import { useTheme } from '../context/ThemeContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Calendar, 
  Car, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Plus
} from 'lucide-react';

export default function Documents() {
  const { darkMode } = useTheme(); // Hook active kar diya
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Insurance');
  const [expiryDate, setExpiryDate] = useState('');
  const [file, setFile] = useState(null);

  // Fetch vehicles on load to populate dropdown
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

  // Fetch documents when selected vehicle changes
  useEffect(() => {
    if (selectedVehicle) {
      fetchDocuments();
    }
  }, [selectedVehicle]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/documents/vehicle/${selectedVehicle}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedVehicle || !title) {
      alert('Please fill in all required fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('vehicleId', selectedVehicle);
    formData.append('title', title);
    formData.append('docType', docType);
    formData.append('expiryDate', expiryDate);
    formData.append('file', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/documents', formData, {
        headers: { 
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      setTitle('');
      setExpiryDate('');
      setFile(null);
      fetchDocuments();
      alert('Document uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err.response || err);
      alert(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/documents/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete document.');
    }
  };

  return (
    <div className={`min-h-screen p-6 lg:p-10 transition-colors duration-300 ${darkMode ? 'bg-[#0B1F3A] text-[#F8FAFC]' : 'bg-slate-100 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${darkMode ? 'border-slate-700/60' : 'border-slate-200'}`}>
          <div>
            <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Fleet Vault & Documents 
              <span className={`text-sm font-bold px-3 py-1 rounded-full border ${darkMode ? 'bg-[#102a4c] border-slate-700 text-[#FACC15]' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                Secure Storage
              </span>
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Upload, manage and monitor insurance policies, RC books, PUC certificates and service invoices.
            </p>
          </div>

          {/* Vehicle Selector Dropdown */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Upload Form */}
          <div className={`border p-6 rounded-3xl shadow-xl space-y-6 h-fit transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className={`text-xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <Upload className={`w-5 h-5 ${darkMode ? 'text-[#FACC15]' : 'text-amber-500'}`} /> Upload New Document
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC ERGO Comprehensive Policy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={`w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className={`w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                >
                  <option value="Insurance">Insurance Policy</option>
                  <option value="RC Book">RC Book (Registration)</option>
                  <option value="PUC Certificate">PUC Certificate</option>
                  <option value="Service Invoice">Service Invoice</option>
                  <option value="Other">Other Document</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={`w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none focus:border-[#FACC15] transition-colors ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Select File (PDF / Image)</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  className={`w-full text-xs border rounded-xl p-2 transition-colors ${darkMode ? 'bg-[#0B1F3A] text-slate-400 border-slate-700 file:bg-[#0B1F3A] file:text-[#FACC15]' : 'bg-slate-50 text-slate-600 border-slate-300 file:bg-slate-100 file:text-amber-600'} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold`}
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full font-extrabold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-4 ${
                  darkMode 
                    ? 'bg-[#FACC15] hover:bg-yellow-400 text-[#0B1F3A]' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{uploading ? 'Uploading to Vault...' : 'Upload Document'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Documents List Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className={`text-xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <FileText className={`w-5 h-5 ${darkMode ? 'text-[#FACC15]' : 'text-amber-500'}`} /> Uploaded Vehicle Vault Files
            </h2>

            {loading ? (
              <div className={`border rounded-2xl p-12 text-center transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                Fetching documents from secure vault...
              </div>
            ) : documents.length === 0 ? (
              <div className={`border rounded-3xl p-12 text-center space-y-3 transition-colors ${darkMode ? 'bg-[#102a4c] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold">No Documents Found</h3>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No records have been uploaded for this vehicle yet. Use the form to add one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {documents.map((doc) => (
                  <div 
                    key={doc._id} 
                    className={`border p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 transition-all ${
                      darkMode ? 'bg-[#102a4c] border-slate-700/80 hover:border-[#FACC15]/40 text-white' : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${darkMode ? 'bg-[#0B1F3A] border-slate-700 text-[#FACC15]' : 'bg-slate-100 border-slate-300 text-amber-600'}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-base tracking-tight">{doc.title}</h3>
                            <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border mt-1 ${darkMode ? 'bg-[#0B1F3A] text-[#FACC15] border-slate-700' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                              {doc.docType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {doc.expiryDate && (
                        <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${darkMode ? 'border-slate-700/60 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
                          <span className={`flex items-center gap-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <Calendar className="w-3.5 h-3.5" /> Expiry:
                          </span>
                          <span className="font-mono font-semibold">
                            {new Date(doc.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={`pt-3 border-t flex items-center justify-between gap-3 ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
                      <a
                        href={`http://localhost:5000${doc.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 border font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                          darkMode ? 'bg-[#0B1F3A] hover:bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                        }`}
                      >
                        <ExternalLink className={`w-3.5 h-3.5 ${darkMode ? 'text-[#FACC15]' : 'text-amber-600'}`} /> View File
                      </a>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className={`p-2 border rounded-xl transition-all cursor-pointer ${
                          darkMode ? 'bg-[#0B1F3A] hover:bg-red-500/20 border-slate-700 hover:border-red-500/40 text-red-400' : 'bg-slate-100 hover:bg-red-50 border-slate-300 hover:border-red-300 text-red-600'
                        }`}
                        title="Delete Document"
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

      </div>
    </div>
  );
}