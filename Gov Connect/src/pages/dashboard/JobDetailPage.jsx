import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Bookmark, Share2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { mockJobs } from '@/data/mockJobs';
import { useAuth } from '@/context/AuthContext';
import { useSaved } from '@/context/SavedContext';
import { useToast } from '@/components/ui/Toast';
import { Button, Card, Badge, LoadingSkeleton } from '@/components/ui';
import ROUTES from '@/constants/routes';
export default function JobDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const { isJobSaved, toggleSaveJob } = useSaved();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [job, setJob] = useState(null);
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            const found = mockJobs.find(j => j.id === id) || mockJobs[0];
            setJob(found);
            setIsLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [id]);
    if (isLoading) {
        return <div className="p-8"><LoadingSkeleton count={1} type="card" className="h-[400px]"/></div>;
    }
    if (!job)
        return <div className="p-8">Job not found.</div>;
    const saved = isJobSaved(job.id);
    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            showToast({
                title: 'Job Link Copied',
                description: 'URL copied to clipboard.',
                variant: 'info'
            });
        }
    };
    return (<div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      <Link to={ROUTES.JOBS} className="inline-flex items-center text-sm font-medium text-[#7D6E63] hover:text-[#59463B] transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1"/> Back to Jobs Board
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Job Overview */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{job.organization}</Badge>
              <Badge className="bg-[#FAF7F2] text-[#59463B] border-[#D5BDAF]">{job.category || 'Central Govt'}</Badge>
              <Badge variant="outline">Vacancies: {job.vacancies || 'N/A'}</Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2D231E] mb-2">
              {job.title}
            </h1>
            <p className="text-sm text-[#7D6E63] mb-4">
              {job.department} • Posting: {job.location}
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 bg-[#EDEDE9] rounded-md font-semibold text-[#43342B]">
                Pay Scale: ₹{job.payScale}
              </span>
              <span className="px-3 py-1 bg-[#EDEDE9] rounded-md font-semibold text-[#43342B]">
                Job Type: {job.jobType}
              </span>
              <span className="px-3 py-1 bg-[#EDEDE9] rounded-md font-semibold text-[#43342B]">
                Age: {job.ageLimit ? `${job.ageLimit.min}-${job.ageLimit.max} yrs` : '18-30 yrs'}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#D6CCC2]">
              <Button variant="outline" onClick={() => toggleSaveJob(job.id, job.title)} className={`gap-2 ${saved ? 'text-amber-600 border-amber-300 bg-amber-50' : ''}`}>
                <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"}/>
                {saved ? 'Bookmarked' : 'Bookmark Job'}
              </Button>
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4"/> Share
              </Button>
            </div>
          </div>

          {/* Role Description & Responsibilities */}
          <section>
            <h2 className="text-xl font-bold text-[#2D231E] mb-3">
              Role Overview & Responsibilities
            </h2>
            <p className="text-sm text-[#6B5E55] leading-relaxed mb-4">
              {job.description}
            </p>

            {job.responsibilities && (<Card className="p-5">
                <h4 className="font-bold text-sm text-[#2D231E] mb-3">Key Duties:</h4>
                <ul className="space-y-2 text-xs text-[#6B5E55]">
                  {job.responsibilities.map((r, idx) => (<li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#A67C65] shrink-0 mt-0.5"/>
                      <span>{r}</span>
                    </li>))}
                </ul>
              </Card>)}
          </section>

          {/* Educational Criteria & Skills */}
          <section>
            <h2 className="text-xl font-bold text-[#2D231E] mb-3">
              Eligibility & Skill Requirements
            </h2>
            <Card className="p-5 space-y-4">
              <div>
                <h4 className="font-semibold text-xs text-[#8C7D73] uppercase tracking-wider mb-2">Qualifications:</h4>
                <div className="space-y-2 text-xs text-[#43342B]">
                  {job.qualification?.map((q, i) => (<p key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600"/>
                      <span>{q}</span>
                    </p>))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3D5CA]/50">
                <h4 className="font-semibold text-xs text-[#8C7D73] uppercase tracking-wider mb-2">Matched Profile Skills:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.skills || ['Python', 'SQL', 'React', 'Data Analysis']).map(sk => (<span key={sk} className="px-2.5 py-1 bg-[#FAF7F2] text-[#59463B] text-xs rounded-lg font-medium border border-[#D5BDAF]">
                      {sk} ✓
                    </span>))}
                </div>
              </div>
            </Card>
          </section>

          {/* Selection Process Stages */}
          {job.selectionProcess && (<section>
              <h2 className="text-xl font-bold text-[#2D231E] mb-3">
                Selection Process Stages
              </h2>
              <div className="space-y-3">
                {job.selectionProcess.map((step, idx) => (<div key={idx} className="flex items-start gap-3 p-3 bg-white border rounded-xl text-xs">
                    <div className="w-6 h-6 rounded-full bg-[#59463B] text-white flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="pt-0.5 font-medium text-[#2D231E]">
                      {step}
                    </div>
                  </div>))}
              </div>
            </section>)}
        </div>

        {/* Right Action Sidebar */}
        <div className="lg:w-[360px] space-y-6">
          
          {/* Match Score Card */}
          <Card className="p-6 bg-[#59463B] text-white shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D5BDAF]">
                Profile Match Rate
              </span>
              <span className="text-3xl font-extrabold text-[#D5BDAF]">
                {job.matchPercentage || 90}%
              </span>
            </div>
            <p className="text-xs text-[#E3D5CA] leading-relaxed mb-4">
              Your degree in <strong>{user?.education || 'MCA'}</strong> and technical skills match the requirements for this recruitment notification.
            </p>
            <div className="p-3 bg-white/10 rounded-xl text-xs text-[#FAF7F2] border border-white/10">
              ✓ Age requirement ({user?.age || 23} yrs) is within the eligible threshold.
            </div>
          </Card>

          {/* Apply on Official Portal (Prompt Section 15) */}
          <Card className="p-6 border-2 border-[#59463B] shadow-md space-y-4">
            <div>
              <Badge className="bg-[#FAF7F2] text-[#59463B] border-[#D6CCC2] text-[10px] mb-2">
                Official Commission Portal
              </Badge>
              <h3 className="font-bold text-[#2D231E] text-base">
                Apply on Official Website
              </h3>
              <p className="text-xs text-[#7D6E63] mt-1">
                You will be redirected to the recruitment board portal ({job.organization}) to complete your OTR registration and payment.
              </p>
            </div>

            <Button className="w-full bg-[#59463B] hover:bg-[#2D231E] text-white font-bold text-sm py-3 h-auto gap-2 shadow" onClick={() => window.open(job.applyUrl || 'https://ssc.gov.in', '_blank')}>
              Apply on Official Website <ExternalLink className="w-4 h-4"/>
            </Button>
          </Card>

          {/* Important Dates */}
          <Card className="p-5 space-y-3">
            <h4 className="font-bold text-sm text-[#2D231E] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500"/> Important Dates
            </h4>
            
            <div className="space-y-2 text-xs">
              {job.applicationStart && (<div className="flex justify-between border-b pb-1.5">
                  <span className="text-[#7D6E63]">Application Start:</span>
                  <span className="font-semibold text-[#2D231E]">{job.applicationStart}</span>
                </div>)}
              {job.applicationDeadline && (<div className="flex justify-between border-b pb-1.5">
                  <span className="text-[#7D6E63]">Last Date to Apply:</span>
                  <span className="font-bold text-red-600">{job.applicationDeadline}</span>
                </div>)}
              {job.examDate && (<div className="flex justify-between">
                  <span className="text-[#7D6E63]">Exam Date (Tentative):</span>
                  <span className="font-semibold text-[#2D231E]">{job.examDate}</span>
                </div>)}
            </div>
          </Card>

        </div>
      </div>
    </div>);
}
