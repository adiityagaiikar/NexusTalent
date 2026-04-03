import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import DashboardCRM from './pages/DashboardCRM';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Talent from './pages/Talent';
import Insights from './pages/Insights';
import Strategy from './pages/Strategy';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import ApplicationTracker from './pages/ApplicationTracker';
import EmployerPricing from './pages/EmployerPricing';
import StudentUpgrade from './pages/StudentUpgrade';
import RoleGate from './components/RoleGate';
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';

function PortalRedirect() {
  const storedUser = localStorage.getItem('authUser');

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    if (user?.role === 'admin' || user?.role === 'employer') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/student/jobs" replace />;
  } catch {
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<RoleGate allowedRoles={['admin', 'employer']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardCRM />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetails />} />
            <Route path="talent" element={<Talent />} />
            <Route path="billing" element={<EmployerPricing />} />
            <Route path="strategy" element={<Strategy />} />
            <Route path="insights" element={<Insights />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        <Route element={<RoleGate allowedRoles={['student', 'candidate']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="jobs" element={<Jobs />} />
            <Route path="profile" element={<Profile />} />
            <Route path="applications" element={<ApplicationTracker />} />
            <Route path="pro" element={<StudentUpgrade />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetails />} />
            <Route index element={<Navigate to="jobs" replace />} />
          </Route>
        </Route>

        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/crm" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/talent" element={<Navigate to="/admin/talent" replace />} />
        <Route path="/jobs" element={<Navigate to="/student/jobs" replace />} />
        <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
        <Route path="/products" element={<Navigate to="/student/products" replace />} />
        <Route path="/products/:slug" element={<Navigate to="/student/products" replace />} />

        <Route path="/" element={<PortalRedirect />} />
        <Route path="*" element={<PortalRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;