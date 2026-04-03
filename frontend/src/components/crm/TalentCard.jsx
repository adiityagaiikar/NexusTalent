import React from 'react';
import Badge from './Badge';
import MatchScore from './MatchScore';
import { CheckCircle, Mail, MessageSquare, Star, Flame, Zap } from '../../constants/icons';

const STATUS_TONE = {
  Active: 'success',
  Dormant: 'danger',
  'Needs Follow-up': 'warning',
};

function TalentCard({ candidate, onNudge, compact = false }) {
  const hasPremiumStyling = candidate.isFinalist;

  return (
    <article
      className={`group rounded-3xl border bg-white/85 p-5 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/85 ${
        hasPremiumStyling
          ? 'border-amber-300/70 shadow-amber-100 ring-1 ring-amber-200/70 dark:border-amber-500/60 dark:ring-amber-500/40'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="relative shrink-0">
          <img
            src={candidate.img}
            alt={candidate.name}
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-700"
          />
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{candidate.name}</h4>
            <CheckCircle size={16} className="text-sky-500" />
            <Badge tone={STATUS_TONE[candidate.status]}>{candidate.status}</Badge>
          </div>

          <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{candidate.role}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {candidate.isTopPick && (
              <Badge tone="accent">
                <Flame size={12} /> Top Pick for You
              </Badge>
            )}
            {candidate.isFastResponder && (
              <Badge tone="warning">
                <Zap size={12} /> Fast Responder
              </Badge>
            )}
            {candidate.isFinalist && (
              <>
                <Badge tone="success">Highly Vetted</Badge>
                <Badge tone="neutral">Finalist (Previous Round)</Badge>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-300">
            Last Active: {candidate.lastActive}
          </div>
        </div>

        <div className="flex w-full flex-row items-end justify-between gap-3 border-t border-slate-100 pt-3 md:w-auto md:flex-col md:border-none md:pt-0 dark:border-slate-700">
          <div className="text-right">
            <MatchScore score={candidate.matchScore} breakdown={candidate.scoreBreakdown} />
            {!compact && (
              <p className="mt-1 text-xs font-semibold text-slate-400">
                {candidate.exp} experience · {candidate.rate}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNudge(candidate)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {candidate.contactPreference === 'whatsapp' ? <MessageSquare size={14} /> : <Mail size={14} />} Nudge
            </button>
            {!compact && (
              <div className="inline-flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star size={14} fill="currentColor" /> {candidate.rating}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default TalentCard;
