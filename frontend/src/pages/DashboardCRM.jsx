import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import {
  Activity,
  AlertCircle,
  Briefcase,
  CheckCircle,
  Clock,
  Mail,
  Sparkles,
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  ArrowUpRight,
  BadgeCheck,
  RotateCcw,
  Megaphone,
  X,
} from '../constants/icons';
import { JOBS_DATA } from '../components/jobs/jobsData';

const STAGES = ['Applied', 'Screening', 'Interviewing', 'Hired'];
const PROMOTION_PRICE = 50;
const PROMOTION_DURATION = 7;

function getStage(matchScore) {
  if (matchScore >= 90) return 'Hired';
  if (matchScore >= 75) return 'Interviewing';
  if (matchScore >= 55) return 'Screening';
  return 'Applied';
}

const STAGE_CONFIG = {
  Applied: {
    chip: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    bar: 'bg-slate-300',
  },
  Screening: {
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    bar: 'bg-sky-400',
  },
  Interviewing: {
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    bar: 'bg-amber-400',
  },
  Hired: {
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
  },
};

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Tiny circular SVG progress for match scores
function CircularScore({ score }) {
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="relative flex items-center justify-center" style={{ width: 44, height: 44 }}>
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="22" cy="22" r={radius} stroke="#f1f5f9" strokeWidth="3.5" fill="none" />
        <circle
          cx="22" cy="22" r={radius}
          stroke={color} strokeWidth="3.5" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>
      <span className="absolute text-[10px] font-black text-slate-800">{score}%</span>
    </div>
  );
}

const TIMELINE_ICON = {
  Applied: <Briefcase size={13} />,
  Screening: <Users size={13} />,
  Interviewing: <Activity size={13} />,
  Hired: <BadgeCheck size={13} />,
  default: <Zap size={13} />,
};

