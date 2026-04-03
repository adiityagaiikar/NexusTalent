import React, { useMemo, useState } from 'react';
import api from '../lib/api';
import { CheckCircle2, IndianRupee, Loader2, Sparkles } from '../constants/icons';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    const existing = document.getElementById('razorpay-checkout-js');
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function PaymentButton({
  amountRupees = 12,
  planName = 'Student Pro',
  onPaymentSuccess,
  onStatusRefresh,
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const user = useMemo(() => {
    const stored = localStorage.getItem('authUser');
    if (!stored) return {};

    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }, []);

  const startPayment = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Unable to load Razorpay checkout. Please try again.');
        setLoading(false);
        return;
      }

      const amountPaise = Math.round(Number(amountRupees) * 100);
      const orderResponse = await api.post('/api/payments/order', {
        amount: amountPaise,
      });

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        setError('Razorpay key is not configured in frontend environment.');
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'TalentNexus',
        description: `${planName} Subscription`,
        order_id: orderResponse.data.id,
        prefill: {
          name: user?.name || 'Student User',
          email: user?.email || 'student@talentnexus.com',
          contact: user?.phone || '',
        },
        notes: {
          platform: 'TalentNexus',
          plan: planName,
        },
        theme: {
          color: '#0f172a',
        },
        handler: async (response) => {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderResponse.data.amount,
            };

            await api.post('/api/payments/verify', verifyPayload);

            setSuccess(true);
            if (onPaymentSuccess) onPaymentSuccess();
            if (onStatusRefresh) onStatusRefresh();
          } catch {
            setError('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (paymentError) {
      setError(paymentError?.response?.data?.message || 'Unable to start payment.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={startPayment}
        disabled={loading}
        className="inline-flex min-w-56 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <IndianRupee size={16} />}
        {loading ? 'Launching Razorpay...' : `Pay ₹${amountRupees} with Razorpay`}
      </button>

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <p className="inline-flex items-center gap-2">
            <CheckCircle2 size={16} /> Payment successful.
          </p>
          <p className="mt-1 inline-flex items-center gap-2 text-emerald-600">
            <Sparkles size={14} /> Application status refreshed.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}

export default PaymentButton;
