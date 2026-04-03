import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Briefcase, DollarSign, LayoutDashboard, Sparkles, Users, LogOut, Target } from '../constants/icons';

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
              <LayoutDashboard size={16} /> CRM Workspace
            </NavLink>
            <NavLink to="/admin/products" className={itemClass}>
              <Briefcase size={16} /> Products
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
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Signed in as</p>
            <p className="mt-1 text-sm font-bold text-slate-800">{user.name || 'Admin User'}</p>
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
      <footer className="pb-6 text-center text-xs font-semibold text-slate-400">
        Made by Aditya Gaikar
      </footer>
    </div>
  );
}

export default AdminLayout;
