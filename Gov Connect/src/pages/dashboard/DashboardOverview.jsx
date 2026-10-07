import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Briefcase, FolderOpen, MessageSquare, Bookmark, ChevronRight, Clock, ArrowRight, Sparkles, Bell, Search, Shield, Bot } from 'lucide-react';
import { cn } from '@/utils/cn';
import ROUTES from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { useSaved } from '@/context/SavedContext';
import { mockSchemes } from '@/data/mockSchemes';
import { mockJobs } from '@/data/mockJobs';
import { mockNotifications } from '@/data/mockNotifications';
import { LoadingSkeleton, MatchBadge } from '@/components/ui';
import { timeAgo } from '@/utils/formatDate';
import { AdminDataStatusModal } from '@/components/common/AiResponseWidgets';
export default function DashboardOverview() {
    const { user } = useAuth();
    const { isSchemeSaved, toggleSaveScheme, isJobSaved, toggleSaveJob } = useSaved();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAdminStatusOpen, setIsAdminStatusOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [schemes, setSchemes] = useState([]);
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setSchemes(mockSchemes.slice(0, 3));
            setJobs(mockJobs.slice(0, 3));
            setIsLoading(false);
        }, 350);
        return () => clearTimeout(timer);
    }, []);
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12)
            return 'Good morning';
        if (hour < 18)
            return 'Good afternoon';
        return 'Good evening';
    };
    const firstName = user?.name ? user.name.split(' ')[0] : 'Citizen';
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchKeyword.trim())
            return;
        navigate(`/schemes?search=${encodeURIComponent(searchKeyword.trim())}`);
    };
    const upcomingDeadlines = [
        ...schemes.filter(s => s.deadline).map(s => ({ ...s, type: 'scheme' })),
        ...jobs.filter(j => j.applicationDeadline).map(j => ({ ...j, type: 'job', deadline: j.applicationDeadline }))
    ].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 4);
    const quickSearchPills = [
        { label: 'Mudra Loan', href: '/schemes?search=mudra' },
        { label: 'SSC CGL Exam', href: '/jobs?search=ssc' },
        { label: 'PMAY Housing', href: '/schemes?search=pmay' },
        { label: 'Banking Jobs', href: '/jobs?search=bank' },
        { label: 'Scholarships', href: '/schemes?search=scholarship' },
    ];
    return (<div className="space-y-7 max-w-7xl mx-auto font-sans pb-12">
      
      {/* ── 1. HERO BANNER: Clean, High-Contrast Light Theme Welcome ── */}
      <div className="bg-[#59463B] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-[#E3D5CA] border border-white/20">
                <Shield className="w-3.5 h-3.5 text-[#D5BDAF]"/>
                <span>Unified Citizen Preparation Portal</span>
              </div>
              <button type="button" onClick={() => setIsAdminStatusOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#A67C65]/20 hover:bg-[#A67C65]/30 text-[#E3D5CA] border border-[#D5BDAF]/30 transition-colors cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                <span>51 Official Portals Indexed</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {getGreeting()}, {firstName} 👋
            </h1>

            <p className="text-[#E3D5CA] text-sm sm:text-base leading-relaxed">
              Welcome to your personal citizen dashboard. Discover eligible welfare schemes, find sarkari recruitment vacancies, and manage verified documents in one place.
            </p>

            {/* Quick Search Bar directly inside Dashboard */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#8C7D73] absolute left-3.5 pointer-events-none"/>
                <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Search schemes, job exams, documents, or grievance topics..." className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white text-[#2D231E] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D5BDAF] shadow-sm border-0"/>
                <button type="submit" className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-[#59463B] hover:bg-[#2D231E] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer">
                  Search
                </button>
              </div>

              {/* Keyword Shortcut Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px]">
                <span className="text-[#D6CCC2] font-medium">Quick searches:</span>
                {quickSearchPills.map((pill) => (<Link key={pill.label} to={pill.href} className="px-2 py-0.5 rounded-md bg-white/15 hover:bg-white/25 text-white transition-colors border border-white/10">
                    {pill.label}
                  </Link>))}
              </div>
            </form>
          </div>

          {/* Profile Status Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shrink-0 w-full lg:w-72">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D6CCC2]">
                Profile Status
              </span>
              <span className="text-xs font-bold text-[#D5BDAF] bg-[#1C1512]/40 px-2 py-0.5 rounded-full border border-[#D5BDAF]/30">
                {user?.profileCompletion || 80}% Complete
              </span>
            </div>

            <p className="text-xs text-[#E3D5CA] mb-3 truncate">
              {user?.state || 'Delhi'} • {user?.education || 'Graduate'}
            </p>

            <div className="w-full bg-black/25 rounded-full h-2 mb-3 overflow-hidden">
              <div className="bg-[#D5BDAF] h-full rounded-full transition-all duration-500" style={{ width: `${user?.profileCompletion || 80}%` }}/>
            </div>

            <Link to={ROUTES.PROFILE} className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white text-[#2D231E] hover:bg-[#EDEDE9] font-bold text-xs transition-colors shadow-xs">
              <span>Manage Profile</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#59463B]"/>
            </Link>
          </div>
        </div>

        {/* Decorative background accents */}
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#A67C65]/20 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute -top-10 left-1/3 w-64 h-64 bg-[#D5BDAF]/15 rounded-full blur-3xl pointer-events-none"/>
      </div>

      {/* ── 2. QUICK MODULE CARDS: 4 Primary Citizen Functions (Clean Light UI) ── */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#2D231E]">
              Citizen Service Portals
            </h2>
            <p className="text-xs text-[#7D6E63]">
              Direct access to all major civic benefits and assisted preparation tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Welfare Schemes */}
          <Link to={ROUTES.SCHEMES} className="p-5 rounded-2xl bg-white border border-[#D6CCC2]/90 hover:border-[#59463B] hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#59463B] border border-[#E3D5CA] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5"/>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]">
                  AI Match
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#2D231E] group-hover:text-[#59463B] transition-colors mb-1">
                Welfare Schemes
              </h3>
              <p className="text-xs text-[#7D6E63] line-clamp-2 leading-relaxed">
                Check eligibility scores for central & state welfare schemes, scholarships, and grants.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[#E3D5CA]/50 flex items-center justify-between text-xs font-semibold text-[#59463B]">
              <span>Explore Schemes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"/>
            </div>
          </Link>

          {/* Card 2: Jobs & Vacancies */}
          <Link to={ROUTES.JOBS} className="p-5 rounded-2xl bg-white border border-[#D6CCC2]/90 hover:border-[#A67C65] hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#A67C65] border border-[#E3D5CA] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5"/>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C644F] border border-[#D5BDAF]">
                  Recruitment
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#2D231E] group-hover:text-[#A67C65] transition-colors mb-1">
                Govt Jobs & Exams
              </h3>
              <p className="text-xs text-[#7D6E63] line-clamp-2 leading-relaxed">
                Track vacancies in SSC, Banking, Railways, and UPSC with syllabus details and deadlines.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[#E3D5CA]/50 flex items-center justify-between text-xs font-semibold text-[#A67C65]">
              <span>Find Vacancies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"/>
            </div>
          </Link>

          {/* Card 3: Document Vault */}
          <Link to={ROUTES.DOCUMENTS} className="p-5 rounded-2xl bg-white border border-[#D6CCC2]/90 hover:border-[#59463B] hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#43342B] border border-[#E3D5CA] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FolderOpen className="w-5 h-5"/>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#43342B] border border-[#D6CCC2]">
                  DigiLocker
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#2D231E] group-hover:text-[#43342B] transition-colors mb-1">
                Digital Document Vault
              </h3>
              <p className="text-xs text-[#7D6E63] line-clamp-2 leading-relaxed">
                Safely organize Aadhaar, certificates, and ID proofs with OCR auto-verification.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[#E3D5CA]/50 flex items-center justify-between text-xs font-semibold text-[#43342B]">
              <span>Open Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"/>
            </div>
          </Link>

          {/* Card 4: Grievance Redressal */}
          <Link to={ROUTES.GRIEVANCES} className="p-5 rounded-2xl bg-white border border-[#D6CCC2]/90 hover:border-amber-600 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5"/>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  CPGRAMS
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#2D231E] group-hover:text-amber-700 transition-colors mb-1">
                Grievance Redressal
              </h3>
              <p className="text-xs text-[#7D6E63] line-clamp-2 leading-relaxed">
                File complaints with municipal & state departments with AI-assisted drafting and SLA tracking.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-[#E3D5CA]/50 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Lodge Grievance</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"/>
            </div>
          </Link>

        </div>
      </section>

      {/* ── 3. ASK SARKAR AI BANNER: Direct Instant Assistance ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#59463B] border border-[#D6CCC2]/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#59463B] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Bot className="w-6 h-6"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#2D231E]">
                Ask Sarkar AI Assistant
              </h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Next-generation conversational AI copilot currently in development. You will soon be able to converse in plain English or हिन्दी for instant welfare checks and grievance drafting.
            </p>
          </div>
        </div>

        <Link to={ROUTES.ASSISTANT} className="shrink-0 px-4 py-2.5 rounded-xl bg-[#59463B] hover:from-[#2D231E] hover:to-[#59463B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-[#D5BDAF]"/>
          <span>Preview Sarkar AI (Coming Soon)</span>
        </Link>
      </div>

      {/* ── 4. MAIN CONTENT SPLIT: Left (Schemes & Jobs), Right (Deadlines & Activity) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left Column (8-col): Schemes & Jobs Snapshots */}
        <div className="lg:col-span-8 space-y-7">
          
          {/* Section: Recommended Schemes */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D6CCC2]/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#2D231E] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500"/>
                  Top Recommended Schemes
                </h2>
                <p className="text-xs text-[#7D6E63]">
                  Personalized matches for your registered profile in {user?.state || 'Delhi'}.
                </p>
              </div>
              <Link to={ROUTES.SCHEMES} className="text-xs font-bold text-[#59463B] hover:underline flex items-center gap-0.5">
                <span>View All (12)</span>
                <ChevronRight className="w-3.5 h-3.5"/>
              </Link>
            </div>
            
            {isLoading ? (<LoadingSkeleton count={3} type="card" className="grid grid-cols-1 md:grid-cols-3 gap-3.5"/>) : (<div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {schemes.map(scheme => {
                const saved = isSchemeSaved(scheme.id);
                return (<div key={scheme.id} className="p-4 rounded-xl border border-[#D6CCC2] bg-[#FAF7F2]/50 hover:bg-white hover:border-[#59463B] hover:shadow-sm transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-[#7D6E63] truncate max-w-[130px] uppercase">
                            {scheme.category || 'Central'}
                          </span>
                          <MatchBadge matchPercentage={scheme.matchPercentage || 85}/>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-[#2D231E] mb-1.5 line-clamp-2">
                          {scheme.title}
                        </h3>
                        <p className="text-[11px] text-[#6B5E55] mb-3 line-clamp-2 leading-relaxed">
                          {scheme.description}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-[#D6CCC2]/80 flex items-center justify-between">
                        <button onClick={() => toggleSaveScheme(scheme.id, scheme.title)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${saved ? 'text-amber-600 bg-amber-50' : 'text-[#8C7D73] hover:text-[#6B5E55] hover:bg-[#EDEDE9]'}`} title={saved ? "Saved" : "Save Scheme"}>
                          <Bookmark className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"}/>
                        </button>
                        <Link to={`/schemes/${scheme.id}`} className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#59463B] hover:bg-[#FAF7F2] transition-colors">
                          Details →
                        </Link>
                      </div>
                    </div>);
            })}
              </div>)}
          </section>

          {/* Section: Recommended Govt Jobs */}
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D6CCC2]/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#2D231E] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#A67C65]"/>
                  Latest Government Vacancies
                </h2>
                <p className="text-xs text-[#7D6E63]">
                  Recruitments matching educational qualification and age bracket.
                </p>
              </div>
              <Link to={ROUTES.JOBS} className="text-xs font-bold text-[#A67C65] hover:underline flex items-center gap-0.5">
                <span>View All Jobs</span>
                <ChevronRight className="w-3.5 h-3.5"/>
              </Link>
            </div>

            {isLoading ? (<LoadingSkeleton count={3} type="card" className="grid grid-cols-1 md:grid-cols-3 gap-3.5"/>) : (<div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {jobs.map(job => {
                const saved = isJobSaved(job.id);
                return (<div key={job.id} className="p-4 rounded-xl border border-[#D6CCC2] bg-[#FAF7F2]/50 hover:bg-white hover:border-[#A67C65] hover:shadow-sm transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-[#7D6E63] uppercase truncate max-w-[120px]">
                            {job.organization}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FAF7F2] text-[#8C644F] border border-[#D5BDAF]">
                            {job.vacancies ? `${job.vacancies} Posts` : 'Active'}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-[#2D231E] mb-1 line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="text-[11px] text-[#7D6E63] mb-2">
                          📍 {job.location || 'All India'} • {job.jobType || 'Regular'}
                        </p>
                        <div className="text-[11px] font-semibold text-[#43342B] bg-white border border-[#D6CCC2] px-2 py-1 rounded-md mb-3">
                          Pay: ₹{job.payScale}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#D6CCC2]/80 flex items-center justify-between">
                        <button onClick={() => toggleSaveJob(job.id, job.title)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${saved ? 'text-amber-600 bg-amber-50' : 'text-[#8C7D73] hover:text-[#6B5E55] hover:bg-[#EDEDE9]'}`} title={saved ? "Bookmarked" : "Bookmark Job"}>
                          <Bookmark className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"}/>
                        </button>
                        <Link to={`/jobs/${job.id}`} className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-[#A67C65] hover:bg-[#8C644F] transition-colors">
                          View Job
                        </Link>
                      </div>
                    </div>);
            })}
              </div>)}
          </section>

        </div>

        {/* Right Column (4-col): Deadlines, Notifications & Activity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: Upcoming Deadlines */}
          <div className="bg-white rounded-2xl p-5 border border-[#D6CCC2]/90 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-[#2D231E] text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500"/>
                Upcoming Deadlines
              </h3>
              <span className="text-[10px] font-bold text-[#8C7D73] uppercase tracking-wider">
                Action Required
              </span>
            </div>
            
            {upcomingDeadlines.length > 0 ? (<div className="space-y-2.5">
                {upcomingDeadlines.map((item, i) => {
                const daysLeft = Math.ceil((new Date(item.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 7;
                return (<div key={i} className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D6CCC2]/70 flex items-center justify-between text-xs">
                      <div className="pr-2 truncate">
                        <p className="font-bold text-[#2D231E] truncate text-xs">{item.title}</p>
                        <span className="text-[10px] text-[#8C7D73] capitalize">{item.type} application</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0", isUrgent
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]")}>
                        {daysLeft <= 0 ? 'Last Day' : `${daysLeft}d left`}
                      </span>
                    </div>);
            })}
              </div>) : (<p className="text-xs text-[#8C7D73] text-center py-4">No imminent deadlines.</p>)}
          </div>

          {/* Widget 2: Recent Notifications */}
          <div className="bg-white rounded-2xl p-5 border border-[#D6CCC2]/90 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-[#2D231E] text-sm flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#59463B]"/>
                Recent Alerts
              </h3>
              <Link to={ROUTES.NOTIFICATIONS} className="text-xs font-semibold text-[#59463B] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {mockNotifications.slice(0, 3).map((n) => (<div key={n.id} className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D6CCC2]/70 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#2D231E]">
                    <span className="truncate max-w-[170px]">{n.title}</span>
                    <span className="text-[10px] text-[#8C7D73] font-normal">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="text-[#7D6E63] text-[11px] line-clamp-2">{n.message}</p>
                </div>))}
            </div>
          </div>

          {/* Widget 3: Trust & Official Preparation Notice */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D6CCC2] text-xs text-[#6B5E55] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#2D231E]">
              <Shield className="w-4 h-4 text-emerald-600"/>
              <span>Official Preparation Standard</span>
            </div>
            <p className="text-[11px] text-[#7D6E63] leading-relaxed">
              GovConnect assists in preparing applications, verifying criteria, and organizing required documents. Final submissions are processed directly on official government servers.
            </p>
          </div>

        </div>

      </div>

      {/* Admin SIH Live Data Status Modal */}
      <AdminDataStatusModal isOpen={isAdminStatusOpen} onClose={() => setIsAdminStatusOpen(false)}/>
    </div>);
}
