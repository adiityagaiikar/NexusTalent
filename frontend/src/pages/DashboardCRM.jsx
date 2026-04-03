import React, { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  Clock,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  IndianRupee,
} from '../constants/icons';

const STAGES = ['Applied', 'Screening', 'Interviewing', 'Hired'];

function getStage(matchScore) {
  if (matchScore >= 90) return 'Hired';
  if (matchScore >= 75) return 'Interviewing';
  if (matchScore >= 55) return 'Screening';
  return 'Applied';
}

function getDaysInStage(lastActive) {
  const diff = Date.now() - new Date(lastActive).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function formatLastActive(lastActive) {
  const date = new Date(lastActive);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function stageChip(stage) {
  const classes = {
    Applied: 'bg-slate-100 text-slate-700 border-slate-200',
    Screening: 'bg-sky-100 text-sky-700 border-sky-200',
    Interviewing: 'bg-amber-100 text-amber-700 border-amber-200',
    Hired: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return classes[stage] || classes.Applied;
}

function DashboardCRM() {
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStats, setPaymentStats] = useState({
    totalEarnings: 0,
    totalTransactions: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [folders, setFolders] = useState(['Future Data Team', 'Q3 Product Hiring']);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderByCandidate, setSelectedFolderByCandidate] = useState({});
  const [savedTalentByFolder, setSavedTalentByFolder] = useState({
    'Future Data Team': [],
    'Q3 Product Hiring': [],
  });

  useEffect(() => {
    let mounted = true;

    async function fetchCandidates() {
      try {
        setLoading(true);
        const [candidateResponse, paymentResponse] = await Promise.all([
          api.get('/api/crm/candidates'),
          api.get('/api/payments/stats'),
        ]);

        if (!mounted) return;

        const mapped = candidateResponse.data.map((candidate) => ({
          id: candidate._id,
          name: candidate.name,
          role: candidate.role,
          matchScore: candidate.matchScore,
          isTopCandidate: candidate.isTopCandidate,
          isFinalist: candidate.isFinalist,
          stage: getStage(candidate.matchScore),
          daysInStage: getDaysInStage(candidate.lastActive),
          lastActive: candidate.lastActive,
        }));
        setPipeline(mapped);
        setPaymentStats(paymentResponse.data);
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError.response?.data?.message || 'Unable to load CRM candidates');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchCandidates();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPipeline = useMemo(
    () =>
      pipeline.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.role.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [pipeline, searchTerm]
  );

  const byStage = useMemo(() => {
    const grouped = {
      Applied: [],
      Screening: [],
      Interviewing: [],
      Hired: [],
    };

    filteredPipeline.forEach((candidate) => {
      grouped[candidate.stage].push(candidate);
    });

    return grouped;
  }, [filteredPipeline]);

  const ghostingAlerts = useMemo(
    () => filteredPipeline.filter((candidate) => candidate.daysInStage > 5),
    [filteredPipeline]
  );

  const silverMedalists = useMemo(
    () => filteredPipeline.filter((candidate) => candidate.isFinalist),
    [filteredPipeline]
  );

  const stats = useMemo(() => {
    const total = pipeline.length;
    const interviewing = pipeline.filter((candidate) => candidate.stage === 'Interviewing').length;
    const hired = pipeline.filter((candidate) => candidate.stage === 'Hired').length;
    const avgScore =
      total === 0
        ? 0
        : Math.round(
            pipeline.reduce((sum, candidate) => sum + candidate.matchScore, 0) / total
          );

    return [
      {
        title: 'Total Candidates',
        value: total,
        icon: <Users className="text-sky-600" size={18} />,
      },
      {
        title: 'Interviewing',
        value: interviewing,
        icon: <Clock className="text-amber-600" size={18} />,
      },
      {
        title: 'Hired',
        value: hired,
        icon: <CheckCircle className="text-emerald-600" size={18} />,
      },
      {
        title: 'Avg. Match Score',
        value: `${avgScore}%`,
        icon: <TrendingUp className="text-rose-600" size={18} />,
      },
    ];
  }, [pipeline]);

  const planUsage = {
    usedJobs: 3,
    totalJobs: 5,
    activeSeats: 12,
    seatLimit: 15,
  };

  const addFolder = () => {
    const folder = newFolderName.trim();
    if (!folder || folders.includes(folder)) return;

    setFolders((prev) => [...prev, folder]);
    setSavedTalentByFolder((prev) => ({
      ...prev,
      [folder]: [],
    }));
    setNewFolderName('');
  };

  const saveSilverMedalist = (candidate) => {
    const selected = selectedFolderByCandidate[candidate.id] || folders[0];
    if (!selected) return;

    setSavedTalentByFolder((prev) => {
      const existing = prev[selected] || [];
      const alreadySaved = existing.some((item) => item.id === candidate.id);

      if (alreadySaved) return prev;

      return {
        ...prev,
        [selected]: [...existing, candidate],
      };
    });
  };

  return (
    <div className="animate-in mx-auto max-w-7xl pb-6">
      <div className="mb-6 rounded-3xl border border-slate-200 bg-linear-to-br from-white to-sky-50 p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              <Sparkles size={14} /> Employer Workspace
            </p>
            <h2 className="mb-3 text-3xl font-extrabold text-slate-900">CRM Command Center</h2>
            <p className="max-w-2xl text-slate-500">
              Pipeline intelligence, ghosting prevention alerts, and silver medalist talent pooling in a single enterprise dashboard.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidates or roles"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 shadow-sm outline-none transition-all focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5"
            >
              <div className="mb-2 inline-flex rounded-xl bg-slate-100 p-2">{stat.icon}</div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.title}</p>
              <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 xl:col-span-2">
          <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-black text-amber-700">
            <AlertCircle size={16} /> Ghosting Prevention Alerts
          </h3>

          {ghostingAlerts.length === 0 ? (
            <p className="text-sm font-semibold text-emerald-700">No ghosting risks detected today.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {ghostingAlerts.map((candidate) => (
                <div key={candidate.id} className="rounded-xl border border-amber-200 bg-white p-3">
                  <p className="text-sm font-bold text-slate-800">{candidate.name}</p>
                  <p className="text-xs text-slate-500">{candidate.role}</p>
                  <p className="mt-2 text-xs font-semibold text-amber-700">
                    Stuck in {candidate.stage} for {candidate.daysInStage} days
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-sky-200 bg-sky-50 p-5">
          <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-black text-sky-700">
            <Briefcase size={16} /> Enterprise Plan Usage
          </h3>

          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Job Posts</p>
            <p className="text-lg font-black text-slate-900">{planUsage.usedJobs} of {planUsage.totalJobs} Used</p>
            <div className="mt-2 h-2 w-full rounded-full bg-sky-100">
              <div className="h-2 rounded-full bg-sky-600" style={{ width: `${(planUsage.usedJobs / planUsage.totalJobs) * 100}%` }} />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recruiter Seats</p>
            <p className="text-lg font-black text-slate-900">{planUsage.activeSeats} of {planUsage.seatLimit} Active</p>
            <div className="mt-2 h-2 w-full rounded-full bg-emerald-100">
              <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${(planUsage.activeSeats / planUsage.seatLimit) * 100}%` }} />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-green-600 p-8 text-white shadow-xl shadow-green-200">
          <div className="mb-4 flex items-center justify-between">
            <IndianRupee size={24} className="opacity-80" />
            <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-black uppercase">10% Commission</span>
          </div>
          <h4 className="text-3xl font-black">₹{Number(paymentStats.totalEarnings || 0).toFixed(2)}</h4>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest opacity-80">Platform Revenue</p>
          <p className="mt-2 text-[11px] font-semibold text-green-100">Transactions: {paymentStats.totalTransactions || 0}</p>
        </section>
      </div>

      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="inline-flex items-center gap-2 text-lg font-black text-slate-900">
            <Target size={18} /> Kanban Pipeline Board
          </h3>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Applied {'>'} Screening {'>'} Interviewing {'>'} Hired
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {STAGES.map((stage) => (
              <div key={stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${stageChip(stage)}`}>
                    {stage}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{byStage[stage].length}</span>
                </div>

                <div className="space-y-2">
                  {byStage[stage].map((candidate) => (
                    <article key={candidate.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
                      <p className="text-xs text-slate-500">{candidate.role}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">Score {candidate.matchScore}%</span>
                        <span className="text-slate-400">Last active {formatLastActive(candidate.lastActive)}</span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {candidate.isTopCandidate && (
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">Top Candidate</span>
                        )}
                        {candidate.isFinalist && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">Silver Medalist</span>
                        )}
                      </div>
                    </article>
                  ))}

                  {byStage[stage].length === 0 && (
                    <p className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-center text-xs font-semibold text-slate-400">
                      No candidates in this stage
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="inline-flex items-center gap-2 text-lg font-black text-slate-900">
            <Users size={18} /> Silver Medalist Talent Pooling
          </h3>
          <div className="flex items-center gap-2">
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Create folder"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-100"
            />
            <button
              onClick={addFolder}
              type="button"
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            >
              Add Folder
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Finalist Candidates</p>
            <div className="space-y-2">
              {silverMedalists.map((candidate) => (
                <div key={candidate.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
                      <p className="text-xs text-slate-500">{candidate.role}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedFolderByCandidate[candidate.id] || folders[0] || ''}
                        onChange={(e) =>
                          setSelectedFolderByCandidate((prev) => ({
                            ...prev,
                            [candidate.id]: e.target.value,
                          }))
                        }
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
                      >
                        {folders.map((folder) => (
                          <option key={folder} value={folder}>
                            {folder}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => saveSilverMedalist(candidate)}
                        className="rounded-lg bg-sky-600 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {silverMedalists.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-center text-xs font-semibold text-slate-400">
                  No silver medalists match this filter.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Custom Talent Folders</p>
            <div className="space-y-3">
              {folders.map((folder) => (
                <div key={folder} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-bold text-slate-900">{folder}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(savedTalentByFolder[folder] || []).map((candidate) => (
                      <span key={candidate.id} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">
                        {candidate.name}
                      </span>
                    ))}
                    {(savedTalentByFolder[folder] || []).length === 0 && (
                      <span className="text-xs font-medium text-slate-400">No candidates saved yet</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!loading && error && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}

export default DashboardCRM;