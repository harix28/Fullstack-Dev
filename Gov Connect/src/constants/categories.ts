import type { SchemeCategory, JobCategory, DocumentCategory, GrievanceCategory } from '@/types';

export const SCHEME_CATEGORIES: { value: SchemeCategory; label: string }[] = [
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health & Medical' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'housing', label: 'Housing' },
  { value: 'employment', label: 'Employment' },
  { value: 'women', label: "Women's Welfare" },
  { value: 'senior_citizen', label: 'Senior Citizens' },
  { value: 'disability', label: 'Disability' },
  { value: 'minority', label: 'Minority Welfare' },
  { value: 'youth', label: 'Youth' },
  { value: 'financial', label: 'Financial Assistance' },
  { value: 'skill_development', label: 'Skill Development' },
  { value: 'social_welfare', label: 'Social Welfare' },
];

export const JOB_CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: 'banking', label: 'Banking & Finance' },
  { value: 'defence', label: 'Defence & Police' },
  { value: 'railways', label: 'Railways' },
  { value: 'teaching', label: 'Teaching & Education' },
  { value: 'police', label: 'Police & Law Enforcement' },
  { value: 'medical', label: 'Medical & Health' },
  { value: 'engineering', label: 'Engineering & Technical' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'psu', label: 'Public Sector Units' },
  { value: 'state_govt', label: 'State Government' },
  { value: 'central_govt', label: 'Central Government' },
];

export const DOCUMENT_CATEGORIES: { id: DocumentCategory; value: DocumentCategory; label: string; icon: string }[] = [
  { id: 'identity', value: 'identity', label: 'Identity', icon: 'id-card' },
  { id: 'education', value: 'education', label: 'Education', icon: 'graduation-cap' },
  { id: 'income', value: 'income', label: 'Income', icon: 'indian-rupee' },
  { id: 'address', value: 'address', label: 'Address Proof', icon: 'map-pin' },
  { id: 'caste_category', value: 'caste_category', label: 'Caste / Category', icon: 'users' },
  { id: 'certificates', value: 'certificates', label: 'Certificates', icon: 'award' },
  { id: 'other', value: 'other', label: 'Other', icon: 'file' },
];

export const GRIEVANCE_CATEGORIES: { id: GrievanceCategory; value: GrievanceCategory; label: string }[] = [
  { id: 'public_services', value: 'public_services', label: 'Public Services' },
  { id: 'infrastructure', value: 'infrastructure', label: 'Infrastructure' },
  { id: 'corruption', value: 'corruption', label: 'Corruption' },
  { id: 'education', value: 'education', label: 'Education' },
  { id: 'health', value: 'health', label: 'Health' },
  { id: 'police', value: 'police', label: 'Police' },
  { id: 'revenue', value: 'revenue', label: 'Revenue / Land' },
  { id: 'utilities', value: 'utilities', label: 'Utilities' },
  { id: 'environment', value: 'environment', label: 'Environment' },
  { id: 'other', value: 'other', label: 'Other' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep', 'Delhi', 'Puducherry', 'Ladakh', 'Jammu and Kashmir',
];

export const MINISTRIES = [
  'Ministry of Education',
  'Ministry of Health and Family Welfare',
  'Ministry of Agriculture and Farmers Welfare',
  'Ministry of Housing and Urban Affairs',
  'Ministry of Labour and Employment',
  'Ministry of Women and Child Development',
  'Ministry of Social Justice and Empowerment',
  'Ministry of Skill Development and Entrepreneurship',
  'Ministry of Finance',
  'Ministry of Rural Development',
  'Ministry of Tribal Affairs',
  'Ministry of Minority Affairs',
  'Ministry of Micro, Small and Medium Enterprises',
  'Ministry of Electronics and Information Technology',
];

export const INCOME_RANGES = [
  { label: 'Below ₹1 Lakh', value: 100000 },
  { label: '₹1L – ₹2.5L', value: 250000 },
  { label: '₹2.5L – ₹5L', value: 500000 },
  { label: '₹5L – ₹8L', value: 800000 },
  { label: '₹8L – ₹12L', value: 1200000 },
  { label: 'Above ₹12L', value: 9999999 },
];
