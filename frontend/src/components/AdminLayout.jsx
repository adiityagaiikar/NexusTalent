import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { DollarSign, LayoutDashboard, Sparkles, Users, LogOut, Target, Shield } from '../constants/icons';
import NotificationCenter from './NotificationCenter';

function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');

  const itemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-slate-900 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <Link to="/admin/dashboard" className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-sky-500 to-blue-700 text-white shadow-lg">
              <Sparkles size={18} />
            </span>
            <span>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Admin Portal</p>
              <p className="text-lg font-black text-slate-900">TalentNexus</p>
            </span>
          </Link>

          <nav className="space-y-1">
            <NavLink to="/admin/dashboard" className={itemClass}>
              <LayoutDashboard size={16} /> Hiring Dashboard
            </NavLink>
            <NavLink to="/admin/talent" className={itemClass}>
              <Users size={16} /> Talent Pool
            </NavLink>
            <NavLink to="/admin/billing" className={itemClass}>
              <DollarSign size={16} /> Billing
            </NavLink>
            <NavLink to="/admin/strategy" className={itemClass}>
              <Target size={16} /> Strategy
            </NavLink>
            <NavLink to="/admin/system-intelligence" className={itemClass}>
              <Sparkles size={16} /> System Intelligence
            </NavLink>
            <NavLink to="/admin/supply-chain-analytics" className={itemClass}>
              <Sparkles size={16} /> Supply Chain Analytics
            </NavLink>
            <NavLink to="/admin/security" className={itemClass}>
              <Shield size={16} /> Security
            </NavLink>
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Signed in as</p>
              <NotificationCenter />
            </div>
            <p className="text-sm font-bold text-slate-800">{user.name || 'Admin User'}</p>
            <p className="text-xs font-medium text-slate-500">{user.email || 'admin@talentnexus.com'}</p>
            <button
              onClick={handleLogout}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white"
              type="button"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
