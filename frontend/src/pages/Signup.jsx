import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../firebase';
import { AlertCircle, Loader2, Lock, Mail, ShieldCheck } from '../constants/icons';

function Signup() {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [candidateBio, setCandidateBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'signup-recaptcha-container', {
        size: 'invisible',
      });
    }

    return () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // OWASP Mitigation #5 (Weak Authentication Prevention):
      // Firebase Auth securely handles credential storage and JWT issuance.
      if (!recaptchaRef.current) {
        throw new Error('reCAPTCHA failed to initialize.');
      }

      // OWASP Mitigation #2 (Bot / API Abuse):
      // Require invisible reCAPTCHA verification before sign-up processing.
      await recaptchaRef.current.verify();

      const credentials = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const token = await credentials.user.getIdToken();

      localStorage.setItem('token', token);
      localStorage.setItem(
        'authUser',
        JSON.stringify({
          id: credentials.user.uid,
          name: name.trim() || credentials.user.email?.split('@')[0] || 'Candidate',
          email: credentials.user.email,
          role: 'student',
        })
      );

      setSuccess('Account created successfully. Redirecting to student portal...');
      setTimeout(() => {
        navigate('/student/jobs', { replace: true });
      }, 700);
    } catch (signupError) {
      setError(signupError.message || 'Sign-up failed. Please try again.');
      try {
        recaptchaRef.current?.render().then((widgetId) => {
          window.grecaptcha?.reset(widgetId);
        });
      } catch {
        // noop
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] animate-in py-8">
      <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-10">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-sky-100 to-indigo-100 text-sky-700">
            <ShieldCheck size={30} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create Candidate Account</h1>
          <p className="mt-2 text-sm text-slate-500">Secure sign-up with Firebase Auth and invisible reCAPTCHA.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            required
          />

          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
            <input
              type="password"
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              minLength={8}
              required
            />
          </div>

          {/* OWASP Mitigation #3 (XSS): React escapes user input by default.
              Entering <script>alert('Hacked')</script> is rendered safely as text below. */}
          <textarea
            rows={3}
            placeholder="Candidate Bio (XSS safety demo)"
            value={candidateBio}
            onChange={(e) => setCandidateBio(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Bio Preview (safe render)</p>
            <p>{candidateBio || 'Your bio preview appears here.'}</p>
          </div>

          <div id="signup-recaptcha-container" />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Creating account...' : 'Sign Up Securely'}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            <p className="inline-flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
