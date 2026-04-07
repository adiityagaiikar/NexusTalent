import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, Award, CheckCircle, Copy, Gift, Globe,
  Sparkles, Users, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Config ─────────────────────────────────────────────── */
const REWARD_MILESTONES = [
  { friends: 1, reward: '1 Week Pro',    color: 'text-sky-600',    fill: 'bg-sky-500' },
  { friends: 3, reward: '1 Month Pro',   color: 'text-indigo-600', fill: 'bg-indigo-500' },
  { friends: 7, reward: '3 Months Pro',  color: 'text-emerald-600',fill: 'bg-emerald-500' },
  { friends: 15, reward: 'Pro for Life', color: 'text-amber-600',  fill: 'bg-amber-400'  },
];

const MOCK_REFERRALS = [
  { id: 'r1', name: 'Priya S.', joined: '2 days ago', status: 'signed_up' },
  { id: 'r2', name: 'Ravi M.', joined: '5 days ago', status: 'signed_up' },
  { id: 'r3', name: 'Dev K.', joined: '1 week ago', status: 'signed_up' },
];

/* ─── Milestone tracker ──────────────────────────────────── */
function MilestoneTracker({ count }) {
  const current = REWARD_MILESTONES.findIndex((m) => count < m.friends);
  const active = current === -1 ? REWARD_MILESTONES.length - 1 : Math.max(0, current);
  const milestone = REWARD_MILESTONES[active];
  const prev = REWARD_MILESTONES[active - 1]?.friends || 0;
  const pct = Math.round(((count - prev) / (milestone.friends - prev)) * 100);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Goal</p>
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            Unlock <span className={milestone.color}>{milestone.reward}</span>
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Award size={22} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={`h-full rounded-full ${milestone.fill}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>

      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
        <span>{count} invited</span>
        <span>{milestone.friends} needed</span>
      </div>

      {/* All milestones row */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {REWARD_MILESTONES.map((m, i) => (
          <div
            key={m.friends}
            className={`rounded-xl border p-2.5 text-center transition-all ${
              count >= m.friends
                ? 'border-emerald-200 bg-emerald-50'
                : i === active
                ? 'border-indigo-200 bg-indigo-50'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <p className={`text-[10px] font-black ${count >= m.friends ? 'text-emerald-600' : i === active ? m.color : 'text-slate-400'}`}>
              {m.friends} {m.friends === 1 ? 'friend' : 'friends'}
            </p>
            <p className={`mt-0.5 text-[9px] font-semibold ${count >= m.friends ? 'text-emerald-600' : 'text-slate-400'}`}>
              {m.reward}
            </p>
            {count >= m.friends && (
              <CheckCircle size={10} className="mx-auto mt-1 text-emerald-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Referral code + share box ──────────────────────────── */
function ShareBox({ code, onCopy, copied }) {
  const tweetText = encodeURIComponent(
    `🚀 Just joined TalentNexus — the AI-powered career platform! Use my code ${code} to get a free Pro week. `
  );

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Referral Code</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 font-mono text-lg font-black tracking-widest text-indigo-700">
          {code}
        </div>
        <button
          type="button"
          onClick={onCopy}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border font-semibold transition-all duration-200 ${
            copied
              ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
              : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
          title="Copy code"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="done" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <CheckCircle size={16} />
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <Copy size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Share buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 py-2.5 text-xs font-bold text-sky-700 transition hover:bg-sky-100"
        >
          <Globe size={13} /> Share on X (Twitter)
        </a>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
        >
          <Copy size={13} /> Copy Link
        </button>
      </div>
    </div>
  );
}

/* ─── Referred friends list ──────────────────────────────── */
function ReferralList({ referrals }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
        <Users size={12} /> Friends You've Invited ({referrals.length})
      </h3>
      {referrals.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm font-semibold text-slate-400">
          No referrals yet — share your code!
        </p>
      ) : (
        <div className="space-y-2">
          {referrals.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700">
                {r.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{r.name}</p>
                <p className="text-[11px] text-slate-400">Joined {r.joined}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                <CheckCircle size={9} /> Signed Up
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Upgrade CTA ────────────────────────────────────────── */
function UpgradeCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-600 to-indigo-500 p-6 text-white">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <Sparkles size={20} className="mb-3" />
      <h3 className="font-black tracking-tight">Don't want to wait?</h3>
      <p className="mt-1 text-sm text-indigo-200">
        Upgrade to Pro now and unlock AI matchmaking, priority listings, and analytics.
      </p>
      <Link
        to="/student/pro"
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/30"
      >
        Upgrade to Pro <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
function ReferralDashboard() {
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  const referralCode = user.referralCode || 'TN-' + (user.name?.slice(0, 4).toUpperCase() || 'USER') + '24';

  const [referrals] = useState(MOCK_REFERRALS);
  const [manualCode, setManualCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const inviteCount = referrals.length;

  const copyCode = async () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const applyCode = () => {
    if (manualCode.trim().length < 4) {
      setCodeMsg('Please enter a valid referral code.');
      return;
    }
    setCodeMsg('✓ Code applied! Your friend will get a Pro week on signup.');
    setManualCode('');
  };

  return (
    <div className="animate-in mx-auto max-w-3xl space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
            <Gift size={11} className="mr-1 inline" /> Referral Program
          </p>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Invite Friends, Earn Pro
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Share your link. When friends sign up, unlock TalentNexus Pro — no credit card needed.
          </p>
        </div>
      </div>

      {/* Milestone tracker */}
      <MilestoneTracker count={inviteCount} />

      {/* Share box */}
      <ShareBox code={referralCode} onCopy={copyCode} copied={copied} />

      {/* Enter a friend's code */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Have a friend's code?
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            placeholder="e.g. PRIYA-TN24"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-sm uppercase tracking-widest text-slate-900 outline-none placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-50 transition"
          />
          <button
            type="button"
            onClick={applyCode}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
          >
            Apply
          </button>
        </div>
        <AnimatePresence>
          {codeMsg && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-2 text-xs font-semibold ${codeMsg.startsWith('✓') ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {codeMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Referral list */}
      <ReferralList referrals={referrals} />

      {/* Upgrade CTA */}
      <UpgradeCTA />
    </div>
  );
}

export default ReferralDashboard;
