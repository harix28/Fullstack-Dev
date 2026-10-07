import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ExternalLink, FileText, Building, Tag, Copy } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { mockGrievances } from '@/data/mockGrievances';
import { mockDocuments } from '@/data/mockDocuments';
import { formatDate } from '@/utils/formatDate';
import ROUTES from '@/constants/routes';
export default function GrievanceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const grievance = mockGrievances.find(g => g.id === id);
    if (!grievance) {
        return (<div className="text-center py-12">
        <h2 className="text-2xl font-bold text-[#43342B]">Grievance not found</h2>
        <Button onClick={() => navigate(ROUTES.GRIEVANCES)} className="mt-4">Back to Grievances</Button>
      </div>);
    }
    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'submitted': return 'bg-[#E3D5CA] text-[#2D231E] border-[#D6CCC2]';
            case 'under_review': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'draft': return 'bg-[#EDEDE9] text-[#2D231E] border-[#D6CCC2]';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-[#EDEDE9] text-[#2D231E] border-[#D6CCC2]';
        }
    };
    return (<div className="space-y-6 max-w-6xl mx-auto">
      <button onClick={() => navigate(ROUTES.GRIEVANCES)} className="flex items-center text-sm text-[#6B5E55] hover:text-[#59463B] transition-colors mb-2">
        <ArrowLeft className="w-4 h-4 mr-1"/> Back to Grievances
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#2D231E]">{grievance.title}</h1>
            <Badge variant="outline" className={getStatusColor(grievance.status)}>
              {grievance.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-[#7D6E63]">Created on {formatDate(grievance.createdAt)}</p>
        </div>
        
        {grievance.status === 'draft' && (<Button onClick={() => { }} className="bg-[#59463B]">
            Continue Editing
          </Button>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[#2D231E] mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-[#7D6E63] mb-1">Department</p>
                <div className="flex items-center font-medium">
                  <Building className="w-4 h-4 mr-2 text-[#8C7D73]"/>
                  {grievance.department}
                </div>
              </div>
              <div>
                <p className="text-sm text-[#7D6E63] mb-1">Category</p>
                <div className="flex items-center font-medium">
                  <Tag className="w-4 h-4 mr-2 text-[#8C7D73]"/>
                  {grievance.category}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-[#7D6E63] mb-1">Location</p>
                <p className="font-medium">{grievance.location}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-[#7D6E63] mb-2">Description</p>
              <p className="text-[#43342B] whitespace-pre-wrap">{grievance.description}</p>
            </div>
          </Card>

          {grievance.aiDraft && (<Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#2D231E] flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#59463B]"/>
                  Formal Draft
                </h2>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(grievance.aiDraft)}>
                  <Copy className="w-4 h-4 mr-2"/> Copy
                </Button>
              </div>
              <div className="bg-[#FAF7F2] p-4 rounded-lg border text-sm text-[#43342B] whitespace-pre-wrap font-mono">
                {grievance.aiDraft}
              </div>
            </Card>)}

          {grievance.timeline && grievance.timeline.length > 0 && (<Card className="p-6">
              <h2 className="text-lg font-semibold text-[#2D231E] mb-6">Timeline</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {grievance.timeline.map((event, index) => (<div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#E3D5CA] text-[#7D6E63] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Clock className="w-4 h-4"/>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-[#2D231E]">{event.status.replace('_', ' ').toUpperCase()}</div>
                        <time className="text-xs font-medium text-amber-500">{formatDate(event.date || event.timestamp)}</time>
                      </div>
                      <div className="text-[#7D6E63] text-sm">{event.comment || event.description}</div>
                    </div>
                  </div>))}
              </div>
            </Card>)}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-[#2D231E] mb-4">Status Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#7D6E63] mb-1">Current Status</p>
                <Badge variant="outline" className={getStatusColor(grievance.status)}>
                  {grievance.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              {grievance.referenceNumber && (<div>
                  <p className="text-xs text-[#7D6E63] mb-1">Reference Number</p>
                  <p className="font-medium text-sm font-mono bg-[#EDEDE9] p-1.5 rounded">{grievance.referenceNumber}</p>
                </div>)}
              {grievance.priority && (<div>
                  <p className="text-xs text-[#7D6E63] mb-1">Priority</p>
                  <p className="font-medium text-sm capitalize">{grievance.priority}</p>
                </div>)}
            </div>
          </Card>

          {grievance.officialPortal && (<Card className="p-6 bg-[#FAF7F2]/50 border-[#E3D5CA]">
              <h3 className="font-semibold text-[#59463B] mb-2">Official Portal</h3>
              <p className="text-sm text-[#6B5E55] mb-4">
                This grievance is managed through the official portal.
              </p>
              <Button variant="outline" className="w-full bg-white text-[#59463B] border-[#59463B] hover:bg-[#FAF7F2]" onClick={() => {
                const url = typeof grievance.officialPortal === 'string' ? grievance.officialPortal : grievance.officialPortal?.url;
                if (url)
                    window.open(url, '_blank');
            }}>
                Visit Portal <ExternalLink className="w-4 h-4 ml-2"/>
              </Button>
            </Card>)}

          {(grievance.documents || grievance.attachments) && (grievance.documents || grievance.attachments).length > 0 && (<Card className="p-6">
              <h3 className="font-semibold text-[#2D231E] mb-4">Attached Documents</h3>
              <ul className="space-y-2">
                {(grievance.documents || grievance.attachments).map((docId) => {
                const doc = mockDocuments.find(d => d.id === docId);
                if (!doc)
                    return null;
                return (<li key={docId} className="flex items-center justify-between text-sm p-2 bg-[#FAF7F2] rounded border">
                      <div className="flex items-center truncate mr-2">
                        <FileText className="w-4 h-4 text-[#8C7D73] mr-2 shrink-0"/>
                        <span className="truncate">{doc.name}</span>
                      </div>
                      <a href="#" className="text-[#59463B] hover:underline text-xs shrink-0">View</a>
                    </li>);
            })}
              </ul>
            </Card>)}
        </div>
      </div>
    </div>);
}
