import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api';
import { ArrowRight, Clock3, ExternalLink, Sparkles, Star } from '../constants/icons';

function BlogSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-48 animate-pulse bg-slate-100" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
            <div className="h-6 w-4/5 animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">No posts yet</p>
      <h2 className="mt-3 text-2xl font-black text-slate-900">The blog is waiting for content.</h2>
      <p className="mt-2 text-sm text-slate-500">Create a post from the admin panel to start publishing career content.</p>
    </div>
  );
}

function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug || post._id}`}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={post.image || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80'}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/35 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span>{post.author}</span>
          <span className="inline-flex items-center gap-1 text-sky-700"><Clock3 size={13} /> {post.readTime || 4} min</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 transition group-hover:text-sky-700">{post.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt || post.content}</p>
        <div className="flex flex-wrap gap-2">
          {(post.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function Blog() {
  const { id } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/api/blogs');
        if (!mounted) return;

        const items = response.data.data || [];
        setBlogs(items);

        if (id) {
          const detail = await api.get(`/api/blogs/${id}`);
          if (!mounted) return;
          setSelectedBlog(detail.data.data);
        } else {
          setSelectedBlog(null);
        }
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError.response?.data?.message || 'Unable to load blogs');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const featuredBlogs = useMemo(() => blogs.slice(0, 6), [blogs]);

  const copyLink = async () => {
    if (!selectedBlog) return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (loading) {
    return <BlogSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
        {error}
      </div>
    );
  }

  if (selectedBlog) {
    return (
      <article className="mx-auto max-w-4xl space-y-6 py-4">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:underline">
          <ArrowRight size={16} className="rotate-180" /> Back to blog
        </Link>

        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-72 bg-slate-100">
            <img
              src={selectedBlog.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'}
              alt={selectedBlog.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                <Sparkles size={14} /> {selectedBlog.author}
              </p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">{selectedBlog.title}</h1>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {selectedBlog.readTime || 4} min read</span>
              <span>{new Date(selectedBlog.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <p className="mt-5 whitespace-pre-line text-slate-700 leading-7">{selectedBlog.content}</p>
          </div>

          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(selectedBlog.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              <ExternalLink size={14} /> {copied ? 'Link copied' : 'Share post'}
            </button>
          </aside>
        </section>
      </article>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-white via-sky-50 to-cyan-50 p-8 shadow-sm">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          <Sparkles size={14} /> TalentNexus Blog
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Career content designed for discovery and retention.</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Browse interview prep, salary insights, and portfolio guidance that keeps candidates coming back.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          <Star size={14} /> Editorial picks
        </div>
      </section>

      {featuredBlogs.length === 0 ? (
        <BlogEmptyState />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredBlogs.map((post) => (
            <BlogCard key={post._id || post.slug} post={post} />
          ))}
        </section>
      )}
    </div>
  );
}

export default Blog;
