import React, { useMemo, useState } from 'react';
import { CheckCircle, Sparkles, Users, Zap } from '../constants/icons';

const FEATURES = [
  'Kanban Pipeline Board',
  'Talent Pooling Folders',
  'Predictive Match Scores',
  'Ghosting Prevention Alerts',
];

const STRATEGY_7P = [
  { key: 'Product', value: 'Career coaching, job discovery, referral acceleration, interview prep subscriptions' },
  { key: 'Price', value: 'Free starter value, monthly pro plans, annual savings, bundle pricing' },
  { key: 'Place', value: 'Mobile-first student portal, admin workspace, partner hiring channels' },
  { key: 'Promotion', value: 'Referral rewards, social proof campaigns, campus and corporate collaborations' },
  { key: 'People', value: 'Recruiters, hiring managers, mentors, student success advisors' },
  { key: 'Process', value: 'Discover → Apply → Follow-up → Interview → Offer pipeline automation' },
  { key: 'Physical Evidence', value: 'Verified employer badges, candidate reviews, downloadable progress reports' },
];

function Price({ monthly, annual, yearly }) {
  return (
    <p className="mt-4 text-4xl font-black text-slate-900">
      {yearly ? `$${annual}` : `$${monthly}`}
      <span className="ml-1 text-sm font-semibold text-slate-400">/{yearly ? 'mo (billed yearly)' : 'mo'}</span>
    </p>
  );
}

function EmployerPricing() {
  const [yearly, setYearly] = useState(false);

  const plans = useMemo(
    () => [
      {
        name: 'Starter',
        monthly: 0,
        annual: 0,
        description: 'For early-stage hiring teams evaluating TalentNexus workflows.',
        cta: 'Current Plan',
        classes: 'border-slate-200 bg-white',
      },
      {
        name: 'Growth',
        monthly: 99,
        annual: 79,
        description: 'For scaling employers building a repeatable recruiting engine.',
        cta: 'Upgrade to Growth',
        ribbon: 'Most Popular',
        classes:
          'border-sky-300 bg-linear-to-br from-sky-50 to-white shadow-lg shadow-sky-100 ring-1 ring-sky-200',
      },
      {
        name: 'Enterprise',
        monthly: 499,
        annual: 399,
        description: 'For high-volume organizations requiring enterprise-grade control.',
        cta: 'Contact Sales',
        classes:
          'border-violet-300 bg-linear-to-br from-violet-50 to-white shadow-lg shadow-violet-100 ring-1 ring-violet-200',
      },
    ],
    []
  );

  return (
    <div className="animate-in pb-8">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm">
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <Sparkles size={14} /> B2B Employer SaaS
        </p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Scale Your Hiring Engine</h1>
        <p className="mt-2 max-w-3xl text-slate-500">
          Turn hiring into a predictable growth channel with structured CRM pipelines, smart talent reuse, and score-driven decisioning.
        </p>

        <div className="mt-6 inline-flex items-center rounded-full border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !yearly ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              yearly ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Annual <span className="ml-1 text-emerald-500">(20% OFF)</span>
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className={`relative rounded-3xl border p-6 ${plan.classes}`}>
            {plan.ribbon && (
              <span className="absolute right-4 top-4 rounded-full bg-sky-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                {plan.ribbon}
              </span>
            )}

            <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
            <Price monthly={plan.monthly} annual={plan.annual} yearly={yearly} />

            <ul className="mt-6 space-y-2">
              {FEATURES.map((feature) => (
                <li key={`${plan.name}-${feature}`} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <CheckCircle size={15} className="text-emerald-500" /> {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                plan.name === 'Starter'
                  ? 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  : 'bg-slate-900 text-white hover:bg-slate-700'
              }`}
            >
              {plan.name === 'Enterprise' ? <Users size={15} /> : <Zap size={15} />} {plan.cta}
            </button>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">7P Strategy Canvas</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">How TalentNexus Maps Product-Market Strategy</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {STRATEGY_7P.map((item) => (
            <article key={item.key} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.key}</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{item.value}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default EmployerPricing;
