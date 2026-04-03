import React from 'react';
import { CheckCircle2, Clock3, Circle, Sparkles } from '../constants/icons';

const APPLICATIONS = [
  {
    id: 1,
    company: 'Google',
    role: 'Frontend Engineer Intern',
    stages: ['Applied', 'Resume Viewed by Google', 'Interview Scheduled'],
    currentStage: 2,
  },
  {
    id: 2,
    company: 'Meta',
    role: 'Product Designer',
    stages: ['Applied', 'Portfolio Reviewed', 'Hiring Team Discussion'],
    currentStage: 1,
  },
  {
    id: 3,
    company: 'Stripe',
    role: 'Full Stack Developer',
    stages: ['Applied', 'Technical Assessment Sent', 'Interview Pending'],
    currentStage: 0,
  },
];

function TimelineStage({ label, isDone, isCurrent }) {
  return (
    <div className="flex items-center gap-3">
      {isDone ? (
        <CheckCircle2 size={18} className="text-emerald-500" />
      ) : isCurrent ? (
        <Clock3 size={18} className="text-sky-600" />
      ) : (
        <Circle size={18} className="text-slate-300" />
      )}
      <p className={`text-sm font-semibold ${isDone || isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
        {label}
      </p>
    </div>
  );
}

function ApplicationTracker() {
  return (
    <div className="animate-in pb-8">
      <div className="mb-6 rounded-3xl border border-sky-100 bg-sky-50 p-5">
        <p className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          <Sparkles size={14} /> Candidate Workspace
        </p>
        <h1 className="text-2xl font-black text-slate-900 md:text-3xl">Application Tracker</h1>
        <p className="mt-2 text-sm text-slate-600">Track every application exactly like order-tracking, from submission to final outcome.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {APPLICATIONS.map((application) => (
          <article key={application.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{application.company}</p>
              <h3 className="text-lg font-black text-slate-900">{application.role}</h3>
            </div>

            <div className="space-y-3">
              {application.stages.map((stage, index) => (
                <TimelineStage
                  key={stage}
                  label={stage}
                  isDone={index < application.currentStage}
                  isCurrent={index === application.currentStage}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ApplicationTracker;
