import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, Sparkles, Clock, Bell, CheckCircle2, ArrowRight, 
  FileText, Briefcase, ShieldCheck, MessageSquare, Send, 
  Lock, Languages, Cpu, Check
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import ROUTES from '@/constants/routes';

export default function AssistantPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [notifyContact, setNotifyContact] = useState(user?.email || user?.mobile || '');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (!notifyContact.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      showToast({
        title: 'Notification Alert Saved!',
        description: `We will notify you at ${notifyContact} as soon as Ask Sarkar AI goes live.`,
        variant: 'success',
      });
    }, 400);
  };

  const upcomingFeatures = [
    {
      icon: FileText,
      iconColor: 'text-[#59463B]',
      iconBg: 'bg-[#FAF7F2]',
      title: 'Conversational Scheme Matching',
      titleHi: 'बातचीत से सरकारी योजना खोज',
      desc: 'Ask questions like "I am an MCA graduate in Delhi, what scholarships or startup grants can I apply for?" and get tailored scheme lists with exact match scores.',
      status: 'In Training',
    },
    {
      icon: MessageSquare,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      title: 'Automated Grievance Drafter',
      titleHi: 'शिकायत पत्र स्वचालित प्रारूपण',
      desc: 'Describe civic issues (potholes, garbage, water supply) in everyday Hindi or English. Sarkar AI categorizes the department and composes a formal letter for CPGRAMS.',
      status: 'Under Development',
    },
    {
      icon: Briefcase,
      iconColor: 'text-[#59463B]',
      iconBg: 'bg-[#FAF7F2]',
      title: 'Intelligent Job Notification Radar',
      titleHi: 'सटीक सरकारी भर्ती विश्लेषण',
      desc: 'Instant qualification checks against SSC, UPSC, Railway, and State PSC recruitment notices with deadline reminders and syllabus summaries.',
      status: 'Data Modeling',
    },
    {
      icon: Languages,
      iconColor: 'text-[#A67C65]',
      iconBg: 'bg-[#FAF7F2]',
      title: 'Voice & Multilingual Dialogue',
      titleHi: 'आवाज और बहुभाषी सुविधा',
      desc: 'Citizen-friendly voice input supporting English, Hindi, and regional dialects with instant audio responses for maximum accessibility.',
      status: 'Beta Testing',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans pb-16">
      
      {/* ── 1. HERO COMING SOON BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-[#59463B] text-white p-8 sm:p-12 shadow-xl border border-[#2D231E]/40">
        
        {/* Subtle decorative glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D5BDAF]/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D5BDAF]/10 rounded-full blur-2xl translate-y-12 -translate-x-12 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-[#E3D5CA]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white">Under Active Development</span>
            <span className="text-white/40">•</span>
            <span className="text-amber-300 font-extrabold">Coming Soon / जल्द आ रहा है</span>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#59463B] flex items-center justify-center text-white shadow-lg">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Ask Sarkar AI
                </h1>
                <p className="text-[#E3D5CA] text-xs sm:text-sm font-medium">
                  Next-Generation Conversational Citizen Copilot
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#E3D5CA] leading-relaxed pt-2">
              We are currently engineering and fine-tuning <strong className="text-white">Ask Sarkar AI</strong> with verified Indian government datasets, official gazettes, and citizen charters. This feature will soon provide instant 24/7 conversational guidance for all your public service queries.
            </p>
          </div>

          {/* Early Access Notification Form */}
          <div className="pt-2">
            {isSubscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-semibold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>You're on the early access list! We will notify you at <strong className="text-white">{notifyContact}</strong> upon rollout.</span>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-lg">
                <div className="relative flex-1">
                  <Bell className="w-4 h-4 text-[#8C7D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={notifyContact}
                    onChange={(e) => setNotifyContact(e.target.value)}
                    placeholder="Enter email or mobile for launch alert..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 text-white placeholder-blue-200/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D5BDAF] focus:bg-white/15 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-xl bg-[#59463B] hover:from-[#D5BDAF] hover:to-emerald-400 text-[#2D231E] font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : 'Notify Me'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Citizen Demographics Note */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-[11px] text-[#D6CCC2] border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D5BDAF]" />
              <span>Target Launch: Phase 2 Major Release</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D5BDAF]" />
              <span>Zero-Knowledge Client Privacy Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. UPCOMING FEATURES GRID ── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D231E] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Upcoming Capabilities</span>
          </h2>
          <p className="text-xs text-[#7D6E63] mt-0.5">
            Here is what our research and engineering team is preparing for the Ask Sarkar AI launch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i}
                className="bg-white rounded-2xl p-5 border border-[#D6CCC2] shadow-xs hover:border-[#59463B]/40 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${feat.iconBg} ${feat.iconColor} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#2D231E] leading-snug">
                          {feat.title}
                        </h3>
                        <p className="text-[11px] text-[#7D6E63] font-medium">
                          {feat.titleHi}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      {feat.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B5E55] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E3D5CA]/50 flex items-center justify-between text-[11px] text-[#8C7D73]">
                  <span>Engine: Deep Learning & RAG</span>
                  <span className="text-[#A67C65] font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> In Pipeline
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. LIVE FEATURES READY TO USE TODAY ── */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-lg font-bold text-[#2D231E]">
            Features Active & Ready to Use Today
          </h2>
          <p className="text-xs text-[#7D6E63] mt-0.5">
            While we finalize the AI copilot, you can explore all fullstack modules currently live on GovConnect:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Schemes Matching */}
          <Link 
            to={ROUTES.SCHEMES}
            className="p-5 bg-white rounded-2xl border border-[#D6CCC2] shadow-xs hover:border-[#59463B] hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#59463B] flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#2D231E] group-hover:text-[#59463B] transition-colors">
                Welfare Schemes Matching
              </h3>
              <p className="text-xs text-[#6B5E55]">
                Explore central & state schemes with dynamic eligibility checklist and instant calculation.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#59463B]">
              <span>Explore Schemes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Jobs Tracker */}
          <Link 
            to={ROUTES.JOBS}
            className="p-5 bg-white rounded-2xl border border-[#D6CCC2] shadow-xs hover:border-[#59463B] hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] text-[#59463B] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#2D231E] group-hover:text-[#59463B] transition-colors">
                Govt Jobs & Vacancies
              </h3>
              <p className="text-xs text-[#6B5E55]">
                Track notifications across SSC, UPSC, Railways, and state boards with exam countdowns.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#59463B]">
              <span>View Jobs Board</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Grievance Redress */}
          <Link 
            to={ROUTES.GRIEVANCES}
            className="p-5 bg-white rounded-2xl border border-[#D6CCC2] shadow-xs hover:border-[#59463B] hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#2D231E] group-hover:text-[#59463B] transition-colors">
                Grievance Redressal
              </h3>
              <p className="text-xs text-[#6B5E55]">
                File and track civic complaints with direct department routing and official portal links.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span>Track Grievances</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
