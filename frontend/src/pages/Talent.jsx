import React, { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TalentCard from '../components/crm/TalentCard';
import EngagementModal from '../components/crm/EngagementModal';
import api from '../lib/api';
import { mapCandidateToCard } from '../lib/candidateMapper';
import {
  ArrowUpRight, Filter, Search, Star, Zap, BadgeCheck, Users, ChevronRight,
} from '../constants/icons';

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

function StatPill({ label, value, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  };
  return (
    <div className={`rounded-xl px-4 py-3 ${colors[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{label}</p>
      <p className="text-2xl font-black tracking-tighter">{value}</p>
    </div>
  );
}

function Talent() {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [statusFilters, setStatusFilters] = useState(['Active', 'Needs Follow-up']);
  const [finalistOnly, setFinalistOnly] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [minMatch, setMinMatch] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  React.useEffect(() => {
    let mounted = true;
    async function fetchCandidates() {
      try {
        const res = await api.get('/api/crm/candidates');
        if (!mounted) return;
        setCandidates(res.data.map((c, i) => mapCandidateToCard(c, i)));
      } catch (e) {
        if (!mounted) return;
        setError(e.response?.data?.message || 'Unable to load candidates');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCandidates();
    return () => { mounted = false; };
  }, []);

  const filteredCandidates = useMemo(() =>
    candidates.filter((c) => {
      const query = `${c.name} ${c.role}`.toLowerCase();
      return (
        query.includes(deferredSearchTerm.toLowerCase()) &&
        (statusFilters.length === 0 || statusFilters.includes(c.status)) &&
        (!finalistOnly || c.isFinalist) &&
        c.matchScore >= minMatch
      );
    }),
    [deferredSearchTerm, statusFilters, finalistOnly, candidates, minMatch]
  );

  const topCandidates = useMemo(() => candidates.filter((c) => c.isTopPick).slice(0, 3), [candidates]);

  const handleStatusToggle = (s) =>
    setStatusFilters((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);

  return (
    <div className="animate-in min-h-screen bg-slate-50 pb-24">
      {/* Page header */}
      <div className="border-b border-slate-200/60 bg-white px-6 py-6 shadow-[0_1px_0_rgb(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Talent Pool</p>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">Candidate Intelligence</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
            <Zap size={12} />
            AI Matchmaking Active
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        {/* ── Top Picks Row ── */}
        {topCandidates.length > 0 && (
          <section className="mb-6">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <Star size={11} className="text-amber-400" /> Featured Talent
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {topCandidates.map((c) => (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-[0_4px_18px_rgba(245,158,11,0.08)] transition-shadow hover:shadow-[0_8px_32px_rgba(245,158,11,0.14)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Top Pick</p>
                      <h3 className="truncate text-base font-black text-slate-900">{c.name}</h3>
                      <p className="truncate text-xs text-slate-500">{c.role}</p>
                    </div>
                    <Star size={16} className="shrink-0 text-amber-400" fill="currentColor" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-indigo-600">{c.matchScore}% match</span>
                    <Link
                      to={`/user/${c.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
                    >
                      Profile <ArrowUpRight size={10} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Main layout: sidebar + grid ── */}
        <div className="flex gap-5">

          {/* Sidebar */}
          <AnimatePresence initial={false}>
            {sidebarOpen && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 256 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 overflow-hidden"
                style={{ minWidth: 256 }}
              >
                <div className="sticky top-24 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      <Filter size={12} /> Filters
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative mb-5">
                    <Search className="pointer-events-none absolute left-3 top-3 text-slate-300" size={14} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Name or role…"
                      className="w-full rounded-xl border border-slate-200/60 bg-slate-50 py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Status */}
                  <div className="mb-5">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Talent Status</p>
                    <div className="space-y-2">
                      {['Active', 'Needs Follow-up', 'Dormant'].map((s) => (
                        <label key={s} className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={statusFilters.includes(s)}
                            onChange={() => handleStatusToggle(s)}
                            className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Finalist toggle */}
                  <div className="mb-5 border-t border-slate-100 pt-5">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={finalistOnly}
                        onChange={(e) => setFinalistOnly(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-amber-500"
                      />
                      <BadgeCheck size={14} className="text-amber-500" />
                      Finalists Only
                    </label>
                  </div>

                  {/* Min Match slider */}
                  <div className="border-t border-slate-100 pt-5">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Min Match Score</p>
                    <input
                      type="range" min="0" max="100" value={minMatch}
                      onChange={(e) => setMinMatch(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] font-semibold text-slate-400">
                      <span>0%</span>
                      <span className="text-indigo-600">{minMatch}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between gap-3">
              {!sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
                >
                  <Filter size={12} /> Filters
                </button>
              )}
              <div className="ml-auto flex items-center gap-2">
                <StatPill label="Shown" value={filteredCandidates.length} color="slate" />
                <StatPill label="Active" value={candidates.filter(c => c.status === 'Active').length} color="emerald" />
              </div>
            </div>

            {/* Error */}
            {!loading && error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
                {error}
              </div>
            )}

            {/* Skeleton */}
            {loading && (
              <div className="grid gap-4 lg:grid-cols-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-200" />
                ))}
              </div>
            )}

            {/* Cards grid */}
            {!loading && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${deferredSearchTerm}-${statusFilters.join()}-${finalistOnly}-${minMatch}`}
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-3 lg:grid-cols-1"
                >
                  {filteredCandidates.map((c) => (
                    <motion.div key={c.id} variants={itemVariants}>
                      <TalentCard candidate={c} onNudge={setActiveCandidate} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Empty state */}
            {!loading && filteredCandidates.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <Users size={36} className="mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">No candidates matched your filters.</p>
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setStatusFilters(['Active', 'Needs Follow-up']); setFinalistOnly(false); setMinMatch(0); }}
                  className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Engagement modal */}
      {activeCandidate && (
        <EngagementModal candidate={activeCandidate} onClose={() => setActiveCandidate(null)} />
      )}
    </div>
  );
}

export default Talent;