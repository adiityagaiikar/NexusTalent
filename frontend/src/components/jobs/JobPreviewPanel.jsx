import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, User, Users } from '../../constants/icons';

function JobPreviewPanel({ job, onApply }) {
  return (
    <aside className="sticky top-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={job?.id || 'empty'}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className="glass-panel rounded-3xl border border-white/70 p-5 shadow-xl shadow-slate-900/10"
        >
          {job ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Job Preview</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">{job.title}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">{job.company}</p>

              <div className="mt-4 rounded-2xl bg-white/75 p-4 ring-1 ring-slate-200/70">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Description</p>
                <p className="text-sm leading-relaxed text-slate-700">{job.description}</p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <Users size={13} /> Company Info
                  </p>
                  <p className="text-sm text-slate-700">{job.companyInfo}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    <User size={13} /> Recruiter
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{job.recruiter.name}</p>
                  <p className="text-xs text-slate-500">{job.recruiter.role}</p>
                  <p className="mt-1 text-xs text-emerald-700">{job.recruiter.availability}</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onApply(job)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-500"
              >
                Apply Now <Globe size={15} />
              </motion.button>
            </>
          ) : (
            <div className="rounded-2xl bg-white/70 p-4 text-sm text-slate-500">Select a job to preview details.</div>
          )}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}

export default JobPreviewPanel;
