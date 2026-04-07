import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Heart, MapPin, Sparkles } from '../../constants/icons';

function JobCard({ job, isActive, isSaved, onSelect, onSaveToggle, onQuickApply }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, boxShadow: '0 20px 48px rgba(15, 23, 42, 0.14)' }}
      onClick={() => onSelect(job)}
      className={`cursor-pointer rounded-3xl border p-4 transition md:p-5 ${
        isActive
          ? 'border-cyan-500 ring-2 ring-cyan-200'
          : job.promoted
            ? 'border-amber-300 bg-linear-to-r from-amber-50/80 via-white to-amber-50/40 hover:border-amber-400'
            : 'border-slate-200 bg-white/90 hover:border-slate-300'
      } ${job.matchScore >= 90 ? 'high-match-glow' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            {job.promoted ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">
                <Sparkles size={11} /> Promoted Ad
              </span>
            ) : null}
            {job.trending ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">
                <Sparkles size={11} /> Trending Job
              </span>
            ) : null}
            {job.matchScore >= 90 ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                High Match
              </span>
            ) : null}
          </div>

          <h3 className="text-lg font-black text-slate-900">{job.title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-600">{job.company}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSaveToggle(job.id);
          }}
          className={`rounded-xl border p-2 transition ${
            isSaved
              ? 'border-rose-300 bg-rose-50 text-rose-600'
              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
          }`}
          aria-label="Save job"
        >
          <Heart size={15} className={isSaved ? 'fill-rose-500' : ''} />
        </motion.button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">{job.matchScore}% match</span>
        <span className="inline-flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
        <span className="inline-flex items-center gap-1"><Clock size={13} /> {job.posted}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {isHovered ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 overflow-hidden text-sm leading-relaxed text-slate-600"
          >
            {job.shortDescription}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-800">${job.salaryK}k</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onQuickApply(job);
          }}
          className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
        >
          Quick Apply <ArrowRight size={13} />
        </motion.button>
      </div>
    </motion.article>
  );
}

export default JobCard;
