import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, Briefcase, CheckCircle, Copy, ExternalLink,
  Globe, Mail, Sparkles, Star,
} from 'lucide-react';

/* ─── Mock / Prop Fallbacks ──────────────────────────────── */
const DEMO_PROFILE = {
  name: 'Alex Rivera',
  headline: 'Full-Stack Engineer · Open to Opportunities',
  bio: 'Building at the intersection of design and engineering. 3 yrs shipping React/Node products. Love OSS and clean code.',
  skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'GraphQL'],
  analytics: { profileViews: 1284, jobClicks: 47 },
  referralCode: 'ALEX-TN24',
  role: 'Full-Stack Engineer',
  matchScore: 92,
  img: `https://api.dicebear.com/7.x/notionists/svg?seed=Alex`,
};

/* ─── Share helpers ─────────────────────────────────────── */
async function handleShare(profile) {
  const url = window.location.href;
  const text = `Check out ${profile.name}'s profile on TalentNexus!`;
  if (navigator.share) {
    try { await navigator.share({ title: profile.name, text, url }); } catch { /* cancelled */ }
  } else {
    await navigator.clipboard.writeText(url);
  }
}

/* ─── Skill Pill ─────────────────────────────────────────── */
function SkillPill({ label }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
      {label}
    </span>
  );
}

/* ─── Circular score badge ───────────────────────────────── */
function ScoreBadge({ score }) {
  const r = 22, c = 2 * Math.PI * r;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="28" cy="28" r={r} stroke="#f1f5f9" strokeWidth="4.5" fill="none" />
        <circle cx="28" cy="28" r={r} stroke={color} strokeWidth="4.5" fill="none"
          strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <span className="absolute text-[11px] font-black text-slate-800">{score}%</span>
    </div>
  );
}

/* ─── CTA Banner (for non-logged-in visitors) ───────────── */
function CTABanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5 text-white">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-6 left-24 h-20 w-20 rounded-full bg-white/5" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black tracking-tight">Powered by TalentNexus</p>
          <p className="mt-0.5 text-sm text-indigo-200">
            Build your own AI-matched profile — completely free
          </p>
        </div>
        <Link
          to="/signup"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/30 bg-white/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          Create Yours Free <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
function PublicProfileCard({ profile: propProfile, isLoggedIn = false }) {
  const profile = propProfile || DEMO_PROFILE;
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out ${profile.name}'s profile on TalentNexus! ${window.location.href}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener');
  };

  return (
    <div className="animate-in mx-auto max-w-2xl space-y-4">

      {/* ── Hero Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
      >
        {/* top indigo stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400" />

        <div className="p-7">
          {/* Avatar + Meta row */}
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <img
                src={profile.img || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`}
                alt={profile.name}
                loading="lazy"
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-slate-100"
              />
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">{profile.name}</h1>
                <CheckCircle size={16} className="text-indigo-400" />
              </div>
              <p className="mt-0.5 text-sm text-slate-500">{profile.headline}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
                  <Briefcase size={10} /> {profile.role}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  <Star size={10} fill="currentColor" /> Top Match
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <ScoreBadge score={profile.matchScore || 92} />
              <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-widest text-slate-400">Match</p>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-600">
              {profile.bio}
            </p>
          )}

          {/* Skills */}
          <div className="mt-5">
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {(profile.skills || []).map((s) => <SkillPill key={s} label={s} />)}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
            {[
              { label: 'Profile Views', value: profile.analytics?.profileViews?.toLocaleString() || '—' },
              { label: 'Job Clicks', value: profile.analytics?.jobClicks || '—' },
              { label: 'Referral Code', value: profile.referralCode || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 py-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-0.5 text-base font-black tracking-tight text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Share footer */}
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-3">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle size={12} /> Copied!
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                  <Copy size={12} /> Copy Link
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={shareToTwitter}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            <Globe size={12} /> Share
          </button>

          <button
            type="button"
            onClick={() => handleShare(profile)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
          >
            <ExternalLink size={12} /> Share Profile
          </button>
        </div>
      </motion.div>

      {/* ── CTA for guests ── */}
      {!isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CTABanner />
        </motion.div>
      )}
    </div>
  );
}

export default PublicProfileCard;
