import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Megaphone, Target, Zap, Users, Globe,
  GitMerge, Shield, DollarSign, TrendingUp, ArrowUpRight,
  Layers, BookOpen, Building2, BadgeCheck, Sparkles,
} from '../constants/icons';
import GrowthAccelerator from '../components/GrowthAccelerator';

/* ─── helpers ─────────────────────────────── */
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45, ease: 'easeOut' } }),
};

function SectionLabel({ children }) {
  return (
    <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-500">
      {children}
    </p>
  );
}

function SectionHeading({ children }) {
  return <h2 className="text-2xl font-black tracking-tighter text-slate-900">{children}</h2>;
}

function MetricCard({ label, value, sub, color = 'indigo', icon }) {
  const colors = {
    indigo: 'border-indigo-200/60 bg-indigo-50/50 text-indigo-700',
    emerald: 'border-emerald-200/60 bg-emerald-50/50 text-emerald-700',
    amber: 'border-amber-200/60 bg-amber-50/50 text-amber-700',
    rose: 'border-rose-200/60 bg-rose-50/50 text-rose-600',
    slate: 'border-slate-200/60 bg-slate-50 text-slate-700',
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="mb-2 opacity-70">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-widest opacity-60">{label}</p>
      <p className="text-3xl font-black tracking-tighter">{value}</p>
      {sub && <p className="mt-0.5 text-xs font-medium opacity-65">{sub}</p>}
    </div>
  );
}

