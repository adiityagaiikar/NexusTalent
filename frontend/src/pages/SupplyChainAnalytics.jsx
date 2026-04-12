import React from 'react';
import { AlertTriangle, PackageSearch, Truck, Workflow } from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const pipelineVelocityData = [
  { stage: 'Sourcing', avgDays: 2, benchmarkDays: 3 },
  { stage: 'Screening', avgDays: 4, benchmarkDays: 5 },
  { stage: 'Technical Interview', avgDays: 14, benchmarkDays: 6 },
  { stage: 'Offer', avgDays: 3, benchmarkDays: 4 },
];

const bottleneckMessage =
  'Logistical Bottleneck Detected: Candidates are stagnating in the Technical Round. Recommend automating initial code assessments to improve supply chain velocity.';

const inventoryHealth = [
  {
    title: 'Procurement Rate',
    value: 'New Talent Intake: +450 profiles/week.',
    detail: 'Intake remains above target with stable week-over-week inflow.',
    icon: PackageSearch,
  },
  {
    title: 'Active Inventory',
    value: '78% of the Talent Pool is actively seeking work (High Liquidity).',
    detail: 'Healthy market liquidity supports faster employer match cycles.',
    icon: Workflow,
  },
  {
    title: 'Stale Inventory',
    value: '22% Dormant Profiles. Triggering automated re-engagement emails.',
    detail: 'Reactivation automation is live to reduce profile dormancy drag.',
    icon: Truck,
  },
];

const quickActionGroups = [
  {
    label: 'Promotions',
    status: 'Ready',
    statusClass: 'bg-emerald-500',
    actions: ['Send Promo Email', 'Start Weekly Promo Run'],
  },
  {
    label: 'Discounts',
    status: 'Queued',
    statusClass: 'bg-amber-500',
    actions: ['Issue Reactivation Coupons', 'Enable 7-Day Offer Window'],
  },
  {
    label: 'Product Notifications',
    status: 'Live',
    statusClass: 'bg-sky-500',
    actions: ['Push Product Match Alerts', 'Send Job + Product Digest'],
  },
];

function PipelineTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const avgDays = payload.find((item) => item.dataKey === 'avgDays')?.value;
  const benchmarkDays = payload.find((item) => item.dataKey === 'benchmarkDays')?.value;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{avgDays} days in stage</p>
      <p className="text-xs font-semibold text-emerald-700">Benchmark: {benchmarkDays} days</p>
    </div>
  );
}

function BottleneckBadge({ viewBox }) {
  if (!viewBox) return null;

  const width = 330;
  const height = 96;
  const x = viewBox.x + 14;
  const y = viewBox.y - 26;

  return (
    <g>
      <foreignObject x={x} y={y} width={width} height={height}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="rounded-xl border border-rose-300 bg-rose-50/95 px-3 py-2 text-[11px] font-bold leading-tight text-rose-900 shadow-lg"
        >
          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-rose-700">
            <AlertTriangle size={12} />
            Priority Alert
          </div>
          {bottleneckMessage}
        </div>
      </foreignObject>
    </g>
  );
}

function SupplyChainAnalytics() {
  return (
    <div className="min-h-full rounded-3xl bg-slate-50 p-4 md:p-6">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-600">Supply Chain Command Center</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Pipeline Velocity and Talent Inventory Health</h1>
          <p className="max-w-3xl text-sm font-semibold text-slate-600 md:text-base">
            Operational intelligence view for candidate flow velocity, bottleneck risk, and warehouse-style talent inventory liquidity.
          </p>
        </header>

        <article className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-md md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-black tracking-tight text-slate-900 md:text-xl">Pipeline Velocity Chart (Logistics)</h2>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              ComposedChart: Bar + Line
            </span>
          </div>

          <div className="w-full" style={{ height: '340px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pipelineVelocityData} margin={{ top: 24, right: 220, left: 0, bottom: 14 }}>
                <defs>
                  <linearGradient id="velocityBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.35} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" vertical={false} />
                <XAxis
                  dataKey="stage"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                  label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip cursor={{ fill: 'rgba(16,185,129,0.08)' }} content={<PipelineTooltip />} />
                <Bar dataKey="avgDays" fill="url(#velocityBar)" radius={[12, 12, 6, 6]} barSize={42} name="Average Days" />
                <Line
                  type="monotone"
                  dataKey="benchmarkDays"
                  stroke="#047857"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#047857', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  name="Target Velocity"
                />
                <ReferenceDot
                  x="Technical Interview"
                  y={14}
                  r={8}
                  fill="#dc2626"
                  stroke="#ffffff"
                  strokeWidth={2}
                  ifOverflow="visible"
                  label={<BottleneckBadge />}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </article>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-600" />
            <h2 className="text-lg font-black tracking-tight text-slate-900 md:text-xl">Inventory Health Metrics (Warehousing)</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {inventoryHealth.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.title}
                  className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-md"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-600">
                      <Icon size={18} />
                    </div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">{metric.title}</p>
                  </div>

                  <p className="text-base font-black leading-tight tracking-tight text-slate-900">{metric.value}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{metric.detail}</p>
                </article>
              );
            })}
          </div>

          <article className="mt-5 rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-md md:p-6">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Quick Actions: Dormant Profile Recovery</h3>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
              {quickActionGroups.map((group) => (
                <div key={group.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-600">{group.label}</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                      <span className={`h-2 w-2 rounded-full ${group.statusClass}`} />
                      {group.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.actions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </div>
  );
}

export default SupplyChainAnalytics;
