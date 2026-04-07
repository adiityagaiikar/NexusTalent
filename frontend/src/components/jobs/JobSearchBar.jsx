import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Search, Sparkles } from '../../constants/icons';

function JobSearchBar({ value, onChange, onSubmit, recentSearches, trendingRoles }) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return trendingRoles.slice(0, 5);
    return trendingRoles
      .filter((role) => role.toLowerCase().includes(q))
      .slice(0, 6);
  }, [trendingRoles, value]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [value]);

  const handleKeyDown = (event) => {
    if (!isOpen && event.key === 'ArrowDown') {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      onSubmit(suggestions[highlightedIndex]);
      setIsOpen(false);
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="glass-panel rounded-3xl border border-white/60 p-2 shadow-xl shadow-cyan-900/10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/70">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search role, company, or skills..."
              className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              aria-label="Search jobs"
            />
            <span className="hidden rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-500 md:inline-flex">
              / to focus
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onSubmit(value)}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Search
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute z-30 mt-3 w-full rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-2xl backdrop-blur"
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <Sparkles size={14} /> Suggestions
            </div>
            <div className="space-y-1">
              {suggestions.length ? (
                suggestions.map((item, idx) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onSubmit(item);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                      highlightedIndex === idx
                        ? 'bg-cyan-50 text-cyan-900'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item}</span>
                    <span className="text-xs text-slate-400">Enter</span>
                  </button>
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">No suggestions found.</p>
              )}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        onSubmit(item);
                        setIsOpen(false);
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      <Clock size={12} /> {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Trending Roles</p>
                <div className="flex flex-wrap gap-2">
                  {trendingRoles.slice(0, 5).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        onSubmit(role);
                        setIsOpen(false);
                      }}
                      className="rounded-full bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-900"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default JobSearchBar;
