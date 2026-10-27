import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shadow-lg ${
        darkMode 
          ? 'bg-[#102a4c] border-slate-700 text-[#FACC15] hover:bg-slate-800' 
          : 'bg-white border-slate-200 text-amber-500 hover:bg-slate-100'
      }`}
      title="Toggle Theme"
    >
      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}