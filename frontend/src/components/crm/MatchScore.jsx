import React from 'react';

function getScoreColor(score) {
  if (score >= 80) return { stroke: '#10b981', text: 'text-emerald-700', bg: 'bg-emerald-50' };
  if (score >= 55) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50' };
  return { stroke: '#f43f5e', text: 'text-rose-600', bg: 'bg-rose-50' };
}

function MatchScore({ score = 0, breakdown, size = 52 }) {
  const { stroke, text, bg } = getScoreColor(score);
  const radius = (size - 8) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="group relative inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="#f1f5f9" strokeWidth="4" fill="none"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={stroke} strokeWidth="4" fill="none"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-[11px] font-black ${text}`}
        >
          {score}%
        </span>
      </div>

      {/* Breakdown tooltip */}
      {breakdown && (
        <div
          className={`pointer-events-none absolute -top-2 left-1/2 z-30 hidden min-w-[168px] -translate-x-1/2 -translate-y-full rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-xl group-hover:block`}
        >
          <p className="mb-2 font-semibold text-slate-800">Score Breakdown</p>
          {[
            { label: 'Skills Fit', val: breakdown.skills },
            { label: 'Culture Fit', val: breakdown.culture },
            { label: 'Responsiveness', val: breakdown.responsiveness },
          ].map(({ label, val }) => (
            <div key={label} className="mb-1.5">
              <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-0.5">
                <span>{label}</span><span className={text}>{val}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${val}%`, background: stroke }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchScore;
