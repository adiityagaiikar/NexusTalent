import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ReferralCard from '../components/marketing/ReferralCard';
import { ExternalLink, Eye, Sparkles, Target, Users } from '../constants/icons';

function Profile() {
  const [user, setUser] = useState(null);
  const [referralStats, setReferralStats] = useState({ invites: 0, successfulSignups: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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