import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, XCircle, Share2, Bookmark, 
  ExternalLink, FileText, Calendar, HelpCircle, Shield, AlertTriangle 
} from 'lucide-react';
import { mockSchemes } from '@/data/mockSchemes';
import { useAuth } from '@/context/AuthContext';
import { useSaved } from '@/context/SavedContext';
import { useToast } from '@/components/ui/Toast';
import { Button, Card, Badge, LoadingSkeleton, MatchBadge, OfficialPortalButton } from '@/components/ui';
import ROUTES from '@/constants/routes';

export default function SchemeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isSchemeSaved, toggleSaveScheme } = useSaved();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [scheme, setScheme] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const found = mockSchemes.find(s => s.id === id) || mockSchemes[0];
      setScheme(found);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return <div className="p-8"><LoadingSkeleton count={1} type="card" className="h-[400px]" /></div>;
  }

  if (!scheme) return <div className="p-8">Scheme not found.</div>;

  const saved = isSchemeSaved(scheme.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        title: 'Link Copied',
        description: 'Scheme URL has been copied to your clipboard.',
        variant: 'info'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      <Link 
        to={ROUTES.SCHEMES} 
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#1a2f8a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Schemes Directory
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Main Scheme Guide */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">{scheme.ministry}</Badge>
              <Badge className="bg-blue-50 text-[#1a2f8a] border-blue-200">{scheme.category || 'Welfare'}</Badge>
              {scheme.state && <Badge variant="outline">{scheme.state}</Badge>}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f1740] dark:text-white mb-3">
              {scheme.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              {scheme.description}
            </p>
            
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button 
                variant="outline" 
                onClick={() => toggleSaveScheme(scheme.id, scheme.title)}
                className={`gap-2 ${saved ? 'text-amber-600 border-amber-300 bg-amber-50' : ''}`}
              >
                <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
                {saved ? 'Saved to Bookmarks' : 'Save Scheme'}
              </Button>
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" /> Share Scheme
              </Button>
            </div>
          </div>

          {/* Key Benefits */}
          <section>
            <h2 className="text-xl font-bold text-[#0f1740] dark:text-white mb-3">
              Benefits Provided
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scheme.benefits?.map((benefit: string, i: number) => (
                <div key={i} className="flex items-center gap-2.5 p-3.5 bg-green-50 dark:bg-green-950/40 rounded-xl text-green-900 dark:text-green-300 text-sm font-medium border border-green-200/50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Eligibility Criteria Evaluated for Profile */}
          <section>
            <h2 className="text-xl font-bold text-[#0f1740] dark:text-white mb-3">
              Who is Eligible?
            </h2>
            <Card className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#0f1740] dark:text-white text-sm">Age Requirement</p>
                  <p className="text-xs text-slate-500">Applicable for Indian citizens aged 18–35 years. (Your age: {user?.age || 23} yrs ✓)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#0f1740] dark:text-white text-sm">Target Groups</p>
                  <p className="text-xs text-slate-500">Students, young entrepreneurs, micro-enterprises, and skill program participants.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#0f1740] dark:text-white text-sm">Geographical Scope</p>
                  <p className="text-xs text-slate-500">All States and Union Territories across India.</p>
                </div>
              </div>
            </Card>
          </section>

          {/* Required Documents Checklist */}
          <section>
            <h2 className="text-xl font-bold text-[#0f1740] dark:text-white mb-3">
              Required Documents
            </h2>
            <Card className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1a2f8a]" /> Aadhaar Card
                  </span>
                  <span className="text-xs text-green-600 font-semibold">Ready in Vault</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1a2f8a]" /> PAN Card
                  </span>
                  <span className="text-xs text-green-600 font-semibold">Ready in Vault</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1a2f8a]" /> Bank Account Passbook
                  </span>
                  <span className="text-xs text-green-600 font-semibold">Ready in Vault</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1a2f8a]" /> Domicile / Residence Proof
                  </span>
                  <span className="text-xs text-slate-500">Optional</span>
                </div>
              </div>
            </Card>
          </section>

          {/* Step-by-Step Application Process */}
          <section>
            <h2 className="text-xl font-bold text-[#0f1740] dark:text-white mb-3">
              Application Steps
            </h2>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Verify Details', desc: 'Ensure your Aadhaar and bank details are linked with your mobile number.' },
                { step: '2', title: 'Visit Official Portal', desc: 'Click the official portal button to reach the designated ministry site.' },
                { step: '3', title: 'Authenticate with OTP', desc: 'Log in using your DigiLocker or Aadhaar OTP authentication.' },
                { step: '4', title: 'Fill & Submit Application', desc: 'Upload documents and submit. Save the reference/acknowledgment number for tracking.' },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3.5 p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-7 h-7 rounded-full bg-[#1a2f8a] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0f1740] dark:text-white">{s.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section>
            <h2 className="text-xl font-bold text-[#0f1740] dark:text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#1a2f8a]" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              <Card className="p-4">
                <h4 className="font-bold text-sm text-[#0f1740] dark:text-white mb-1">
                  Does GovConnect charge any application fee?
                </h4>
                <p className="text-xs text-slate-500">
                  No. GovConnect is an open citizen-assistance service. Any official government application fee is paid directly on the government portal.
                </p>
              </Card>
              <Card className="p-4">
                <h4 className="font-bold text-sm text-[#0f1740] dark:text-white mb-1">
                  Can I track the disbursement through GovConnect?
                </h4>
                <p className="text-xs text-slate-500">
                  You can track public PFMS and DBT status on the official portal using the application reference number generated upon final submission.
                </p>
              </Card>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Action & Eligibility Sidebar */}
        <div className="lg:w-[360px] space-y-6">
          
          {/* AI Eligibility Card */}
          <Card className="p-6 bg-gradient-to-br from-[#0f1740] to-[#1a2f8a] text-white shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                AI Eligibility Match
              </span>
              <span className="text-3xl font-extrabold text-teal-300">
                {scheme.matchPercentage || 92}%
              </span>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed mb-4">
              You meet the primary criteria for this scheme based on your age (<strong>{user?.age || 23}</strong>), qualifications (<strong>{user?.education || 'MCA'}</strong>), and residence in <strong>{user?.state || 'Delhi'}</strong>.
            </p>
            <div className="p-3 bg-white/10 rounded-xl text-xs text-blue-50 border border-white/10">
              ✓ All required basic documents are ready in your Document Vault.
            </div>
          </Card>

          {/* Official Portal CTA Box (Prompt Section 12) */}
          <Card className="p-6 border-2 border-[#0d9488] shadow-md space-y-4">
            <div>
              <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-[10px] mb-2">
                External Official Submission
              </Badge>
              <h3 className="font-bold text-[#0f1740] dark:text-white text-base">
                Apply on Official Portal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                GovConnect assists with discovery and document preparation. Final submission occurs securely on the government portal.
              </p>
            </div>

            <Button
              className="w-full bg-[#0d9488] hover:bg-teal-700 text-white font-bold text-sm py-3 h-auto gap-2"
              onClick={() => window.open(scheme.portalUrl || scheme.officialUrl || 'https://www.myscheme.gov.in', '_blank')}
            >
              Open Official Portal <ExternalLink className="w-4 h-4" />
            </Button>
          </Card>

          {/* Application Deadline */}
          {scheme.deadline && (
            <Card className="p-5 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Application Deadline</p>
                <p className="font-bold text-[#0f1740] dark:text-white text-sm">
                  {new Date(scheme.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </Card>
          )}

          {/* Official Helpline */}
          <Card className="p-5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <h4 className="font-bold text-[#0f1740] dark:text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#1a2f8a]" /> Need Assistance?
            </h4>
            <p>National Citizen Toll-Free Desk: <strong className="font-mono text-slate-800 dark:text-slate-100">1800-11-0001</strong></p>
            <p>Ask Sarkar AI is also available 24x7 to clarify scheme terms.</p>
          </Card>

        </div>
      </div>

      {/* Prominent Footer Disclaimer */}
      <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <p>
          <strong>GovConnect Verification Notice:</strong> GovConnect is a student capstone prototype. Scheme guidelines, eligibility thresholds, and required documentation are indicative and subject to official gazette notifications.
        </p>
      </div>
    </div>
  );
}
