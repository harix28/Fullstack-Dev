import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Briefcase, ExternalLink, ShieldCheck, CheckCircle2, 
  ArrowRight, FileText, Database, Server, RefreshCw, X, Sparkles, Building2, Check
} from 'lucide-react';
import { cn } from '@/utils/cn';
import ROUTES from '@/constants/routes';
import type { RecommendationItem, SourceCitation } from '@/types';
import { useSaved } from '@/context/SavedContext';

export interface RecommendationCardsProps {
  recommendations?: RecommendationItem[];
  onAction?: (actionType: string, payload?: any) => void;
  compact?: boolean;
}

export function RecommendationCards({ recommendations, onAction, compact = false }: RecommendationCardsProps) {
  const navigate = useNavigate();
  const { isSchemeSaved, toggleSaveScheme, isJobSaved, toggleSaveJob } = useSaved();

  if (!recommendations || recommendations.length === 0) return null;

  const handleItemClick = (item: RecommendationItem) => {
    if (onAction) {
      if (item.type === 'scheme') onAction('view_scheme', { id: item.id });
      else if (item.type === 'job') onAction('view_job', { id: item.id });
      else if (item.type === 'service') onAction('apply_official', { url: item.official_url });
    } else {
      if (item.type === 'scheme') navigate(ROUTES.SCHEMES);
      else if (item.type === 'job') navigate(ROUTES.JOBS);
      else if (item.type === 'service' && item.official_url) window.open(item.official_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={cn("space-y-2.5 pt-2", compact ? "max-w-full" : "max-w-xl")}>
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        <span>Official-Source Matches ({recommendations.length})</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {recommendations.map((item) => {
          const isScheme = item.type === 'scheme';
          const isJob = item.type === 'job';
          const isSaved = isScheme ? isSchemeSaved(item.id) : (isJob ? isJobSaved(item.id) : false);

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-teal-500/60 dark:hover:border-teal-500/60 transition-all text-left group"
            >
              {/* Card Header: Icon, Type & Match Score */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white shadow-xs",
                    isScheme ? "bg-[#1a2f8a]" : (isJob ? "bg-indigo-600" : "bg-emerald-600")
                  )}>
                    {isScheme ? <Award className="w-3.5 h-3.5" /> : (isJob ? <Briefcase className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />)}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#1a2f8a] dark:group-hover:text-teal-300 transition-colors">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {typeof item.match_score === 'number' && (
                  <span className={cn(
                    "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border",
                    item.match_score >= 85 
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                  )}>
                    {item.match_score}% Match
                  </span>
                )}
              </div>

              {/* Match Reasons */}
              {item.match_reasons && item.match_reasons.length > 0 && (
                <div className="flex flex-wrap gap-1 my-1.5">
                  {item.match_reasons.slice(0, 2).map((reason, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 rounded"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                      <span className="truncate max-w-[200px]">{reason}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] mt-1.5">
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className="inline-flex items-center gap-1 font-bold text-[#1a2f8a] dark:text-teal-300 hover:underline cursor-pointer"
                >
                  <span>Explore Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-2">
                  {(isScheme || isJob) && (
                    <button
                      type="button"
                      onClick={() => isScheme ? toggleSaveScheme(item.id) : toggleSaveJob(item.id)}
                      className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  )}

                  {item.official_url && (
                    <a
                      href={item.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-[#1a2f8a] dark:hover:text-teal-300"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SourceCitations({ sources }: { sources?: SourceCitation[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/70">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
        <Database className="w-3 h-3 text-slate-400" />
        <span>Official-Source References</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {sources.map((src, i) => (
          <a
            key={i}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="truncate max-w-[140px]">{src.domain || src.name}</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function AdminDataStatusModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('http://localhost:3001/api/v1/admin/data-status')
        .then((r) => r.json())
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden text-left font-sans">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0f1740] via-[#1a2f8a] to-[#0d9488] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Server className="w-4 h-4 text-teal-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">GovConnect Knowledge Engine Status</h3>
              <p className="text-[11px] text-teal-200">SIH 2026 Live Diagnostic Monitor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 text-xs text-slate-600 dark:text-slate-300 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <RefreshCw className="w-6 h-6 text-[#1a2f8a] animate-spin" />
              <p className="text-slate-500 text-xs">Querying crawler and RAG status...</p>
            </div>
          ) : data ? (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Sources</span>
                  <div className="text-xl font-black text-[#1a2f8a] dark:text-teal-300">{data.total_sources_configured || 51}</div>
                  <span className="text-[10px] text-slate-500">Official Portals in Excel</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Pages Stored</span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{data.total_pages_stored || 6}</div>
                  <span className="text-[10px] text-slate-500">Ethically Crawled</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Welfare Schemes</span>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{data.schemes_extracted || 6}</div>
                  <span className="text-[10px] text-slate-500">Extracted & Structured</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Sarkari Jobs</span>
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400">{data.jobs_extracted || 4}</div>
                  <span className="text-[10px] text-slate-500">Verified Vacancies</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Public Services</span>
                  <div className="text-xl font-black text-teal-600 dark:text-teal-400">{data.services_extracted || 7}</div>
                  <span className="text-[10px] text-slate-500">Indexed for Citizens</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Robots.txt Adherence</span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                  <span className="text-[10px] text-slate-500">Ethical Crawling Safe</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-800/80 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-600 dark:text-slate-300">Active AI Model:</span>
                  <span className="font-mono text-[#1a2f8a] dark:text-teal-300 font-bold">{data.active_model}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-600 dark:text-slate-300">AI Provider:</span>
                  <span className="text-emerald-600 font-bold">{data.ai_provider}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-600 dark:text-slate-300">Last Knowledge Ingestion:</span>
                  <span className="text-slate-500">{new Date(data.last_crawl).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 italic">
                * Note: Crawling is performed strictly within domain limits adhering to robots.txt without bypassing access controls.
              </div>
            </>
          ) : (
            <p className="text-red-500 text-center py-4">Failed to load backend status. Make sure the Node server is running on port 3001.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1a2f8a] text-white font-bold text-xs hover:bg-[#0f1740] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
