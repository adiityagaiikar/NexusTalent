import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Star } from '../constants/icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80';

function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const basePath = location.pathname.startsWith('/admin') ? '/admin/products' : '/student/products';

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || 'Unable to load products');
        }

        setProducts(payload.data || []);
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') return;
        setError(fetchError.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="animate-in pb-20 mt-8">
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Platform Products</p>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900">TalentNexus Product Suite</h1>
        <p className="mt-2 text-slate-500 max-w-3xl">
          Explore student and employer products. Open any product to read reviews, leave feedback, and ask product-specific questions.
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="h-48 w-full rounded-2xl bg-slate-100 animate-pulse" />
              <div className="mt-4 h-4 w-1/3 rounded bg-slate-100 animate-pulse" />
              <div className="mt-2 h-6 w-2/3 rounded bg-slate-100 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-500">
          No data available
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`${basePath}/${product.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={product.image || FALLBACK_IMAGE}
                alt={product.title || product.name}
                loading="lazy"
                className="object-cover w-full h-48 rounded-2xl"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                <Sparkles size={13} /> {product.category}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{product.title || product.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{product.shortDescription}</p>

              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={15} fill="currentColor" /> {product.rating}
                </div>
                <span className="text-xs text-slate-400 font-semibold">${product.price ?? 0}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
