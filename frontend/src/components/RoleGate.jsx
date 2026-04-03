import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function RoleGate({ allowedRoles }) {
  const location = useLocation();
  const storedUser = localStorage.getItem('authUser');

  if (!storedUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    const user = JSON.parse(storedUser);
    const role = user?.role;

    if (!allowedRoles.includes(role)) {
      if (role === 'admin' || role === 'employer') {
        return <Navigate to="/admin/dashboard" replace />;
      }

      return <Navigate to="/student/jobs" replace />;
    }
  } catch {
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RoleGate;
