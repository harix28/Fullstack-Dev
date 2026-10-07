import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ROUTES from '@/constants/routes';

const SERVICES = [
  { title: 'Government Schemes',     desc: 'Match 200+ central and state welfare schemes to your profile in seconds.' },
  { title: 'Sarkari Jobs',           desc: 'Track UPSC, SSC, Banking, Railways, and State PSC vacancies with deadline alerts.' },
  { title: 'Document Vault',         desc: 'Organise Aadhaar, PAN, marksheets, and certificates in one private, encrypted space.' },
  { title: 'Grievance Assistance',   desc: 'Draft formal CPGRAMS-formatted complaints with automatic departmental routing.' },
  { title: 'Ask Sarkar AI',          desc: 'Bilingual conversational guidance on eligibility, rules, and application steps.' },
  { title: 'Local Services',         desc: 'Locate nearby CSC centres, municipal offices, and emergency helplines.' },
];

const FAQS = [
  {
    q: 'What is the purpose of GovConnect?',
    a: 'GovConnect was built as a capstone project to reduce the friction citizens face navigating dozens of disconnected government portals. It consolidates scheme matching, job tracking, document storage, and grievance drafting in one interface.'
  },
  {
    q: 'Does GovConnect submit applications on my behalf?',
    a: 'No. Government portals require biometric Aadhaar verification and OTPs. GovConnect prepares your application and provides a direct link to the verified official portal for final submission.'
  },
  {
    q: 'How is citizen data protected?',
    a: 'Your documents and profile data are stored locally in your browser. Nothing is sent to unauthorized third-party servers. You remain in full control.'
  },
  {
    q: 'Is Hindi supported?',
    a: 'Yes. The interface and Ask Sarkar AI both support English, Hindi, and Hinglish. Toggle language from the navigation bar at any time.'
  },
  {
    q: 'How does the Ask Sarkar AI assistant work?',
    a: 'Ask Sarkar uses NLP to understand plain-language questions, translate gazette rules into plain summaries, evaluate eligibility, and generate formal grievance letters ready for CPGRAMS.'
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
      <Navbar />

      <main className="flex-grow">

        {/* ── Hero ── */}
        <section className="border-b border-[var(--color-border)] px-5 sm:px-10 py-20 sm:py-28 max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-6">
            Citizen Services Platform
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[var(--color-text)] leading-snug">
            One platform.<br />Every citizen service.
          </h1>
          <p className="mt-6 text-[var(--color-muted)] text-base leading-relaxed max-w-xl">
            GovConnect unifies government welfare schemes, recruitment notifications, document storage, and grievance assistance into a single quiet interface — built for 1.4 billion citizens.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[var(--color-ink-800)] text-[var(--color-surface)] dark:bg-[var(--color-parch-200)] dark:text-[var(--color-ink-900)] rounded-sm hover:opacity-90 transition-opacity"
            >
              Sign In <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-[var(--color-muted)] border border-[var(--color-border)] rounded-sm hover:text-[var(--color-text)] hover:bg-[var(--color-parch-100)] dark:hover:bg-[var(--color-ink-800)] transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-1 text-xs text-[var(--color-muted)]">
            {['50+ Welfare Schemes', '200+ Recruitment Exams', 'Encrypted Document Vault', '100% Free & Open'].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </section>

        {/* ── Services ── */}
        <section id="services" className="border-b border-[var(--color-border)] px-5 sm:px-10 py-16 max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-10">
            What's inside
          </p>
          <div className="divide-y divide-[var(--color-border)]">
            {SERVICES.map(({ title, desc }, i) => (
              <div key={i} className="py-5 flex items-start justify-between gap-6 group">
                <div>
                  <p className="font-serif text-base text-[var(--color-text)]">{title}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)] leading-relaxed">{desc}</p>
                </div>
                <span className="shrink-0 text-[var(--color-subtle)] group-hover:text-[var(--color-muted)] transition-colors mt-1">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Motive / About ── */}
        <section id="motive" className="border-b border-[var(--color-border)] px-5 sm:px-10 py-16 max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-8">
            Our motive
          </p>
          <div className="space-y-4 text-[var(--color-muted)] text-sm leading-relaxed max-w-xl">
            <p>
              A citizen seeking welfare support must navigate dozens of disconnected portals — each with its own jargon, login, and process. GovConnect was built to change that.
            </p>
            <p>
              We don't replace official government systems. We make them <em>accessible</em> — matching your profile to the right schemes, preparing your applications, and guiding you to the correct portal with everything ready.
            </p>
            <p className="text-[var(--color-text)] font-medium">
              Built as a college capstone project. Free. Open. Private.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="border-b border-[var(--color-border)] px-5 sm:px-10 py-16 max-w-3xl mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-10">
            Questions
          </p>
          <div className="divide-y divide-[var(--color-border)]">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between py-4 text-left gap-4 cursor-pointer"
                >
                  <span className="text-sm text-[var(--color-text)] font-medium">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 mt-0.5 text-[var(--color-subtle)] transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <p className="pb-5 text-sm text-[var(--color-muted)] leading-relaxed max-w-lg">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-5 sm:px-10 py-16 max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl text-[var(--color-text)]">Ready to begin?</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">Create a free account in under two minutes.</p>
          <Link
            to={ROUTES.REGISTER}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[var(--color-ink-800)] text-[var(--color-surface)] dark:bg-[var(--color-parch-200)] dark:text-[var(--color-ink-900)] rounded-sm hover:opacity-90 transition-opacity"
          >
            Create Account <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}
