import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { 
  Car, 
  ShieldAlert, 
  Wrench, 
  BarChart2, 
  Home, 
  LogOut, 
  User, 
  Sun, 
  Moon,
  FileText,
  ClipboardList
} from 'lucide-react';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const { darkMode } = useTheme(); // 2. darkMode state nikali
  const navigate = useNavigate();

  if (!token) return null;

  return (
    // 3. Navbar background aur text ko dynamic kiya
    <nav className={`shadow-md transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border-b border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold text-indigo-400 flex items-center gap-2">
          <Wrench className="w-6 h-6" /> DriveSync
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="flex items-center gap-1 hover:text-indigo-400"><Home className="w-4 h-4"/> Home</Link>
          <Link to="/vehicles" className="flex items-center gap-1 hover:text-indigo-400"><Car className="w-4 h-4"/> Vehicles</Link>
          <Link to="/documents" className="flex items-center gap-1 hover:text-indigo-400"><ShieldAlert className="w-4 h-4"/> Documents</Link>
          <Link to="/logs" className="flex items-center gap-1 hover:text-indigo-400"><Wrench className="w-4 h-4"/> Logs</Link>
          <Link to="/reports" className="flex items-center gap-1 hover:text-indigo-400"><BarChart2 className="w-4 h-4"/> Reports</Link>
          <Link 
  to="/profile" 
  className={`hover:text-[#FACC15] font-bold text-sm flex items-center gap-2`}
>
  <User className="w-4 h-4" />
  Profile
</Link>
          
          {/* 4. Yahan ThemeToggle component laga diya */}
          <ThemeToggle />

          <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}