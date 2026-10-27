import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import AddVehicle from './pages/AddVehicle';
import Documents from './pages/Documents';
import Logs from './pages/Logs';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Navbar />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/vehicles" element={<PrivateRoute><Vehicles /></PrivateRoute>} />
            <Route path="/vehicles/add" element={<PrivateRoute><AddVehicle /></PrivateRoute>} />
            <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
            <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> {/* 2. Add route */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}