/* ─── Component ───────────────────────────── */
function Strategy() {
  const [billing, setBilling] = useState('monthly');

  const prices = {
    pro: billing === 'monthly' ? 12 : 9,
    enterprise: billing === 'monthly' ? 299 : 239,
  };

  return (
    <div className="animate-in min-h-screen bg-slate-50 pb-24">

      {/* ── Page Header ── */}
      <div className="border-b border-slate-200/60 bg-white px-6 py-8 shadow-[0_1px_0_rgb(0,0,0,0.04)]">
        <div className="mx-auto max-w-5xl">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-500">
            <Sparkles size={11} className="mr-1 inline" />
            Business Intelligence
          </p>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Business Strategy</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            How TalentNexus scales, sustains, and captures the modern employment market.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-10 px-4 pt-10 sm:px-6">

        {/* ══════════════════════════════════
            1 · Revenue Model
        ══════════════════════════════════ */}
        <motion.section custom={0} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <SectionLabel>Revenue Model</SectionLabel>
                <SectionHeading>Monetization Tiers</SectionHeading>
              </div>
              {/* Billing toggle */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                {['monthly', 'annual'].map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBilling(cycle)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                      billing === cycle
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {cycle}{cycle === 'annual' && <span className="ml-1 text-emerald-600">-20%</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Freemium */}
              <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                  <Users size={20} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Freemium</p>
                <p className="mt-1 text-3xl font-black tracking-tighter text-slate-900">$0</p>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  Free profile creation, portfolio hosting, and standard job applications to drive top-of-funnel growth.
                </p>
              </div>

              {/* Pro – highlighted */}
              <div className="relative rounded-xl border-2 border-indigo-400 bg-white p-6 shadow-[0_4px_24px_rgba(99,102,241,0.15)]">
                <div className="absolute -top-3 right-4 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most Popular
                </div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Zap size={20} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Pro Creatives</p>
                <p className="mt-1 text-3xl font-black tracking-tighter text-slate-900">
                  ${prices.pro}<span className="text-sm font-medium text-slate-400">/mo</span>
                </p>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  Advanced analytics, custom domain mapping, and priority ranking in employer searches.
                </p>
              </div>

              {/* Enterprise */}
              <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
                  <Building2 size={20} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Enterprise SaaS</p>
                <p className="mt-1 text-3xl font-black tracking-tighter text-slate-900">
                  ${prices.enterprise}<span className="text-sm font-medium text-slate-400">/mo</span>
                </p>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  Unlimited job posts, full ATS CRM access, advanced filtering, and dedicated onboarding.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════
            2 · The Growth Flywheel
        ══════════════════════════════════ */}
        <motion.section custom={1} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <SectionLabel>Growth Engine</SectionLabel>
            <SectionHeading>The Flywheel Effect</SectionHeading>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              Each side of our marketplace reinforces the other, creating a self-sustaining loop of compounding growth.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'University Talent Inflow',
                  body: 'We partner directly with campus placement cells, onboarding high-quality fresh talent at near-zero CAC.',
                  icon: <BookOpen size={22} />,
                  color: 'bg-indigo-50 text-indigo-600',
                  arrow: true,
                },
                {
                  step: '02',
                  title: 'Enterprise Employer Pull',
                  body: 'A deep, vetted talent pool attracts top enterprise employers willing to pay for premium ATS + job-post access.',
                  icon: <Building2 size={22} />,
                  color: 'bg-emerald-50 text-emerald-600',
                  arrow: true,
                },
                {
                  step: '03',
                  title: 'Talent Attraction Loop',
                  body: 'Enterprise brand partnerships become a magnet for more ambitious talent — the loop closes and accelerates.',
                  icon: <GitMerge size={22} />,
                  color: 'bg-amber-50 text-amber-600',
                  arrow: false,
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-5">
                    <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                      {item.icon}
                    </div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Step {item.step}</p>
                    <h3 className="mb-2 text-sm font-black text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
                  </div>
                  {item.arrow && (
                    <div className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 md:flex">
                      <ArrowUpRight size={18} className="text-slate-300 rotate-45" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════
            3 · Market Defensibility (The Moat)
        ══════════════════════════════════ */}
        <motion.section custom={2} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <SectionLabel>Competitive Advantage</SectionLabel>
            <SectionHeading>Market Defensibility</SectionHeading>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              Our proprietary technology stack creates hard-to-replicate moats that compound over time.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: 'Predictive Match Scoring',
                  body: 'Our multi-dimensional scoring model weighs skills fit, culture alignment, and historical responsiveness. Every data point improves the model — a true network-effect flywheel.',
                  icon: <Target size={20} />,
                  tag: 'Proprietary AI',
                  color: 'border-indigo-200 bg-indigo-50/40',
                  iconColor: 'bg-indigo-100 text-indigo-600',
                  tagColor: 'bg-indigo-100 text-indigo-700',
                },
                {
                  title: 'Automated Ghosting Prevention',
                  body: 'Our two-sided nudge system detects inactivity windows and auto-triggers context-aware re-engagement messages via email or WhatsApp — reducing pipeline drop-off by up to 40%.',
                  icon: <Shield size={20} />,
                  tag: 'Retention Tech',
                  color: 'border-emerald-200 bg-emerald-50/40',
                  iconColor: 'bg-emerald-100 text-emerald-600',
                  tagColor: 'bg-emerald-100 text-emerald-700',
                },
                {
                  title: 'Verified Talent Graph',
                  body: 'Campus-verified profiles with university seal, GPA, and project portfolios create a trust layer that generic LinkedIn-style networks cannot replicate without costly partnership buildout.',
                  icon: <BadgeCheck size={20} />,
                  tag: 'Data Moat',
                  color: 'border-amber-200 bg-amber-50/40',
                  iconColor: 'bg-amber-100 text-amber-600',
                  tagColor: 'bg-amber-100 text-amber-700',
                },
                {
                  title: 'Employer Network Density',
                  body: 'Each enterprise client brings exclusive job reqs. These roles become visible to students only on TalentNexus — creating a proprietary opportunity layer that retains talent on-platform.',
                  icon: <Layers size={20} />,
                  tag: 'Network Effects',
                  color: 'border-slate-200 bg-slate-50/60',
                  iconColor: 'bg-slate-100 text-slate-600',
                  tagColor: 'bg-slate-100 text-slate-600',
                },
              ].map((item) => (
                <div key={item.title} className={`rounded-xl border p-5 ${item.color} transition-shadow hover:shadow-md`}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mb-2 text-sm font-black text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════
            4 · Unit Economics
        ══════════════════════════════════ */}
        <motion.section custom={3} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <SectionLabel>Unit Economics · B2B Enterprise Tier</SectionLabel>
            <SectionHeading>CAC vs. LTV at Scale</SectionHeading>
            <p className="mt-1.5 text-sm text-slate-500 max-w-xl">
              Projected metrics for enterprise clients at Seed → Series A velocity.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Customer Acquisition Cost (CAC)"
                value="$1,200"
                sub="Per enterprise client"
                color="rose"
                icon={<DollarSign size={20} />}
              />
              <MetricCard
                label="Lifetime Value (LTV)"
                value="$14,400"
                sub="36-month retention avg."
                color="emerald"
                icon={<TrendingUp size={20} />}
              />
              <MetricCard
                label="LTV : CAC Ratio"
                value="12×"
                sub="Healthy > 3× benchmark"
                color="indigo"
                icon={<Layers size={20} />}
              />
              <MetricCard
                label="Payback Period"
                value="4.8 mo"
                sub="Best-in-class < 12 months"
                color="amber"
                icon={<PieChart size={20} />}
              />
            </div>

            {/* LTV/CAC bar visualisation */}
            <div className="mt-8 rounded-xl bg-slate-50 px-6 py-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">LTV vs CAC — Visual</p>
              <div className="space-y-3">
                {[
                  { label: 'LTV · $14,400', pct: 100, color: 'bg-emerald-400' },
                  { label: 'CAC · $1,200', pct: Math.round((1200 / 14400) * 100), color: 'bg-rose-400' },
                  { label: 'Gross Margin · ~72%', pct: 72, color: 'bg-indigo-400' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-500">
                      <span>{label}</span><span>{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        className={`h-full rounded-full ${color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════
            5 · Marketing Strategy
        ══════════════════════════════════ */}
        <motion.section custom={4} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <SectionLabel>Go-To-Market</SectionLabel>
            <SectionHeading>Marketing Strategy</SectionHeading>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: 'University Partnerships',
                  body: 'Collaborating directly with campus placement cells to onboard fresh, verified talent — creating a baseline of high-quality candidates at minimal cost.',
                  icon: <Target size={20} />,
                  color: 'hover:border-indigo-200 hover:bg-indigo-50/30',
                },
                {
                  title: 'Community Buildathons',
                  body: 'Hosting virtual design and coding challenges sponsored by enterprise tech companies to drive organic social sharing and qualified top-of-funnel.',
                  icon: <Megaphone size={20} />,
                  color: 'hover:border-amber-200 hover:bg-amber-50/30',
                },
                {
                  title: 'Content-Led SEO',
                  body: 'Publishing salary benchmarking reports and hiring trend data to capture high-intent organic search traffic from both recruiters and job seekers.',
                  icon: <Globe size={20} />,
                  color: 'hover:border-emerald-200 hover:bg-emerald-50/30',
                },
                {
                  title: 'Enterprise Sales Motion',
                  body: 'A dedicated outbound sequence targeting HR leaders at high-growth Series B–D companies with ROI case studies and free 30-day ATS trials.',
                  icon: <Building2 size={20} />,
                  color: 'hover:border-slate-300 hover:bg-slate-50',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`flex gap-4 rounded-xl border border-slate-200/60 bg-white p-5 transition-all duration-200 ${item.color}`}
                >
                  <div className="mt-0.5 shrink-0 text-slate-400">{item.icon}</div>
                  <div>
                    <h3 className="mb-1.5 text-sm font-black text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════
            6 · Interactive Growth Accelerator
        ══════════════════════════════════ */}
        <motion.section custom={5} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <SectionLabel>Simulation Lab</SectionLabel>
            <SectionHeading>Growth Accelerator</SectionHeading>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
              Model how marketing and product improvements influence top-of-funnel performance, paid conversion, and monthly recurring revenue.
            </p>

            <div className="mt-7">
              <GrowthAccelerator />
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

export default Strategy;