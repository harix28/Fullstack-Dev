import React, { useState, useMemo } from 'react';
import { 
  MapPin, Search, Phone, Clock, ExternalLink, Bookmark, 
  Hospital, Shield, Building2, Landmark, GraduationCap, 
  Briefcase, CheckCircle2, Navigation, Layers
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button, Card, Badge, EmptyState } from '@/components/ui';
import { mockServices } from '@/data/mockServices';
import { useSaved } from '@/context/SavedContext';
import type { ServiceCategory } from '@/types';

const CATEGORIES: { id: ServiceCategory | 'all'; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'all', label: 'All Services', icon: Layers },
  { id: 'hospital', label: 'Hospitals', icon: Hospital },
  { id: 'police', label: 'Police Stations', icon: Shield },
  { id: 'csc_centre', label: 'CSC Centres', icon: Building2 },
  { id: 'govt_office', label: 'Government Offices', icon: Landmark },
  { id: 'municipal_office', label: 'Municipal Offices', icon: Building2 },
  { id: 'bank', label: 'Banks / MSME', icon: Landmark },
  { id: 'employment_office', label: 'Employment Offices', icon: Briefcase },
  { id: 'college', label: 'Colleges & Universities', icon: GraduationCap },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>('srv_csc_01');
  const { isServiceSaved, toggleSaveService } = useSaved();

  const filteredServices = useMemo(() => {
    return mockServices.filter((service) => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || service.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const activeService = mockServices.find((s) => s.id === selectedServiceId) || filteredServices[0];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8f9fc] dark:bg-slate-900 transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* Hero Section */}
        <section className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-10">
          <Badge className="bg-[#0d9488]/10 text-[#0d9488] border-[#0d9488]/20 mb-3 font-semibold">
            Geo-Located Citizen Facilities
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f1740] dark:text-white mb-4 tracking-tight">
            Local Government Services Locator
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Quickly find verified public facilities, CSC digital kiosks, municipal offices, and emergency support centers near you.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find government services, CSC centres, hospitals near you..."
                className="w-full pl-12 pr-4 py-4 text-sm bg-white dark:bg-slate-800 text-[#0f1740] dark:text-white focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-4 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 text-left sm:text-center">
              📍 Showing verified facilities around: <span className="font-semibold text-slate-700 dark:text-slate-300">Connaught Place, New Delhi 110001</span>
            </p>
          </div>
        </section>

        {/* Category Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-[#1a2f8a] text-white border-[#1a2f8a] shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1a2f8a]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Services & Map Interface */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Service Cards List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                <span>Showing <strong className="text-[#0f1740] dark:text-white">{filteredServices.length}</strong> public service locations</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Sorted by Proximity</span>
              </div>

              {filteredServices.length === 0 ? (
                <EmptyState
                  icon={<MapPin className="w-12 h-12 text-slate-300" />}
                  title="No facilities found"
                  description="Try adjusting your search query or choosing another service category."
                  action={
                    <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} variant="outline">
                      Reset Filters
                    </Button>
                  }
                />
              ) : (
                filteredServices.map((service) => {
                  const isSaved = isServiceSaved(service.id);
                  const isSelected = selectedServiceId === service.id;

                  return (
                    <Card
                      key={service.id}
                      className={`p-5 transition-all cursor-pointer border-2 ${
                        isSelected 
                          ? 'border-[#1a2f8a] shadow-md bg-blue-50/20 dark:bg-slate-800' 
                          : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                      onClick={() => setSelectedServiceId(service.id)}
                    >
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[11px] font-medium uppercase tracking-wider">
                            {service.category.replace('_', ' ')}
                          </Badge>
                          <span className="flex items-center text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded">
                            <Navigation className="w-3 h-3 mr-1" />
                            {service.distance} away
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveService(service.id, service.name);
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            isSaved 
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' 
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={isSaved ? "Saved to your places" : "Save location"}
                        >
                          <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <h3 className="text-lg font-bold text-[#0f1740] dark:text-white mb-1.5">
                        {service.name}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 mb-3">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                        {service.address}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {service.timing || (service as any).openingHours || '9:00 AM - 6:00 PM'}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3.5 h-3.5" />
                            {service.phone}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(service.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(service.name + ' ' + service.address)}`, '_blank');
                            }}
                            className="gap-1 text-xs"
                          >
                            Get Directions
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Right: Map Simulation & Active Service Spotlight */}
            <div className="lg:col-span-5 space-y-6">
              {/* Realistic Map Placeholder */}
              <div className="sticky top-24 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 h-80 shadow-md">
                  {/* Stylized SVG Map Graphic */}
                  <svg className="w-full h-full object-cover opacity-60" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#e2e8f0" />
                    {/* Roads & Blocks */}
                    <path d="M0,80 Q150,120 400,60" stroke="#cbd5e1" strokeWidth="12" fill="none" />
                    <path d="M0,180 Q200,160 400,220" stroke="#cbd5e1" strokeWidth="16" fill="none" />
                    <path d="M120,0 Q140,150 160,300" stroke="#cbd5e1" strokeWidth="10" fill="none" />
                    <path d="M280,0 Q260,180 300,300" stroke="#cbd5e1" strokeWidth="14" fill="none" />
                    {/* Green Parks */}
                    <rect x="40" y="110" width="60" height="50" rx="8" fill="#d1fae5" />
                    <rect x="220" y="80" width="40" height="60" rx="8" fill="#d1fae5" />
                    <rect x="180" y="200" width="80" height="40" rx="8" fill="#d1fae5" />
                  </svg>

                  {/* Citizen Marker */}
                  <div className="absolute top-[45%] left-[38%] transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg animate-ping absolute"></div>
                    <div className="w-5 h-5 rounded-full bg-[#1a2f8a] border-2 border-white shadow-lg relative flex items-center justify-center text-white text-[9px] font-bold">
                      📍
                    </div>
                    <span className="bg-[#0f1740] text-white text-[10px] px-1.5 py-0.5 rounded shadow mt-1 font-semibold">
                      You are here
                    </span>
                  </div>

                  {/* Pins for Services */}
                  {mockServices.slice(0, 5).map((srv, i) => {
                    const positions = [
                      { top: '30%', left: '55%' },
                      { top: '65%', left: '60%' },
                      { top: '25%', left: '20%' },
                      { top: '75%', left: '25%' },
                      { top: '50%', left: '80%' },
                    ];
                    const pos = positions[i % positions.length];
                    const isPinSelected = activeService?.id === srv.id;

                    return (
                      <button
                        key={srv.id}
                        onClick={() => setSelectedServiceId(srv.id)}
                        style={{ top: pos.top, left: pos.left }}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 z-20 ${
                          isPinSelected ? 'scale-125 z-30' : ''
                        }`}
                      >
                        <div className={`p-1.5 rounded-full shadow-lg border-2 border-white ${
                          isPinSelected ? 'bg-teal-600 text-white ring-4 ring-teal-300/50' : 'bg-red-500 text-white'
                        }`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}

                  {/* Map Overlay Badges */}
                  <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    Interactive Civic Map Preview
                  </div>
                  <div className="absolute top-3 right-3 bg-[#0f1740] text-white px-2.5 py-1 rounded text-[10px] font-bold">
                    GPS Active (Demo)
                  </div>
                </div>

                {/* Selected Service Spotlight Detail Card */}
                {activeService && (
                  <Card className="p-6 bg-white dark:bg-slate-800 border-2 border-[#1a2f8a]/20 shadow-md space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-xs mb-1">
                          {activeService.category.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <h4 className="font-bold text-lg text-[#0f1740] dark:text-white">
                          {activeService.name}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {activeService.distance}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#1a2f8a] shrink-0 mt-0.5" />
                        <span>{activeService.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#1a2f8a] shrink-0" />
                        <span>{activeService.timing || (activeService as any).openingHours || 'Mon-Sat 9:00 AM - 6:00 PM'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#1a2f8a] shrink-0" />
                        <span className="font-mono">{activeService.phone}</span>
                      </p>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <Button
                        className="flex-1 bg-[#1a2f8a] hover:bg-[#0f1740] text-white text-xs gap-2"
                        onClick={() => window.open(activeService.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(activeService.name + ' ' + activeService.address)}`, '_blank')}
                      >
                        <Navigation className="w-4 h-4" />
                        Open Google Maps
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toggleSaveService(activeService.id, activeService.name)}
                        className="text-xs gap-1.5"
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={isServiceSaved(activeService.id) ? "currentColor" : "none"} />
                        {isServiceSaved(activeService.id) ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
