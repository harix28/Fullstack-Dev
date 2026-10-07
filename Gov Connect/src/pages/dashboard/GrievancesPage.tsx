import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, MessageSquare, Clock, AlertTriangle, 
  CheckCircle2, ShieldAlert, Sparkles, Building2, 
  ExternalLink, ChevronRight, FileText, ArrowRight
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Card, Badge, EmptyState } from '@/components/ui';
import { timeAgo, formatDate } from '@/utils/formatDate';
import { mockGrievances } from '@/data/mockGrievances';
import ROUTES from '@/constants/routes';

export default function GrievancesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved' | 'draft'>('all');

  const filteredGrievances = mockGrievances.filter(g => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['submitted', 'under_review'].includes(g.status);
    return g.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> RESOLVED</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1"><Clock className="w-3 h-3" /> IN REVIEW</span>;
      case 'submitted':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center gap-1"><Clock className="w-3 h-3" /> SUBMITTED</span>;
      case 'draft':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700">DRAFT</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 dark:text-red-400 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40';
      case 'medium': return 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40';
      default: return 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40';
    }
  };

  const activeCount = mockGrievances.filter(g => ['submitted', 'under_review'].includes(g.status)).length;
  const resolvedCount = mockGrievances.filter(g => g.status === 'resolved').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      
      {/* ── BEAST MODE: GRIEVANCE REDRESSAL COMMAND BANNER ── */}
      <div className="bg-gradient-to-r from-[#0f1740] via-[#1a2f8a] to-[#2563eb] rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-400/20 text-teal-200 border border-teal-300/30">
                <ShieldAlert className="w-3.5 h-3.5 text-teal-300" />
                CPGRAMS Integrated Redressal
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/90">
                Civic Escalation Track
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Grievance Redressal Assistant
            </h1>

            <p className="text-blue-100 text-sm leading-relaxed">
              File official complaints with municipal corporations, state departments, and central ministries with AI auto-drafting and real-time SLA tracking.
            </p>

            {/* Quick Metrics Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                <span>Active Trackers: <strong className="text-amber-300">{activeCount} Cases</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                <span>Successfully Resolved: <strong className="text-emerald-300">{resolvedCount} Cases</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
                <span>Avg SLA Time: <strong className="text-white">4.2 Days</strong></span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10 shrink-0">
            <Button 
              onClick={() => navigate(ROUTES.GRIEVANCE_NEW)} 
              className="bg-[#0d9488] hover:bg-teal-500 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg gap-2 text-sm cursor-pointer hover:scale-102 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              File Grievance with AI
            </Button>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-20 pointer-events-none" />
      </div>

      {/* ── TABS BAR ── */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'All Complaints', count: mockGrievances.length },
          { id: 'active', label: '⏳ In Progress / Active', count: activeCount },
          { id: 'resolved', label: '✅ Resolved', count: resolvedCount },
          { id: 'draft', label: '📝 Drafts', count: 0 }
        ].map(tab => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                isSelected
                  ? "bg-[#1a2f8a] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn("text-[10px] px-1.5 py-0.2 rounded-full font-bold", isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── GRIEVANCES LIST ── */}
      {filteredGrievances.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-12 h-12 text-slate-300" />}
          title="No grievances in this category"
          description={activeTab === 'all' ? "Need help resolving a public or municipal issue? File a grievance with AI auto-drafting." : `You have no ${activeTab} grievances at this time.`}
          action={
            <Button onClick={() => navigate(ROUTES.GRIEVANCE_NEW)} className="bg-[#1a2f8a] text-white font-bold">
              <PlusCircle className="w-4 h-4 mr-2" />
              File New Grievance
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredGrievances.map(grievance => {
            const isResolved = grievance.status === 'resolved';

            return (
              <Card key={grievance.id} className="p-5 sm:p-6 hover:shadow-lg transition-all duration-200 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
                  
                  <div className="space-y-2 flex-1">
                    {/* Status & Priority Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {getStatusBadge(grievance.status)}
                      
                      {grievance.priority && (
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase", getPriorityColor(grievance.priority))}>
                          {grievance.priority} Priority
                        </span>
                      )}

                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
                        🏛️ {grievance.department}
                      </span>

                      <span className="text-[11px] font-mono text-slate-400">
                        Token: #{grievance.id.toUpperCase()}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-extrabold text-base sm:text-lg text-[#0f1740] dark:text-white group-hover:text-[#1a2f8a] dark:group-hover:text-blue-400 transition-colors">
                      <Link to={`${ROUTES.GRIEVANCES}/${grievance.id}`}>
                        {grievance.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed max-w-3xl">
                      {grievance.description}
                    </p>

                    {/* ── VISUAL PROGRESS STEPPER BAR ── */}
                    <div className="pt-2 pb-1 max-w-xl">
                      <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                        <div className="space-y-1">
                          <div className="h-1.5 bg-emerald-500 rounded-full" />
                          <span className="text-emerald-700 dark:text-emerald-400">Submitted</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 bg-emerald-500 rounded-full" />
                          <span className="text-emerald-700 dark:text-emerald-400">Department Assigned</span>
                        </div>
                        <div className="space-y-1">
                          <div className={cn("h-1.5 rounded-full", isResolved ? "bg-emerald-500" : "bg-amber-400 animate-pulse")} />
                          <span className={cn(isResolved ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400")}>
                            {isResolved ? "Investigated" : "In Action"}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className={cn("h-1.5 rounded-full", isResolved ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700")} />
                          <span className={cn(isResolved ? "text-emerald-700 dark:text-emerald-400" : "text-slate-400")}>
                            Resolved
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Filed {timeAgo(grievance.createdAt)}
                      </span>
                      {grievance.timeline && grievance.timeline.length > 0 && (
                        <span className="flex items-center text-teal-600 dark:text-teal-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Latest status update logged
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                    <Button 
                      asChild 
                      className="bg-[#1a2f8a] hover:bg-[#0f1740] text-white text-xs font-bold rounded-xl h-9 px-4"
                    >
                      <Link to={`${ROUTES.GRIEVANCES}/${grievance.id}`}>
                        Track Progress & SLA →
                      </Link>
                    </Button>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
