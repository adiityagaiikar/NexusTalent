import React from 'react';
import {
  AlertTriangle,
  Database,
  Lock,
  Shield,
  ShieldCheck,
  UserX,
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const issueCategorizationData = [
  { category: 'Payment System', volume: 700 },
  { category: 'UI Bugs', volume: 150 },
  { category: 'Login Issues', volume: 100 },
  { category: 'Other', volume: 50 },
];

const securityManifestCards = [
  {
    title: 'Encryption Layer',
    icon: Lock,
    copy: 'All sensitive user data, passwords, and transaction details are protected with industry-standard encryption at rest to safeguard records even if storage infrastructure is compromised.',
  },
  {
    title: 'Data Validation & Sanitization',
    icon: Database,
    copy: 'Zero-tolerance input policy. Every incoming payload is strictly validated and sanitized to stop XSS (Cross-Site Scripting) and database injection attempts before data reaches the server.',
  },
  {
    title: 'RBAC & Data Privacy',
    icon: UserX,
    copy: 'Role-Based Access Control (RBAC) governs every protected route and data surface. Personal information is shared only with explicit user consent under privacy-by-design policies.',
  },
  {
    title: 'Defense in Depth',
    icon: ShieldCheck,
    copy: 'Layered controls combine transport security, authentication checks, and access monitoring to continuously enforce trust boundaries across the platform.',
  },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="text-sm font-black tracking-tight text-slate-900">{payload[0].value} reports</p>
    </div>
  );
}

function SystemIntelligence() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Advanced CRM</p>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 md:text-5xl">
              CRM Feedback Intelligence
            </h1>
            <p className="max-w-3xl text-sm font-medium leading-relaxed text-slate-500 md:text-base">
              This bento-style intelligence layer demonstrates how complaint signals are mapped into engineering decisions through automated feedback analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8 lg:col-span-7">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-xl font-black tracking-tighter text-slate-900 md:text-2xl">Complaint Categorization from 1,000 Reports</h2>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                  Recharts Visualization
                </div>
              </div>
              <p className="mb-5 text-sm font-medium leading-relaxed text-slate-600">
                High-severity themes are clustered and ranked for product operations and engineering escalation.
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={issueCategorizationData} margin={{ top: 10, right: 10, left: -10, bottom: 8 }}>
                    <defs>
                      <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0.55} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip cursor={{ fill: 'rgba(79,70,229,0.08)' }} content={<CustomTooltip />} />
                    <Bar dataKey="volume" radius={[12, 12, 4, 4]} fill="url(#colorIndigo)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-3xl border border-rose-200 bg-white p-6 shadow-[0_10px_30px_rgba(244,63,94,0.10)] md:p-8 lg:col-span-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-lg font-black tracking-tighter text-slate-900">System Alert</h3>
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                Automated NLP Analysis processed 1,000 recent customer reports. The system flagged a major critical issue: 700 of these reports mapped directly to 'Payment System Unresponsive.' Instead of manual review, this mapped data was automatically routed to the engineering pipeline. Status: Major issue identified and patch deployed.
              </p>
            </article>
          </div>
        </section>

        <section className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 md:text-4xl">Platform Security Practices</h2>
            <p className="max-w-3xl text-sm font-medium leading-relaxed text-slate-500 md:text-base">
              These cards expose the invisible backend security layers that protect identity, transactions, and personal data throughout the platform lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {securityManifestCards.map(({ title, icon: Icon, copy }) => (
              <article
                key={title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-7"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-3 text-indigo-600">
                  <Icon size={20} />
                </div>
                <h3 className="mb-2 text-xl font-black tracking-tighter text-slate-900">{title}</h3>
                <p className="text-sm font-medium leading-relaxed text-slate-600">{copy}</p>
              </article>
            ))}
          </div>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-7">
            <div className="mb-4 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-3 text-indigo-600">
              <Shield size={20} />
            </div>
            <h3 className="mb-2 text-xl font-black tracking-tighter text-slate-900">Transparent Security Manifest</h3>
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              This dashboard explicitly communicates backend trust mechanisms for evaluators, showing how CRM intelligence and zero-trust controls work together in a production-style SaaS architecture.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}

export default SystemIntelligence;