import React, { useState } from 'react';
import PaymentButton from '../components/PaymentButton';
import { Eye, ShieldCheck, Sparkles, TrendingUp } from '../constants/icons';

function StudentUpgrade() {
  const [statusVersion, setStatusVersion] = useState(1);
  const [proActivated, setProActivated] = useState(false);

  const refreshApplicationStatus = () => {
    setStatusVersion((prev) => prev + 1);
    setProActivated(true);
  };

  return (
    <div className="animate-in pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-7 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
            <Sparkles size={14} /> Student Pro Membership
          </p>
          <h1 className="text-3xl font-black leading-tight md:text-4xl">Unlock Your Potential</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
            Stand out in employer searches, get recruiter visibility signals, and optimize your profile with deep AI guidance.
          </p>

          <div className="mt-6 inline-flex items-end gap-1">
            <span className="text-5xl font-black">$12</span>
            <span className="mb-1 text-sm font-semibold text-slate-300">/month</span>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <Eye size={18} />
          </div>
          <h3 className="text-base font-black text-slate-900">See Who Viewed Your Profile</h3>
          <p className="mt-2 text-sm text-slate-500">Get high-signal visibility into recruiter and employer activity.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <TrendingUp size={18} />
          </div>
          <h3 className="text-base font-black text-slate-900">Priority Discovery Ranking</h3>
          <p className="mt-2 text-sm text-slate-500">Increase your placement in employer discovery and shortlist workflows.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <ShieldCheck size={18} />
          </div>
          <h3 className="text-base font-black text-slate-900">AI Resume Insights</h3>
          <p className="mt-2 text-sm text-slate-500">Actionable recommendations to improve interview conversion rate.</p>
        </article>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Secure Checkout</p>
            <h2 className="text-2xl font-black text-slate-900">Start Student Pro</h2>
            <p className="mt-1 text-sm text-slate-500">Razorpay checkout with secure server-side order creation and signature verification.</p>
            <p className="mt-2 text-xs font-semibold text-slate-400">Application status version: {statusVersion}</p>
          </div>

          <PaymentButton amountRupees={12} onStatusRefresh={refreshApplicationStatus} onPaymentSuccess={() => setProActivated(true)} />
        </div>

        {proActivated && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            Student Pro unlocked. Your application visibility status has been refreshed.
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentUpgrade;
