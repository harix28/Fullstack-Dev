import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldAlert, Compass, FileCheck, HelpCircle, Shield, Award, Users, ArrowRight } from 'lucide-react';
import ROUTES from '@/constants/routes';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8f9fc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20">
        {/* HERO */}
        <section className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16 pt-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1a2f8a] dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-4">
            <Award className="w-3.5 h-3.5" /> College Major Capstone Project
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0f1740] dark:text-white mb-5 tracking-tight">
            About GovConnect
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between 1.4 billion citizens and critical government services through AI-assisted discoverability and private digital tooling.
          </p>
        </section>

        {/* MISSION */}
        <section className="bg-white dark:bg-slate-900 py-16 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 transition-colors">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#0d9488] mb-3">Our Core Mission</h2>
            <blockquote className="text-xl sm:text-3xl font-extrabold text-[#0f1740] dark:text-white leading-relaxed tracking-tight">
              "To make government services accessible, understandable, and actionable for every Indian citizen regardless of literacy, language, or background."
            </blockquote>
          </div>
        </section>

        {/* HOW WE HELP */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0f1740] dark:text-white mb-3">How We Empower Citizens</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Three pillars of the GovConnect ecosystem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/60 text-[#1a2f8a] dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Compass size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#0f1740] dark:text-white mb-3">1. Discover</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                We remove the guesswork from finding government schemes, vacancies, and local CSC services by matching your unique citizen profile against active eligibility rules.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-teal-50 dark:bg-teal-950/60 text-[#0d9488] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#0f1740] dark:text-white mb-3">2. Organize</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Our encrypted Document Vault organizes certificates, marksheets, and identity proofs locally with simulated OCR data extraction for effortless repeated use.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#0f1740] dark:text-white mb-3">3. Assist</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Our "Ask Sarkar AI" assistant helps translate complex gazette rules into plain language and formats structured grievance submissions ready for official portals.
              </p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-16">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-6 rounded-2xl flex gap-4 items-start shadow-xs">
            <ShieldAlert className="w-7 h-7 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <h3 className="font-bold text-amber-950 dark:text-amber-100 mb-1">Important Civic Notice</h3>
              <p>
                GovConnect is <strong>NOT an official government agency</strong>. We are an independent civic-tech platform designed to aggregate open public information and empower citizens. We do not collect statutory fees or approve benefits. Final submissions and approvals always take place securely on the respective official government portals.
              </p>
            </div>
          </div>
        </section>

        {/* TECH & TEAM */}
        <section className="bg-white dark:bg-slate-900 py-16 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#0f1740] dark:text-white mb-4">Built for Scale, Accessibility & Privacy</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed">
              GovConnect uses modern reactive frontend architecture, bilingual i18n support, local client encryption, and responsive design adhering to Government of India (GIGW) digital guidelines.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">React 18</span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">TypeScript</span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Tailwind CSS</span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Bilingual Engine</span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Client-Side Vault</span>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
