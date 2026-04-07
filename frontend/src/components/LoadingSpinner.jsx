import React from 'react';
import { Sparkles } from '../constants/icons';

function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-100 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-cyan-100 blur-2xl" />

        <div className="relative">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-widest text-indigo-600">
            TalentNexus
          </p>
          <p className="mt-1 text-center text-sm text-slate-500">Loading a faster experience...</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;