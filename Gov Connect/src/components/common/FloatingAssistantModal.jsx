import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Sparkles, ArrowRight, Clock, ShieldCheck, FileText, Briefcase, Bell } from 'lucide-react';
import ROUTES from '@/constants/routes';

export default function FloatingAssistantModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPage = () => {
    setIsOpen(false);
    navigate(ROUTES.ASSISTANT);
  };

  return (
    <div className="font-sans">
      
      {/* ── 1. FLOATING ROUNDED TRIGGER BUTTON (Bottom-right) ── */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Helper Tooltip Pill with Coming Soon badge */}
          <div 
            onClick={() => setIsOpen(true)} 
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white shadow-xl border border-[#D6CCC2]/90 text-xs font-bold text-[#2D231E] cursor-pointer hover:scale-103 transition-transform group"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[#2D231E] group-hover:text-[#59463B] transition-colors">
              Ask Sarkar AI
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-extrabold border border-amber-200">
              Coming Soon
            </span>
          </div>

          {/* Glowing Round Floating Button */}
          <button 
            onClick={() => setIsOpen(true)} 
            className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#59463B] text-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 group border-2 border-white/40"
            title="Ask Sarkar AI (Coming Soon)"
          >
            <div className="absolute inset-0 rounded-full bg-[#D5BDAF] opacity-20 blur-md group-hover:opacity-50 transition-opacity" />
            <Bot className="w-7 h-7 text-white relative z-10 group-hover:rotate-12 transition-transform" />
            
            {/* Pulse Indicator */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white" />
          </button>
        </div>
      )}

      {/* ── 2. COMING SOON MODAL DIALOG ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6 bg-[#241C18]/40 backdrop-blur-xs animate-in fade-in duration-200">
          
          <div className="w-full sm:w-[400px] bg-white rounded-3xl shadow-2xl border border-[#D6CCC2] overflow-hidden text-left font-sans animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-300">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#59463B] text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-5 h-5 text-[#D5BDAF]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-white">Ask Sarkar AI</h3>
                    <span className="text-[9px] bg-amber-400/25 text-amber-200 font-extrabold px-2 py-0.5 rounded-full border border-amber-300/40">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-[11px] text-[#E3D5CA]">
                    Next-Gen Citizen Copilot
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs text-[#6B5E55]">
              
              {/* Highlight Badge */}
              <div className="p-3.5 bg-[#FAF7F2]/80 rounded-2xl border border-[#E3D5CA] flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E3D5CA] text-[#59463B] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#59463B]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#2D231E]">
                    Feature Under Active Development
                  </h4>
                  <p className="text-[11px] text-[#6B5E55] leading-relaxed">
                    Our AI models are currently being trained with official government gazettes, schemes eligibility criteria, and grievance redressal pathways.
                  </p>
                </div>
              </div>

              {/* What will be possible */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#8C7D73] uppercase tracking-wider">
                  Upcoming Capabilities:
                </span>
                <ul className="space-y-1.5 text-xs text-[#43342B]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A67C65] shrink-0" />
                    <span>Instant scheme matching via natural language</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#59463B] shrink-0" />
                    <span>Auto-draft formal grievances for CPGRAMS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Bilingual voice input in Hindi & English</span>
                  </li>
                </ul>
              </div>

              {/* Explore Roadmap CTA */}
              <div className="pt-2">
                <button
                  onClick={handleOpenPage}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#59463B] hover:from-[#2D231E] hover:to-[#59463B] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-[#D5BDAF]" />
                  <span>View Roadmap & Get Notified</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Active Features Quick Access */}
              <div className="pt-3 border-t border-[#E3D5CA]/50 space-y-2">
                <span className="text-[10px] font-bold text-[#8C7D73] uppercase tracking-wider">
                  Active Features Available Now:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setIsOpen(false); navigate(ROUTES.SCHEMES); }}
                    className="p-2 rounded-xl border border-[#D6CCC2] hover:border-[#59463B] bg-[#FAF7F2]/50 hover:bg-white text-left transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-[#59463B] font-bold text-xs">
                      <FileText className="w-3 h-3" />
                      <span>Schemes</span>
                    </div>
                    <p className="text-[10px] text-[#7D6E63] truncate mt-0.5">Explore 50+ programs</p>
                  </button>

                  <button
                    onClick={() => { setIsOpen(false); navigate(ROUTES.JOBS); }}
                    className="p-2 rounded-xl border border-[#D6CCC2] hover:border-[#59463B] bg-[#FAF7F2]/50 hover:bg-white text-left transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-[#59463B] font-bold text-xs">
                      <Briefcase className="w-3 h-3" />
                      <span>Govt Jobs</span>
                    </div>
                    <p className="text-[10px] text-[#7D6E63] truncate mt-0.5">Live vacancies & alerts</p>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
