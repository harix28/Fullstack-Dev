// Shared TypeScript interfaces for GovConnect

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  phone?: string;
  age?: number;
  avatar?: string;
  state: string;
  district: string;
  cityVillage?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | string;
  category: 'general' | 'obc' | 'sc' | 'st' | 'ews' | string;
  religion?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  hasDisability: boolean;
  disabilityType?: string;
  education: EducationLevel | string;
  occupation: OccupationStatus | string;
  skills?: string[];
  employmentStatus?: string;
  annualIncome: number;
  familySize: number;
  profileCompletion: number;
  savedSchemes?: string[];
  savedJobs?: string[];
  savedServices?: string[];
  preferences: {
    language: 'en' | 'hi';
    notifications: boolean;
    emailUpdates: boolean;
    theme?: 'light' | 'dark' | 'system';
  };
  createdAt: string;
}

// ─── Local Services Types ───────────────────────────────────────────────────

export interface LocalService {
  id: string;
  name: string;
  category: ServiceCategory;
  address: string;
  distance: string;
  phone: string;
  timing: string;
  openingHours?: string;
  state: string;
  district: string;
  isSaved?: boolean;
  description?: string;
  mapsUrl?: string;
}

export type ServiceCategory =
  | 'hospital'
  | 'police'
  | 'govt_office'
  | 'college'
  | 'bank'
  | 'csc_centre'
  | 'employment_office'
  | 'municipal_office';

export interface FAQItem {
  id: string;
  category: 'general' | 'schemes' | 'jobs' | 'documents' | 'grievances' | 'privacy';
  question: string;
  answer: string;
}

export type EducationLevel =
  | 'no_formal'
  | 'primary'
  | 'secondary'
  | 'higher_secondary'
  | 'diploma'
  | 'graduate'
  | 'post_graduate'
  | 'phd';

export type OccupationStatus =
  | 'student'
  | 'employed_govt'
  | 'employed_private'
  | 'self_employed'
  | 'farmer'
  | 'unemployed'
  | 'retired'
  | 'homemaker';

// ─── Scheme Types ───────────────────────────────────────────────────────────

export interface Scheme {
  id: string;
  title: string;
  ministry: string;
  department: string;
  category: SchemeCategory;
  tags: string[];
  description: string;
  overview: string;
  eligibility: EligibilityCriteria;
  benefits: string[];
  documentsRequired: string[];
  applicationProcess: string[];
  importantDates: ImportantDate[];
  officialWebsite: string;
  portalUrl: string;
  matchPercentage?: number;
  isSaved?: boolean;
  isNew?: boolean;
  deadline?: string;
  launchDate: string;
  state?: string; // null = central scheme
  aiExplanation?: string;
}

export type SchemeCategory =
  | 'education'
  | 'health'
  | 'agriculture'
  | 'housing'
  | 'employment'
  | 'women'
  | 'senior_citizen'
  | 'disability'
  | 'minority'
  | 'youth'
  | 'financial'
  | 'skill_development'
  | 'social_welfare';

export interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  gender?: string[];
  category?: string[];
  income?: number; // max annual income
  education?: string[];
  occupation?: string[];
  state?: string[];
  description: string[];
}

export interface ImportantDate {
  label: string;
  date: string;
}

// ─── Job Types ───────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  organization: string;
  department: string;
  category: JobCategory;
  location: string;
  state: string;
  qualification: string[];
  experience?: string;
  vacancies: number;
  payScale: string;
  salaryRange?: { min: number; max: number };
  jobType: 'permanent' | 'contract' | 'temporary';
  ageLimit: { min: number; max: number };
  applicationStart: string;
  applicationDeadline: string;
  examDate?: string;
  description: string;
  responsibilities: string[];
  selectionProcess: string[];
  officialNotification: string;
  applyUrl: string;
  tags: string[];
  matchPercentage?: number;
  isSaved?: boolean;
  isNew?: boolean;
}

export type JobCategory =
  | 'banking'
  | 'defence'
  | 'railways'
  | 'teaching'
  | 'police'
  | 'medical'
  | 'engineering'
  | 'administrative'
  | 'psu'
  | 'state_govt'
  | 'central_govt';

