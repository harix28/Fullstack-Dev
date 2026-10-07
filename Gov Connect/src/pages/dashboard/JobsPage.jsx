import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, SlidersHorizontal, Zap, ArrowUpDown, BookOpen } from 'lucide-react';
import { mockJobs } from '@/data/mockJobs';
import { useAuth } from '@/context/AuthContext';
import { useSaved } from '@/context/SavedContext';
import { Button, Card, DeadlineBadge, MatchBadge, SearchBar, EmptyState, Modal } from '@/components/ui';
const QUICK_JOB_PILLS = [
    { id: 'all', label: 'All Vacancies across India' },
    { id: 'top_match', label: '🌟 Top Skill Matches (90%+)' },
    { id: 'administrative', label: '🏛️ UPSC & Civil Services' },
    { id: 'central_govt', label: '📑 SSC Central Exams' },
    { id: 'banking', label: '🏦 Banking & Finance (SBI / IBPS / RBI)' },
    { id: 'railways', label: '🚆 Indian Railways (RRB)' },
    { id: 'defence', label: '🛡️ Defence & Armed Forces' },
    { id: 'police', label: '👮 Police & Sub-Inspectors' },
    { id: 'engineering', label: '🔬 Scientific Labs & PSUs (ISRO/DRDO/NIC)' },
    { id: 'teaching', label: '📚 Teaching & Education' },
    { id: 'medical', label: '🩺 Medical & Healthcare (AIIMS)' },
    { id: 'state_govt', label: '🏛️ State PSCs (UPPSC / BPSC / MPSC)' },
];
export default function JobsPage() {
    const { user } = useAuth();
    const { isJobSaved, toggleSaveJob } = useSaved();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPill, setSelectedPill] = useState('all');
    const [selectedQualification, setSelectedQualification] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [sortBy, setSortBy] = useState('vacancies');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    // Quick Syllabus & Exam pattern modal
    const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
    const [selectedJobForModal, setSelectedJobForModal] = useState(null);
    const userSkills = user?.skills || ['Python', 'SQL', 'React', 'Data Analysis'];
    const filteredJobs = useMemo(() => {
        return mockJobs.filter(job => {
            // Search
            const query = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                job.title.toLowerCase().includes(query) ||
                job.organization.toLowerCase().includes(query) ||
                job.department.toLowerCase().includes(query) ||
                job.location.toLowerCase().includes(query) ||
                (job.tags && job.tags.some(t => t.toLowerCase().includes(query)));
            // Tab logic
            if (activeTab === 'saved') {
                if (!isJobSaved(job.id))
                    return false;
            }
            else if (activeTab === 'recommended') {
                if ((job.matchPercentage || 0) < 85)
                    return false;
            }
            // Quick Pill
            let matchesPill = true;
            if (selectedPill === 'top_match') {
                matchesPill = (job.matchPercentage || 0) >= 90;
            }
            else if (selectedPill !== 'all') {
                matchesPill = job.category === selectedPill;
            }
            // Advanced filters
            const matchesQual = selectedQualification === 'all' ||
                job.qualification.some(q => q.toLowerCase().includes(selectedQualification.toLowerCase()));
            const matchesLoc = selectedLocation === 'all' || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
            return matchesSearch && matchesPill && matchesQual && matchesLoc;
        }).sort((a, b) => {
            if (sortBy === 'vacancies') {
                const getVac = (v) => typeof v === 'number' ? v : parseInt(String(v).replace(/\D/g, '')) || 0;
                return getVac(b.vacancies) - getVac(a.vacancies);
            }
            if (sortBy === 'match') {
                return (b.matchPercentage || 0) - (a.matchPercentage || 0);
            }
            if (sortBy === 'name_asc') {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === 'name_desc') {
                return b.title.localeCompare(a.title);
            }
            if (sortBy === 'deadline') {
                if (!a.applicationDeadline)
                    return 1;
                if (!b.applicationDeadline)
                    return -1;
                return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
            }
            return 0;
        });
    }, [searchQuery, activeTab, selectedPill, selectedQualification, selectedLocation, isJobSaved, sortBy]);
    const openSyllabus = (job) => {
        setSelectedJobForModal(job);
        setSyllabusModalOpen(true);
    };
    const resetAllFilters = () => {
        setActiveTab('all');
        setSelectedPill('all');
        setSelectedQualification('all');
        setSelectedLocation('all');
        setSearchQuery('');
        setSortBy('vacancies');
    };
    return (<div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      
      {/* ── CANDIDATE CAREER COMMAND BANNER ── */}
      <div className="bg-[#59463B] rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D5BDAF]/20 text-[#E3D5CA] border border-[#D5BDAF]/30">
                <Zap className="w-3.5 h-3.5 text-[#D5BDAF]"/>
                Pan-India Sarkari Jobs & Vacancies Tracker
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/90">
                Matched for: {user?.education || 'Graduate / MCA'} • {user?.state || 'Delhi'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Pan-India Sarkari Jobs & Public Sector Vacancies
            </h1>

            <p className="text-[#E3D5CA] text-sm leading-relaxed">
              Real-time directory of <strong>all {mockJobs.length} active recruitment examinations</strong> across UPSC, SSC, Public Sector Banks (IBPS/SBI/RBI), Indian Railways (RRB), Defence Armed Forces (CDS/CAPF/Coast Guard), and Premier Tech Labs (NIC/DRDO/ISRO/BARC).
            </p>

            {/* Matched Profile Skills Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-[#D6CCC2] mr-1 font-semibold">Matched Profile Skills:</span>
              {userSkills.map((sk) => (<span key={sk} className="px-2.5 py-0.5 bg-[#A67C65]/20 text-[#E3D5CA] border border-[#D5BDAF]/30 text-xs rounded-full font-bold">
                  {sk} ✓
                </span>))}
            </div>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="relative z-10 shrink-0 flex flex-row lg:flex-col gap-3">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[140px]">
              <span className="text-3xl font-black text-[#D5BDAF]">
                {mockJobs.length}
              </span>
              <p className="text-[11px] text-[#D6CCC2] font-bold uppercase tracking-wider mt-0.5">Total Exam Tracks</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[140px]">
              <span className="text-2xl font-black text-amber-300">
                126,000+
              </span>
              <p className="text-[11px] text-[#D6CCC2] font-bold uppercase tracking-wider mt-0.5">Total Vacancies Pan-India</p>
            </div>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-[#59463B] rounded-full blur-3xl opacity-20 pointer-events-none"/>
      </div>

      {/* ── 1-CLICK SECTOR FILTER PILLS ── */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#D6CCC2]/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] font-bold text-[#8C7D73] uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Sectors:
          </span>
          {QUICK_JOB_PILLS.map((pill) => {
            const isSelected = selectedPill === pill.id;
            return (<button key={pill.id} onClick={() => setSelectedPill(pill.id)} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${isSelected
                    ? 'bg-[#59463B] text-white shadow-sm ring-2 ring-[#59463B]/20'
                    : 'bg-[#EDEDE9] text-[#43342B] hover:bg-[#E3D5CA]'}`}>
                <span>{pill.label}</span>
              </button>);
        })}
        </div>
      </div>

      {/* ── TOOLBAR: TABS, SEARCH, SORT ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D6CCC2]/80 shadow-xs">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b md:border-b-0 pb-2 md:pb-0 border-[#D6CCC2]">
          <button onClick={() => {
            setActiveTab('all');
            setSelectedPill('all');
        }} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'all'
            ? 'bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]'
            : 'text-[#7D6E63] hover:text-[#2D231E]'}`}>
            Explore All Vacancies ({mockJobs.length})
          </button>
          <button onClick={() => setActiveTab('recommended')} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'recommended'
            ? 'bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]'
            : 'text-[#7D6E63] hover:text-[#2D231E]'}`}>
            Top Matches for Me
          </button>
          <button onClick={() => setActiveTab('saved')} className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'saved'
            ? 'bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]'
            : 'text-[#7D6E63] hover:text-[#2D231E]'}`}>
            Bookmarked
          </button>
        </div>

        {/* Search, Sort & Advanced Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-64">
            <SearchBar placeholder="Search all 18 jobs by post, board, skill..." onChange={(v) => setSearchQuery(v)}/>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-2.5 py-1.5 rounded-xl border border-[#D6CCC2] text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8C7D73]"/>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-[#43342B] font-semibold focus:outline-none cursor-pointer text-xs">
              <option value="name_asc">Sort: Alphabetical (A to Z)</option>
              <option value="name_desc">Sort: Alphabetical (Z to A)</option>
              <option value="vacancies">Sort: High Vacancies</option>
              <option value="match">Sort: Top Match %</option>
              <option value="deadline">Sort: Deadline Soon</option>
            </select>
          </div>

          <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${showAdvancedFilters || selectedQualification !== 'all' || selectedLocation !== 'all'
            ? 'bg-[#FAF7F2] text-[#59463B] border-[#D6CCC2]'
            : 'border-[#D6CCC2] text-[#6B5E55] hover:bg-[#FAF7F2]'}`}>
            <SlidersHorizontal className="w-3.5 h-3.5"/>
            <span>Filters {(selectedQualification !== 'all' || selectedLocation !== 'all') ? '• Active' : ''}</span>
          </button>
        </div>
      </div>

      {/* ── EXPANDABLE ADVANCED FILTER DRAWER ── */}
      {showAdvancedFilters && (<div className="bg-[#FAF7F2] border border-[#D6CCC2] p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
          <div>
            <label className="text-xs font-bold text-[#43342B] block mb-1">
              Minimum Qualification
            </label>
            <select value={selectedQualification} onChange={e => setSelectedQualification(e.target.value)} className="w-full p-2 rounded-xl text-xs bg-white border border-[#D6CCC2] text-[#2D231E]">
              <option value="all">All Qualifications</option>
              <option value="10th">10th Pass</option>
              <option value="12th">12th Pass</option>
              <option value="Graduate">Graduation (Any Stream)</option>
              <option value="MCA">Post Graduate / MCA / B.Tech</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#43342B] block mb-1">
              Posting Location
            </label>
            <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="w-full p-2 rounded-xl text-xs bg-white border border-[#D6CCC2] text-[#2D231E]">
              <option value="all">All Locations</option>
              <option value="All India">All India / Pan India</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={resetAllFilters} className="w-full text-xs h-9">
              Reset Filters
            </Button>
          </div>
        </div>)}

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-[#7D6E63] px-1">
        <p>
          Showing <strong className="text-[#2D231E]">{filteredJobs.length}</strong> of <strong>{mockJobs.length}</strong> public sector vacancies across India
          {selectedPill !== 'all' && <span> • Sector: <strong>{selectedPill}</strong></span>}
        </p>

        {(selectedPill !== 'all' || searchQuery || selectedQualification !== 'all' || selectedLocation !== 'all') && (<button onClick={resetAllFilters} className="text-[#59463B] font-bold hover:underline cursor-pointer">
            Clear Filters & Show All {mockJobs.length} Vacancies
          </button>)}
      </div>

      {/* ── JOBS CARDS LIST ── */}
      {filteredJobs.length === 0 ? (<EmptyState icon={<Briefcase className="w-12 h-12 text-[#D6CCC2]"/>} title="No vacancies match your criteria" description={`Try broadening your search or sector filters to explore all ${mockJobs.length} national and state government opportunities.`} action={<Button onClick={resetAllFilters} className="bg-[#59463B] text-white">
              Show All {mockJobs.length} Vacancies
            </Button>}/>) : (<div className="space-y-4">
          {filteredJobs.map((job) => {
                const saved = isJobSaved(job.id);
                const matchScore = job.matchPercentage || 85;
                return (<Card key={job.id} className="p-5 sm:p-6 hover:shadow-lg transition-all duration-200 border-[#D6CCC2]/90 bg-white group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left: Organization Avatar + Role Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-13 h-13 rounded-2xl bg-[#59463B] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md">
                      {job.organization.slice(0, 3).toUpperCase()}
                    </div>
                    
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-extrabold text-[#2D231E] group-hover:text-[#59463B] transition-colors">
                          <Link to={`/dashboard/jobs/${job.id}`}>
                            {job.title}
                          </Link>
                        </h3>
                        {job.isNew && (<span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-extrabold rounded-full animate-pulse">
                            NEW NOTICE
                          </span>)}
                      </div>

                      <p className="text-xs font-semibold text-[#6B5E55]">
                        🏛️ {job.organization} • <span className="text-[#8C7D73]">{job.department}</span>
                      </p>

                      {/* Pay Scale + Vacancies + Location Badges */}
                      <div className="flex flex-wrap gap-2 text-xs pt-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#59463B] border border-[#D5BDAF]/60 font-extrabold text-xs">
                          💰 {job.payScale}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#59463B] border border-[#D6CCC2]/60 font-bold text-xs">
                          👥 {(typeof job.vacancies === 'number' ? job.vacancies.toLocaleString('en-IN') : job.vacancies) || 'Multiple'} Vacancies
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EDEDE9] text-[#43342B] font-semibold text-xs">
                          📍 {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Match Score + Deadline */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E3D5CA]/50">
                    <MatchBadge matchPercentage={matchScore}/>
                    {job.applicationDeadline && (<DeadlineBadge date={job.applicationDeadline}/>)}
                  </div>
                </div>

                {/* Bottom Strip: Skills match & Action Buttons */}
                <div className="mt-4 pt-3.5 border-t border-[#E3D5CA]/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                  
                  {/* Qualification & Age Tag */}
                  <div className="flex flex-wrap items-center gap-2 text-[#7D6E63]">
                    <span className="font-semibold text-[#43342B]">Min Qual:</span>
                    <span className="font-bold text-[#2D231E] bg-[#EDEDE9] px-2 py-0.5 rounded">
                      {job.qualification?.join(' / ') || 'Graduation'}
                    </span>
                    <span className="mx-1">•</span>
                    <span className="font-semibold text-[#43342B]">Age:</span>
                    <span>{job.ageLimit ? `${job.ageLimit.min}–${job.ageLimit.max} yrs` : '18–30 yrs'}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleSaveJob(job.id, job.title)} className={`p-2 rounded-xl transition-all cursor-pointer ${saved
                        ? 'text-amber-500 bg-amber-50 ring-1 ring-amber-300'
                        : 'text-[#8C7D73] hover:text-[#43342B] bg-[#FAF7F2] hover:bg-[#EDEDE9]'}`} title={saved ? "Saved in Bookmarks" : "Bookmark Job"}>
                      <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"}/>
                    </button>

                    <button onClick={() => openSyllabus(job)} className="px-3 py-1.5 text-xs font-bold text-[#59463B] bg-[#FAF7F2] hover:bg-[#E3D5CA] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#59463B]"/>
                      <span>Quick Syllabus</span>
                    </button>

                    <Button asChild size="sm" className="bg-[#59463B] hover:bg-[#2D231E] text-white text-xs h-8 px-3.5 rounded-xl font-bold">
                      <Link to={`/dashboard/jobs/${job.id}`}>
                        Full Details & Apply →
                      </Link>
                    </Button>
                  </div>

                </div>
              </Card>);
            })}
        </div>)}

      {/* ── QUICK SYLLABUS & EXAM PATTERN MODAL ── */}
      <Modal isOpen={syllabusModalOpen} onClose={() => setSyllabusModalOpen(false)} title="Exam Pattern & Syllabus Breakdown" size="lg">
        {selectedJobForModal && (<div className="space-y-4 font-sans text-xs">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#D6CCC2]">
              <span className="text-[10px] font-bold text-[#8C7D73] uppercase tracking-wider">
                {selectedJobForModal.organization}
              </span>
              <h4 className="font-bold text-base text-[#2D231E] mt-0.5">
                {selectedJobForModal.title}
              </h4>
              <p className="text-[#7D6E63] mt-1">
                Pay Scale: <strong className="text-[#8C644F]">{selectedJobForModal.payScale}</strong> • Vacancies: <strong>{(typeof selectedJobForModal.vacancies === 'number' ? selectedJobForModal.vacancies.toLocaleString('en-IN') : selectedJobForModal.vacancies)}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold uppercase tracking-wider text-[#8C7D73] text-[11px]">
                Exam Pattern (Computer-Based Test / Tier 1):
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white border rounded-lg">
                  <p className="font-bold text-[#2D231E]">General Intelligence & Reasoning</p>
                  <p className="text-[#7D6E63] text-[11px]">25 Questions • 50 Marks</p>
                </div>
                <div className="p-2.5 bg-white border rounded-lg">
                  <p className="font-bold text-[#2D231E]">General Awareness & GK</p>
                  <p className="text-[#7D6E63] text-[11px]">25 Questions • 50 Marks</p>
                </div>
                <div className="p-2.5 bg-white border rounded-lg">
                  <p className="font-bold text-[#2D231E]">Quantitative Aptitude</p>
                  <p className="text-[#7D6E63] text-[11px]">25 Questions • 50 Marks</p>
                </div>
                <div className="p-2.5 bg-white border rounded-lg">
                  <p className="font-bold text-[#2D231E]">English Comprehension</p>
                  <p className="text-[#7D6E63] text-[11px]">25 Questions • 50 Marks</p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-wider text-[#8C7D73] text-[11px] mb-1.5">
                Targeted Profile Skills:
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedJobForModal.tags?.map((t) => (<span key={t} className="px-2.5 py-1 bg-[#FAF7F2] text-[#59463B] rounded-lg font-semibold text-[11px]">
                    ✓ {t}
                  </span>))}
              </div>
            </div>

            <div className="pt-3 border-t flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setSyllabusModalOpen(false)}>
                Close
              </Button>
              <Button size="sm" asChild className="bg-[#59463B] text-white font-bold">
                <Link to={`/dashboard/jobs/${selectedJobForModal.id}`}>
                  Go to Job Application Portal →
                </Link>
              </Button>
            </div>
          </div>)}
      </Modal>

    </div>);
}
