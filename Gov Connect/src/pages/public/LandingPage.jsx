import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, FolderOpen, MessageSquare, Bot, ShieldCheck, ChevronDown, ArrowRight, CheckCircle2, MapPin, Shield, Layers, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ROUTES from '@/constants/routes';
import { cn } from '@/utils/cn';
const LandingPage = () => {
    const { t } = useTranslation();
    const [openFaq, setOpenFaq] = useState(null);
    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };
    const faqs = [
        {
            q: 'What is the motive of GovConnect?',
            a: 'GovConnect was engineered as a College Major Capstone Project to solve the fragmentation of citizen services in India. Currently, citizens must navigate dozens of disconnected portals (myScheme, CPGRAMS, SSC, NSP, state portals) with confusing bureaucratic jargon. GovConnect consolidates scheme matching, recruitment tracking, document storage, and grievance drafting into one unified citizen interface.'
        },
        {
            q: 'How does the platform protect citizen data?',
            a: 'GovConnect uses a privacy-first, client-side encryption architecture. Your documents and demographic information remain securely stored in your browser memory and are not uploaded to unauthorized third-party databases. You retain full control of your records.'
        },
        {
            q: 'Does GovConnect submit applications on my behalf?',
            a: 'No. Government portals mandate biometric Aadhaar verification, OTPs, and CAPTCHAs for statutory security. GovConnect acts as an intelligent preparation layer: it calculates your eligibility, verifies required documents, and drafts application packages, then provides a 1-click jump to the verified official government portal for final submission.'
        },
        {
            q: 'Does GovConnect support bilingual accessibility?',
            a: 'Yes! GovConnect provides bilingual support in both English and Hindi. Citizens can instantly toggle the language using the switch in the top navigation bar at any moment.'
        },
        {
            q: 'How does the Ask Sarkar AI assistant work?',
            a: 'Ask Sarkar AI leverages modern NLP techniques to understand natural queries in plain language, translate complex gazette rules into simple bullet points, evaluate eligibility parameters, and generate professionally structured formal grievance letters ready for CPGRAMS submission.'
        }
    ];
    const services = [
        {
            icon: FileText,
            color: 'bg-[#FAF7F2] text-[#59463B]',
            title: 'Government Welfare Schemes',
            desc: 'Smart matching against 200+ central & state schemes with instant eligibility scores based on caste, income, and education criteria.',
            badge: '50+ Verified Schemes'
        },
        {
            icon: Briefcase,
            color: 'bg-[#FAF7F2] text-[#A67C65]',
            title: 'Sarkari Jobs & Recruitment',
            desc: 'Track UPSC, SSC, Banking, Railways, and State PSUs with qualification fit checklists, deadline countdowns, and official links.',
            badge: '200+ Job Roles'
        },
        {
            icon: FolderOpen,
            color: 'bg-[#FAF7F2] text-[#59463B]',
            title: 'Digital Document Vault',
            desc: 'Securely organize Aadhaar, PAN, marksheets, and income certificates with simulated OCR data extraction for effortless reuse.',
            badge: 'Client-Side Encrypted'
        },
        {
            icon: MessageSquare,
            color: 'bg-amber-50 text-amber-600',
            title: 'AI Grievance Redressal',
            desc: 'Draft formal, legally formatted grievance letters for CPGRAMS and state portals with automated departmental routing recommendations.',
            badge: 'CPGRAMS Format'
        },
        {
            icon: Bot,
            color: 'bg-purple-50 text-purple-600',
            title: 'Ask Sarkar AI Assistant',
            desc: 'Bilingual 24/7 conversational guidance to clarify complex government rules, verify eligibility conditions, and guide next steps.',
            badge: 'Hindi & English'
        },
        {
            icon: MapPin,
            color: 'bg-emerald-50 text-emerald-600',
            title: 'Local Services Locator',
            desc: 'Find verified nearby Common Service Centres (CSC), municipal offices, hospitals, and emergency helplines with interactive map pins.',
            badge: 'Proximity Filter'
        }
    ];
    return (<div className="min-h-screen flex flex-col font-sans bg-[#F5EBE0] text-[#2D231E] transition-colors">
      {/* Clean Navbar: Only Mode (Theme), Language, Sign In, Register */}
      <Navbar />
      
      <main className="flex-grow">
        
        {/* ── 1. HERO SECTION & HERO CARD ── */}
        <section className="w-full bg-gradient-to-br from-white via-[#FAF7F2] to-[#EDEDE9] pt-16 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#D6CCC2]/70">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Copy & Motive */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2D231E] leading-[1.12] tracking-tight">
                One Platform. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A67C65] via-[#7A6051] to-[#59463B]">
                  Every Citizen Service.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B5E55] max-w-2xl leading-relaxed">
                GovConnect unifies 1,000+ government welfare schemes, recruitment notifications, an encrypted document vault, and AI grievance assistance into a single intuitive gateway. Designed to eliminate bureaucratic friction for 1.4 billion citizens.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to={ROUTES.LOGIN} className="inline-flex justify-center items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl text-white bg-[#59463B] hover:from-[#2D231E] hover:to-[#59463B] shadow-md hover:shadow-lg transition-all duration-200">
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4"/>
                </Link>
                <Link to={ROUTES.REGISTER} className="inline-flex justify-center items-center px-6 py-3.5 text-sm font-semibold rounded-xl border border-[#D6CCC2] text-[#2D231E] bg-white/90 hover:bg-[#EDEDE9] transition-colors shadow-xs">
                  Register Account
                </Link>
                <a href="#motive" className="inline-flex justify-center items-center px-4 py-3.5 text-xs font-semibold text-[#7D6E63] hover:text-[#59463B] transition-colors">
                  Learn Motive & Services ↓
                </a>
              </div>

              {/* Stats Strip */}
              <div className="pt-6 border-t border-[#D6CCC2]/80 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-[#7D6E63]">
                <span className="flex items-center gap-1.5 text-[#2D231E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#59463B]"></span> 50+ Welfare Schemes
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-[#2D231E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A67C65]"></span> 200+ Recruitment Exams
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-[#2D231E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7A6051]"></span> Client-Side OCR Vault
                </span>
                <span>•</span>
                <span className="text-[#A67C65] font-bold">100% Free & Open</span>
              </div>
            </div>

            {/* Right Column: HERO SECTION CARD */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#D6CCC2]/90 relative overflow-hidden">
                
                {/* Hero Card Top Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E3D5CA]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#59463B] flex items-center justify-center text-white font-bold shadow-xs">
                      <Shield className="w-5 h-5"/>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2D231E]">GovConnect Citizen Portal</h4>
                      <p className="text-[10px] text-[#8C7D73]">Single Verified Profile</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[10px] font-bold text-[#A67C65] border border-[#D5BDAF] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A67C65] animate-ping"/>
                    Live System
                  </span>
                </div>

                {/* Hero Card Body Tiles */}
                <div className="mt-4 space-y-2.5">
                  {/* Scheme Item */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2]/70 border border-[#E3D5CA] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#59463B] text-white flex items-center justify-center font-bold text-xs">
                        <FileText className="w-4 h-4"/>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2D231E]">PM MUDRA Yojana</p>
                        <p className="text-[10px] text-[#7D6E63]">₹50K - ₹10L Loan • MSME</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#59463B] bg-white px-2 py-0.5 rounded-md shadow-xs border border-[#D6CCC2]/50">
                      92% Match
                    </span>
                  </div>

                  {/* Job Item */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2]/70 border border-[#E3D5CA] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#A67C65] text-white flex items-center justify-center font-bold text-xs">
                        <Briefcase className="w-4 h-4"/>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2D231E]">SSC CGL Tier 1 Officer</p>
                        <p className="text-[10px] text-[#7D6E63]">Pay Level 7 • 12 Days Left</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#A67C65] bg-white px-2 py-0.5 rounded-md shadow-xs border border-[#D5BDAF]/50">
                      Eligible
                    </span>
                  </div>

                  {/* Document Vault Item */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#D6CCC2] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#59463B] text-white flex items-center justify-center font-bold text-xs">
                        <FolderOpen className="w-4 h-4"/>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2D231E]">Digital Document Vault</p>
                        <p className="text-[10px] text-[#7D6E63]">Aadhaar, PAN & Degree OCR</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Verified
                    </span>
                  </div>

                  {/* Ask Sarkar AI */}
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        <Bot className="w-4 h-4"/>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2D231E]">Ask Sarkar AI Assistant</p>
                        <p className="text-[10px] text-[#7D6E63]">Grievance draft & advice</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-600 bg-white px-2 py-0.5 rounded-md shadow-xs">
                      Active
                    </span>
                  </div>
                </div>

                {/* Hero Card Footer CTA */}
                <div className="mt-4 pt-3 border-t border-[#E3D5CA]/50 flex items-center justify-between text-[11px]">
                  <span className="text-[#7D6E63]">Client Encrypted • Zero Data Loss</span>
                  <Link to={ROUTES.LOGIN} className="font-bold text-[#59463B] hover:underline flex items-center gap-1">
                    Open Dashboard →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 2. PROJECT MOTIVE & PROBLEM STATEMENT (ABOUT SECTION) ── */}
        <section id="motive" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#D6CCC2]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#59463B] text-xs font-bold border border-[#D6CCC2] mb-3">
              <Compass className="w-3.5 h-3.5"/> Project Motive & Problem Statement
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D231E] tracking-tight mb-4">
              Why We Engineered GovConnect
            </h2>
            <p className="text-base text-[#6B5E55] leading-relaxed">
              India has over 1,000 welfare programs and hundreds of competitive exams, yet millions of eligible citizens miss out every year due to fragmented portals, legal jargon, and repetitive bureaucratic obstacles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* The Current Problem */}
            <div className="bg-red-50/50 rounded-2xl p-8 border border-red-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">The Problem in Current Governance</span>
                <h3 className="text-xl font-bold text-[#2D231E] mt-2 mb-4">
                  Fragmented Portals & Bureaucratic Friction
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-[#6B5E55]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>50+ Separate Portals:</strong> Citizens must search different websites for scholarships, farm subsidies, health aid, and employment.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Confusing Jargon:</strong> Complex legal and gazette wording causes eligible citizens to misunderstand qualifying conditions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Repetitive Form Filling:</strong> Citizens re-enter their caste, address, and demographics for every single application.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span><strong>Grievance Abandonment:</strong> Common citizens struggle to identify the correct ministry or draft formal legal complaints.</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-[#8C7D73] mt-6 pt-4 border-t border-red-100">
                Result: Billions of rupees in allocated public funds and career opportunities go unclaimed.
              </p>
            </div>

            {/* Our Engineered Solution */}
            <div className="bg-[#FAF7F2]/50 rounded-2xl p-8 border border-[#E3D5CA] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A67C65]">The GovConnect Solution</span>
                <h3 className="text-xl font-bold text-[#2D231E] mt-2 mb-4">
                  Single Interface & AI-Assisted Empowerment
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-[#6B5E55]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C65] shrink-0 mt-0.5"/>
                    <span><strong>Single Citizen Profile:</strong> Input your demographics once; dynamic eligibility rules calculate instant match scores.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C65] shrink-0 mt-0.5"/>
                    <span><strong>Plain-Language Rules:</strong> AI translates complicated policy eligibility into visual pass/fail checklists.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C65] shrink-0 mt-0.5"/>
                    <span><strong>Client-Side Document Vault:</strong> Secure local storage with OCR indexing prevents repetitive certificate uploading.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#A67C65] shrink-0 mt-0.5"/>
                    <span><strong>Assisted Official Portal Hand-off:</strong> Auto-drafts complaint letters and routes directly to authorized central/state portals.</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-[#A67C65] font-bold mt-6 pt-4 border-t border-[#E3D5CA]">
                Motive: Deliver a zero-friction, transparent civic experience for every Indian citizen.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. CORE SERVICES SUITE (SERVICES SECTION) ── */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#D6CCC2]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] text-[#A67C65] text-xs font-bold border border-[#D5BDAF] mb-3">
              <Layers className="w-3.5 h-3.5"/> Comprehensive Citizen Services
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D231E] tracking-tight mb-4">
              All Citizen Work Housed in One Dashboard
            </h2>
            <p className="text-base text-[#6B5E55]">
              Explore the core service modules. Once you log in, all tasks, applications, and vault records are managed directly from your personalized Citizen Dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item, idx) => {
            const Icon = item.icon;
            return (<div key={idx} className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-[#D6CCC2]/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                        <Icon size={22}/>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#EDEDE9] text-[#6B5E55] border border-[#D6CCC2]/60">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#2D231E] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B5E55] leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#59463B] hover:underline mt-auto pt-4 border-t border-[#E3D5CA]/50">
                    <span>Sign in to access</span>
                    <ArrowRight className="w-3.5 h-3.5"/>
                  </Link>
                </div>);
        })}
          </div>
        </section>

        {/* ── 4. HOW IT WORKS WORKFLOW ── */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#D6CCC2]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D231E] tracking-tight mb-4">
              How GovConnect Works in 4 Steps
            </h2>
            <p className="text-base text-[#6B5E55]">
              A streamlined, transparent workflow connecting citizens directly to authorized government benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
            {
                step: '01',
                title: 'Single Citizen Profile',
                desc: 'Enter demographics, caste category, income band, and education once. Saved locally in your browser.'
            },
            {
                step: '02',
                title: 'AI Eligibility Engine',
                desc: 'Rule-based matching computes match percentages and checklist passes for 200+ schemes and recruitment exams.'
            },
            {
                step: '03',
                title: 'Private Document Vault',
                desc: 'Upload Aadhaar, marksheets, and certificates. Automated simulated OCR verifies credentials for reuse.'
            },
            {
                step: '04',
                title: '1-Click Official Portal',
                desc: 'Jump directly to the official ministry portal (CPGRAMS, NSP, SSC) with pre-verified checklists in hand.'
            }
        ].map((st) => (<div key={st.step} className="bg-white rounded-2xl p-6 border border-[#D6CCC2]/80 shadow-xs flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-[#59463B] text-white flex items-center justify-center font-black text-sm mb-4 shadow-sm">
                  {st.step}
                </div>
                <h4 className="text-base font-bold text-[#2D231E] mb-2">{st.title}</h4>
                <p className="text-xs text-[#6B5E55] leading-relaxed">{st.desc}</p>
              </div>))}
          </div>
        </section>

        {/* ── 5. CALL TO ACTION TO DASHBOARD ── */}
        <section className="bg-[#59463B] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A67C65]/20 text-[#D5BDAF] text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#D5BDAF]"/> Secure Citizen Gateway
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Explore Your Matched Opportunities?
            </h2>
            <p className="text-[#E3D5CA] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Sign in to your Citizen Dashboard to instantly access your matched schemes, sarkari vacancies, document vault, and grievance drafting tools.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link to={ROUTES.LOGIN} className="px-7 py-3.5 rounded-xl bg-[#A67C65] hover:bg-[#D5BDAF] text-[#2D231E] font-bold text-sm transition-all shadow-lg flex items-center gap-2">
                Sign In to Citizen Dashboard <ArrowRight className="w-4 h-4"/>
              </Link>
              <Link to={ROUTES.REGISTER} className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20">
                Register Free Account
              </Link>
            </div>
          </div>
        </section>

        {/* ── 6. FAQ SECTION ── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#2D231E]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6E63] mt-2">
              Key questions about our College Major Capstone Project architecture and usage.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (<div key={index} className="rounded-xl border border-[#D6CCC2] bg-white overflow-hidden shadow-xs">
                <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center p-4 sm:p-5 text-left focus:outline-none cursor-pointer hover:bg-[#FAF7F2] transition-colors">
                  <span className="text-sm sm:text-base font-bold text-[#2D231E]">{faq.q}</span>
                  <ChevronDown className={cn("w-4 h-4 text-[#7D6E63] transition-transform duration-200 shrink-0 ml-3", openFaq === index ? "transform rotate-180 text-[#59463B]" : "")}/>
                </button>
                {openFaq === index && (<div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#6B5E55] border-t border-[#E3D5CA]/50 pt-3 leading-relaxed">
                    {faq.a}
                  </div>)}
              </div>))}
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>);
};
export default LandingPage;
