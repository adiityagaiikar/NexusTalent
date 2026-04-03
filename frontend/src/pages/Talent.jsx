import React, { useMemo, useState } from 'react';
import TalentCard from '../components/crm/TalentCard';
import EngagementModal from '../components/crm/EngagementModal';
import api from '../lib/api';
import { mapCandidateToCard } from '../lib/candidateMapper';
import { Search, Filter, Zap } from '../constants/icons';

function Talent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState(['Active', 'Needs Follow-up']);
  const [finalistOnly, setFinalistOnly] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    let mounted = true;

    async function fetchCandidates() {
      try {
        const response = await api.get('/api/crm/candidates');
        if (!mounted) return;

        setCandidates(response.data.map((candidate, index) => mapCandidateToCard(candidate, index)));
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError.response?.data?.message || 'Unable to load candidates');
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

  const filteredCandidates = useMemo(
    () =>
      candidates.filter((candidate) => {
        const query = `${candidate.name} ${candidate.role}`.toLowerCase();
        const matchesText = query.includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilters.length === 0 || statusFilters.includes(candidate.status);
        const matchesFinalist = !finalistOnly || candidate.isFinalist;

        return matchesText && matchesStatus && matchesFinalist;
      }),
    [searchTerm, statusFilters, finalistOnly, candidates]
  );

  const handleStatusToggle = (status) => {
    setStatusFilters((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status]
    );
  };

  const handleNudge = (candidate) => {
    setActiveCandidate(candidate);
  };

  return (
    <div className="animate-in mt-6 pb-20">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
              <Filter size={18} /> Filters
            </h3>

            <div className="mb-5 relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or role"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-400">Talent Status</label>
                <div className="space-y-2">
                  {['Active', 'Needs Follow-up', 'Dormant'].map((status) => (
                    <label key={status} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={statusFilters.includes(status)}
                        onChange={() => handleStatusToggle(status)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 dark:border-slate-700">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={finalistOnly}
                    onChange={(e) => setFinalistOnly(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-400"
                  />
                  Silver Medalists Only
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Featured Talent</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              <Zap size={14} /> AI-Powered Matchmaking Active
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredCandidates.map((candidate) => (
              <TalentCard
                key={candidate.id}
                candidate={candidate}
                onNudge={handleNudge}
              />
            ))}
          </div>

          {!loading && error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          {!loading && filteredCandidates.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              No candidates matched these filters.
            </div>
          )}

          {activeCandidate && (
            <EngagementModal
              candidate={activeCandidate}
              onClose={() => setActiveCandidate(null)}
            />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`${loading ? 'block' : 'hidden'} h-28 animate-pulse rounded-3xl bg-slate-100 sm:block dark:bg-slate-800`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Talent;