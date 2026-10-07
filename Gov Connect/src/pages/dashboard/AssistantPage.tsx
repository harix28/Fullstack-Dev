import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ROUTES from '@/constants/routes';

const LINKS = [
  { label: 'Browse Schemes',  route: ROUTES.SCHEMES },
  { label: 'Find Jobs',       route: ROUTES.JOBS },
  { label: 'File a Grievance', route: ROUTES.GRIEVANCES },
  { label: 'My Documents',    route: ROUTES.DOCUMENTS },
];

export default function AssistantPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md space-y-10">

        {/* Icon + heading */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Bot className="w-7 h-7 text-[var(--color-muted)]" />
          </div>

          <div>
            <h1 className="font-serif text-3xl text-[var(--color-text)] leading-snug">
              Ask Sarkar
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              AI Assistant — coming soon
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border)]" />

        {/* Message */}
        <div className="space-y-3 text-sm text-[var(--color-muted)] leading-relaxed text-center">
          <p>
            Hello, <span className="text-[var(--color-text)] font-medium">{user?.name || 'Citizen'}</span>.
            We're connecting Ask Sarkar to live government data and Gemini AI.
          </p>
          <p>
            The assistant will help you discover schemes, draft grievances, and find jobs — all in English, Hindi, or Hinglish.
          </p>
          <div className="inline-flex items-center gap-2 text-[var(--color-muted)] text-xs border border-[var(--color-border)] px-3 py-1.5 rounded-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>Service available soon</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border)]" />

        {/* Quick links */}
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-subtle)] font-sans">
            Available now
          </p>
          <div className="grid grid-cols-2 gap-2">
            {LINKS.map(({ label, route }) => (
              <button
                key={label}
                onClick={() => navigate(route)}
                className="flex items-center justify-between px-3 py-2.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded-sm hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)] transition-colors cursor-pointer"
              >
                <span>{label}</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
