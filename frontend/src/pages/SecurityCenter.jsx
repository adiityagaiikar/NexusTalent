import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, Lock, Shield, Sparkles, Zap } from '../constants/icons';

function SecurityCenter() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false);
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  const role = user?.role || 'student';

  const roleCapabilities = useMemo(() => {
    if (role === 'admin' || role === 'employer' || role === 'recruiter') {
      return [
        'View candidate analytics and funnel controls',
        'Manage hiring workflow and shortlists',
        'Review payment and billing summaries',
      ];
    }

    return [
      'Manage personal profile and privacy settings',
      'Track applications and referral activity',
      'Control notification and follow-up preferences',
    ];
  }, [role]);

  const auditTrail = [
    { id: 'a1', event: 'Login success', actor: user?.email || 'student@talentnexus.com', time: 'Today, 10:14 AM' },
    { id: 'a2', event: 'Profile updated', actor: user?.name || 'Student User', time: 'Today, 09:31 AM' },
    { id: 'a3', event: 'Payment session initiated', actor: 'Checkout Widget', time: 'Yesterday, 06:42 PM' },
    { id: 'a4', event: 'Role gate verification', actor: 'RBAC middleware', time: 'Yesterday, 06:41 PM' },
  ];

  return (
    <div className="animate-in space-y-6 pb-6">
      <section className="rounded-3xl border border-slate-200 bg-linear-to-br from-white to-sky-50 p-6 shadow-sm">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          <Shield size={14} /> Security Control Center
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Trust, Access & Payment Protection</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Frontend strategy surface for role-based access visibility, MFA simulation, audit evidence, and tokenized payment messaging.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Role-based View</p>
          <p className="mt-1 text-lg font-black text-slate-900">Current Role: {role}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {roleCapabilities.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">MFA Placeholder</p>
          <p className="mt-1 text-sm text-slate-600">
            Demonstrates second-factor verification UX before sensitive actions.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Multi-factor authentication</p>
              <p className="text-xs text-slate-500">Email OTP or authenticator app (mock flow)</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!mfaEnabled) {
                  setShowVerifyPrompt(true);
                  return;
                }
                setMfaEnabled(false);
              }}
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                mfaEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {mfaEnabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Audit Trail UI</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-130 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                <th className="px-2 py-2">Event</th>
                <th className="px-2 py-2">Actor</th>
                <th className="px-2 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditTrail.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-2 py-3 font-semibold text-slate-800">{row.event}</td>
                  <td className="px-2 py-3 text-slate-600">{row.actor}</td>
                  <td className="px-2 py-3 text-slate-500">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Tokenized Payment Messaging</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Lock size={14} /> Card data never stored in plain text</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Zap size={14} /> One-time payment tokens per transaction</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><AlertCircle size={14} /> Suspicious checkout attempts flagged</p>
          </div>
        </div>
      </section>

      {showVerifyPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">MFA Verification (Mock)</p>
            <h3 className="mt-2 text-xl font-black text-slate-900">Enter verification code</h3>
            <p className="mt-2 text-sm text-slate-600">Use code 123456 to simulate successful second-factor verification.</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMfaEnabled(true);
                  setShowVerifyPrompt(false);
                }}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={() => setShowVerifyPrompt(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-linear-to-r from-emerald-50 to-sky-50 p-5 shadow-sm">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          <Sparkles size={14} /> Trust Evidence
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-700">
          Verified employer credentials, role-gated routes, and secure checkout messaging increase platform credibility for both students and recruiters.
        </p>
      </section>
    </div>
  );
}

export default SecurityCenter;
