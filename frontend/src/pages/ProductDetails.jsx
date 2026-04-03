import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { MessageSquare, Mail, Sparkles, Star } from '../constants/icons';

const INITIAL_REVIEW = { name: '', rating: 5, comment: '' };
const INITIAL_QUESTION = { name: '', question: '' };

function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [reviewForm, setReviewForm] = useState(INITIAL_REVIEW);
  const [questionForm, setQuestionForm] = useState(INITIAL_QUESTION);

  async function loadProduct() {
    const response = await api.get(`/api/products/${slug}`);
    setProduct(response.data);
  }

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const [productRes, aiRes] = await Promise.all([
          api.get(`/api/products/${slug}`),
          api.get(`/api/products/${slug}/ai-insights`),
        ]);

        if (!mounted) return;

        setProduct(productRes.data);
        setAiInsights(aiRes.data);
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError.response?.data?.message || 'Unable to load product details');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [slug]);

  async function handleReviewSubmit(event) {
    event.preventDefault();
    setSubmittingReview(true);
    setError('');

    try {
      await api.post(`/api/products/${slug}/reviews`, reviewForm);
      await loadProduct();
      setReviewForm(INITIAL_REVIEW);
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to submit review');
    } finally {
      setSubmittingReview(false);
    }
  }

  async function handleQuestionSubmit(event) {
    event.preventDefault();
    setSubmittingQuestion(true);
    setError('');

    try {
      await api.post(`/api/products/${slug}/questions`, questionForm);
      await loadProduct();
      setQuestionForm(INITIAL_QUESTION);
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to submit question');
    } finally {
      setSubmittingQuestion(false);
    }
  }

  if (loading) {
    return <div className="h-60 rounded-3xl bg-slate-100 animate-pulse" />;
  }

  if (error && !product) {
    return <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>;
  }

  return (
    <div className="animate-in pb-20 mt-8 space-y-6">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{product.category}</p>
        <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
        <p className="mt-2 text-slate-500 max-w-3xl">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.features.map((feature) => (
            <span key={feature} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{feature}</span>
          ))}
        </div>
      </div>

      {aiInsights && (
        <div className="rounded-3xl border border-sky-200 bg-sky-50 p-6">
          <div className="inline-flex items-center gap-2 text-sky-700 font-bold text-sm mb-2">
            <Sparkles size={16} /> AI Product Insights ({aiInsights.confidence} confidence)
          </div>
          <p className="text-slate-700 font-medium mb-3">{aiInsights.summary}</p>
          <div className="space-y-1 text-sm text-slate-600">
            {aiInsights.recommendations.map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Reviews</h2>
            <div className="inline-flex items-center gap-1 text-amber-500 font-bold"><Star size={15} fill="currentColor" /> {product.rating}</div>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-3 mb-6">
            <input
              value={reviewForm.name}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-100"
              required
            />
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-100"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>{value} Star</option>
              ))}
            </select>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
              rows={3}
              placeholder="Leave your review"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-100"
              required
            />
            <button
              disabled={submittingReview}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Mail size={14} /> {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {product.reviews.map((review, index) => (
              <article key={`${review.name}-${index}`} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-slate-800">{review.name}</p>
                  <p className="text-xs font-bold text-amber-500">{review.rating}/5</p>
                </div>
                <p className="text-sm text-slate-600">{review.comment}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare size={16} className="text-slate-600" />
            <h2 className="text-xl font-black text-slate-900">Product Q&A</h2>
          </div>

          <form onSubmit={handleQuestionSubmit} className="space-y-3 mb-6">
            <input
              value={questionForm.name}
              onChange={(e) => setQuestionForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-100"
              required
            />
            <textarea
              value={questionForm.question}
              onChange={(e) => setQuestionForm((prev) => ({ ...prev, question: e.target.value }))}
              rows={3}
              placeholder="Ask a question about this product"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-100"
              required
            />
            <button
              disabled={submittingQuestion}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
            >
              {submittingQuestion ? 'Posting...' : 'Post Question'}
            </button>
          </form>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {product.qna.map((item) => (
              <article key={item._id} className="rounded-xl border border-slate-100 p-3">
                <p className="text-sm font-semibold text-slate-800">Q: {item.question}</p>
                <p className="text-xs text-slate-400 mt-1">Asked by {item.askedBy}</p>
                <p className="text-sm text-slate-600 mt-2">
                  {item.answer ? `A: ${item.answer}` : 'A: Thanks for asking. Our team will answer shortly.'}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetails;
