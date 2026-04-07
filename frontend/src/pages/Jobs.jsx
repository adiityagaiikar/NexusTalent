import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import JobFiltersSidebar from '../components/jobs/JobFiltersSidebar';
import JobListPanel from '../components/jobs/JobListPanel';
import JobPreviewPanel from '../components/jobs/JobPreviewPanel';
import JobSearchBar from '../components/jobs/JobSearchBar';
import JobSkeletonList from '../components/jobs/JobSkeletonList';
import { EmptyJobsState, JobsErrorState, JobStats } from '../components/jobs/JobStates';
import {
  EXPERIENCE_LEVELS,
  JOBS_DATA,
  ROLE_CATEGORIES,
  SKILL_POOL,
  TRENDING_ROLES,
} from '../components/jobs/jobsData';
import api from '../lib/api';

const DEFAULT_FILTERS = {
  category: 'All',
  salaryK: 220,
  experience: [],
  remoteOnly: false,
  skills: [],
};

function Jobs() {
  const [promotedIds, setPromotedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('promoted_jobs') || '[]');
    } catch {
      return [];
    }
  });
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [savedIds, setSavedIds] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['frontend', 'remote product', 'react intern']);
  const [selectedJobId, setSelectedJobId] = useState(JOBS_DATA[0].id);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onShortcut = (event) => {
      if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        event.preventDefault();
        const input = document.querySelector('input[aria-label="Search jobs"]');
        input?.focus();
      }
    };

    document.addEventListener('keydown', onShortcut);
    return () => document.removeEventListener('keydown', onShortcut);
  }, []);

  useEffect(() => {
    const syncPromotions = () => {
      try {
        setPromotedIds(JSON.parse(localStorage.getItem('promoted_jobs') || '[]'));
      } catch {
        setPromotedIds([]);
      }
    };

    syncPromotions();
    window.addEventListener('storage', syncPromotions);
    window.addEventListener('promoted-jobs-updated', syncPromotions);

    return () => {
      window.removeEventListener('storage', syncPromotions);
      window.removeEventListener('promoted-jobs-updated', syncPromotions);
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();
    const sourceJobs = JOBS_DATA.map((job) => ({
      ...job,
      promoted: job.promoted || promotedIds.includes(job.id),
    }));

    const matches = sourceJobs.filter((job) => {
      const byCategory = filters.category === 'All' || job.category === filters.category;
      const bySalary = job.salaryK <= filters.salaryK;
      const byExperience = !filters.experience.length || filters.experience.includes(job.experience);
      const byRemote = !filters.remoteOnly || job.location.toLowerCase().includes('remote');
      const bySkills =
        !filters.skills.length || filters.skills.every((skill) => job.skills.includes(skill));
      const bySearch =
        !term ||
        [job.title, job.company, job.location, ...job.skills].join(' ').toLowerCase().includes(term);

      return byCategory && bySalary && byExperience && byRemote && bySkills && bySearch;
    });

    return matches.sort((a, b) => {
      if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
      if (a.trending !== b.trending) return a.trending ? -1 : 1;
      return b.matchScore - a.matchScore;
    });
  }, [deferredQuery, filters, promotedIds]);

  useEffect(() => {
    if (!filteredJobs.find((job) => job.id === selectedJobId)) {
      setSelectedJobId(filteredJobs[0]?.id || null);
    }
  }, [filteredJobs, selectedJobId]);

  const selectedJob = useMemo(
    () => filteredJobs.find((job) => job.id === selectedJobId) || filteredJobs[0] || null,
    [filteredJobs, selectedJobId],
  );

  const highMatchCount = filteredJobs.filter((job) => job.matchScore >= 90).length;

  const submitSearch = (value) => {
    const normalized = value.trim();
    setQuery(normalized);
    if (!normalized) return;

    setRecentSearches((prev) => [normalized, ...prev.filter((item) => item !== normalized)].slice(0, 5));
  };

  const handleSaveToggle = (jobId) => {
    setSavedIds((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
  };

  const handleQuickApply = (job) => {
    setSelectedJobId(job.id);
    api.post('/api/analytics/track', {
      type: 'job_click',
      targetId: job.id,
      metadata: { source: 'jobs_page' },
    }).catch(() => {});
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery('');
    setHasError(false);
  };

  return (
    <div className="animate-in relative pb-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-10 top-0 h-60 w-60 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      <section className="mb-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Career Command Center</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Discover your next role with precision.
          </h1>
        </div>
        <JobSearchBar
          value={query}
          onChange={setQuery}
          onSubmit={submitSearch}
          recentSearches={recentSearches}
          trendingRoles={TRENDING_ROLES}
        />
        <JobStats total={filteredJobs.length} highMatch={highMatchCount} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_380px]">
        <div className="order-2 xl:order-1">
          <JobFiltersSidebar
            categories={ROLE_CATEGORIES}
            experienceLevels={EXPERIENCE_LEVELS}
            skillPool={SKILL_POOL}
            filters={filters}
            setFilters={setFilters}
            onReset={resetFilters}
          />
        </div>

        <div className="order-1 xl:order-2">
          {hasError ? (
            <JobsErrorState onRetry={() => setHasError(false)} />
          ) : isLoading ? (
            <JobSkeletonList />
          ) : filteredJobs.length ? (
            <JobListPanel
              jobs={filteredJobs}
              activeId={selectedJob?.id}
              savedIds={savedIds}
              onSelect={(job) => setSelectedJobId(job.id)}
              onSaveToggle={handleSaveToggle}
              onQuickApply={handleQuickApply}
            />
          ) : (
            <EmptyJobsState onReset={resetFilters} />
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setHasError((prev) => !prev)}
            className="mt-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            {hasError ? 'Hide error demo' : 'Show error demo'}
          </motion.button>
        </div>

        <div className="order-3">
          <JobPreviewPanel job={selectedJob} onApply={handleQuickApply} />
        </div>
      </section>
    </div>
  );
}

export default Jobs;