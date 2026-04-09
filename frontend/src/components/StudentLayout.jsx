import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Briefcase, Search, User, Sparkles, Clock3, LogOut, Zap, Target, TrendingUp, Gift, Shield } from '../constants/icons';

function StudentLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');

  const itemClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-emerald-500 to-sky-600 text-white shadow-lg">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Student Portal</p>
              <p className="text-lg font-black text-slate-900">TalentNexus</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <NavLink to="/student/jobs" className={itemClass}>
              <Search size={14} /> Jobs
            </NavLink>
            <NavLink to="/student/applications" className={itemClass}>
              <Clock3 size={14} /> Applications
            </NavLink>
            <NavLink to="/student/pro" className={itemClass}>
              <Zap size={14} /> Upgrade Pro
            </NavLink>
            <NavLink to="/student/referral" className={itemClass}>
              <Gift size={14} /> Refer & Earn
            </NavLink>
            <NavLink to="/student/products" className={itemClass}>
              <Briefcase size={14} /> Products
            </NavLink>
            <NavLink to="/student/profile" className={itemClass}>
              <User size={14} /> Profile
            </NavLink>
            <NavLink to="/student/security" className={itemClass}>
              <Shield size={14} /> Security
            </NavLink>
            <NavLink to="/student/blog" className={itemClass}>
              <TrendingUp size={14} /> Blog
            </NavLink>
            <NavLink to="/student/events" className={itemClass}>
              <Target size={14} /> Events
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <p className="hidden text-right text-xs font-medium text-slate-500 md:block">
              {user.name || 'Student User'}
              <br />
              {user.email || 'student@talentnexus.com'}
            </p>
            <button
              onClick={handleLogout}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;
