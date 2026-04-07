import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Briefcase, Sparkles } from '../../constants/icons';

export function EmptyJobsState({ onReset }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-cyan-100 to-emerald-100 text-cyan-700">
        <Briefcase size={34} />
      </div>
      <h3 className="mt-4 text-xl font-black text-slate-900">No jobs found</h3>
      <p className="mt-2 text-sm text-slate-500">
        Try removing a few filters or searching for broader role terms.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        Reset filters
      </button>
    </div>
  );
}

export function JobsErrorState({ onRetry }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertCircle size={26} />
      </div>
      <h3 className="mt-3 text-lg font-black text-rose-900">Unable to load jobs</h3>
      <p className="mt-2 text-sm text-rose-700">Something went wrong while fetching job listings.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
      >
        Retry
      </button>
    </div>
  );
}

export function JobStats({ total, highMatch }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <motion.div
        key={`total-${total}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white/80 p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Live Openings</p>
        <p className="mt-2 text-3xl font-black text-slate-900">{total}</p>
      </motion.div>

      <motion.div
        key={`high-${highMatch}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4"
      >
        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-700">
          <Sparkles size={12} /> High Match
        </p>
        <p className="mt-2 text-3xl font-black text-cyan-900">{highMatch}</p>
      </motion.div>
    </div>
  );
}
