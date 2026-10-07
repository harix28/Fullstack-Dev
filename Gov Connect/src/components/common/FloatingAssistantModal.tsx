import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bot, Send, X, Minimize2, Maximize2, Sparkles, Trash2, 
  ArrowRight, CheckCircle2, Mic, ExternalLink, Shield, 
  ChevronDown, MessageSquareText, HelpCircle, Layers
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { sendMessage } from '@/services/assistant';
import ROUTES from '@/constants/routes';
import { RecommendationCards, SourceCitations } from '@/components/common/AiResponseWidgets';

export default function FloatingAssistantModal() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine current page context to give smart recommendations
  const getPageContext = () => {
    const path = location.pathname;
    if (path.includes('schemes')) return { name: 'Welfare Schemes Matching', type: 'schemes' };
    if (path.includes('jobs')) return { name: 'Govt Jobs & Recruitment', type: 'jobs' };
    if (path.includes('documents')) return { name: 'Digital Document Vault', type: 'documents' };
    if (path.includes('grievances')) return { name: 'Grievance Redressal Assistant', type: 'grievances' };
    if (path.includes('profile')) return { name: 'Citizen Profile Management', type: 'profile' };
    return { name: 'GovConnect Portal', type: 'general' };
  };

  const pageContext = getPageContext();

  // Context-specific quick suggestion chips
  const getContextPrompts = () => {
    switch (pageContext.type) {
      case 'schemes':
        return [
          'Am I eligible for PM-MUDRA?',
          'NSP Scholarship criteria',
          'Show Agriculture schemes',
          'How to claim DBT benefits?'
        ];
      case 'jobs':
        return [
          'Show SSC CGL vacancies',
          'Sarkari jobs for MCA graduate',
          'Age relaxations for OBC/SC',
          'Railway RRB exam pattern'
        ];
      case 'documents':
        return [
          'How does DigiLocker sync work?',
          'Which documents needed for caste certificate?',
          'Is my vault SHA-256 secure?'
        ];
      case 'grievances':
        return [
          'Draft complaint for broken street lights',
          'Garbage dump overflow complaint',
          'How to track CPGRAMS token?'
        ];
      default:
        return [
          'Which schemes am I eligible for?',
          'Sarkari jobs matching my profile',
          'Help me draft a civic complaint'
        ];
    }
  };

  const [messages, setMessages] = useState<any[]>([
    {
      id: 'welcome_float_1',
      role: 'assistant',
      content: `Namaste, **${user?.name || 'Citizen'}**! 🙏 

Main hoon **Ask Sarkar AI**. Aap jo screen dekh rahe hain, main uske baare me turant madad kar sakta hoon. 

Sawaal poochein ya neeche diye gaye quick prompts par click karein!`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Meri eligibility check karo',
        'Top 3 schemes for me',
        'Show Govt Jobs for my degree'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const botReply = await sendMessage(text, [...messages, userMsg], {
        page: pageContext.type,
        user: user || undefined
      });
      setMessages(prev => [...prev, botReply]);

      if (!isOpen) {
        setUnreadCount(c => c + 1);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Thoda samay lag raha hai. Kripya apna sawaal dobara poochein.',
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const simulateVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      setInputValue(
        pageContext.type === 'schemes' 
          ? 'Kya main PM Mudra loan ke liye eligible hoon?' 
          : 'Show me government jobs that match my qualifications'
      );
      setIsListening(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: `Chat history refresh ho gayi hai. Ask Sarkar AI aapki seva me hajir hai!`,
        timestamp: new Date().toISOString(),
        suggestions: getContextPrompts()
      }
    ]);
  };

  const handleAction = (actionType?: string, payload?: any) => {
    if (actionType === 'navigate_schemes' || actionType === 'view_scheme') {
      if (payload?.id) navigate(`/schemes/${payload.id}`);
      else navigate(ROUTES.SCHEMES);
    } else if (actionType === 'navigate_jobs' || actionType === 'view_job') {
      if (payload?.id) navigate(`/jobs/${payload.id}`);
      else navigate(ROUTES.JOBS);
    } else if (actionType === 'navigate_vault' || actionType === 'view_vault') {
      navigate(ROUTES.DOCUMENTS);
    } else if (actionType === 'navigate_services') {
      navigate(ROUTES.SERVICES);
    } else if (actionType === 'navigate_grievance' || actionType === 'create_grievance') {
      navigate(ROUTES.GRIEVANCE_NEW, { state: payload });
    } else if (actionType === 'apply_official' && payload?.url) {
      window.open(payload.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(ROUTES.SCHEMES);
    }
  };

  return (
    <div className="font-sans">
      
      {/* ── 1. FLOATING ROUNDED TRIGGER BUTTON (Always visible at bottom-right) ── */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Pulsing Helper Tooltip Pill */}
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white cursor-pointer hover:scale-103 transition-transform group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#0f1740] dark:text-slate-100 group-hover:text-[#1a2f8a] transition-colors">
              Chat with Sarkar AI
            </span>
            <span className="text-[10px] bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full font-extrabold border border-teal-200 dark:border-teal-800">
              Active
            </span>
          </div>

          {/* Glowing Round Floating Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-[#0f1740] via-[#1a2f8a] to-[#0d9488] text-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 group border-2 border-white/40 dark:border-slate-700/60"
            title="Open Ask Sarkar AI Copilot"
          >
            <div className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-md group-hover:opacity-50 transition-opacity" />
            <Bot className="w-7 h-7 text-white relative z-10 group-hover:rotate-12 transition-transform" />
            
            {/* Online Pulse Indicator */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ── 2. FLOATING CHATBOT WINDOW (Non-intrusive, interactive with background screen) ── */}
      {isOpen && (
        <div className={cn(
          "fixed z-50 transition-all duration-300 ease-out flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden",
          isMinimized 
            ? "bottom-5 right-5 sm:bottom-6 sm:right-6 w-72 sm:w-80 h-14 rounded-2xl" 
            : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[410px] md:w-[430px] h-[580px] max-h-[85vh] rounded-3xl"
        )}>
          
          {/* Header */}
          <div className="flex-none px-4 py-3 bg-gradient-to-r from-[#0f1740] via-[#1a2f8a] to-[#1e3a8a] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1a2f8a]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight text-white">Ask Sarkar AI</h3>
                  <span className="text-[9px] bg-teal-400/20 text-teal-200 font-extrabold px-1.5 py-0.2 rounded border border-teal-300/30">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-blue-200 truncate max-w-[170px]">
                  Viewing: {pageContext.name}
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear Chat History"
                className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand Chat" : "Minimize to Strip"}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Chatbot"
                className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* When expanded: Full chat conversation */}
          {!isMinimized && (
            <>
              {/* Context Breadcrumb Notification */}
              <div className="px-3.5 py-1.5 bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-[11px] text-[#1a2f8a] dark:text-blue-300">
                <span className="flex items-center gap-1 truncate">
                  <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
                  <span>Interactive with: <strong>{pageContext.name}</strong></span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">EN / हिन्दी</span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fc] dark:bg-slate-950 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div 
                      key={msg.id} 
                      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
                    >
                      <div className={cn("flex max-w-[86%] gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
                        
                        {/* Avatar */}
                        <div className="shrink-0 mt-0.5">
                          {isUser ? (
                            <div className="w-6 h-6 rounded-full bg-[#1a2f8a] text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                              {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0f1740] to-[#1a2f8a] text-teal-300 flex items-center justify-center shadow-xs">
                              <Bot className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        {/* Text Bubble */}
                        <div className="space-y-1.5">
                          <div className={cn(
                            "p-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-xs",
                            isUser
                              ? "bg-[#1a2f8a] text-white rounded-tr-xs"
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs"
                          )}>
                            {msg.content}

                            {/* Official-Source Recommendation Cards */}
                            {msg.recommendations && msg.recommendations.length > 0 && (
                              <RecommendationCards recommendations={msg.recommendations} onAction={handleAction} compact />
                            )}

                            {/* Source Citations */}
                            {msg.sources && msg.sources.length > 0 && (
                              <SourceCitations sources={msg.sources} />
                            )}
                          </div>

                          {/* Action Button inside reply */}
                          {msg.actionType && (
                            <button
                              onClick={() => handleAction(msg.actionType, msg.actionPayload)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d9488] hover:bg-teal-600 text-white font-extrabold text-[11px] shadow-xs cursor-pointer transition-transform hover:scale-102"
                            >
                              <span>{msg.actionLabel || 'Proceed'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {/* Suggestion Chips */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {msg.suggestions.map((sug: string, i: number) => (
                                <button
                                  key={i}
                                  onClick={() => handleSend(sug)}
                                  className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-[#1a2f8a] dark:text-blue-300 border border-slate-200/80 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer text-left"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          )}

                          <p className={cn("text-[9px] text-slate-400 px-1", isUser ? "text-right" : "text-left")}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing status */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 w-fit">
                    <Bot className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                    <span>Ask Sarkar is typing a response...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Strip */}
              <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  Quick:
                </span>
                {getContextPrompts().map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Footer */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  
                  {/* Voice Simulation Button */}
                  <button
                    type="button"
                    onClick={simulateVoice}
                    className={cn(
                      "p-2 rounded-full transition-colors cursor-pointer shrink-0",
                      isListening 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    )}
                    title={isListening ? "Listening..." : "Simulate voice input"}
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>

                  {/* Input field */}
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isListening ? "Listening..." : "Ask in English / Hindi (e.g. Mudra loan kaise milega?)..."}
                      className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a2f8a] text-slate-800 dark:text-white font-medium"
                      disabled={isTyping}
                    />

                    <button
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim() || isTyping}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#1a2f8a] text-white hover:bg-[#0f1740] disabled:opacity-30 transition-all cursor-pointer"
                      title="Send"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}
