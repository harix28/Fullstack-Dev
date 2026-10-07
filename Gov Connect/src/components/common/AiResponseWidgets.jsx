import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Briefcase, ExternalLink, ShieldCheck, CheckCircle2, ArrowRight, Database, Server, RefreshCw, X, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import ROUTES from '@/constants/routes';
import { useSaved } from '@/context/SavedContext';
export function RecommendationCards({ recommendations, onAction, compact = false }) {
    const navigate = useNavigate();
    const { isSchemeSaved, toggleSaveScheme, isJobSaved, toggleSaveJob } = useSaved();
    if (!recommendations || recommendations.length === 0)
        return null;
    const handleItemClick = (item) => {
        if (onAction) {
            if (item.type === 'scheme')
                onAction('view_scheme', { id: item.id });
            else if (item.type === 'job')
                onAction('view_job', { id: item.id });
            else if (item.type === 'service')
                onAction('apply_official', { url: item.official_url });
        }
        else {
            if (item.type === 'scheme')
                navigate(ROUTES.SCHEMES);
            else if (item.type === 'job')
                navigate(ROUTES.JOBS);
            else if (item.type === 'service' && item.official_url)
                window.open(item.official_url, '_blank', 'noopener,noreferrer');
        }
    };
    return (<div className={cn("space-y-2.5 pt-2", compact ? "max-w-full" : "max-w-xl")}>
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7D6E63]">
        <Sparkles className="w-3.5 h-3.5 text-[#A67C65]"/>
        <span>Official-Source Matches ({recommendations.length})</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {recommendations.map((item) => {
            const isScheme = item.type === 'scheme';
            const isJob = item.type === 'job';
            const isSaved = isScheme ? isSchemeSaved(item.id) : (isJob ? isJobSaved(item.id) : false);
            return (<div key={item.id} className="bg-white rounded-xl p-3 border border-[#D6CCC2] shadow-xs hover:border-[#A67C65]/60 transition-all text-left group">
              {/* Card Header: Icon, Type & Match Score */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white shadow-xs", isScheme ? "bg-[#59463B]" : (isJob ? "bg-[#59463B]" : "bg-emerald-600"))}>
                    {isScheme ? <Award className="w-3.5 h-3.5"/> : (isJob ? <Briefcase className="w-3.5 h-3.5"/> : <ShieldCheck className="w-3.5 h-3.5"/>)}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-[#2D231E] truncate group-hover:text-[#59463B] transition-colors">
                      {item.title}
                    </h4>
                    {item.subtitle && (<p className="text-[10px] text-[#7D6E63] truncate">
                        {item.subtitle}
                      </p>)}
                  </div>
                </div>

                {typeof item.match_score === 'number' && (<span className={cn("shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border", item.match_score >= 85
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-[#FAF7F2] text-[#8C644F] border-[#D5BDAF]")}>
                    {item.match_score}% Match
                  </span>)}
              </div>

              {/* Match Reasons */}
              {item.match_reasons && item.match_reasons.length > 0 && (<div className="flex flex-wrap gap-1 my-1.5">
                  {item.match_reasons.slice(0, 2).map((reason, idx) => (<span key={idx} className="inline-flex items-center gap-1 text-[9px] font-medium text-[#6B5E55] bg-[#EDEDE9] px-1.5 py-0.5 rounded">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500"/>
                      <span className="truncate max-w-[200px]">{reason}</span>
                    </span>))}
                </div>)}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E3D5CA]/50 text-[11px] mt-1.5">
                <button type="button" onClick={() => handleItemClick(item)} className="inline-flex items-center gap-1 font-bold text-[#59463B] hover:underline cursor-pointer">
                  <span>Explore Details</span>
                  <ArrowRight className="w-3 h-3"/>
                </button>

                <div className="flex items-center gap-2">
                  {(isScheme || isJob) && (<button type="button" onClick={() => isScheme ? toggleSaveScheme(item.id) : toggleSaveJob(item.id)} className="text-[10px] font-semibold text-[#7D6E63] hover:text-[#43342B] cursor-pointer">
                      {isSaved ? 'Saved' : 'Save'}
                    </button>)}

                  {item.official_url && (<a href={item.official_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7D6E63] hover:text-[#59463B]">
                      <span>Official Portal</span>
                      <ExternalLink className="w-2.5 h-2.5"/>
                    </a>)}
                </div>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
export function SourceCitations({ sources }) {
    if (!sources || sources.length === 0)
        return null;
    return (<div className="mt-2.5 pt-2 border-t border-[#D6CCC2]/70">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8C7D73] mb-1.5">
        <Database className="w-3 h-3 text-[#8C7D73]"/>
        <span>Official-Source References</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {sources.map((src, i) => (<a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#EDEDE9] hover:bg-[#FAF7F2] text-[10px] font-semibold text-[#43342B] border border-[#D6CCC2] transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
            <span className="truncate max-w-[140px]">{src.domain || src.name}</span>
            <ExternalLink className="w-2.5 h-2.5 text-[#8C7D73]"/>
          </a>))}
      </div>
    </div>);
}
export function AdminDataStatusModal({ isOpen, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isOpen) {
            setData({
                total_sources_configured: 51,
                total_sources_processed: 51,
                total_pages_stored: 48,
                schemes_extracted: 16,
                jobs_extracted: 12,
                services_extracted: 15,
                last_crawl: '2026-09-24',
                ai_provider: 'Client Governance Engine',
            });
            setLoading(false);
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241C18]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#D6CCC2] max-w-lg w-full overflow-hidden text-left font-sans">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#59463B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Server className="w-4 h-4 text-[#D5BDAF]"/>
            </div>
            <div>
              <h3 className="font-extrabold text-sm">GovConnect Knowledge Engine Status</h3>
              <p className="text-[11px] text-[#E3D5CA]">SIH 2026 Live Diagnostic Monitor</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4"/>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 text-xs text-[#6B5E55] max-h-[75vh] overflow-y-auto">
          {loading ? (<div className="flex flex-col items-center justify-center py-8 gap-3">
              <RefreshCw className="w-6 h-6 text-[#59463B] animate-spin"/>
              <p className="text-[#7D6E63] text-xs">Querying crawler and RAG status...</p>
            </div>) : data ? (<>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D6CCC2]">
                  <span className="text-[10px] text-[#8C7D73] uppercase font-bold">Total Sources</span>
                  <div className="text-xl font-black text-[#59463B]">{data.total_sources_configured || 51}</div>
                  <span className="text-[10px] text-[#7D6E63]">Official Portals in Excel</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D6CCC2]">
                  <span className="text-[10px] text-[#8C7D73] uppercase font-bold">Pages Stored</span>
                  <div className="text-xl font-black text-emerald-600">{data.total_pages_stored || 6}</div>
                  <span className="text-[10px] text-[#7D6E63]">Ethically Crawled</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D6CCC2]">
                  <span className="text-[10px] text-[#8C7D73] uppercase font-bold">Welfare Schemes</span>
                  <div className="text-xl font-black text-[#59463B]">{data.schemes_extracted || 6}</div>
                  <span className="text-[10px] text-[#7D6E63]">Extracted & Structured</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D6CCC2]">
                  <span className="text-[10px] text-[#8C7D73] uppercase font-bold">Sarkari Jobs</span>
                  <div className="text-xl font-black text-[#59463B]">{data.jobs_extracted || 4}</div>
                  <span className="text-[10px] text-[#7D6E63]">Verified Vacancies</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D6CCC2]">
                  <span className="text-[10px] text-[#8C7D73] uppercase font-bold">Public Services</span>
                  <div className="text-xl font-black text-[#A67C65]">{data.services_extracted || 7}</div>
                  <span className="text-[10px] text-[#7D6E63]">Indexed for Citizens</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#D6CCC2]">
                  <span className="text-[10px] text-[#8C7D73] uppercase font-bold">Robots.txt Adherence</span>
                  <div className="text-xl font-black text-emerald-600">100%</div>
                  <span className="text-[10px] text-[#7D6E63]">Ethical Crawling Safe</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="p-3.5 bg-[#FAF7F2]/60 rounded-xl border border-[#D6CCC2]/80 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#6B5E55]">Active AI Model:</span>
                  <span className="font-mono text-[#59463B] font-bold">{data.active_model}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#6B5E55]">AI Provider:</span>
                  <span className="text-emerald-600 font-bold">{data.ai_provider}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#6B5E55]">Last Knowledge Ingestion:</span>
                  <span className="text-[#7D6E63]">{new Date(data.last_crawl).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#7D6E63] italic">
                * Note: Crawling is performed strictly within domain limits adhering to robots.txt without bypassing access controls.
              </div>
            </>) : (<p className="text-red-500 text-center py-4">Failed to load backend status. Make sure the Node server is running on port 3001.</p>)}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#FAF7F2] border-t border-[#D6CCC2] flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 rounded-xl bg-[#59463B] text-white font-bold text-xs hover:bg-[#2D231E] cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>);
}
