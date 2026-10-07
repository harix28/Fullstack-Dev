import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Bot, Building, Tag, AlertTriangle, Copy, RefreshCw, Save, ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Card, Badge } from '@/components/ui';
import { GRIEVANCE_CATEGORIES } from '@/constants/categories';
import { mockDocuments } from '@/data/mockDocuments';
import ROUTES from '@/constants/routes';
const STEPS = ['Describe Issue', 'AI Classification', 'Draft Complaint', 'Review', 'Official Portal'];
export default function NewGrievancePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        district: '',
        state: '',
        referenceNumber: '',
        attachedDocs: []
    });
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [draftText, setDraftText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDrafting, setIsDrafting] = useState(false);
    const [reviewChecked, setReviewChecked] = useState(false);
    const [isEditingDraft, setIsEditingDraft] = useState(false);
    const [copied, setCopied] = useState(false);
    // Pre-fill if routed from Ask Sarkar AI with draft payload
    useEffect(() => {
        if (location.state) {
            const s = location.state;
            if (s.draft || s.title) {
                setFormData(prev => ({
                    ...prev,
                    title: s.title || prev.title,
                    category: s.category || prev.category,
                }));
                setAiAnalysis({
                    department: s.department || 'Competent Authority',
                    category: s.category || 'Infrastructure / Public Services',
                    priority: s.priority || 'high',
                    portal: {
                        name: s.portalUrl?.includes('morth') ? 'MoRTH Portal' : (s.portalUrl?.includes('consumer') ? 'INGRAM' : 'CPGRAMS'),
                        url: s.portalUrl || 'https://pgportal.gov.in',
                        description: 'Official Government Redressal Portal'
                    },
                    confidence: 94,
                    reasoning: 'Classified by Ask Sarkar AI using official department mapping based on citizen issue.'
                });
                if (s.draft) {
                    setDraftText(s.draft);
                    setCurrentStep(2); // Advance directly to Draft review step
                }
            }
        }
    }, [location.state]);
    const simulateAnalysis = () => {
        setIsAnalyzing(true);
        setCurrentStep(1);
        setTimeout(() => {
            setAiAnalysis({
                department: 'Municipal Corporation',
                category: formData.category || 'General',
                priority: 'high',
                portal: {
                    name: 'CPGRAMS',
                    url: 'https://pgportal.gov.in',
                    description: 'Centralized Public Grievance Redress and Monitoring System'
                },
                confidence: 87,
                reasoning: 'Based on your description mentioning local infrastructure and location, this falls under municipal jurisdiction. High priority assigned due to public safety concern.'
            });
            setIsAnalyzing(false);
        }, 2000);
    };
    const simulateDrafting = () => {
        setIsDrafting(true);
        setCurrentStep(2);
        setTimeout(() => {
            setDraftText(`To,\nThe Authorized Officer,\n${aiAnalysis?.department || 'Concerned Department'}\n\nSubject: Formal Complaint regarding ${formData.title || 'the issue'}\n\nRespected Sir/Madam,\n\nI am writing to formally register a grievance regarding ${formData.description.substring(0, 100)}... [AI Generated Formal Text].\n\nLocation Details: ${formData.location}, ${formData.district}, ${formData.state}\n\nI request you to kindly look into this matter urgently and take appropriate action.\n\nThank you.\n\nSincerely,\n[Your Name]`);
            setIsDrafting(false);
        }, 1500);
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(draftText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-[#6B5E55] bg-[#FAF7F2] border-[#D6CCC2]';
        }
    };
    return (<div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2D231E]">File a Grievance</h1>
        <p className="text-[#7D6E63]">Follow the steps to draft and submit your official complaint.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E3D5CA] -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#59463B] -z-10 rounded-full transition-all duration-300" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
        
        {STEPS.map((step, index) => (<div key={index} className="flex flex-col items-center">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors border-2", currentStep > index ? "bg-[#59463B] border-[#59463B] text-white" :
                currentStep === index ? "bg-white border-[#59463B] text-[#59463B]" :
                    "bg-white border-[#D6CCC2] text-[#8C7D73]")}>
              {currentStep > index ? <CheckCircle2 className="w-5 h-5"/> : index + 1}
            </div>
            <span className={cn("absolute mt-10 text-xs font-medium whitespace-nowrap", currentStep >= index ? "text-[#2D231E]" : "text-[#8C7D73]")}>{step}</span>
          </div>))}
      </div>

      <Card className="p-6">
        {currentStep === 0 && (<div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2D231E]">Describe Your Issue</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#43342B] mb-1">Issue Title <span className="text-red-500">*</span></label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} maxLength={100} className="w-full px-3 py-2 border border-[#D6CCC2] rounded-md focus:ring-2 focus:ring-[#59463B]" placeholder="e.g. Broken street lights on Main Road"/>
                <div className="text-right text-xs text-[#7D6E63] mt-1">{formData.title.length}/100</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#43342B] mb-1">Describe Your Problem <span className="text-red-500">*</span></label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={6} className="w-full px-3 py-2 border border-[#D6CCC2] rounded-md focus:ring-2 focus:ring-[#59463B]" placeholder="Provide detailed information about your issue..."/>
                <div className="text-right text-xs text-[#7D6E63] mt-1">{formData.description.length}/1000</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#43342B] mb-1">Category <span className="text-red-500">*</span></label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-[#D6CCC2] rounded-md focus:ring-2 focus:ring-[#59463B]">
                    <option value="">Select a category</option>
                    {GRIEVANCE_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#43342B] mb-1">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border border-[#D6CCC2] rounded-md focus:ring-2 focus:ring-[#59463B]" placeholder="Specific area or landmark"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#43342B] mb-1">District</label>
                  <input type="text" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="w-full px-3 py-2 border border-[#D6CCC2] rounded-md focus:ring-2 focus:ring-[#59463B]"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#43342B] mb-1">State</label>
                  <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-3 py-2 border border-[#D6CCC2] rounded-md focus:ring-2 focus:ring-[#59463B]">
                    <option value="">Select state</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="delhi">Delhi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#43342B] mb-1">Reference Number (Optional)</label>
                <input type="text" value={formData.referenceNumber} onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })} className="w-full px-3 py-2 border border-[#D6CCC2] rounded-md focus:ring-2 focus:ring-[#59463B]" placeholder="If you have an existing case number"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#43342B] mb-2">Attach Documents (Optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-[#D6CCC2] rounded-md p-3 max-h-48 overflow-y-auto">
                  {mockDocuments.map(doc => (<label key={doc.id} className="flex items-center space-x-2 text-sm p-2 hover:bg-[#FAF7F2] rounded cursor-pointer">
                      <input type="checkbox" checked={formData.attachedDocs.includes(doc.id)} onChange={(e) => {
                    if (e.target.checked)
                        setFormData({ ...formData, attachedDocs: [...formData.attachedDocs, doc.id] });
                    else
                        setFormData({ ...formData, attachedDocs: formData.attachedDocs.filter(id => id !== doc.id) });
                }} className="rounded text-[#59463B] focus:ring-[#59463B]"/>
                      <span className="truncate">{doc.name}</span>
                    </label>))}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={simulateAnalysis} className="bg-[#59463B]" disabled={!formData.title || !formData.description || !formData.category}>
                Analyse Grievance <ArrowRight className="w-4 h-4 ml-2"/>
              </Button>
            </div>
          </div>)}

        {currentStep === 1 && (<div className="space-y-6">
            {isAnalyzing ? (<div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E3D5CA] flex items-center justify-center animate-pulse">
                  <Bot className="w-8 h-8 text-[#59463B]"/>
                </div>
                <h3 className="text-lg font-medium text-[#2D231E]">Analysing your complaint...</h3>
                <p className="text-[#7D6E63] text-sm">Identifying appropriate department and category</p>
              </div>) : (<div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                  <Bot className="w-8 h-8 text-[#59463B]"/>
                  <div>
                    <h2 className="text-xl font-semibold text-[#2D231E]">AI Analysis Complete</h2>
                    <p className="text-sm text-[#7D6E63]">Confidence Score: <span className="text-green-600 font-semibold">{aiAnalysis?.confidence}%</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-[#FAF7F2] border-transparent">
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-[#7D6E63] mt-0.5 shrink-0"/>
                      <div>
                        <p className="text-xs text-[#7D6E63] font-medium uppercase tracking-wider mb-1">Detected Department</p>
                        <p className="font-semibold text-[#2D231E]">{aiAnalysis?.department}</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 bg-[#FAF7F2] border-transparent">
                    <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 text-[#7D6E63] mt-0.5 shrink-0"/>
                      <div>
                        <p className="text-xs text-[#7D6E63] font-medium uppercase tracking-wider mb-1">Category</p>
                        <p className="font-semibold text-[#2D231E]">{GRIEVANCE_CATEGORIES.find(c => c.id === aiAnalysis?.category)?.label || aiAnalysis?.category}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[#43342B] mb-2">Priority Suggestion</p>
                    <Badge variant="outline" className={getPriorityColor(aiAnalysis?.priority || 'medium')}>
                      {(aiAnalysis?.priority || 'medium').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-[#43342B] mb-2">Suggested Official Portal</p>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-[#FAF7F2]/50">
                      <div>
                        <p className="font-semibold text-[#59463B]">{aiAnalysis?.portal.name}</p>
                        <p className="text-xs text-[#6B5E55]">{aiAnalysis?.portal.description}</p>
                      </div>
                      <a href={aiAnalysis?.portal.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#59463B] hover:underline flex items-center">
                        Visit <ExternalLink className="w-3 h-3 ml-1"/>
                      </a>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3 rounded-lg text-sm border">
                    <p className="font-medium text-[#43342B] mb-1">AI Reasoning:</p>
                    <p className="text-[#6B5E55]">{aiAnalysis?.reasoning}</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setCurrentStep(0)}>
                    <ArrowLeft className="w-4 h-4 mr-2"/> Back
                  </Button>
                  <Button onClick={simulateDrafting} className="bg-[#59463B]">
                    Generate Draft Complaint <ArrowRight className="w-4 h-4 ml-2"/>
                  </Button>
                </div>
              </div>)}
          </div>)}

        {currentStep === 2 && (<div className="space-y-6">
            {isDrafting ? (<div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E3D5CA] flex items-center justify-center animate-pulse">
                  <Bot className="w-8 h-8 text-[#59463B]"/>
                </div>
                <h3 className="text-lg font-medium text-[#2D231E]">Generating formal complaint draft...</h3>
              </div>) : (<div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#2D231E] mb-2">AI-Generated Formal Complaint</h2>
                  <p className="text-sm text-[#6B5E55]">Review and edit the drafted text before submission.</p>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-[#EDEDE9] p-3 border-b flex justify-between items-center">
                    <span className="text-sm font-medium text-[#43342B]">Original Description</span>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] text-sm text-[#6B5E55] italic">
                    "{formData.description}"
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#43342B]">Formal Draft</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditingDraft(!isEditingDraft)}>
                        {isEditingDraft ? 'Done Editing' : 'Edit'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setIsDrafting(true); setTimeout(() => setIsDrafting(false), 1000); }}>
                        <RefreshCw className="w-4 h-4 mr-1"/> Regenerate
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-1"/> {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  
                  {isEditingDraft ? (<textarea value={draftText} onChange={(e) => setDraftText(e.target.value)} rows={12} className="w-full p-4 border border-[#59463B] rounded-lg focus:ring-2 focus:ring-[#59463B] text-sm"/>) : (<div className="w-full p-4 border border-[#D6CCC2] rounded-lg bg-white text-sm whitespace-pre-wrap">
                      {draftText}
                    </div>)}
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2"/> Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} className="bg-[#59463B]">
                    Continue to Review <ArrowRight className="w-4 h-4 ml-2"/>
                  </Button>
                </div>
              </div>)}
          </div>)}

        {currentStep === 3 && (<div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#2D231E]">Review Application</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Card className="p-4 bg-[#FAF7F2] shadow-sm border-transparent">
                  <h3 className="text-sm font-semibold text-[#2D231E] mb-3 border-b pb-2">Complaint Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-[#7D6E63] w-24 inline-block">Title:</span> <span className="font-medium">{formData.title}</span></p>
                    <p><span className="text-[#7D6E63] w-24 inline-block">Category:</span> <span>{GRIEVANCE_CATEGORIES.find(c => c.id === formData.category)?.label}</span></p>
                    <p><span className="text-[#7D6E63] w-24 inline-block">Department:</span> <span>{aiAnalysis?.department}</span></p>
                    <p><span className="text-[#7D6E63] w-24 inline-block">Location:</span> <span>{formData.location}, {formData.district}, {formData.state}</span></p>
                  </div>
                </Card>

                {formData.attachedDocs.length > 0 && (<Card className="p-4 bg-[#FAF7F2] shadow-sm border-transparent">
                    <h3 className="text-sm font-semibold text-[#2D231E] mb-2 border-b pb-2">Attached Documents ({formData.attachedDocs.length})</h3>
                    <ul className="text-sm space-y-1">
                      {formData.attachedDocs.map(docId => (<li key={docId} className="flex items-center text-[#43342B]">
                           <CheckCircle2 className="w-3 h-3 text-green-500 mr-2"/>
                           {mockDocuments.find(d => d.id === docId)?.name}
                        </li>))}
                    </ul>
                  </Card>)}
              </div>

              <div className="space-y-4">
                <Card className="p-4 bg-[#FAF7F2] shadow-sm border-transparent h-full flex flex-col">
                  <h3 className="text-sm font-semibold text-[#2D231E] mb-2 border-b pb-2">Draft Preview</h3>
                  <div className="text-sm text-[#6B5E55] whitespace-pre-wrap flex-1 overflow-hidden relative">
                    {draftText.substring(0, 300)}...
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#59463B]"></div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => setCurrentStep(2)}>Edit Draft</Button>
                </Card>
              </div>
            </div>

            <div className="border-2 border-red-500 bg-red-50 rounded-lg p-5 mt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5"/>
                <div>
                  <h3 className="text-lg font-bold text-red-800 mb-2">⚠️ Important: You Must Complete Submission Yourself</h3>
                  <p className="text-sm text-red-800 mb-3">GovConnect does NOT submit grievances on your behalf. When you click Continue to Official Portal, you will be taken to the official government portal where you must:</p>
                  <ul className="list-disc pl-5 text-sm text-red-800 space-y-1 mb-3">
                    <li>Complete any CAPTCHA verification</li>
                    <li>Verify your identity via OTP</li>
                    <li>Review and submit the complaint yourself</li>
                    <li>Note the reference/acknowledgment number</li>
                  </ul>
                  <p className="text-sm font-medium text-red-800">This is required to protect the integrity of the grievance process.</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-red-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={reviewChecked} onChange={(e) => setReviewChecked(e.target.checked)} className="mt-1 w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500"/>
                  <span className="text-sm font-medium text-red-900">I understand that I must complete the submission process on the official portal myself.</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2"/> Back
              </Button>
              <Button onClick={() => setCurrentStep(4)} className={cn("bg-[#59463B]", !reviewChecked && "opacity-50 cursor-not-allowed")} disabled={!reviewChecked}>
                Continue to Official Portal <ArrowRight className="w-4 h-4 ml-2"/>
              </Button>
            </div>
          </div>)}

        {currentStep === 4 && (<div className="text-center space-y-8 py-8">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-16 h-16 text-[#A67C65] mb-4"/>
              <h2 className="text-2xl font-bold text-[#2D231E] mb-2">Your Complaint is Ready to Submit</h2>
              <p className="text-[#6B5E55] max-w-lg mx-auto">
                Your formal complaint has been prepared. Visit the official portal below to submit your grievance.
              </p>
            </div>

            <Card className="max-w-md mx-auto p-6 bg-[#FAF7F2]/50 border-[#E3D5CA]">
              <h3 className="font-semibold text-lg text-[#59463B] mb-1">{aiAnalysis?.portal.name || 'CPGRAMS'}</h3>
              <p className="text-sm text-[#6B5E55] mb-6">{aiAnalysis?.portal.description}</p>
              
              <div className="text-left bg-white p-4 rounded-lg border text-sm mb-6">
                <p className="font-semibold mb-2">Instructions:</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-[#43342B]">
                  <li>The official portal will open in a new tab</li>
                  <li>Log in or register on the official portal</li>
                  <li>Complete CAPTCHA and OTP verification</li>
                  <li>Submit your complaint and note the acknowledgment number</li>
                  <li>Return to GovConnect to track your grievance status</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-[#A67C65] hover:bg-[#8C644F] h-12 text-lg" onClick={() => window.open(aiAnalysis?.portal.url || 'https://pgportal.gov.in', '_blank')}>
                  Open Official Portal <ExternalLink className="w-5 h-5 ml-2"/>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate(ROUTES.GRIEVANCES)}>
                  <Save className="w-4 h-4 mr-2"/> Save Draft to Grievances
                </Button>
              </div>
            </Card>

            <div className="pt-4">
              <button onClick={() => navigate(ROUTES.GRIEVANCES)} className="text-sm text-[#59463B] hover:underline">
                Back to Grievances
              </button>
            </div>

            <div className="max-w-2xl mx-auto bg-[#FAF7F2] p-4 rounded-lg text-xs text-[#7D6E63] text-left border">
              <p>Disclaimer: GovConnect is an assistance platform and is not affiliated with the government. We help you draft and organize your complaints, but the actual submission must be done by you on the official government portals. We do not guarantee any resolution timeline as that is solely at the discretion of the concerned department.</p>
            </div>
          </div>)}
      </Card>
    </div>);
}
