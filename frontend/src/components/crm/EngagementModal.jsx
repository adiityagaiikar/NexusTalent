import React, { useMemo, useState } from 'react';
import { Mail, MessageSquare, X } from '../../constants/icons';

function EngagementModal({ candidate, onClose }) {
  const [channel, setChannel] = useState(candidate?.contactPreference || 'email');

  const channelMeta = useMemo(() => {
    if (channel === 'whatsapp') {
      return {
        icon: MessageSquare,
        title: 'WhatsApp Outreach',
        helper: 'Short, high-context outreach with a quick reply CTA.',
        placeholder: `Hi ${candidate.name}, we have a role that maps strongly to your recent profile updates. Open to a quick 10-min chat this week?`,
      };
    }

    return {
      icon: Mail,
      title: 'Email Outreach',
      helper: 'Structured email with role details and timeline.',
      placeholder: `Hi ${candidate.name}, your profile is a great match for our ${candidate.role} opening. Would you like to explore the opportunity this week?`,
    };
  }, [candidate, channel]);

  const ChannelIcon = channelMeta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Engagement</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{candidate.name}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{candidate.role}</p>
          </div>
          <button
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-5 inline-flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setChannel('email')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              channel === 'email'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            <Mail size={15} /> Email
          </button>
          <button
            type="button"
            onClick={() => setChannel('whatsapp')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              channel === 'whatsapp'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            <MessageSquare size={15} /> WhatsApp
          </button>
        </div>

        <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <ChannelIcon size={16} /> {channelMeta.title}
        </div>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">{channelMeta.helper}</p>

        <textarea
          rows={5}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          defaultValue={channelMeta.placeholder}
        />

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-sky-500 dark:hover:bg-sky-400"
            onClick={onClose}
          >
            Send Nudge
          </button>
        </div>
      </div>
    </div>
  );
}

export default EngagementModal;
