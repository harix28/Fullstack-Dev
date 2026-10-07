import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ExternalLink, FileText, CheckCircle2, AlertTriangle, Building, Tag, Copy } from 'lucide-react';
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
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Grievance not found</h2>
        <Button onClick={() => navigate(ROUTES.GRIEVANCES)} className="mt-4">Back to Grievances</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(ROUTES.GRIEVANCES)}
        className="flex items-center text-sm text-gray-600 hover:text-[#1a2f8a] transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Grievances
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#0f1740]">{grievance.title}</h1>
            <Badge variant="outline" className={getStatusColor(grievance.status)}>
              {grievance.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">Created on {formatDate(grievance.createdAt)}</p>
        </div>
        
        {grievance.status === 'draft' && (
          <Button onClick={() => {}} className="bg-[#1a2f8a]">
            Continue Editing
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[#0f1740] mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Department</p>
                <div className="flex items-center font-medium">
                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                  {grievance.department}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <div className="flex items-center font-medium">
                  <Tag className="w-4 h-4 mr-2 text-gray-400" />
                  {grievance.category}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-medium">{grievance.location}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-700 whitespace-pre-wrap">{grievance.description}</p>
            </div>
          </Card>

          {grievance.aiDraft && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#0f1740] flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#1a2f8a]" />
                  Formal Draft
                </h2>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(grievance.aiDraft!)}>
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {grievance.aiDraft}
              </div>
            </Card>
          )}

          {grievance.timeline && grievance.timeline.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[#0f1740] mb-6">Timeline</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {grievance.timeline.map((event, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-slate-900">{event.status.replace('_', ' ').toUpperCase()}</div>
                        <time className="text-xs font-medium text-amber-500">{formatDate(event.date || event.timestamp)}</time>
                      </div>
                      <div className="text-slate-500 text-sm">{event.comment || event.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-[#0f1740] mb-4">Status Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Status</p>
                <Badge variant="outline" className={getStatusColor(grievance.status)}>
                  {grievance.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              {grievance.referenceNumber && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reference Number</p>
                  <p className="font-medium text-sm font-mono bg-gray-100 p-1.5 rounded">{grievance.referenceNumber}</p>
                </div>
              )}
              {grievance.priority && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Priority</p>
                  <p className="font-medium text-sm capitalize">{grievance.priority}</p>
                </div>
              )}
            </div>
          </Card>

          {grievance.officialPortal && (
            <Card className="p-6 bg-blue-50/50 border-blue-100">
              <h3 className="font-semibold text-[#1a2f8a] mb-2">Official Portal</h3>
              <p className="text-sm text-gray-600 mb-4">
                This grievance is managed through the official portal.
              </p>
              <Button 
                variant="outline" 
                className="w-full bg-white text-[#1a2f8a] border-[#1a2f8a] hover:bg-blue-50"
                onClick={() => {
                  const url = typeof grievance.officialPortal === 'string' ? grievance.officialPortal : grievance.officialPortal?.url;
                  if (url) window.open(url, '_blank');
                }}
              >
                Visit Portal <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          )}

          {(grievance.documents || grievance.attachments) && (grievance.documents || grievance.attachments).length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-[#0f1740] mb-4">Attached Documents</h3>
              <ul className="space-y-2">
                {(grievance.documents || grievance.attachments).map((docId: string) => {
                  const doc = mockDocuments.find(d => d.id === docId);
                  if (!doc) return null;
                  return (
                    <li key={docId} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded border">
                      <div className="flex items-center truncate mr-2">
                        <FileText className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                        <span className="truncate">{doc.name}</span>
                      </div>
                      <a href="#" className="text-[#1a2f8a] hover:underline text-xs shrink-0">View</a>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
