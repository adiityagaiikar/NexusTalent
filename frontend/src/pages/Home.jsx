import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Sparkles, Target, Layers, BadgeCheck } from '../constants/icons';

function Home() {
  const logos = ['Google', 'Meta', 'Stripe', 'Notion', 'Shopify', 'Canva', 'Figma', 'Linear'];
  const marqueeItems = [...logos, ...logos];

  return (
    <div className="animate-in min-h-screen bg-slate-50 text-slate-900">
      <style>
        {`@keyframes tn-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}
      </style>

      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
        <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-700">
              <Sparkles size={14} /> Career Intelligence Platform
            </p>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Hire Faster. Get Hired Smarter.
              <span className="block text-indigo-600">One Platform for Modern Career Growth.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              TalentNexus connects high-intent candidates with hiring teams using predictive matching, verified talent pools, and conversion-optimized workflows.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/student/jobs"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 sm:w-auto"
              >
                Find Work <ArrowRight size={15} />
              </Link>
              <Link
                to="/admin/dashboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 sm:w-auto"
              >
                Hire Talent <Building2 size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/80 py-7">
          <div className="mx-auto max-w-6xl overflow-hidden px-4 sm:px-6">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Trusted by teams hiring on TalentNexus
            </p>
            <div className="relative overflow-hidden">
              <div
                className="flex min-w-max gap-3"
                style={{ animation: 'tn-marquee 20s linear infinite' }}
              >
                {marqueeItems.map((logo, index) => (
                  <span
                    key={`${logo}-${index}`}
                    className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Product Advantage</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Purpose-built for outcome-driven hiring.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Predictive Match Scoring',
              desc: 'AI-weighted relevance scores align candidate intent, role fit, and response likelihood before outreach.',
              icon: <Target size={18} className="text-indigo-600" />,
            },
            {
              title: 'Kanban ATS',
              desc: 'Move talent from Applied to Hired with a visual pipeline designed to reduce drop-off and decision latency.',
              icon: <Layers size={18} className="text-indigo-600" />,
            },
            {
              title: 'Verified Talent Pools',
              desc: 'University-verified candidate profiles and skill signatures improve trust and speed up shortlist quality.',
              icon: <BadgeCheck size={18} className="text-indigo-600" />,
            },
          ].map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-200"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black tracking-tight text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;