import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import PublicProfileCard from '../components/PublicProfileCard';

function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Determines if the visitor is currently logged in
  const isLoggedIn = !!localStorage.getItem('authUser');

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const response = await api.get(`/api/users/${id}`);
        if (!mounted) return;

        const data = response.data.data;
        setProfile(data);

        // SEO meta tags
        document.title = `${data.name} | TalentNexus`;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
        meta.content = data.bio || data.headline || 'TalentNexus public profile';

        // Analytics track (fire-and-forget)
        api.post('/api/analytics/track', { type: 'profile_view', targetId: id }).catch(() => {});
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError.response?.data?.message || 'Unable to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-2xl space-y-4">
          <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm font-semibold text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm font-semibold text-slate-500">
          No profile data available.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <PublicProfileCard profile={profile} isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default PublicProfile;
