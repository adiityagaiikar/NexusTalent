import React from 'react';
import { ArrowRight, Sparkles, Users } from '../../constants/icons';

function ReferralCard({ referralCode, stats, onCopy, onInvite }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            <Sparkles size={14} /> Invite Friends
          </p>
          <h3 className="mt-2 text-2xl font-black">Grow your network with referrals</h3>
          <p className="mt-2 max-w-xl text-sm text-slate-300">Share your referral code and earn visibility while helping friends join TalentNexus faster.</p>
        </div>
        <button onClick={onInvite} type="button" className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100">
          Invite Friends
        </button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Referral Code</p>
          <p className="mt-2 text-lg font-black">{referralCode || 'Generating...'}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Invites</p>
          <p className="mt-2 text-3xl font-black">{stats.invites || 0}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Successful Signups</p>
          <p className="mt-2 text-3xl font-black">{stats.successfulSignups || 0}</p>
        </div>
      </div>

      <button onClick={onCopy} type="button" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15">
        <ArrowRight size={14} /> Copy referral link
      </button>
    </section>
  );
}

export default ReferralCard;
