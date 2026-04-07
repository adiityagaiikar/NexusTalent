import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from '../../constants/icons';

function SectionLabel({ children }) {
  return <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{children}</p>;
}

function JobFiltersSidebar({
  categories,
  experienceLevels,
  skillPool,
  filters,
  setFilters,
  onReset,
}) {
  const toggleSkill = (skill) => {
    setFilters((prev) => {
      const selected = prev.skills.includes(skill)
        ? prev.skills.filter((item) => item !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: selected };
    });
  };

  const toggleExperience = (level) => {
    setFilters((prev) => {
      const selected = prev.experience.includes(level)
        ? prev.experience.filter((item) => item !== level)
        : [...prev.experience, level];
      return { ...prev, experience: selected };
    });
  };

  return (
    <aside className="glass-panel sticky top-24 rounded-3xl border border-white/70 p-5 shadow-xl shadow-slate-900/5">
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Filter size={15} /> Filters
        </p>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 transition hover:text-slate-800"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <SectionLabel>Role Category</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = filters.category === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, category }))}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-cyan-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <SectionLabel>Salary Range</SectionLabel>
          <input
            type="range"
            min={60}
            max={220}
            step={5}
            value={filters.salaryK}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, salaryK: Number(event.target.value) }))
            }
            className="w-full accent-cyan-600"
          />
          <div className="mt-2 text-sm font-semibold text-slate-700">Up to ${filters.salaryK}k</div>
        </div>

        <div>
          <SectionLabel>Experience Level</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {experienceLevels.map((level) => {
              const active = filters.experience.includes(level);
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => toggleExperience(level)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <div>
            <SectionLabel>Remote Only</SectionLabel>
            <p className="text-xs text-slate-500">Only show remote openings</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, remoteOnly: !prev.remoteOnly }))}
            className={`relative h-7 w-12 rounded-full transition ${
              filters.remoteOnly ? 'bg-cyan-600' : 'bg-slate-300'
            }`}
            aria-label="Toggle remote only"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                filters.remoteOnly ? 'left-6' : 'left-1'
              }`}
            />
          </motion.button>
        </div>

        <div>
          <SectionLabel>Skills</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {skillPool.map((skill) => {
              const active = filters.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-cyan-100 text-cyan-900 ring-1 ring-cyan-300'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default JobFiltersSidebar;
