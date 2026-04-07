import React from 'react';
import MatchScore from './MatchScore';
import { CheckCircle, Mail, MessageSquare, Star, Flame, Zap, ArrowUpRight } from '../../constants/icons';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Dormant: 'bg-slate-100 text-slate-500 border-slate-200',
  'Needs Follow-up': 'bg-amber-50 text-amber-700 border-amber-200',
};

function TalentCard({ candidate, onNudge, compact = false }) {
  const isHighlight = candidate.isFinalist;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-200 will-change-transform hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] ${
        isHighlight
          ? 'border-amber-200 shadow-[0_4px_20px_rgba(245,158,11,0.10)]'
          : 'border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
      }`}
    >
      {/* finalist shimmer bar */}
      {isHighlight && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300" />
      )}

      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={candidate.img}
            alt={candidate.name}
            loading="lazy"
            className="h-14 w-14 rounded-xl object-cover ring-2 ring-slate-100"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">{candidate.name}</h3>
            <CheckCircle size={14} className="text-indigo-400" />
            {/* Status pill */}
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                STATUS_STYLES[candidate.status] || STATUS_STYLES.Active
              }`}
            >
              {candidate.status}
            </span>
          </div>

          <p className="mt-0.5 text-sm text-slate-500">{candidate.role}</p>

          {/* Trait badges */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {candidate.isTopPick && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                <Flame size={10} /> Top Pick
              </span>
            )}
            {candidate.isFastResponder && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                <Zap size={10} /> Fast Responder
              </span>
            )}
            {candidate.isFinalist && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                ✓ Highly Vetted
              </span>
            )}
          </div>

          {/* Skills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {candidate.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 transition-colors hover:bg-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>

          {!compact && (
            <p className="mt-2 text-[11px] font-medium text-slate-400">
              {candidate.exp} exp · {candidate.rate} · Last active: {candidate.lastActive}
            </p>
          )}
        </div>

        {/* Score + Actions Column */}
        <div className="flex shrink-0 flex-col items-end justify-between gap-3">
          <MatchScore score={candidate.matchScore} breakdown={candidate.scoreBreakdown} size={52} />

          {!compact && (
            <div className="inline-flex items-center gap-1 text-sm font-bold text-amber-400">
              <Star size={13} fill="currentColor" /> {candidate.rating}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {/* Nudge */}
            <button
              type="button"
              onClick={() => onNudge(candidate)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-all duration-150 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {candidate.contactPreference === 'whatsapp' ? <MessageSquare size={12} /> : <Mail size={12} />}
              Nudge
            </button>

            {/* Profile link */}
            <Link
              to={`/user/${candidate.id}`}
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-600 bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
            >
              Profile <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TalentCard;
