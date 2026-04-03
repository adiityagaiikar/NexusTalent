import React from 'react';

function getScoreStyle(score) {
  if (score >= 80) {
    return {
      text: 'text-emerald-700',
      bar: 'bg-emerald-500',
      track: 'bg-emerald-100',
      ring: 'ring-emerald-200',
    };
  }

  if (score >= 50) {
    return {
      text: 'text-amber-700',
      bar: 'bg-amber-500',
      track: 'bg-amber-100',
      ring: 'ring-amber-200',
    };
  }

  return {
    text: 'text-rose-700',
    bar: 'bg-rose-500',
    track: 'bg-rose-100',
    ring: 'ring-rose-200',
  };
}

function MatchScore({ score, breakdown }) {
  const style = getScoreStyle(score);

  return (
    <div className="group relative flex items-center gap-3">
      <div className={`h-2 w-28 overflow-hidden rounded-full ${style.track}`}>
        <div
          className={`h-full rounded-full ${style.bar} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-bold ${style.text}`}>{score}%</span>

      <button
        type="button"
        className={`hidden rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset md:inline ${style.ring} ${style.text}`}
      >
        Why?
      </button>

      <div className="pointer-events-none absolute left-0 top-8 z-20 hidden min-w-52 rounded-xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-600 shadow-xl backdrop-blur-sm group-hover:block dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
        <p className="mb-1 font-semibold text-slate-800 dark:text-slate-100">Score Breakdown</p>
        <p>Skills Fit: {breakdown.skills}%</p>
        <p>Culture Fit: {breakdown.culture}%</p>
        <p>Responsiveness: {breakdown.responsiveness}%</p>
      </div>
    </div>
  );
}

export default MatchScore;