// ─── Document Types ───────────────────────────────────────────────────────────

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  expiryDate?: string;
  status: DocumentStatus;
  ocrStatus?: OcrStatus;
  extractedData?: Record<string, string>;
  tags: string[];
  usedIn?: string[]; // scheme/job ids where used
}

export type DocumentCategory =
  | 'identity'
  | 'education'
  | 'income'
  | 'address'
  | 'caste_category'
  | 'certificates'
  | 'other';

export type DocumentType =
  | 'aadhaar'
  | 'pan'
  | 'voter_id'
  | 'passport'
  | 'driving_licence'
  | 'birth_certificate'
  | 'marksheet'
  | 'degree'
  | 'income_certificate'
  | 'caste_certificate'
  | 'residence_proof'
  | 'disability_certificate'
  | 'other';

export type DocumentStatus = 'uploaded' | 'processing' | 'verified' | 'needs_review' | 'expired';
export type OcrStatus = 'pending' | 'processing' | 'completed' | 'failed';

// ─── Grievance Types ─────────────────────────────────────────────────────────

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: GrievanceCategory;
  department: string;
  location: string;
  district: string;
  state: string;
  referenceNumber?: string;
  attachments: string[];
  documents?: string[];
  status: GrievanceStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  aiAnalysis?: AiAnalysis;
  aiDraft?: string;
  officialPortal?: OfficialPortal;
  createdAt: string;
  updatedAt: string;
  timeline: GrievanceTimeline[];
}

export type GrievanceCategory =
  | 'public_services'
  | 'infrastructure'
  | 'corruption'
  | 'education'
  | 'health'
  | 'police'
  | 'revenue'
  | 'utilities'
  | 'environment'
  | 'other';

export type GrievanceStatus =
  | 'draft'
  | 'analyzed'
  | 'drafted'
  | 'ready_to_submit'
  | 'submitted'
  | 'under_review'
  | 'resolved'
  | 'closed';

export interface AiAnalysis {
  detectedDepartment: string;
  complaintCategory: string;
  prioritySuggestion: 'low' | 'medium' | 'high' | 'urgent';
  suggestedPortal: OfficialPortal;
  confidence: number;
  reasoning: string;
}

export interface OfficialPortal {
  name: string;
  url: string;
  description: string;
  type: 'central' | 'state' | 'department';
}

export interface GrievanceTimeline {
  status: string;
  description: string;
  timestamp: string;
  date?: string;
  comment?: string;
}

// ─── Notification Types ───────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  read?: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, string>;
}

export type NotificationType =
  | 'scheme_deadline'
  | 'job_deadline'
  | 'document_expiry'
  | 'grievance_update'
  | 'new_scheme'
  | 'new_job'
  | 'system';

// ─── Chat / AI Assistant Types ────────────────────────────────────────────────

export interface RecommendationItem {
  id: string;
  type: 'scheme' | 'job' | 'service';
  title: string;
  subtitle?: string;
  match_score?: number;
  match_reasons?: string[];
  official_url?: string;
  details?: Record<string, any>;
}

export interface ActionItem {
  type: string;
  label: string;
  payload?: any;
}

export interface SourceCitation {
  name: string;
  url: string;
  domain?: string;
  last_checked?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isTyping?: boolean;
  suggestions?: string[];
  intent?: string;
  confidence?: number;
  recommendations?: RecommendationItem[];
  actions?: ActionItem[];
  sources?: SourceCitation[];
  actionType?: string;
  actionLabel?: string;
  actionPayload?: any;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  state?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  emailOrMobile: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserDocument {
  id: string;
  userId: string;
  name: string;
  category: DocumentCategory;
  type: string;
  fileSize: number;
  fileUrl: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'verified' | 'uploaded' | 'processing' | 'expired' | 'needs_review';
  ocrStatus?: 'completed' | 'processing' | 'failed' | 'pending';
  isVerified?: boolean;
  isStarred?: boolean;
  extractedData?: Record<string, any>;
  usedIn?: string[];
}


export interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  state: string;
  district?: string;
  cityVillage?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  education?: string;
  occupation?: string;
  employmentStatus?: string;
  skills?: string[];
  category?: string;
  annualIncome?: number;
}
