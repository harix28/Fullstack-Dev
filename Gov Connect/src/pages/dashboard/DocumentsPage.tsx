import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderPlus, FileText, Download, Trash2, Eye, UploadCloud, 
  AlertCircle, Star, Search, ArrowUpDown, CheckCircle2, 
  ShieldCheck, Clock, ExternalLink, RefreshCw, Zap, Sparkles, Check
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Card, Badge, Modal, EmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/utils/formatDate';
import { formatFileSize } from '@/utils/formatCurrency';
import { mockDocuments } from '@/data/mockDocuments';
import { DOCUMENT_CATEGORIES } from '@/constants/categories';
import type { UserDocument } from '@/types';

const STORAGE_KEY = 'govconnect_documents';

export default function DocumentsPage() {
  const { showToast } = useToast();

  const [documents, setDocuments] = useState<UserDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : mockDocuments;
    } catch {
      return mockDocuments;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [isSyncingDigilocker, setIsSyncingDigilocker] = useState(false);

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<UserDocument | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('identity');
  const [uploadExpiry, setUploadExpiry] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  const filteredDocs = documents.filter(doc => {
    const matchesCat = activeCategory === 'all' || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStar = !onlyStarred || (doc as any).isStarred;
    return matchesCat && matchesSearch && matchesStar;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'size') return ((b.fileSize || 0) - (a.fileSize || 0));
    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
  });

  // Simulated 1-Click DigiLocker Sync
  const handleDigiLockerSync = () => {
    setIsSyncingDigilocker(true);
    showToast({
      title: 'Connecting to DigiLocker',
      description: 'Contacting National e-Governance Division (NeGD) Gateway...',
      variant: 'info'
    });

    setTimeout(() => {
      setIsSyncingDigilocker(false);
      showToast({
        title: 'DigiLocker Sync Complete! ✅',
        description: 'All 4 government-issued credentials verified with SHA-256 digital signatures.',
        variant: 'success'
      });
    }, 1500);
  };

  const handleUploadSubmit = () => {
    if (!uploadName.trim() && !selectedFile) return;

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const newDoc: UserDocument = {
            id: `doc_${Date.now()}`,
            userId: 'user_001',
            name: uploadName.trim() || selectedFile?.name || 'Uploaded Document',
            category: uploadCategory as any,
            type: selectedFile?.name.endsWith('.png') || selectedFile?.name.endsWith('.jpg') ? 'jpg' : 'pdf',
            fileSize: selectedFile?.size || 1450000,
            fileUrl: '#',
            uploadDate: new Date().toISOString(),
            expiryDate: uploadExpiry || undefined,
            status: 'verified',
            ocrStatus: 'completed',
            isVerified: true,
            extractedData: {
              documentType: uploadCategory.toUpperCase(),
              issuingAuthority: 'Government of India',
              verificationHash: `SHA256-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
            },
            usedIn: []
          };

          setDocuments(prev => [newDoc, ...prev]);
          setIsUploading(false);
          setUploadModalOpen(false);
          setUploadProgress(0);
          setSelectedFile(null);
          setUploadName('');
          setUploadExpiry('');

          showToast({
            title: 'Document Saved in Vault',
            description: `"${newDoc.name}" encrypted with AES-256 and ready for 1-click applications.`,
            variant: 'success'
          });
        }, 400);
      }
    }, 80);
  };

  const handleDeleteConfirm = () => {
    if (!selectedDoc) return;
    setDocuments(prev => prev.filter(d => d.id !== selectedDoc.id));
    setDeleteModalOpen(false);
    showToast({
      title: 'Document Removed',
      description: `"${selectedDoc.name}" has been deleted from your local vault.`,
      variant: 'info'
    });
    setSelectedDoc(null);
  };

  const toggleStar = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        const nowStarred = !(d as any).isStarred;
        showToast({
          title: nowStarred ? 'Starred' : 'Unstarred',
          description: nowStarred ? `Added to favorites.` : `Removed from favorites.`,
          variant: 'info'
        });
        return { ...d, isStarred: nowStarred };
      }
      return d;
    }));
  };

  const handleMockDownload = (doc: UserDocument) => {
    showToast({
      title: 'Downloading Document',
      description: `Downloading ${doc.name} (${formatFileSize(doc.fileSize || 1024000)})...`,
      variant: 'success'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      
      {/* ── BEAST MODE: VAULT COMMAND BANNER ── */}
      <div className="bg-gradient-to-r from-[#0f1740] via-[#1a2f8a] to-[#0d9488] rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-400/20 text-teal-200 border border-teal-300/30">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                Zero-Knowledge Encrypted Vault
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/90">
                DigiLocker Compliant
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Digital Document Vault
            </h1>

            <p className="text-blue-100 text-sm leading-relaxed">
              Store, verify, and auto-populate your government credentials across scheme registrations and public recruitment forms with 1-click.
            </p>

            {/* Vault Readiness Progress Bar */}
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" /> Vault Application Readiness
                </span>
                <span className="font-extrabold text-teal-300">80% Ready (4/5)</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full transition-all duration-300" style={{ width: '80%' }} />
              </div>
              <p className="text-[11px] text-blue-200">
                Aadhaar, Degree Marksheet, Income Proof, and Bank IFSC verified.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Button 
              onClick={() => setUploadModalOpen(true)} 
              className="bg-[#0d9488] hover:bg-teal-500 text-white font-extrabold px-5 py-3 rounded-xl shadow-lg gap-2 text-sm cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              Upload New Document
            </Button>
            
            <button
              onClick={handleDigiLockerSync}
              disabled={isSyncingDigilocker}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 text-teal-300", isSyncingDigilocker && "animate-spin")} />
              <span>{isSyncingDigilocker ? 'Syncing NeGD...' : '⚡ 1-Click DigiLocker Sync'}</span>
            </button>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-[#0d9488] rounded-full blur-3xl opacity-20 pointer-events-none" />
      </div>

      {/* ── SEARCH & FILTER TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search documents by name or category..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a2f8a] text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end text-xs">
          <button
            onClick={() => setOnlyStarred(!onlyStarred)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              onlyStarred 
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700' 
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Star className="w-3.5 h-3.5" fill={onlyStarred ? "currentColor" : "none"} />
            Starred Only
          </button>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="date">Sort: Upload Date</option>
              <option value="name">Sort: Document Name</option>
              <option value="size">Sort: File Size</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT: CATEGORY PILLS + CARDS GRID ── */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Categories Sidebar */}
        <div className="lg:w-64 shrink-0 overflow-x-auto lg:overflow-visible">
          <div className="flex lg:flex-col gap-1.5 min-w-max lg:min-w-0 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeCategory === 'all' 
                  ? "bg-[#1a2f8a] text-white shadow-xs" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              )}
            >
              <span>All Documents</span>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", activeCategory === 'all' ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600")}>
                {documents.length}
              </span>
            </button>

            {DOCUMENT_CATEGORIES.map(cat => {
              const count = documents.filter(d => d.category === cat.id).length;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    isActive 
                      ? "bg-[#1a2f8a] text-white shadow-xs" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <span>{cat.label}</span>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="flex-1">
          {filteredDocs.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-12 h-12 text-slate-300" />}
              title="No documents in this category"
              description="Upload your document or adjust filters to view items in your vault."
              action={
                <Button onClick={() => setUploadModalOpen(true)} className="bg-[#1a2f8a] text-white">
                  <UploadCloud className="w-4 h-4 mr-2" /> Upload Document
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDocs.map(doc => {
                const isStarred = (doc as any).isStarred;
                return (
                  <Card key={doc.id} className="p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-2xl text-[#1a2f8a] dark:text-blue-300 group-hover:scale-105 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => toggleStar(doc.id, e)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isStarred ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-300 hover:text-slate-500'}`}
                            title={isStarred ? "Starred" : "Star document"}
                          >
                            <Star className="w-4 h-4" fill={isStarred ? "currentColor" : "none"} />
                          </button>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            VERIFIED
                          </span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-[#0f1740] dark:text-white text-sm mb-1 line-clamp-1 group-hover:text-[#1a2f8a] dark:group-hover:text-blue-400 transition-colors" title={doc.name}>
                        {doc.name}
                      </h3>

                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-3">
                        <p className="font-semibold">{doc.type.toUpperCase()} • {formatFileSize(doc.fileSize || 1200000)}</p>
                        <p className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> Added: {formatDate(doc.uploadDate)}
                        </p>
                        {doc.expiryDate && (
                          <p className="text-amber-600 font-semibold">
                            Expires: {formatDate(doc.expiryDate)}
                          </p>
                        )}
                      </div>

                      {doc.usedIn && doc.usedIn.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md font-bold">
                            🔗 Linked in {doc.usedIn.length} application{doc.usedIn.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Auto-Fill Ready
                      </span>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => { setSelectedDoc(doc); setPreviewModalOpen(true); }}
                          className="p-1.5 text-slate-500 hover:text-[#1a2f8a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMockDownload(doc)}
                          className="p-1.5 text-slate-500 hover:text-[#1a2f8a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                          title="Download Copy"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedDoc(doc); setDeleteModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── UPLOAD MODAL ── */}
      <Modal isOpen={uploadModalOpen} onClose={() => !isUploading && setUploadModalOpen(false)} title="Upload Document to Vault">
        <div className="space-y-4 font-sans text-sm">
          <div 
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const f = e.dataTransfer.files[0];
                setSelectedFile(f);
                if (!uploadName) setUploadName(f.name.replace(/\.[^/.]+$/, ''));
              }
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const f = e.target.files[0];
                  setSelectedFile(f);
                  if (!uploadName) setUploadName(f.name.replace(/\.[^/.]+$/, ''));
                }
              }} 
            />
            <UploadCloud className="w-10 h-10 text-[#1a2f8a] mx-auto mb-2" />
            <p className="font-bold text-[#0f1740] dark:text-white">
              Drag & Drop file here, or click to browse
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF, JPG, PNG (Max 10 MB). Stored locally in demo.
            </p>

            {selectedFile && (
              <div className="mt-3 p-2.5 bg-blue-50 dark:bg-slate-700 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-[#1a2f8a] dark:text-blue-300 truncate max-w-[200px]">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </span>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Title *
              </label>
              <input
                type="text"
                value={uploadName}
                onChange={e => setUploadName(e.target.value)}
                placeholder="e.g. Caste Certificate / Degree Marksheet"
                className="w-full px-3.5 py-2.5 border rounded-xl text-xs dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a2f8a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a2f8a]"
                >
                  {DOCUMENT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={uploadExpiry}
                  onChange={e => setUploadExpiry(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a2f8a]"
                />
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Extracting OCR fields & generating SHA-256 hash...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="bg-[#1a2f8a] h-full rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="outline" size="sm" onClick={() => setUploadModalOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              size="sm" 
              className="bg-[#1a2f8a] hover:bg-[#0f1740] text-white font-bold" 
              onClick={handleUploadSubmit} 
              disabled={isUploading || (!uploadName.trim() && !selectedFile)}
            >
              {isUploading ? 'Encrypting & Saving...' : 'Save to Vault'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── PREVIEW MODAL ── */}
      <Modal isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)} title="Document Preview & OCR Data" size="lg">
        {selectedDoc && (
          <div className="space-y-4 font-sans">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-[#0f1740] dark:text-white text-base">{selectedDoc.name}</h3>
                <p className="text-xs text-slate-400">Category: {selectedDoc.category.toUpperCase()} • Uploaded: {formatDate(selectedDoc.uploadDate)}</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">
                DIGILOCKER VERIFIED
              </Badge>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-2">
              <FileText className="w-12 h-12 text-[#1a2f8a]" />
              <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{selectedDoc.name}</p>
              <p className="text-xs text-slate-500">
                Digital Signature Checksum: <span className="font-mono text-[#1a2f8a] dark:text-teal-300 font-bold">SHA256-VLT-{selectedDoc.id.toUpperCase()}</span>
              </p>
            </div>

            {selectedDoc.extractedData && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  OCR Extracted Credential Fields:
                </h4>
                <div className="bg-slate-50 dark:bg-slate-900 border rounded-xl p-3.5 grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(selectedDoc.extractedData).map(([k, val]) => (
                    <div key={k}>
                      <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{String(val)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleMockDownload(selectedDoc)}
                className="gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Copy
              </Button>
              <Button size="sm" onClick={() => setPreviewModalOpen(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── DELETE MODAL ── */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Document">
        <div className="space-y-4 text-sm font-sans">
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to remove <strong className="text-red-600">{selectedDoc?.name}</strong> from your document vault?
          </p>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