function ActivityTimeline({ items }) {
  if (!items.length) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs font-semibold text-slate-400">
        No activity yet.
      </p>
    );
  }
  return (
    <div className="relative ml-2 space-y-0">
      {items.map((item, i) => {
        const stage = STAGES.find((s) => item.action?.includes(s)) || 'default';
        const isLast = i === items.length - 1;
        return (
          <div key={item.id} className="relative flex gap-4">
            {/* vertical connector */}
            {!isLast && (
              <div className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-slate-100" />
            )}
            {/* icon bubble */}
            <div
              className={`z-10 mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm`}
            >
              {TIMELINE_ICON[stage] || TIMELINE_ICON.default}
            </div>
            {/* content */}
            <div className="pb-5 flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 leading-snug">{item.action}</p>
              <p className="mt-0.5 text-xs text-slate-400">{item.source} · {formatDate(item.time)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BarChart({ title, points, color }) {
  const max = Math.max(...points.map((item) => item.count), 1);
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
      <div className="flex h-28 items-end gap-1.5">
        {points.map((point) => (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`w-full rounded-t-md ${color} opacity-80 transition-all duration-500`}
              style={{ height: `${Math.max(8, Math.round((point.count / max) * 100))}%` }}
              title={`${point.label}: ${point.count}`}
            />
            <span className="text-[9px] font-semibold uppercase text-slate-300">{point.label.slice(-3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' } }),
};

function DashboardCRM() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pipeline, setPipeline] = useState([]);
  const [overview, setOverview] = useState(null);
  const [shortlisted, setShortlisted] = useState([]);
  const [promotedJobIds, setPromotedJobIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('promoted_jobs') || '[]');
    } catch {
      return [];
    }
  });
  const [checkoutJob, setCheckoutJob] = useState(null);
  const [isPromoting, setIsPromoting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [candidateRes, overviewRes] = await Promise.all([
          api.get('/api/crm/candidates'),
          api.get('/api/crm/overview'),
        ]);
        if (!mounted) return;
        const mapped = candidateRes.data.map((c) => ({
          id: c._id, name: c.name, role: c.role, matchScore: c.matchScore,
          stage: getStage(c.matchScore), lastActive: c.lastActive,
        }));
        setPipeline(mapped);
        setOverview(overviewRes.data.data);
      } catch (e) {
        if (!mounted) return;
        setError(e.response?.data?.message || 'Unable to load CRM dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  const byStage = useMemo(() => {
    const g = { Applied: [], Screening: [], Interviewing: [], Hired: [] };
    pipeline.forEach((c) => g[c.stage].push(c));
    return g;
  }, [pipeline]);

  const toggleShortlist = (id) =>
    setShortlisted((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const analytics = overview?.analytics || { conversionRate: 0, avgTimeToHire: 0, dropOffRate: 0 };
  const atRisk = overview?.atRiskCandidates || [];
  const topTalent = overview?.topTalent || [];
  const activityFeed = overview?.activityFeed || [];
  const weekly = overview?.trends?.weekly || [];
  const monthly = overview?.trends?.monthly || [];
  const activeJobs = useMemo(
    () => JOBS_DATA.slice(0, 4).map((job) => ({ ...job, promoted: promotedJobIds.includes(job.id) || job.promoted })),
    [promotedJobIds],
  );

  const metricCards = [
    {
      label: 'Conversion Rate', value: `${analytics.conversionRate}%`,
      icon: <Target size={16} className="text-emerald-600" />,
      iconBg: 'bg-emerald-50', trend: '+4.2%', up: true,
    },
    {
      label: 'Avg. Time to Hire', value: `${analytics.avgTimeToHire}d`,
      icon: <Clock size={16} className="text-indigo-600" />,
      iconBg: 'bg-indigo-50', trend: '-1.5d', up: true,
    },
    {
      label: 'Drop-off Rate', value: `${analytics.dropOffRate}%`,
      icon: <AlertCircle size={16} className="text-rose-500" />,
      iconBg: 'bg-rose-50', trend: '+0.8%', up: false,
    },
  ];

  const handlePromoteCheckout = async () => {
    if (!checkoutJob) return;

    try {
      setIsPromoting(true);
      await new Promise((resolve) => setTimeout(resolve, 650));

      setPromotedJobIds((previous) => {
        const next = Array.from(new Set([...previous, checkoutJob.id]));
        localStorage.setItem('promoted_jobs', JSON.stringify(next));
        window.dispatchEvent(new Event('promoted-jobs-updated'));
        return next;
      });
      setCheckoutJob(null);
    } finally {
      setIsPromoting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
        {[1, 2].map((i) => (
          <div key={i} className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-8 animate-in">
      {/* ── Error Banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
          >
            <AlertCircle size={15} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Header ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        {/* subtle gradient orb */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-50 opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-32 h-40 w-40 rounded-full bg-sky-50 opacity-60 blur-2xl" />

        <div className="relative">
          <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500">
            <Sparkles size={12} /> Intelligence Layer
          </p>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">
            Hiring Command Center
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-slate-500">
            Real-time signals across your talent pipeline — conversion, risk, and velocity in one view.
          </p>
        </div>

        {/* ── Hero Metric Row ── */}
        <div className="relative mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {metricCards.map((m, i) => (
            <motion.div
              key={m.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="group flex items-start gap-4 rounded-xl border border-slate-200/60 bg-slate-50/80 px-5 py-4 transition-shadow hover:shadow-[0_4px_18px_rgb(0,0,0,0.06)]"
            >
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${m.iconBg}`}>
                {m.icon}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{m.label}</p>
                <p className="text-2xl font-black tracking-tighter text-slate-900">{m.value}</p>
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${m.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {m.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {m.trend} vs last month
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Bento Row 1: At-Risk · Top Talent · Quick Actions ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

        {/* At-Risk Candidates */}
        <motion.article
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <AlertCircle size={13} className="text-rose-500" /> At-Risk <span className="ml-auto rounded-full bg-rose-50 px-2 py-0.5 text-rose-600">{atRisk.length}</span>
          </h2>
          <div className="space-y-2.5">
            {atRisk.length ? atRisk.map((c) => (
              <div key={c.id} className="rounded-xl border-l-4 border-rose-400 bg-slate-50 px-4 py-3">
                <p className="text-sm font-bold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">{c.role}</p>
                <p className="mt-1 text-[11px] font-semibold text-rose-500">
                  Inactive {c.daysInactive}d — action needed
                </p>
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-slate-200 px-3 py-5 text-center text-xs font-semibold text-slate-400">
                All candidates are engaged ✓
              </p>
            )}
          </div>
        </motion.article>

        {/* Top Talent */}
        <motion.article
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <BadgeCheck size={13} className="text-indigo-500" /> Top Talent <span className="ml-auto rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600">{topTalent.length}</span>
          </h2>
          <div className="space-y-2.5">
            {topTalent.length ? topTalent.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                <CircularScore score={c.matchScore} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{c.name}</p>
                  <p className="truncate text-xs text-slate-500">{c.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleShortlist(c.id)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    shortlisted.includes(c.id)
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5'
                  }`}
                >
                  {shortlisted.includes(c.id) ? '✓ Listed' : 'Shortlist'}
                </button>
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-slate-200 px-3 py-5 text-center text-xs font-semibold text-slate-400">
                No top talent flagged yet.
              </p>
            )}
          </div>

          {shortlisted.length > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Shortlisted</span>
              <span className="text-xl font-black tracking-tighter text-indigo-700">{shortlisted.length}</span>
            </div>
          )}
        </motion.article>

        {/* Quick Actions */}
        <motion.article
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Post New Job', icon: <Briefcase size={14} />, style: 'text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200' },
              { label: 'Move Candidates', icon: <ArrowUpRight size={14} />, style: 'text-slate-700 hover:bg-slate-50' },
              { label: 'Send Bulk Email', icon: <Mail size={14} />, style: 'text-slate-700 hover:bg-slate-50' },
              { label: 'Re-engage Dormant', icon: <RotateCcw size={14} />, style: 'text-amber-700 hover:bg-amber-50 hover:border-amber-200' },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                className={`flex w-full items-center justify-between rounded-xl border border-slate-200/60 px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${action.style}`}
              >
                <span>{action.label}</span>
                {action.icon}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-slate-50 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pipeline</p>
              <p className="text-2xl font-black tracking-tighter text-slate-900">{pipeline.length}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">Hired</p>
              <p className="text-2xl font-black tracking-tighter text-emerald-700">{byStage.Hired.length}</p>
            </div>
          </div>
        </motion.article>
      </div>

      {/* ── Bento Row 2: Trends + Activity Feed ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

        {/* Hiring Trends */}
        <motion.article
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] xl:col-span-2"
        >
          <h2 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <TrendingUp size={13} className="text-indigo-500" /> Hiring Trends
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <BarChart title="Weekly Applications" points={weekly} color="bg-indigo-400" />
            <BarChart title="Monthly Hires" points={monthly} color="bg-emerald-400" />
          </div>
        </motion.article>

        {/* Activity Timeline */}
        <motion.article
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
          className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h2 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <Activity size={13} className="text-indigo-500" /> Activity Feed
          </h2>
          <ActivityTimeline items={activityFeed} />
        </motion.article>
      </div>

      {/* ── Pipeline Board ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <h2 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <Target size={13} className="text-indigo-500" /> Pipeline Overview
        </h2>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          {STAGES.map((stage) => {
            const cfg = STAGE_CONFIG[stage];
            const candidates = byStage[stage];
            return (
              <div key={stage} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${cfg.chip}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {stage}
                  </span>
                  <span className="text-sm font-black text-slate-500">{candidates.length}</span>
                </div>

                {/* slim progress bar showing stage fill */}
                <div className="mb-3 h-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${cfg.bar} transition-all duration-700`}
                    style={{ width: `${pipeline.length ? Math.round((candidates.length / pipeline.length) * 100) : 0}%` }}
                  />
                </div>

                <div className="space-y-2">
                  {candidates.slice(0, 5).map((c) => (
                    <div key={c.id} className="rounded-lg border border-slate-200/60 bg-white px-3 py-2.5 shadow-sm">
                      <p className="truncate text-sm font-bold text-slate-900">{c.name}</p>
                      <p className="truncate text-xs text-slate-500">{c.role}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-600">{c.matchScore}% match</span>
                        <span className="text-[11px] text-slate-400">{formatDate(c.lastActive)}</span>
                      </div>
                    </div>
                  ))}
                  {candidates.length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-[11px] font-semibold text-slate-400">
                      No data
                    </p>
                  )}
                  {candidates.length > 5 && (
                    <p className="text-center text-[11px] font-semibold text-slate-400">
                      +{candidates.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Revenue Model: Promoted Listings ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}
        className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Revenue Engine</p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-black tracking-tight text-slate-900">
              <Megaphone size={16} className="text-indigo-600" /> Promoted Listings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Upgrade active jobs for sticky placement and boosted visibility in the student feed.
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
            ${PROMOTION_PRICE} / {PROMOTION_DURATION} days
          </span>
        </div>

        <div className="space-y-3">
          {activeJobs.map((job) => (
            <div key={job.id} className="flex flex-col gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-slate-900">{job.title}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{job.company} • {job.location}</p>
              </div>

              {job.promoted ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-800">
                  <Megaphone size={12} /> Promoted
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setCheckoutJob(job)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
                >
                  <Megaphone size={13} /> Promote Listing
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      <AnimatePresence>
        {checkoutJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Mock Stripe Checkout</p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">Promote This Listing</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckoutJob(null)}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">{checkoutJob.title}</p>
                <p className="text-xs text-slate-500">{checkoutJob.company}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Sticky placement duration</span>
                  <span className="font-semibold text-slate-900">{PROMOTION_DURATION} days</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Checkout amount</span>
                  <span className="font-black text-indigo-600">${PROMOTION_PRICE}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePromoteCheckout}
                disabled={isPromoting}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                <Megaphone size={14} /> {isPromoting ? 'Processing...' : `Pay $${PROMOTION_PRICE} & Promote`}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DashboardCRM;
