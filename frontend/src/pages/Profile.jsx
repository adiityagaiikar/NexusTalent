import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ReferralCard from '../components/marketing/ReferralCard';
import { Clock3, ExternalLink, Eye, Sparkles, Target, Users, Zap } from '../constants/icons';

function Profile() {
  const [user, setUser] = useState(null);
  const [referralStats, setReferralStats] = useState({ invites: 0, successfulSignups: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [reminders, setReminders] = useState([
    { id: 'r1', label: 'Interview prep for Platform Engineer role', due: 'Today 7:30 PM', type: 'urgent' },
    { id: 'r2', label: 'Follow-up mail to recruiter at Linear Labs', due: 'Tomorrow 10:00 AM', type: 'normal' },
    { id: 'r3', label: 'Update portfolio project screenshots', due: 'Apr 12', type: 'normal' },
  ]);
  const [automationRules, setAutomationRules] = useState({
    recruiterFollowUp: true,
    staleApplicationNudge: true,
    weeklyDigest: false,
  });
  const [automationQueue, setAutomationQueue] = useState([
    { id: 'q1', name: 'Recruiter check-in draft', eta: 'Today 6:30 PM' },
    { id: 'q2', name: 'Stale application reminder', eta: 'Tomorrow 9:00 AM' },
  ]);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const storedUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        if (mounted) setUser(storedUser);

        const response = await api.get('/api/auth/me');
        if (!mounted) return;

        setUser(response.data.data);

        try {
          const referralResponse = await api.get('/api/users/me/referrals');
          if (mounted) setReferralStats(referralResponse.data.data.referralStats || referralResponse.data.data);
        } catch {
          // Referral stats are optional for older accounts.
        }
      } catch {
        if (mounted) {
          setUser(JSON.parse(localStorage.getItem('authUser') || '{}'));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const referralCode = user?.referralCode || 'N/A';
  const referralUrl = `${window.location.origin}/signup?ref=${referralCode}`;
  const profileChecks = [
    Boolean(user?.name),
    Boolean(user?.email),
    Boolean(user?.headline),
    Boolean(user?.bio),
    Boolean(user?.skills?.length),
  ];
  const profileScore = Math.round((profileChecks.filter(Boolean).length / profileChecks.length) * 100);
  const recommendedActions = [
    'Add 3 role-specific keywords to your profile headline',
    'Upload one detailed project case study',
    'Enable referral sharing to improve profile reach',
  ];
  const recommendedJobs = [
    { id: 'j1', role: 'Frontend Engineer', reason: 'Strong React + UI fit' },
    { id: 'j2', role: 'Product Analyst', reason: 'Profile indicates analytics interest' },
    { id: 'j3', role: 'Platform Engineer', reason: 'High recruiter demand this week' },
  ];
  const followUpTemplates = [
    'Shortlisted recruiter follow-up',
    'Application status ping after 5 days',
    'Portfolio update announcement',
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const inviteFriends = async () => {
    if (!user?.referralCode) return;
    await api.post('/api/users/referrals/invite', { referralCode: user.referralCode }).catch(() => {});
    await copyLink();
  };

  const toggleRule = (ruleKey) => {
    setAutomationRules((prev) => ({ ...prev, [ruleKey]: !prev[ruleKey] }));
  };

  const runTemplate = (template) => {
    const id = `q-${Date.now()}`;
    setAutomationQueue((prev) => [
      { id, name: `${template} queued`, eta: 'In 10 minutes' },
      ...prev,
    ].slice(0, 4));
  };

  if (loading) {
    return <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />;
  }

  return (
    <div className="space-y-6 py-4">
      <section className="rounded-3xl border border-slate-200 bg-linear-to-br from-white to-cyan-50 p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              <Sparkles size={14} /> Your Profile
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">{user?.name || 'Your account'}</h1>
            <p className="mt-2 text-slate-600">{user?.headline || 'Review your public portfolio, referrals, and upgrade opportunities.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={copyLink} type="button" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              <ExternalLink size={14} /> {copied ? 'Link copied' : 'Copy referral link'}
            </button>
            <button onClick={inviteFriends} type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              <Users size={14} /> Invite friends
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Referral Code</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{referralCode}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Invite Link</p>
            <p className="mt-2 break-all text-sm font-semibold text-slate-700">{referralUrl}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Public Views</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{user?.analytics?.profileViews || 0}</p>
          </div>
        </div>
      </section>

      <ReferralCard
        referralCode={referralCode}
        stats={referralStats}
        onCopy={copyLink}
        onInvite={inviteFriends}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Profile Score</p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{profileScore}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${profileScore}%` }} />
          </div>
          <ul className="mt-4 space-y-2">
            {recommendedActions.map((item) => (
              <li key={item} className="text-sm text-slate-600">• {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Clock3 size={14} /> Reminder Center
          </p>
          <div className="mt-4 space-y-2">
            {reminders.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{item.due}</span>
                  <button
                    type="button"
                    onClick={() => setReminders((prev) => prev.filter((reminder) => reminder.id !== item.id))}
                    className="text-xs font-semibold text-sky-700 hover:underline"
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Zap size={14} /> Personalized Recommendations
          </p>
          <div className="mt-4 space-y-2">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-800">{job.role}</p>
                <p className="text-xs text-slate-500">{job.reason}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Zap size={14} /> Follow-up Automation
          </p>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
            {automationQueue.length} queued actions
          </span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Automation Rules</p>
            <div className="mt-3 space-y-2">
              {[
                { key: 'recruiterFollowUp', label: 'Auto follow-up to recruiters' },
                { key: 'staleApplicationNudge', label: 'Nudge stale applications' },
                { key: 'weeklyDigest', label: 'Weekly progress digest' },
              ].map((rule) => (
                <button
                  key={rule.key}
                  type="button"
                  onClick={() => toggleRule(rule.key)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
                    automationRules[rule.key]
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{rule.label}</span>
                  <span>{automationRules[rule.key] ? 'On' : 'Off'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Template Triggers</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {followUpTemplates.map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => runTemplate(template)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Run {template}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {automationQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <Clock3 size={12} /> {item.eta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500"><Eye size={14} /> Public Profile</div>
          <p className="mt-3 text-sm text-slate-600">Share your public portfolio and track how often recruiters view it.</p>
          <Link to={`/user/${user?._id || user?.id || ''}`} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            Open public profile <ExternalLink size={14} />
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500"><Target size={14} /> Upgrade Prompt</div>
          <p className="mt-3 text-sm text-slate-600">Unlock profile boosts, richer analytics, and recruiter priority placement with Pro.</p>
          <Link to="/student/pro" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Upgrade to Pro
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Profile;