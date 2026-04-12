import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  PieChart, Megaphone, Target, Globe,
  GitMerge, Shield, DollarSign, TrendingUp, ArrowUpRight,
  Layers, BookOpen, Building2, BadgeCheck, Sparkles,
} from '../constants/icons';
import GrowthAccelerator from '../components/GrowthAccelerator';

/* ─── helpers ─────────────────────────────── */
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45, ease: 'easeOut' } }),
};

const UNIVERSITY_PARTNERS = [
  'IIT Bombay',
  'BITS Pilani',
  'VIT Vellore',
  'NIT Trichy',
  'SRM University',
];

const UNIVERSITY_POSTS = [
  {
    id: 'up1',
    campus: 'IIT Bombay',
    title: 'Campus Hiring Week 2026 registrations now open for final-year engineers.',
    reach: '12.4K views',
    status: 'Live',
    image: 'https://placehold.co/120x90/4f46e5/ffffff?text=IIT+Bombay',
  },
  {
    id: 'up2',
    campus: 'VIT Vellore',
    title: 'TalentNexus x Placement Cell: Resume screening workshop this Friday.',
    reach: '8.1K views',
    status: 'Scheduled',
    image: 'https://placehold.co/120x90/6366f1/ffffff?text=VIT+Vellore',
  },
];

