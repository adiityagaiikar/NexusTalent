import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api';
import { ArrowRight, ArrowUpRight, Clock3, Sparkles, Users } from '../constants/icons';

function EventSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-52 animate-pulse bg-slate-100" />
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

function EventEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">No events yet</p>
      <h2 className="mt-3 text-2xl font-black text-slate-900">No hackathons are live.</h2>
      <p className="mt-2 text-sm text-slate-500">Create an event from the admin panel to start accepting registrations.</p>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event.slug || event._id}`}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span className="inline-flex items-center gap-1 text-emerald-700"><Clock3 size={13} /> {new Date(event.date || event.deadline || Date.now()).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1 text-sky-700"><Users size={13} /> {event.participants || 0}</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 transition group-hover:text-sky-700">{event.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
      </div>
    </Link>
  );
}

function Events() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/api/events');
        if (!mounted) return;

        const items = response.data.data || [];
        setEvents(items);

        if (id) {
          const detail = await api.get(`/api/events/${id}`);
          if (!mounted) return;
          setSelectedEvent(detail.data.data);
        } else {
          setSelectedEvent(null);
        }
      } catch (fetchError) {
        if (!mounted) return;
        setError(fetchError.response?.data?.message || 'Unable to load events');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const featuredEvents = useMemo(() => events.slice(0, 6), [events]);

  const handleRegister = async () => {
    if (!selectedEvent?._id && !selectedEvent?.id) return;

    try {
      setRegistering(true);
      const response = await api.post('/api/events/register', {
        eventId: selectedEvent._id || selectedEvent.id,
      });
      setSelectedEvent(response.data.data);
      setRegistered(true);
    } catch (registerError) {
      setError(registerError.response?.data?.message || 'Unable to register for this event');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <EventSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
        {error}
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <article className="mx-auto max-w-5xl space-y-6 py-4">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:underline">
          <ArrowRight size={16} className="rotate-180" /> Back to events
        </Link>

        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-72 bg-slate-100">
            <img
              src={selectedEvent.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80'}
              alt={selectedEvent.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                <Sparkles size={14} /> Event Details
              </p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">{selectedEvent.title}</h1>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {new Date(selectedEvent.date || selectedEvent.deadline || Date.now()).toLocaleDateString()}</span>
              <span className="inline-flex items-center gap-1"><Users size={14} /> {selectedEvent.participants || 0} participants</span>
            </div>
            <p className="text-slate-700 leading-7">{selectedEvent.description}</p>

            <div>
              <h2 className="text-lg font-black text-slate-900">Prize Pool</h2>
              <div className="mt-3 space-y-3">
                {(selectedEvent.prizes || []).map((prize) => (
                  <div key={`${prize.title}-${prize.value}`} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                    <span className="font-semibold text-slate-800">{prize.title}</span>
                    <span className="text-sm font-bold text-sky-700">{prize.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Participants</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{selectedEvent.participants || 0}</p>
            </div>
            <button
              type="button"
              onClick={handleRegister}
              disabled={registering}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <ArrowUpRight size={14} /> {registering ? 'Registering...' : registered ? 'Registered' : 'Register Now'}
            </button>
          </aside>
        </section>
      </article>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-white via-emerald-50 to-cyan-50 p-8 shadow-sm">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          <Sparkles size={14} /> Events & Hackathons
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Events that drive repeat usage and social proof.</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          Browse buildathons, design challenges, and hackathons with real participant counts and clear prize pools.
        </p>
      </section>

      {featuredEvents.length === 0 ? (
        <EventEmptyState />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event._id || event.slug} event={event} />
          ))}
        </section>
      )}
    </div>
  );
}

export default Events;
