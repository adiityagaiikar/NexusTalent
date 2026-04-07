import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import JobCard from './JobCard';

function JobListPanel({ jobs, activeId, savedIds, onSelect, onSaveToggle, onQuickApply }) {
  return (
    <section className="space-y-3">
      <AnimatePresence mode="popLayout">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <JobCard
              job={job}
              isActive={activeId === job.id}
              isSaved={savedIds.includes(job.id)}
              onSelect={onSelect}
              onSaveToggle={onSaveToggle}
              onQuickApply={onQuickApply}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}

export default JobListPanel;
