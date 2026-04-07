import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, X, Zap, AlertCircle, TrendingUp,
  Users, Clock, ArrowUpRight, MessageSquare,
} from 'lucide-react';

/* ─── Mock notification data ─────────────────────────────── */
const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'risk',
    title: 'Candidate needs a nudge',
    body: 'Sarah Chen hasn\'t moved in 5 days. Send a quick re-engagement message?',
    cta: 'Nudge Now',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 'n2',
    type: 'trending',
    title: 'Your job post is trending!',
    body: '12 new applicants today for Senior React Engineer. Review the pipeline.',
    cta: 'View Applicants',
    time: '18 min ago',
    unread: true,
  },
  {
    id: 'n3',
    type: 'hire',
    title: 'Candidate moved to Hired',
    body: 'Marcus Williams was marked as Hired. Update the headcount tracker.',
    cta: 'View Pipeline',
    time: '1 hr ago',
    unread: false,
  },
  {
    id: 'n4',
    type: 'alert',
    title: 'Drop-off spike detected',
    body: 'Interview stage drop-off increased by 14% this week. Check the funnel.',
    cta: 'See Insights',
    time: '3 hr ago',
    unread: false,
  },
  {
    id: 'n5',
    type: 'tip',
    title: 'Pro Tip: AI Match is live',
    body: 'TalentNexus AI matched 8 new candidates to your open Product Manager role.',
    cta: 'View Matches',
    time: 'Yesterday',
    unread: false,
  },
];

const TYPE_CONFIG = {
  risk: {
    icon: <AlertCircle size={14} />,
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    ctaColor: 'text-rose-600 hover:text-rose-700',
    dot: 'bg-rose-500',
  },
  trending: {
    icon: <TrendingUp size={14} />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    ctaColor: 'text-emerald-600 hover:text-emerald-700',
    dot: 'bg-emerald-500',
  },
  hire: {
    icon: <CheckCircle size={14} />,
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    ctaColor: 'text-indigo-600 hover:text-indigo-700',
    dot: 'bg-indigo-500',
  },
  alert: {
    icon: <Zap size={14} />,
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
    ctaColor: 'text-amber-600 hover:text-amber-700',
    dot: 'bg-amber-500',
  },
  tip: {
    icon: <MessageSquare size={14} />,
    bg: 'bg-slate-50',
    text: 'text-slate-500',
    border: 'border-slate-200',
    ctaColor: 'text-slate-600 hover:text-slate-800',
    dot: 'bg-slate-400',
  },
};

/* ─── Individual notification item ─────────────────────────── */
function NotificationItem({ notif, onMarkRead }) {
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.tip;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className={`relative flex gap-3 rounded-xl border p-4 transition-colors ${cfg.border} ${notif.unread ? `${cfg.bg}` : 'bg-white hover:bg-slate-50'}`}
    >
      {/* unread dot */}
      {notif.unread && (
        <span className={`absolute right-3 top-3 h-2 w-2 rounded-full ${cfg.dot}`} />
      )}

      {/* icon */}
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ${cfg.text}`}>
        {cfg.icon}
      </div>

      {/* content */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 leading-snug">{notif.title}</p>
        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{notif.body}</p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            className={`inline-flex items-center gap-1 text-xs font-semibold ${cfg.ctaColor} transition-colors`}
          >
            {notif.cta} <ArrowUpRight size={11} />
          </button>
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
            <Clock size={9} /> {notif.time}
          </span>
        </div>
      </div>

      {/* mark read */}
      {notif.unread && (
        <button
          type="button"
          onClick={() => onMarkRead(notif.id)}
          className="mt-0.5 shrink-0 rounded-lg p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
          title="Mark as read"
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const drawerRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="relative" ref={drawerRef}>
      {/* Bell trigger button */}
      <button
        type="button"
        id="notification-bell"
        onClick={() => setOpen((v) => !v)}
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-150 ${
          open
            ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
            : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
        }`}
        aria-label="Notifications"
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay (mobile) */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, x: 20, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-12 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_60px_rgb(0,0,0,0.12)]"
              style={{ maxHeight: 'calc(100vh - 80px)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-black text-slate-900">Notifications</h2>
                  <p className="text-[11px] text-slate-400">
                    {unreadCount > 0 ? `${unreadCount} unread retention signals` : 'All caught up ✓'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
                <AnimatePresence>
                  {notifications.map((n) => (
                    <NotificationItem key={n.id} notif={n} onMarkRead={markRead} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 px-5 py-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  View all activity <ArrowUpRight size={11} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationCenter;
