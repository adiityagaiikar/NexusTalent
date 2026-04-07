import React from 'react';

function JobSkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse rounded-3xl border border-slate-200 bg-white/80 p-5"
        >
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="mt-3 h-6 w-1/3 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-1/4 rounded bg-slate-200" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-slate-200" />
            <div className="h-6 w-16 rounded-full bg-slate-200" />
            <div className="h-6 w-16 rounded-full bg-slate-200" />
          </div>
          <div className="mt-5 h-10 w-full rounded-2xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export default JobSkeletonList;
