import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Briefcase, LogOut, TrendingUp, Target, X } from '../constants/icons';
import { Menu } from 'lucide-react';

function PublicHeader() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const authUser = localStorage.getItem('authUser');
  const user = authUser ? JSON.parse(authUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    navigate('/login', { replace: true });
  };

  const itemClass = 'inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-emerald-500 to-sky-600 text-white shadow-lg">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Career Platform</p>
            <p className="text-lg font-black text-slate-900">TalentNexus</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-wrap items-center gap-6 md:flex">
          <Link to="/" className={itemClass}>
            Home
          </Link>
          <Link to="/blog" className={itemClass}>
            <TrendingUp size={14} /> Blog
          </Link>
          <Link to="/events" className={itemClass}>
            <Target size={14} /> Events
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden flex-wrap items-center gap-3 md:flex">
          {user ? (
            <>
              {(user.role === 'admin' || user.role === 'employer' || user.role === 'recruiter') ? (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Briefcase size={14} /> Dashboard
                </Link>
              ) : (
                <Link
                  to="/student/jobs"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Briefcase size={14} /> Portal
                </Link>
              )}
              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          className="inline-flex md:hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-slate-50 md:hidden">
          <nav className="flex flex-col gap-2 px-4 py-3">
            <Link to="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white transition">
              Home
            </Link>
            <Link to="/blog" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white transition">
              Blog
            </Link>
            <Link to="/events" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white transition">
              Events
            </Link>
            <div className="border-t border-slate-200 pt-3">
              {user ? (
                <>
                  {(user.role === 'admin' || user.role === 'employer' || user.role === 'recruiter') ? (
                    <Link
                      to="/admin/dashboard"
                      className="block rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition text-center mb-2"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/student/jobs"
                      className="block rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition text-center mb-2"
                    >
                      Portal
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 text-center mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default PublicHeader;
