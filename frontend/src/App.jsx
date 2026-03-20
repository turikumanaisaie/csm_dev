import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyCode from './pages/VerifyCode';
import Pricing from './pages/Pricing';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Analytics from './pages/dashboard/Analytics';
import Users from './pages/dashboard/Users';
import Departments from './pages/dashboard/Departments';
import Devices from './pages/dashboard/Devices';
import Attendance from './pages/dashboard/Attendance';
import Settings from './pages/dashboard/Settings';

function App() {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!admin ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify" element={<VerifyCode />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Protected dashboard routes */}
      <Route path="/dashboard" element={admin ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="departments" element={<Departments />} />
        <Route path="devices" element={<Devices />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Default redirect */}

      <Route path="*" element={<Navigate to={admin ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;