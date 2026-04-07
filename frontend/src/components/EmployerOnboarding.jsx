import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Briefcase, Building2, CheckCircle, ChevronRight,
  Globe, Sparkles, Upload, X, Zap,
} from 'lucide-react';

/* ─── Step config ─────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Company', title: 'Set up your company', subtitle: 'Help candidates know who you are.' },
  { id: 2, label: 'Role',    title: 'What are you hiring for?', subtitle: 'Post your first role in 60 seconds.' },
  { id: 3, label: 'Review',  title: 'Review & Post',  subtitle: 'Looks great — go live instantly.' },
];

/* ─── Progress Bar ───────────────────────────────────────── */
function ProgressBar({ step, total }) {
  const pct = Math.round(((step - 1) / (total - 1)) * 100);
  return (
    <div className="px-8 pt-6">
      <div className="mb-2 flex items-center justify-between">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black transition-all duration-300 ${
                  step > s.id
                    ? 'bg-emerald-500 text-white'
                    : step === s.id
                    ? 'bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(99,102,241,0.2)]'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.id ? <CheckCircle size={13} /> : s.id}
              </div>
              <span className={`text-[10px] font-semibold ${step >= s.id ? 'text-slate-700' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="relative mx-2 h-px flex-1 overflow-hidden bg-slate-200">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-indigo-500"
                  initial={{ width: '0%' }}
                  animate={{ width: step > s.id ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ─── Input helpers ──────────────────────────────────────── */
function Field({ label, name, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-50"
      />
    </div>
  );
}

/* ─── Step panels ─────────────────────────────────────────── */
function StepOne({ form, onChange }) {
  return (
    <div className="space-y-4">
      <Field label="Company Name" name="companyName" value={form.companyName} onChange={onChange} placeholder="e.g. Acme Corp" required />
      <Field label="Company Website" name="website" value={form.website} onChange={onChange} placeholder="https://yourcompany.com" type="url" />
      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Company Logo
        </label>
        <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload size={20} className="text-slate-400" />
            <p className="text-xs font-semibold text-slate-500">Click or drag to upload logo</p>
            <p className="text-[10px] text-slate-400">PNG, JPG up to 2 MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepTwo({ form, onChange }) {
  const ROLE_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
  return (
    <div className="space-y-4">
      <Field label="Job Title" name="jobTitle" value={form.jobTitle} onChange={onChange} placeholder="e.g. Senior React Engineer" required />
      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Role Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ROLE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ target: { name: 'roleType', value: type } })}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                form.roleType === type
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <Field label="Salary Range" name="salary" value={form.salary} onChange={onChange} placeholder="e.g. $80k – $120k" />
      <Field label="Remote / Location" name="location" value={form.location} onChange={onChange} placeholder="e.g. Remote, New York, NY" />
    </div>
  );
}

function StepThree({ form }) {
  const ReviewRow = ({ label, value }) => (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-right">{value || '—'}</span>
    </div>
  );
  return (
    <div className="rounded-xl border border-slate-200/60 bg-slate-50 px-5 py-4 space-y-0.5">
      <ReviewRow label="Company" value={form.companyName} />
      <ReviewRow label="Website" value={form.website} />
      <ReviewRow label="Job Title" value={form.jobTitle} />
      <ReviewRow label="Role Type" value={form.roleType} />
      <ReviewRow label="Salary" value={form.salary} />
      <ReviewRow label="Location" value={form.location} />
      <div className="pt-3 mt-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle size={12} /> Ready to go live — AI matching will activate immediately
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
function EmployerOnboarding({ onComplete, onDismiss }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: '', website: '', jobTitle: '', roleType: 'Full-Time', salary: '', location: '',
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const canAdvance = () => {
    if (step === 1) return form.companyName.trim().length > 0;
    if (step === 2) return form.jobTitle.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handlePost = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (onComplete) onComplete(form);
    }, 2200);
  };

  const currentStep = STEPS[step - 1];

  const PANEL_CONTENT = {
    1: <StepOne form={form} onChange={handleChange} />,
    2: <StepTwo form={form} onChange={handleChange} />,
    3: <StepThree form={form} />,
  };

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-[0_32px_80px_rgb(0,0,0,0.18)]"
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400" />

        {/* Progress */}
        <ProgressBar step={step} total={STEPS.length} />

        {/* Header */}
        <div className="px-8 pt-5 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">{currentStep.title}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{currentStep.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              className="mt-0.5 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Step Body */}
        <div className="px-8 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              {PANEL_CONTENT[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-8 py-5">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            {/* dot indicators */}
            {STEPS.map((s) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s.id ? 'w-5 bg-indigo-600' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canAdvance()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none"
            >
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePost}
              disabled={submitted}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md disabled:opacity-60"
            >
              {submitted ? (
                <><CheckCircle size={15} /> Job Posted!</>
              ) : (
                <><Zap size={15} /> Post Job Now</>
              )}
            </button>
          )}
        </div>

        {/* Success overlay */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white"
              >
                <CheckCircle size={28} />
              </motion.div>
              <p className="mt-4 text-lg font-black text-slate-900">Job Posted Successfully!</p>
              <p className="mt-1 text-sm text-slate-500">AI matching is now scanning candidates…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default EmployerOnboarding;
