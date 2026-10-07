import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Briefcase, FolderOpen, MapPin, HelpCircle, ArrowRight } from 'lucide-react';
import { mockSchemes } from '@/data/mockSchemes';
import { mockJobs } from '@/data/mockJobs';
import { mockDocuments } from '@/data/mockDocuments';
import { mockServices } from '@/data/mockServices';
import { mockFaqs } from '@/data/mockFaqs';
import ROUTES from '@/constants/routes';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // If not open, will be handled by window listener
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedSchemes = q
    ? mockSchemes.filter(s => s.title.toLowerCase().includes(q) || s.ministry.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q))).slice(0, 3)
    : [];

  const matchedJobs = q
    ? mockJobs.filter(j => j.title.toLowerCase().includes(q) || j.organization.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q))).slice(0, 3)
    : [];

  const matchedDocs = q
    ? mockDocuments.filter(d => d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedServices = q
    ? mockServices.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const matchedFaqs = q
    ? mockFaqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)).slice(0, 3)
    : [];

  const hasResults = matchedSchemes.length > 0 || matchedJobs.length > 0 || matchedDocs.length > 0 || matchedServices.length > 0 || matchedFaqs.length > 0;

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[80vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search schemes, jobs, documents, services, FAQs..."
            className="flex-1 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 outline-none text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 p-1 mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            ESC to close
          </span>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium mb-2">Search across the entire GovConnect portal</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200" onClick={() => setQuery('MUDRA')}>
                  💡 PM MUDRA Yojana
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200" onClick={() => setQuery('SSC')}>
                  💼 SSC CGL Jobs
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200" onClick={() => setQuery('Aadhaar')}>
                  📁 Aadhaar Card
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200" onClick={() => setQuery('Hospital')}>
                  🏥 AIIMS Hospital
                </span>
              </div>
            </div>
          )}

          {query && !hasResults && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-base font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1 text-slate-400">Try searching for keywords like &ldquo;Scholarship&rdquo;, &ldquo;Railway&rdquo;, &ldquo;Police&rdquo;, or &ldquo;Hospital&rdquo;.</p>
            </div>
          )}

          {/* Schemes Results */}
          {matchedSchemes.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" /> Government Schemes
              </div>
              <div className="space-y-1.5">
                {matchedSchemes.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(`/schemes/${s.id}`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400">
                        {s.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{s.ministry}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Jobs Results */}
          {matchedJobs.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Government Jobs
              </div>
              <div className="space-y-1.5">
                {matchedJobs.map(j => (
                  <button
                    key={j.id}
                    onClick={() => handleSelect(`/jobs/${j.id}`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400">
                        {j.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{j.organization} • {j.location}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents Results */}
          {matchedDocs.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-amber-600" /> Document Vault
              </div>
              <div className="space-y-1.5">
                {matchedDocs.map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect(ROUTES.DOCUMENTS)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-amber-700">
                        {d.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Category: {d.category} • Status: {d.status}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services Results */}
          {matchedServices.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-600" /> Local Citizen Services
              </div>
              <div className="space-y-1.5">
                {matchedServices.map(srv => (
                  <button
                    key={srv.id}
                    onClick={() => handleSelect(ROUTES.SERVICES)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-purple-700">
                        {srv.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{srv.address} ({srv.distance})</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Results */}
          {matchedFaqs.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> FAQs & Guidance
              </div>
              <div className="space-y-1.5">
                {matchedFaqs.map(f => (
                  <button
                    key={f.id}
                    onClick={() => handleSelect(ROUTES.ABOUT)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-indigo-700">
                        {f.question}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{f.answer}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
          <span>Navigate with arrow keys or mouse click</span>
          <span className="text-[#1a2f8a] font-medium">GovConnect Unified Search</span>
        </div>
      </div>
    </div>
  );
};
