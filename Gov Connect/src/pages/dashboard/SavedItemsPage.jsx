import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, FileText, Briefcase, MapPin, Trash2, ExternalLink } from 'lucide-react';
import { useSaved } from '@/context/SavedContext';
import { mockSchemes } from '@/data/mockSchemes';
import { mockJobs } from '@/data/mockJobs';
import { mockServices } from '@/data/mockServices';
import { Button, Card, Badge, MatchBadge, DeadlineBadge, EmptyState } from '@/components/ui';
import ROUTES from '@/constants/routes';
export default function SavedItemsPage() {
    const [activeTab, setActiveTab] = useState('schemes');
    const { savedSchemeIds, savedJobIds, savedServiceIds, toggleSaveScheme, toggleSaveJob, toggleSaveService } = useSaved();
    const savedSchemes = mockSchemes.filter(s => savedSchemeIds.includes(s.id));
    const savedJobs = mockJobs.filter(j => savedJobIds.includes(j.id));
    const savedServices = mockServices.filter(s => savedServiceIds.includes(s.id));
    return (<div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2D231E]">
            Saved & Bookmarked Items
          </h1>
          <p className="text-[#6B5E55] text-sm">
            Quickly access schemes, job openings, and civic services you have bookmarked for later.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D6CCC2] gap-2 sm:gap-6 overflow-x-auto">
        <button onClick={() => setActiveTab('schemes')} className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'schemes'
            ? 'border-[#59463B] text-[#59463B]'
            : 'border-transparent text-[#7D6E63] hover:text-[#2D231E]'}`}>
          <FileText className="w-4 h-4"/>
          Saved Schemes
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-[#EDEDE9] text-[#43342B]">
            {savedSchemes.length}
          </span>
        </button>

        <button onClick={() => setActiveTab('jobs')} className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'jobs'
            ? 'border-[#59463B] text-[#59463B]'
            : 'border-transparent text-[#7D6E63] hover:text-[#2D231E]'}`}>
          <Briefcase className="w-4 h-4"/>
          Bookmarked Jobs
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-[#EDEDE9] text-[#43342B]">
            {savedJobs.length}
          </span>
        </button>

        <button onClick={() => setActiveTab('services')} className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'services'
            ? 'border-[#59463B] text-[#59463B]'
            : 'border-transparent text-[#7D6E63] hover:text-[#2D231E]'}`}>
          <MapPin className="w-4 h-4"/>
          Saved Services
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-[#EDEDE9] text-[#43342B]">
            {savedServices.length}
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'schemes' && (<div>
          {savedSchemes.length === 0 ? (<EmptyState icon={<Bookmark className="w-12 h-12 text-[#D6CCC2]"/>} title="No saved schemes yet" description="Browse government schemes matching your profile and bookmark the ones you wish to apply for." action={<Button asChild className="bg-[#59463B] hover:bg-[#2D231E]">
                  <Link to={ROUTES.SCHEMES}>Explore Schemes</Link>
                </Button>}/>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedSchemes.map((scheme) => (<Card key={scheme.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <Badge variant="outline" className="text-[11px] truncate max-w-[180px]">
                        {scheme.ministry}
                      </Badge>
                      <MatchBadge matchPercentage={scheme.matchPercentage || 85}/>
                    </div>

                    <h3 className="font-bold text-[#2D231E] text-base mb-2 line-clamp-2">
                      {scheme.title}
                    </h3>
                    <p className="text-[#6B5E55] text-xs mb-4 line-clamp-2">
                      {scheme.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {scheme.benefits?.slice(0, 2).map((b, i) => (<span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-[11px] rounded-full">
                          {b}
                        </span>))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E3D5CA]/50 flex items-center justify-between">
                    {scheme.deadline ? (<DeadlineBadge date={scheme.deadline}/>) : (<span className="text-[11px] text-[#7D6E63]">Open ongoing</span>)}

                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleSaveScheme(scheme.id, scheme.title)} className="p-1.5 text-[#8C7D73] hover:text-red-600 transition-colors" title="Remove from saved">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/dashboard/schemes/${scheme.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </Card>))}
            </div>)}
        </div>)}

      {activeTab === 'jobs' && (<div>
          {savedJobs.length === 0 ? (<EmptyState icon={<Briefcase className="w-12 h-12 text-[#D6CCC2]"/>} title="No bookmarked jobs" description="Discover SSC, Banking, Railways, and state government jobs matching your qualification." action={<Button asChild className="bg-[#59463B] hover:bg-[#2D231E]">
                  <Link to={ROUTES.JOBS}>Find Govt Jobs</Link>
                </Button>}/>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs.map((job) => (<Card key={job.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#59463B]/10 text-[#59463B] flex items-center justify-center font-bold text-xs">
                          {job.organization.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#2D231E] text-base">{job.title}</h3>
                          <p className="text-xs text-[#7D6E63]">{job.organization} • {job.location}</p>
                        </div>
                      </div>
                      <MatchBadge matchPercentage={job.matchPercentage || 80}/>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-[#6B5E55] my-3">
                      <Badge variant="outline">{job.jobType}</Badge>
                      <Badge variant="outline">Pay: ₹{job.payScale}</Badge>
                      <Badge variant="outline">Vacancies: {job.vacancies || 'N/A'}</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E3D5CA]/50 flex items-center justify-between">
                    {job.applicationDeadline && (<DeadlineBadge date={job.applicationDeadline}/>)}

                    <div className="flex items-center gap-2 ml-auto">
                      <button onClick={() => toggleSaveJob(job.id, job.title)} className="p-1.5 text-[#8C7D73] hover:text-red-600 transition-colors" title="Remove bookmark">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                      <Button size="sm" asChild className="bg-[#59463B] hover:bg-[#2D231E]">
                        <Link to={`/dashboard/jobs/${job.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </Card>))}
            </div>)}
        </div>)}

      {activeTab === 'services' && (<div>
          {savedServices.length === 0 ? (<EmptyState icon={<MapPin className="w-12 h-12 text-[#D6CCC2]"/>} title="No saved civic services" description="Bookmark nearby hospitals, police stations, CSC centres, and municipal offices for one-click access." action={<Button asChild className="bg-[#59463B] hover:bg-[#2D231E]">
                  <Link to={ROUTES.SERVICES}>Locate Services</Link>
                </Button>}/>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedServices.map((service) => (<Card key={service.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <Badge className="bg-[#FAF7F2] text-[#8C644F] border-[#D5BDAF] text-xs">
                        {service.category.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-xs font-semibold text-[#7D6E63] bg-[#EDEDE9] px-2 py-0.5 rounded">
                        {service.distance} away
                      </span>
                    </div>

                    <h3 className="font-bold text-[#2D231E] text-base mb-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#7D6E63] mb-3 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#8C7D73]"/>
                      {service.address}
                    </p>

                    <div className="text-xs text-[#6B5E55] space-y-1 bg-[#FAF7F2] p-2.5 rounded-lg mb-4">
                      <p><span className="font-semibold">Hours:</span> {service.openingHours}</p>
                      <p><span className="font-semibold">Helpline:</span> {service.phone}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E3D5CA]/50 flex items-center justify-between">
                    <button onClick={() => toggleSaveService(service.id, service.name)} className="p-1.5 text-[#8C7D73] hover:text-red-600 transition-colors" title="Remove saved service">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                    <Button size="sm" variant="outline" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(service.name + ' ' + service.address)}`, '_blank')} className="gap-1 text-xs">
                      Get Directions <ExternalLink className="w-3.5 h-3.5"/>
                    </Button>
                  </div>
                </Card>))}
            </div>)}
        </div>)}
    </div>);
}