const BUILDATHON_POSTS = [
  {
    id: 'bp1',
    platform: 'Unstop',
    title: 'TalentNexus Buildathon 2026: AI Hiring Workflow Challenge',
    timeline: 'Closes in 4 days',
    applications: '1,980 participants',
    image: 'https://placehold.co/120x90/f59e0b/ffffff?text=Unstop',
  },
  {
    id: 'bp2',
    platform: 'Devfolio',
    title: 'Campus Creator Sprint: Build a student-first job discovery micro-product',
    timeline: 'Starts in 3 days',
    applications: '740 waitlisted',
    image: 'https://placehold.co/120x90/ea580c/ffffff?text=Devfolio',
  },
];

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
  const [campusMetrics, setCampusMetrics] = useState({
    activeCampuses: 36,
    intakeGrowth: 18,
    qualityScore: 8.7,
  });
  const [buildathonMetrics, setBuildathonMetrics] = useState({
    events: 4,
    registrations: 3840,
    sponsorLeads: 112,
  });
  const [actionFeed, setActionFeed] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    fieldA: '',
    fieldB: '',
  });

  const taskConfigs = {
    addCampus: {
      title: 'Add Partner Campus',
      actionLabel: 'Create Campus Partner',
      fieldALabel: 'University Name',
      fieldAPlaceholder: 'Example: IIT Bombay',
      fieldBLabel: 'Placement Contact',
      fieldBPlaceholder: 'Example: tpo@iitb.ac.in',
    },
    outreachBatch: {
      title: 'Launch Outreach Batch',
      actionLabel: 'Launch Outreach',
      fieldALabel: 'Target Region',
      fieldAPlaceholder: 'Example: West Zone',
      fieldBLabel: 'Batch Size',
      fieldBPlaceholder: 'Example: 25 campuses',
    },
    createBuildathon: {
      title: 'Create Buildathon',
      actionLabel: 'Create Event',
      fieldALabel: 'Event Name',
      fieldAPlaceholder: 'Example: Spring AI Buildathon',
      fieldBLabel: 'Expected Seats',
      fieldBPlaceholder: 'Example: 500',
    },
    inviteSponsors: {
      title: 'Invite Sponsors',
      actionLabel: 'Send Sponsor Invites',
      fieldALabel: 'Sponsor Segment',
      fieldAPlaceholder: 'Example: DevTools Companies',
      fieldBLabel: 'Invite Count',
      fieldBPlaceholder: 'Example: 20',
    },
  };
  const activeTaskConfig = activeTask ? taskConfigs[activeTask] : null;

  const logAction = (message) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActionFeed((previous) => [{ message, timestamp }, ...previous].slice(0, 6));
  };

  const buildathonPipelineProgress = useMemo(() => {
    return Math.min(100, 52 + buildathonMetrics.events * 5);
  }, [buildathonMetrics.events]);

  const openTaskModal = (taskKey) => {
    setTaskForm({ fieldA: '', fieldB: '' });
    setActiveTask(taskKey);
  };

  const closeTaskModal = () => {
    setActiveTask(null);
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();
    if (!activeTask) return;

    const fieldAValue = taskForm.fieldA.trim();
    const fieldBValue = taskForm.fieldB.trim();

    if (!fieldAValue || !fieldBValue) return;

    if (activeTask === 'addCampus') {
      setCampusMetrics((previous) => ({
        ...previous,
        activeCampuses: previous.activeCampuses + 1,
        qualityScore: Math.min(9.9, Number((previous.qualityScore + 0.1).toFixed(1))),
      }));
      logAction(`University Partnerships: Added campus ${fieldAValue} (${fieldBValue}).`);
      closeTaskModal();
      return;
    }

    if (activeTask === 'outreachBatch') {
      setCampusMetrics((previous) => ({
        ...previous,
        intakeGrowth: Math.min(45, previous.intakeGrowth + 2),
      }));
      logAction(`University Partnerships: Outreach launched for ${fieldAValue} with ${fieldBValue}.`);
      closeTaskModal();
      return;
    }

    if (activeTask === 'createBuildathon') {
      setBuildathonMetrics((previous) => ({
        ...previous,
        events: previous.events + 1,
        registrations: previous.registrations + 420,
      }));
      logAction(`Community Buildathons: Created ${fieldAValue} with ${fieldBValue} seats.`);
      closeTaskModal();
      return;
    }

    if (activeTask === 'inviteSponsors') {
      setBuildathonMetrics((previous) => ({
        ...previous,
        sponsorLeads: previous.sponsorLeads + 14,
      }));
      logAction(`Community Buildathons: Sponsor invites sent to ${fieldAValue} (${fieldBValue}).`);
      closeTaskModal();
    }
  };

  const handleAddPartnerCampus = () => {
    openTaskModal('addCampus');
  };

  const handleLaunchOutreachBatch = () => {
    openTaskModal('outreachBatch');
  };

  const handleCreateBuildathon = () => {
    openTaskModal('createBuildathon');
  };

  const handleInviteSponsors = () => {
    openTaskModal('inviteSponsors');
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
          1 · Marketing Strategy
        ══════════════════════════════════ */}
        <motion.section custom={0} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <div className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <SectionLabel>Go-To-Market</SectionLabel>
            <SectionHeading>Marketing Strategy</SectionHeading>

            <div className="mt-6 space-y-4">
              {/* University Partnerships - Full Width Horizontal */}
              <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/30 p-5">
                <div className="flex items-start justify-between gap-6">
                  {/* Left Section: Header & Metrics */}
                  <div className="min-w-max">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <Target size={20} />
                      </div>
                      <span className="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-700">
                        Campus Engine
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900">University Partnerships</h3>
                    <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-slate-500">
                      Collaborating directly with campus placement cells to onboard fresh, verified talent at scale with low CAC.
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg border border-indigo-200/70 bg-white px-2.5 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Active Campuses</p>
                        <p className="mt-1 text-lg font-black text-indigo-700">{campusMetrics.activeCampuses}</p>
                      </div>
                      <div className="rounded-lg border border-indigo-200/70 bg-white px-2.5 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">MoM Intake</p>
                        <p className="mt-1 text-lg font-black text-indigo-700">+{campusMetrics.intakeGrowth}%</p>
                      </div>
                      <div className="rounded-lg border border-indigo-200/70 bg-white px-2.5 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Quality Score</p>
                        <p className="mt-1 text-lg font-black text-indigo-700">{campusMetrics.qualityScore}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={handleAddPartnerCampus} type="button" className="rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-indigo-700">
                        Add Partner Campus
                      </button>
                      <button onClick={handleLaunchOutreachBatch} type="button" className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-indigo-700 hover:bg-indigo-100/60">
                        Launch Outreach Batch
                      </button>
                    </div>
                  </div>

                  {/* Right Section: Partners & Posts */}
                  <div className="flex-1 space-y-3">
                    <div className="rounded-lg border border-indigo-200/70 bg-white p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Partner Universities</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {UNIVERSITY_PARTNERS.map((partner) => (
                          <span key={partner} className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">
                            {partner}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Campaign Posts</p>
                      {UNIVERSITY_POSTS.map((post) => (
                        <div key={post.id} className="overflow-hidden rounded-lg border border-indigo-200/60 bg-white">
                          <div className="flex gap-3 p-3">
                            <img
                              src={post.image}
                              alt={post.campus}
                              className="h-16 w-20 shrink-0 rounded-md border border-indigo-100 object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">{post.campus}</p>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">{post.status}</span>
                              </div>
                              <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-700">{post.title}</p>
                              <p className="mt-1 text-[11px] font-semibold text-slate-500">{post.reach}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Buildathons - Full Width Horizontal */}
              <div className="rounded-xl border border-amber-200/70 bg-amber-50/30 p-5">
                <div className="flex items-start justify-between gap-6">
                  {/* Left Section: Header & Metrics */}
                  <div className="min-w-max">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                        <Megaphone size={20} />
                      </div>
                      <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                        Community Growth
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900">Community Buildathons</h3>
                    <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-slate-500">
                      Hosting sponsored coding and design buildathons to drive social proof, referral spikes, and qualified top-of-funnel growth.
                    </p>

                    <div className="mt-4 space-y-2.5 rounded-lg border border-amber-200/70 bg-white p-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>Q2 Buildathon Pipeline</span>
                        <span>{buildathonMetrics.events} Events</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-amber-100">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: `${buildathonPipelineProgress}%` }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                        <p>Registrations: {buildathonMetrics.registrations.toLocaleString('en-US')}</p>
                        <p>Sponsor Leads: {buildathonMetrics.sponsorLeads.toLocaleString('en-US')}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={handleCreateBuildathon} type="button" className="rounded-lg bg-amber-500 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-amber-600">
                        Create Buildathon
                      </button>
                      <button onClick={handleInviteSponsors} type="button" className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-amber-700 hover:bg-amber-100/60">
                        Invite Sponsors
                      </button>
                    </div>
                  </div>

                  {/* Right Section: Posts */}
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Campaign Posts</p>
                    {BUILDATHON_POSTS.map((post) => (
                      <div key={post.id} className="overflow-hidden rounded-lg border border-amber-200/70 bg-white">
                        <div className="flex gap-3 p-3">
                          <img
                            src={post.image}
                            alt={post.platform}
                            className="h-16 w-20 shrink-0 rounded-md border border-amber-100 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">{post.platform}</p>
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">{post.timeline}</span>
                            </div>
                            <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-700">{post.title}</p>
                            <p className="mt-1 text-[11px] font-semibold text-slate-500">{post.applications}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              {/* Additional Marketing Strategies */}
              <div className="grid gap-4 md:grid-cols-2">
                {[
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

              <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">Marketing Action Feed</h3>
                  <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    Live
                  </span>
                </div>

                {actionFeed.length === 0 ? (
                  <p className="text-xs font-medium text-slate-500">Click any action button above to trigger operations and populate this feed.</p>
                ) : (
                  <div className="space-y-2">
                    {actionFeed.map((event, index) => (
                      <div key={`${event.message}-${index}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <p className="text-xs font-semibold text-slate-700">{event.message}</p>
                        <span className="text-[11px] font-semibold text-slate-500">{event.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════
          2 · Interactive Growth Accelerator
        ══════════════════════════════════ */}
        <motion.section custom={1} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
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

        {/* ══════════════════════════════════
          3 · Unit Economics
        ══════════════════════════════════ */}
        <motion.section custom={2} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
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
          4 · Market Defensibility (The Moat)
        ══════════════════════════════════ */}
        <motion.section custom={3} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
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

      </div>

      {activeTaskConfig && createPortal(
        <div className="fixed inset-0 z-100 bg-slate-900/25" onClick={closeTaskModal}>
          <div className="flex min-h-dvh items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <h3 className="text-lg font-black tracking-tight text-slate-900">{activeTaskConfig.title}</h3>
              <p className="mt-1 text-xs font-medium text-slate-500">Complete task details to execute this operation.</p>

              <form className="mt-4 space-y-3" onSubmit={handleTaskSubmit}>
                <label className="block">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">{activeTaskConfig.fieldALabel}</p>
                  <input
                    type="text"
                    value={taskForm.fieldA}
                    onChange={(event) => setTaskForm((previous) => ({ ...previous, fieldA: event.target.value }))}
                    placeholder={activeTaskConfig.fieldAPlaceholder}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <label className="block">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">{activeTaskConfig.fieldBLabel}</p>
                  <input
                    type="text"
                    value={taskForm.fieldB}
                    onChange={(event) => setTaskForm((previous) => ({ ...previous, fieldB: event.target.value }))}
                    placeholder={activeTaskConfig.fieldBPlaceholder}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeTaskModal}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-700"
                  >
                    {activeTaskConfig.actionLabel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

export default Strategy;