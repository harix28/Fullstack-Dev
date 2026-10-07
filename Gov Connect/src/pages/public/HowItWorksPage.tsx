import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, 
  Target, 
  FolderLock, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ROUTES from '@/constants/routes';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Single Citizen Profile',
      subtitle: 'One Unified Profile • Zero Redundant Data Entry',
      icon: UserCheck,
      color: 'bg-blue-600',
      description: 'Input your core demographics, education level, category (General/OBC/SC/ST/EWS), income band, domicile state, and skills once. GovConnect stores this information locally to power all platform modules without repeated forms.',
      highlights: [
        'Aadhaar-friendly demographic structure',
        'Income tier & caste category matching',
        'Skills & career qualification tracking',
      ],
    },
    {
      step: '02',
      title: 'Get Intelligent Scheme & Job Recommendations',
      subtitle: 'Dynamic Profile-Based AI Matching Engine',
      icon: Target,
      color: 'bg-teal-600',
      description: 'Our rule-based recommendation engine checks your profile against eligibility criteria for 200+ Central and State welfare schemes and hundreds of Sarkari vacancies, generating an indicative match score (e.g., 92% Match).',
      highlights: [
        'Visual eligibility checklists with instant pass/fail indicators',
        'Skill overlap mapping for technical and administrative jobs',
        'Deadline countdown alerts so you never miss an opening',
      ],
    },
    {
      step: '03',
      title: 'Organize Your Digital Document Vault',
      subtitle: 'Local Storage • Ready for Application Submission',
      icon: FolderLock,
      color: 'bg-amber-600',
      description: 'Securely upload and categorize your essential certificates (Aadhaar, PAN, Marksheets, Income Certificates). Preview documents, monitor validity dates, and review OCR-extracted records before applying on official portals.',
      highlights: [
        'Categorized storage: Identity, Education, Income, Category',
        'Automated simulated OCR field extraction',
        'Privacy-first demo architecture (files stored in browser memory)',
      ],
    },
    {
      step: '04',
      title: 'Take Action with Assisted Official Submission',
      subtitle: 'AI Drafting • Official Government Portal Hand-off',
      icon: Send,
      color: 'bg-indigo-600',
      description: 'When applying for a scheme, job, or reporting a public grievance, GovConnect prepares all checklists and drafts a formal complaint letter. You review, confirm, and complete final authentication directly on authorized government websites.',
      highlights: [
        'AI classifies department and severity for civic complaints',
        'Generates editable formal complaint draft letters',
        'Direct link to CPGRAMS, Jansunwai, SSC, and official portals',
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8f9fc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-grow">
        {/* Header Hero */}
        <section className="bg-gradient-to-b from-blue-50/70 via-white to-[#f8f9fc] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 py-16 md:py-20 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-950/60 text-[#1a2f8a] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-5 border border-blue-200/60 dark:border-blue-800/60">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Platform Architecture & User Journey
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f1740] dark:text-white tracking-tight leading-tight mb-5">
              How <span className="text-[#0d9488]">GovConnect</span> Empowers Every Citizen
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We bridge the gap between complex government portals and everyday citizens through a transparent 4-step digital workflow.
            </p>
          </div>
        </section>

        {/* 4 Steps Section */}
        <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isEven = index % 2 === 1;
              return (
                <div
                  key={s.step}
                  className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs`}
                >
                  {/* Left / Visual Step Box */}
                  <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
                    <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-3xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center p-8 border border-slate-200 dark:border-slate-700 shadow-inner">
                      <div className={`w-24 h-24 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-xl`}>
                        <Icon className="w-12 h-12" />
                      </div>
                      <div className="absolute -top-3 -left-3 w-11 h-11 rounded-xl bg-[#0f1740] dark:bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-md">
                        {s.step}
                      </div>
                    </div>
                  </div>

                  {/* Right / Content Box */}
                  <div className="w-full lg:w-1/2 space-y-4">
                    <div className="inline-block text-xs font-bold text-[#0d9488] uppercase tracking-wider">
                      {s.subtitle}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f1740] dark:text-white tracking-tight">
                      {s.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                      {s.description}
                    </p>
                    <div className="pt-2 space-y-2">
                      {s.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Assisted Submission Model Callout */}
        <section className="bg-gradient-to-r from-[#0f1740] via-[#1a2f8a] to-[#0f1740] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-400" /> Transparent & Responsible Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Why We Use the Assisted Submission Model
            </h2>
            <p className="text-blue-100/90 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
              Official government applications require citizen authentication including biometric Aadhaar e-KYC, CAPTCHA validation, and OTPs. GovConnect empowers citizens by doing the heavy research and preparation work, while keeping final verification firmly in the citizen&apos;s hands.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <Link
                to={ROUTES.REGISTER}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
              >
                Create Citizen Profile <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={ROUTES.SERVICES}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all border border-white/20"
              >
                Browse Public Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
