import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../lib/api';
import { Sparkles, Star } from '../constants/icons';

function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const basePath = location.pathname.startsWith('/admin') ? '/admin/products' : '/student/products';

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        const response = await api.get('/api/products');
        if (!mounted) return;
        setProducts(response.data);
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError.response?.data?.message || 'Unable to load products');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
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
            <div key={index} className="h-52 rounded-3xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`${basePath}/${product.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                <Sparkles size={13} /> {product.category}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{product.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{product.shortDescription}</p>

              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={15} fill="currentColor" /> {product.rating}
                </div>
                <span className="text-xs text-slate-400 font-semibold">{product.reviewsCount} reviews</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
