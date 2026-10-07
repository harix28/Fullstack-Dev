import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, CheckCircle2, Info, SlidersHorizontal, Zap, ShieldCheck, GraduationCap, Briefcase, HeartHandshake, Home, Wheat, Coins, ArrowUpDown } from 'lucide-react';
import { mockSchemes } from '@/data/mockSchemes';
import { useAuth } from '@/context/AuthContext';
import { useSaved } from '@/context/SavedContext';
import { Button, Card, DeadlineBadge, MatchBadge, SearchBar, EmptyState, Modal } from '@/components/ui';
import { INDIAN_STATES } from '@/constants/categories';
// Quick 1-Click Category Filter Pills
const QUICK_FILTER_PILLS = [
    { id: 'all', label: 'All Schemes across India', icon: Coins },
    { id: 'top_match', label: '🌟 Top Matches (90%+)', icon: Sparkles },
    { id: 'agriculture', label: '🌾 Agriculture & Farmers', icon: Wheat },
    { id: 'financial', label: '💼 Financial, Loans & MSME', icon: Briefcase },
    { id: 'education', label: '🎓 Education & Youth', icon: GraduationCap },
    { id: 'health', label: '🏥 Health & Medicines', icon: HeartHandshake },
    { id: 'housing', label: '🏠 Housing & Solar', icon: Home },
    { id: 'women', label: '👩 Women & Child Welfare', icon: Sparkles },
    { id: 'skill_development', label: '🛠️ Skill & Apprenticeship', icon: Briefcase },
    { id: 'social_welfare', label: '🤝 Social Security & Pension', icon: HeartHandshake },
];
export default function SchemesPage() {
    const { user } = useAuth();
    const { isSchemeSaved, toggleSaveScheme } = useSaved();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQuickPill, setSelectedQuickPill] = useState('all');
    const [selectedMinistry, setSelectedMinistry] = useState('all');
    const [selectedState, setSelectedState] = useState('all');
    const [sortBy, setSortBy] = useState('match');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    // Eligibility Evaluation Modal State
    const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
    const [selectedSchemeForAnalysis, setSelectedSchemeForAnalysis] = useState(null);
    // 1-Click Fast Apply Simulation Modal State
    const [fastApplyModalOpen, setFastApplyModalOpen] = useState(false);
    const [selectedSchemeForApply, setSelectedSchemeForApply] = useState(null);
    const [applyStep, setApplyStep] = useState('review');
    const [generatedToken, setGeneratedToken] = useState('');
    const ministries = useMemo(() => {
        const mins = new Set();
        mockSchemes.forEach(s => mins.add(s.ministry));
        return ['all', ...Array.from(mins)];
    }, []);
    // Comprehensive Pan-India Filter & Sort Logic
    const filteredSchemes = useMemo(() => {
        return mockSchemes.filter(s => {
            // 1. Search Query
            const query = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                s.title.toLowerCase().includes(query) ||
                s.ministry.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query) ||
                (s.state && s.state.toLowerCase().includes(query)) ||
                (s.tags && s.tags.some(t => t.toLowerCase().includes(query)));
            // 2. Tab logic
            if (activeTab === 'saved') {
                if (!isSchemeSaved(s.id))
                    return false;
            }
            else if (activeTab === 'recommended') {
                if ((s.matchPercentage || 0) < 80)
                    return false;
            }
            // 3. Quick Category Pill
            let matchesQuickPill = true;
            if (selectedQuickPill === 'top_match') {
                matchesQuickPill = (s.matchPercentage || 0) >= 90;
            }
            else if (selectedQuickPill !== 'all') {
                matchesQuickPill = s.category === selectedQuickPill;
            }
            // 4. Ministry & State Filters
            const matchesMin = selectedMinistry === 'all' || s.ministry === selectedMinistry;
            const matchesState = selectedState === 'all' || s.state === 'Central' || s.state === selectedState;
            return matchesSearch && matchesQuickPill && matchesMin && matchesState;
        }).sort((a, b) => {
            if (sortBy === 'name_asc') {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === 'name_desc') {
                return b.title.localeCompare(a.title);
            }
            if (sortBy === 'match') {
                return (b.matchPercentage || 0) - (a.matchPercentage || 0);
            }
            if (sortBy === 'deadline') {
                if (!a.deadline || a.deadline.includes('Rolling'))
                    return 1;
                if (!b.deadline || b.deadline.includes('Rolling'))
                    return -1;
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            }
            return 0;
        });
    }, [searchQuery, activeTab, selectedQuickPill, selectedMinistry, selectedState, isSchemeSaved, sortBy]);
    const runEligibilityCheck = (scheme) => {
        setSelectedSchemeForAnalysis(scheme || filteredSchemes[0] || mockSchemes[0]);
        setEligibilityModalOpen(true);
    };
    const handleStartFastApply = (scheme) => {
        setSelectedSchemeForApply(scheme);
        setApplyStep('review');
        setFastApplyModalOpen(true);
    };
    const handleSubmitFastApply = () => {
        setApplyStep('submitting');
        setTimeout(() => {
            const token = `GOV-${selectedSchemeForApply?.id?.slice(0, 4)?.toUpperCase() || 'SCH'}-${Date.now().toString().slice(-5)}`;
            setGeneratedToken(token);
            setApplyStep('success');
        }, 1200);
    };
    const resetAllFilters = () => {
        setActiveTab('all');
        setSelectedQuickPill('all');
        setSelectedMinistry('all');
        setSelectedState('all');
        setSearchQuery('');
        setSortBy('match');
    };
    return (<div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      
      {/* ── PAN-INDIA WELFARE SCHEMES DIRECTORY BANNER ── */}
      <div className="bg-[#59463B] rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D5BDAF]/20 text-[#E3D5CA] border border-[#D5BDAF]/30">
                <Zap className="w-3.5 h-3.5 text-[#D5BDAF]"/>
                All-India Welfare Schemes Directory
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/90">
                Active Citizen Profile: {user?.name || 'Citizen'} ({user?.education || 'Graduate'})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Pan-India Government Schemes Directory
            </h1>

            <p className="text-[#E3D5CA] text-sm leading-relaxed">
              Explore <strong>all {mockSchemes.length} Central & State Government Welfare Schemes</strong> operating across India spanning Agriculture, Education, MSME Business Loans, Healthcare, Housing, and Social Security.
            </p>

            {/* Quick Live Metric Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                <span>Total Schemes Listed: <strong>{mockSchemes.length} Active Pan-India</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D5BDAF]"/>
                <span>Vault Readiness: <strong>4 Verified Documents</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-300"/>
                <span>Direct Benefits: <strong>Up to ₹12.5L+</strong></span>
              </div>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Button onClick={() => runEligibilityCheck()} className="bg-[#A67C65] hover:bg-[#A67C65] text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg gap-2 text-sm cursor-pointer transition-all hover:scale-102">
              <Sparkles className="w-4 h-4"/>
              Check My Eligibility
            </Button>
            <button onClick={resetAllFilters} className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors text-center cursor-pointer">
              Show All {mockSchemes.length} Schemes Across India →
            </button>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-[#A67C65] rounded-full blur-3xl opacity-25 pointer-events-none"/>
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-[#D5BDAF] rounded-full blur-3xl opacity-15 pointer-events-none"/>
      </div>

      {/* ── 1-CLICK CATEGORY FILTER PILLS ── */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#D6CCC2]/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] font-bold text-[#8C7D73] uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Categories:
          </span>
          {QUICK_FILTER_PILLS.map((pill) => {
            const Icon = pill.icon;
            const isSelected = selectedQuickPill === pill.id;
            return (<button key={pill.id} onClick={() => setSelectedQuickPill(pill.id)} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${isSelected
                    ? 'bg-[#59463B] text-white shadow-sm ring-2 ring-[#59463B]/20'
                    : 'bg-[#EDEDE9] text-[#43342B] hover:bg-[#E3D5CA]'}`}>
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#59463B]'}`}/>
                <span>{pill.label}</span>
              </button>);
        })}
        </div>
      </div>

      {/* ── CONTROLS TOOLBAR: TABS, SEARCH, SORT & ADVANCED TOGGLE ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D6CCC2]/80 shadow-xs">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b md:border-b-0 pb-2 md:pb-0 border-[#D6CCC2]">
          <button onClick={() => {
            setActiveTab('all');
            setSelectedQuickPill('all');
        }} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'all'
            ? 'bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]'
            : 'text-[#7D6E63] hover:text-[#2D231E]'}`}>
            Explore All Schemes ({mockSchemes.length})
          </button>
          <button onClick={() => setActiveTab('recommended')} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'recommended'
            ? 'bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]'
            : 'text-[#7D6E63] hover:text-[#2D231E]'}`}>
            Recommended For Me
          </button>
          <button onClick={() => setActiveTab('saved')} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'saved'
            ? 'bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]'
            : 'text-[#7D6E63] hover:text-[#2D231E]'}`}>
            Saved Items
          </button>
        </div>

        {/* Search Bar + Sort + Filter Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-64">
            <SearchBar placeholder="Search all 21 schemes by name, ministry, tag..." onChange={(v) => setSearchQuery(v)}/>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1.5 rounded-xl border border-[#D6CCC2] text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C7D73]"/>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-[#43342B] font-semibold focus:outline-none cursor-pointer text-xs">
              <option value="name_asc">Sort: Alphabetical (A to Z)</option>
              <option value="name_desc">Sort: Alphabetical (Z to A)</option>
              <option value="match">Sort: Highest Match %</option>
              <option value="deadline">Sort: Deadline Soon</option>
            </select>
          </div>

          {/* Advanced Filter Toggle */}
          <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${showAdvancedFilters || selectedMinistry !== 'all' || selectedState !== 'all'
            ? 'bg-[#FAF7F2] text-[#59463B] border-[#D6CCC2]'
            : 'border-[#D6CCC2] text-[#6B5E55] hover:bg-[#FAF7F2]'}`}>
            <SlidersHorizontal className="w-3.5 h-3.5"/>
            <span>Filters {(selectedMinistry !== 'all' || selectedState !== 'all') ? '• Active' : ''}</span>
          </button>
        </div>
      </div>

      {/* ── EXPANDABLE ADVANCED FILTER DRAWER ── */}
      {showAdvancedFilters && (<div className="bg-[#FAF7F2] border border-[#D6CCC2] p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
          <div>
            <label className="text-xs font-bold text-[#43342B] block mb-1">
              Ministry / Department
            </label>
            <select value={selectedMinistry} onChange={e => setSelectedMinistry(e.target.value)} className="w-full p-2 rounded-xl text-xs bg-white border border-[#D6CCC2] text-[#2D231E]">
              {ministries.map(m => (<option key={m} value={m}>{m === 'all' ? 'All Ministries' : m}</option>))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#43342B] block mb-1">
              State / Jurisdiction
            </label>
            <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="w-full p-2 rounded-xl text-xs bg-white border border-[#D6CCC2] text-[#2D231E]">
              <option value="all">All Central & State</option>
              <option value="Central">Central Government Only</option>
              {INDIAN_STATES.map(st => (<option key={st} value={st}>{st}</option>))}
            </select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={resetAllFilters} className="w-full text-xs h-9">
              Reset All Filters
            </Button>
          </div>
        </div>)}

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-[#7D6E63] px-1">
        <p>
          Showing <strong className="text-[#2D231E]">{filteredSchemes.length}</strong> of <strong>{mockSchemes.length}</strong> welfare schemes across India
          {selectedQuickPill !== 'all' && <span> • Category: <strong>{selectedQuickPill}</strong></span>}
        </p>

        {(selectedQuickPill !== 'all' || searchQuery || selectedMinistry !== 'all' || selectedState !== 'all') && (<button onClick={resetAllFilters} className="text-[#59463B] font-bold hover:underline cursor-pointer">
            Clear Filters & Show All {mockSchemes.length} Schemes
          </button>)}
      </div>

      {/* ── SCHEMES GRID ── */}
      {filteredSchemes.length === 0 ? (<EmptyState icon={<Info className="w-12 h-12 text-[#D6CCC2]"/>} title="No welfare schemes match your criteria" description={`Try clearing your search or category filters to explore all ${mockSchemes.length} central and state welfare schemes.`} action={<Button onClick={resetAllFilters} className="bg-[#59463B] text-white">
              Show All {mockSchemes.length} Schemes
            </Button>}/>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSchemes.map((scheme) => {
                const isSaved = isSchemeSaved(scheme.id);
                const matchScore = scheme.matchPercentage || 85;
                const isHighMatch = matchScore >= 90;
                return (<Card key={scheme.id} className="p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200 border-[#D6CCC2]/90 bg-white group">
                <div>
                  {/* Top Bar: Ministry Pill + Match Percentage Gauge */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-[#EDEDE9] text-[#43342B] text-[11px] font-bold truncate max-w-[220px]">
                      🏛️ {scheme.ministry}
                    </span>

                    <div className="shrink-0">
                      <MatchBadge matchPercentage={matchScore}/>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-[#2D231E] text-base sm:text-lg mb-2 leading-snug group-hover:text-[#59463B] transition-colors">
                    <Link to={`/dashboard/schemes/${scheme.id}`}>
                      {scheme.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#6B5E55] mb-3.5 line-clamp-2 leading-relaxed">
                    {scheme.description}
                  </p>

                  {/* Key Benefits Pill Box */}
                  <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-xl p-2.5 mb-4">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block mb-1">
                      Key Benefit & Assistance
                    </span>
                    <p className="text-xs font-extrabold text-emerald-900">
                      {scheme.benefits && scheme.benefits.length > 0 ? scheme.benefits[0] : 'Direct welfare assistance and subsidy'}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#59463B] text-[10px] font-bold">
                      {scheme.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#EDEDE9] text-[#6B5E55] text-[10px] font-semibold">
                      {scheme.state === 'Central' ? 'Central Govt' : `${scheme.state} State`}
                    </span>
                    {isHighMatch && (<span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                        🌟 Recommended
                      </span>)}
                  </div>
                </div>

                {/* Bottom Actions Toolbar */}
                <div className="pt-3.5 border-t border-[#E3D5CA]/50 flex items-center justify-between gap-2">
                  
                  {/* Deadline or Status */}
                  <div>
                    {scheme.deadline && !scheme.deadline.includes('Rolling') ? (<DeadlineBadge date={scheme.deadline}/>) : (<span className="text-[11px] font-bold text-[#8C7D73] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"/>
                        Rolling / Open
                      </span>)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleSaveScheme(scheme.id, scheme.title)} className={`p-2 rounded-xl transition-all cursor-pointer ${isSaved
                        ? 'text-amber-500 bg-amber-50 ring-1 ring-amber-300'
                        : 'text-[#8C7D73] hover:text-[#43342B] bg-[#FAF7F2] hover:bg-[#EDEDE9]'}`} title={isSaved ? "Saved in Bookmarks" : "Save Scheme"}>
                      <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"}/>
                    </button>

                    <button onClick={() => runEligibilityCheck(scheme)} className="px-2.5 py-1.5 text-xs font-bold text-[#59463B] bg-[#FAF7F2] hover:bg-[#E3D5CA] rounded-xl transition-colors cursor-pointer flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#A67C65]"/>
                      <span>Check</span>
                    </button>


                    <Button size="sm" variant="outline" asChild className="text-xs h-8 px-2.5 rounded-xl font-bold border-[#D6CCC2]">
                      <Link to={`/dashboard/schemes/${scheme.id}`}>
                        Guide →
                      </Link>
                    </Button>
                  </div>

                </div>
              </Card>);
            })}
        </div>)}

      {/* ── ASSISTIVE DISCLAIMER NOTICE ── */}
      <div className="p-4 bg-[#FAF7F2]/70 border border-[#D6CCC2] rounded-2xl text-xs text-[#2D231E] flex items-start gap-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#59463B]"/>
        <p className="leading-relaxed">
          <strong>Citizen Guidance:</strong> GovConnect catalogs verified government welfare schemes directly from the official gazette notices. Eligibility simulations are calculated against your self-declared citizen profile.
        </p>
      </div>

      {/* ── LIVE ELIGIBILITY BREAKDOWN MODAL ── */}
      <Modal isOpen={eligibilityModalOpen} onClose={() => setEligibilityModalOpen(false)} title="AI Profile Compatibility & Eligibility Breakdown" size="lg">
        {selectedSchemeForAnalysis && (<div className="space-y-5 font-sans">
            
            <div className="flex items-center justify-between p-4 bg-[#59463B] rounded-2xl border border-[#E3D5CA]">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#59463B] uppercase tracking-wider">
                  {selectedSchemeForAnalysis.ministry}
                </span>
                <h4 className="font-extrabold text-[#2D231E] text-base sm:text-lg">
                  {selectedSchemeForAnalysis.title}
                </h4>
              </div>
              <div className="text-right shrink-0">
                <span className="text-3xl font-black text-[#A67C65]">
                  {selectedSchemeForAnalysis.matchPercentage || 92}%
                </span>
                <p className="text-[10px] text-[#7D6E63] font-bold uppercase">Compatibility</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#8C7D73]">
                Profile Criteria Evaluation:
              </h5>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
                    <div>
                      <strong className="block font-bold">Age Requirement:</strong>
                      <span className="text-[11px] text-[#6B5E55]">
                        Citizen age is {user?.age || 23} yrs (Meets scheme criteria).
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    ELIGIBLE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
                    <div>
                      <strong className="block font-bold">Academic Qualification:</strong>
                      <span className="text-[11px] text-[#6B5E55]">
                        Profile has {user?.education || 'Graduate/MCA'} (Qualifies for applicant pool).
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    ELIGIBLE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
                    <div>
                      <strong className="block font-bold">Domicile & Jurisdiction:</strong>
                      <span className="text-[11px] text-[#6B5E55]">
                        Valid for residents of {user?.state || 'Delhi'} (Central / Nationwide Scheme).
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    ELIGIBLE
                  </span>
                </div>
              </div>
            </div>

            {/* Document Vault Status */}
            <div>
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-[#8C7D73] mb-2">
                Required Vault Documents for 1-Click Application:
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 border border-[#D6CCC2] rounded-xl bg-[#FAF7F2] flex items-center justify-between">
                  <span className="font-semibold text-[#43342B]">Aadhaar Card</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5"/> Verified
                  </span>
                </div>
                <div className="p-2.5 border border-[#D6CCC2] rounded-xl bg-[#FAF7F2] flex items-center justify-between">
                  <span className="font-semibold text-[#43342B]">Degree Marksheet</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5"/> Verified
                  </span>
                </div>
                <div className="p-2.5 border border-[#D6CCC2] rounded-xl bg-[#FAF7F2] flex items-center justify-between">
                  <span className="font-semibold text-[#43342B]">Income Certificate</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5"/> Verified
                  </span>
                </div>
                <div className="p-2.5 border border-[#D6CCC2] rounded-xl bg-[#FAF7F2] flex items-center justify-between">
                  <span className="font-semibold text-[#43342B]">Bank Passbook / IFSC</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5"/> Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D6CCC2] flex items-center justify-between gap-3">
              <Button variant="outline" size="sm" onClick={() => setEligibilityModalOpen(false)} className="text-xs">
                Close
              </Button>
              <Button size="sm" asChild className="bg-[#59463B] hover:bg-[#2D231E] text-white font-bold text-xs">
                <Link to={`/dashboard/schemes/${selectedSchemeForAnalysis.id}`}>
                  View Step-by-Step Guide & Official Portal →
                </Link>
              </Button>
            </div>
          </div>)}
      </Modal>

      {/* ── 1-CLICK FAST APPLY SIMULATION MODAL ── */}
      <Modal isOpen={fastApplyModalOpen} onClose={() => setFastApplyModalOpen(false)} title={applyStep === 'success' ? "Official Application Submitted Successfully" : "1-Click DigiLocker Application Form"} size="lg">
        {selectedSchemeForApply && (<div className="space-y-4 font-sans text-xs">
            {applyStep === 'review' && (<>
                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E3D5CA] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#59463B] uppercase tracking-wider">
                      Applying for Welfare Scheme
                    </span>
                    <h4 className="font-bold text-sm text-[#2D231E] mt-0.5">
                      {selectedSchemeForApply.title}
                    </h4>
                    <p className="text-[11px] text-[#7D6E63]">{selectedSchemeForApply.ministry}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ⚡ Pre-Filled from Vault
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold uppercase tracking-wider text-[#8C7D73] text-[11px]">
                    Verified Citizen Credentials (Auto-Injected):
                  </h5>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 bg-[#FAF7F2] rounded-xl border">
                      <span className="text-[#8C7D73] block text-[10px]">Beneficiary Name</span>
                      <p className="font-bold text-[#2D231E]">{user?.name || 'Citizen'}</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF7F2] rounded-xl border">
                      <span className="text-[#8C7D73] block text-[10px]">Aadhaar Identification</span>
                      <p className="font-bold text-[#2D231E]">XXXX-XXXX-8912 (Linked)</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF7F2] rounded-xl border">
                      <span className="text-[#8C7D73] block text-[10px]">DBT Bank Account IFSC</span>
                      <p className="font-bold text-emerald-600">SBIN0001248 (NPCI Active)</p>
                    </div>
                    <div className="p-2.5 bg-[#FAF7F2] rounded-xl border">
                      <span className="text-[#8C7D73] block text-[10px]">Declared Annual Income</span>
                      <p className="font-bold text-[#2D231E]">₹{(user?.annualIncome || 350000).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
                  <p className="text-[11px]">
                    All 4 required documents (Aadhaar, Marksheet, Income Proof, Bank Passbook) are verified from your local DigiLocker vault.
                  </p>
                </div>

                <div className="pt-3 border-t flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => setFastApplyModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSubmitFastApply} className="bg-[#A67C65] hover:bg-[#A67C65] text-white font-extrabold gap-1.5 cursor-pointer">
                    <Zap className="w-3.5 h-3.5"/> Confirm & Transmit Application
                  </Button>
                </div>
              </>)}

            {applyStep === 'submitting' && (<div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-14 h-14 border-4 border-[#A67C65] border-t-transparent rounded-full animate-spin"/>
                <div>
                  <h4 className="font-extrabold text-base text-[#2D231E]">
                    Transmitting to Ministry Gateway...
                  </h4>
                  <p className="text-xs text-[#7D6E63] mt-1">
                    Verifying digital signature • Validating Aadhaar checksum • Generating official token
                  </p>
                </div>
              </div>)}

            {applyStep === 'success' && (<div className="space-y-4">
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6"/>
                  </div>
                  <h4 className="text-lg font-black text-emerald-900">
                    Application Successfully Lodged!
                  </h4>
                  <p className="text-xs text-[#6B5E55] max-w-md mx-auto">
                    Your preliminary application for <strong>{selectedSchemeForApply.title}</strong> has been received by the nodal ministry.
                  </p>

                  <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 inline-block font-mono text-sm font-bold text-[#59463B]">
                    Application Token: #{generatedToken}
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-3.5 rounded-xl border space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7D6E63]">Applicant Name:</span>
                    <strong className="text-[#2D231E]">{user?.name || 'Citizen'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7D6E63]">Submission Timestamp:</span>
                    <strong className="text-[#2D231E]">{new Date().toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7D6E63]">Estimated SLA Window:</span>
                    <strong className="text-emerald-600">14 Working Days</strong>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    alert(`Downloading official acknowledgment slip for token ${generatedToken}...`);
                }} className="text-xs gap-1.5">
                    📥 Download Receipt (PDF)
                  </Button>
                  <Button size="sm" onClick={() => setFastApplyModalOpen(false)} className="bg-[#59463B] text-white text-xs font-bold">
                    Done & Return to Schemes
                  </Button>
                </div>
              </div>)}
          </div>)}
      </Modal>

    </div>);
}
