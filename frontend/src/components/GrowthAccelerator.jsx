import React, { useMemo, useState } from 'react';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MIX_CHANNELS = [
  { key: 'community', label: 'Community', efficiency: 0.94 },
  { key: 'seo', label: 'SEO', efficiency: 1.28 },
  { key: 'viralLoops', label: 'Viral Loops', efficiency: 1.4 },
  { key: 'partnerships', label: 'Partnerships', efficiency: 1.14 },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatInr(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUsd(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  valueLabel,
  accentClass = 'bg-indigo-500',
}) {
  const ratio = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-xs font-semibold text-slate-700">{valueLabel}</p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
        <div
          className={`pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full ${accentClass}`}
          style={{ width: `${ratio}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-indigo-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-indigo-200 [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-indigo-500 [&::-moz-range-thumb]:bg-white"
        />
      </div>
    </div>
  );
}

function GrowthAccelerator() {
  const [budget, setBudget] = useState(200000);
  const [uxQuality, setUxQuality] = useState(72);
  const [marketingMix, setMarketingMix] = useState({
    community: 25,
    seo: 30,
    viralLoops: 20,
    partnerships: 25,
  });

  const adjustMix = (channelKey, proposedValue) => {
    const nextValue = clamp(Math.round(proposedValue), 0, 100);
    const otherKeys = MIX_CHANNELS.map((channel) => channel.key).filter((key) => key !== channelKey);

    setMarketingMix((previous) => {
      const remainder = 100 - nextValue;
      const previousOthersTotal = otherKeys.reduce((sum, key) => sum + previous[key], 0);
      const nextMix = { ...previous, [channelKey]: nextValue };

      if (otherKeys.length === 0) {
        return nextMix;
      }

      if (previousOthersTotal === 0) {
        const evenShare = Math.floor(remainder / otherKeys.length);
        let distributed = 0;

        otherKeys.forEach((key, index) => {
          const allocation = index === otherKeys.length - 1 ? remainder - distributed : evenShare;
          nextMix[key] = allocation;
          distributed += allocation;
        });

        return nextMix;
      }

      let distributed = 0;
      otherKeys.forEach((key) => {
        const weighted = Math.round((previous[key] / previousOthersTotal) * remainder);
        nextMix[key] = weighted;
        distributed += weighted;
      });

      const roundingDelta = remainder - distributed;
      if (roundingDelta !== 0) {
        nextMix[otherKeys[0]] = clamp(nextMix[otherKeys[0]] + roundingDelta, 0, 100);
      }

      return nextMix;
    });
  };

  const computed = useMemo(() => {
    const mixEfficiency = MIX_CHANNELS.reduce((accumulator, channel) => {
      return accumulator + (marketingMix[channel.key] / 100) * channel.efficiency;
    }, 0);

    const traffic = Math.round((budget / 40) * mixEfficiency);
    const conversionRate = 0.018 + (uxQuality / 100) * 0.072;
    const signups = Math.max(1, Math.round(traffic * conversionRate));
    const paidConversion = 0.032 + (uxQuality / 100) * 0.03;
    const paidUsers = Math.max(1, Math.round(signups * paidConversion));
    const mrr = paidUsers * 99;
    const cpa = budget / signups;
    const impressions = Math.round(traffic * 6.2);

    const growthVelocity = 1 + 0.02 + (mixEfficiency - 1) * 0.28 + (uxQuality / 100) * 0.06;
    const trendData = Array.from({ length: 6 }, (_, index) => {
      const month = index + 1;
      return {
        month: `M${month}`,
        signups: Math.round(signups * growthVelocity ** month),
      };
    });

    return {
      mixEfficiency,
      traffic,
      signups,
      paidUsers,
      mrr,
      cpa,
      funnelData: [
        { stage: 'Impressions', volume: impressions },
        { stage: 'Visitors', volume: traffic },
        { stage: 'Signups', volume: signups },
        { stage: 'Paid Users', volume: paidUsers },
      ],
      trendData,
    };
  }, [budget, marketingMix, uxQuality]);

  const mixTotal = useMemo(() => {
    return Object.values(marketingMix).reduce((sum, value) => sum + value, 0);
  }, [marketingMix]);

  return (
    <section className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Acquisition Levers (Marketing)</p>
          <p className="mt-1 text-sm text-slate-500">Tune spend and channel mix to shape efficient top-of-funnel growth.</p>

          <div className="mt-5 space-y-5">
            <RangeField
              label="Monthly Budget"
              value={budget}
              min={50000}
              max={500000}
              step={5000}
              onChange={setBudget}
              valueLabel={formatInr(budget)}
            />

            {MIX_CHANNELS.map((channel) => (
              <RangeField
                key={channel.key}
                label={channel.label}
                value={marketingMix[channel.key]}
                min={0}
                max={100}
                step={1}
                onChange={(value) => adjustMix(channel.key, value)}
                valueLabel={`${marketingMix[channel.key]}%`}
                accentClass="bg-indigo-400"
              />
            ))}

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Mix Integrity</p>
              <p className={`text-sm font-semibold ${mixTotal === 100 ? 'text-indigo-600' : 'text-rose-600'}`}>
                {mixTotal}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Conversion Levers (Product UX)</p>
          <p className="mt-1 text-sm text-slate-500">Better product polish compounds conversion and paid intent.</p>

          <div className="mt-5 space-y-5">
            <RangeField
              label="Global UX Quality"
              value={uxQuality}
              min={0}
              max={100}
              step={1}
              onChange={setUxQuality}
              valueLabel={`${uxQuality}%`}
              accentClass="bg-indigo-600"
            />

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Effective Mix Multiplier</p>
              <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">{computed.mixEfficiency.toFixed(2)}x</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:col-span-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <DollarSign size={14} className="text-indigo-600" />
              MRR
            </p>
            <p className="text-3xl font-black tracking-tight text-indigo-600">{formatUsd(computed.mrr)}</p>
            <p className="mt-1 text-xs text-slate-500">Based on $99/mo B2B plan conversion</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <Target size={14} className="text-indigo-600" />
              CPA
            </p>
            <p className="text-3xl font-black tracking-tight text-slate-900">{formatInr(computed.cpa)}</p>
            <p className="mt-1 text-xs text-slate-500">Cost per signup acquired</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <Users size={14} className="text-indigo-600" />
              Total Signups
            </p>
            <p className="text-3xl font-black tracking-tight text-indigo-600">{formatNumber(computed.signups)}</p>
            <p className="mt-1 text-xs text-slate-500">Monthly projected user signups</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Growth Funnel</p>
              <p className="text-sm text-slate-500">Impressions to paid users under current simulation.</p>
            </div>
            <p className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <TrendingUp size={14} className="text-indigo-600" />
              Live scenario update
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={computed.funnelData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="funnelFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="stage" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
                  contentStyle={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    fontSize: '12px',
                    color: '#0f172a',
                  }}
                  formatter={(value) => [formatNumber(value), 'Volume']}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fill="url(#funnelFill)"
                  isAnimationActive
                  animationDuration={320}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-600">Signup Momentum (6 Months)</p>
          <p className="mb-4 text-sm text-slate-500">Projected trajectory if this mix and UX quality are sustained.</p>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={computed.trendData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [formatNumber(value), 'Signups']}
                />
                <Line
                  type="monotone"
                  dataKey="signups"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive
                  animationDuration={320}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GrowthAccelerator;