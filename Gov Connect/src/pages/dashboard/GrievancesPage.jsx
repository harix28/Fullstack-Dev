import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, MessageSquare, Clock, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Card, EmptyState } from '@/components/ui';
import { timeAgo } from '@/utils/formatDate';
import { mockGrievances } from '@/data/mockGrievances';
import ROUTES from '@/constants/routes';
export default function GrievancesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const filteredGrievances = mockGrievances.filter(g => {
        if (activeTab === 'all')
            return true;
        if (activeTab === 'active')
            return ['submitted', 'under_review'].includes(g.status);
        return g.status === activeTab;
    });
    const getStatusBadge = (status) => {
        switch (status) {
            case 'resolved':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> RESOLVED</span>;
            case 'under_review':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"><Clock className="w-3 h-3"/> IN REVIEW</span>;
            case 'submitted':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#E3D5CA] text-[#2D231E] border border-[#D6CCC2] flex items-center gap-1"><Clock className="w-3 h-3"/> SUBMITTED</span>;
            case 'draft':
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EDEDE9] text-[#43342B]">DRAFT</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EDEDE9] text-[#43342B]">{status}</span>;
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-700 border-red-200 bg-red-50';
            case 'medium': return 'text-amber-700 border-amber-200 bg-amber-50';
            default: return 'text-emerald-700 border-emerald-200 bg-emerald-50';
        }
    };
    const activeCount = mockGrievances.filter(g => ['submitted', 'under_review'].includes(g.status)).length;
    const resolvedCount = mockGrievances.filter(g => g.status === 'resolved').length;
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-[#2D231E]">Grievance Portal</h1>
                <p className="text-xl text-[#6B5E55] font-bold">Coming Soon...</p>
            </div>
        </div>
    );
}
