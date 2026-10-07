import type { ChatMessage, Job, Scheme, User, RecommendationItem, ActionItem, SourceCitation } from '@/types';
import { mockJobs } from '@/data/mockJobs';
import { mockSchemes } from '@/data/mockSchemes';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const randomDelay = (min: number, max: number) =>
  delay(Math.floor(Math.random() * (max - min + 1)) + min);
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

type ActionType =
  | 'navigate_grievance'
  | 'navigate_schemes'
  | 'navigate_jobs'
  | 'navigate_vault'
  | 'navigate_services'
  | 'view_scheme'
  | 'view_job'
  | 'apply_official'
  | 'create_grievance'
  | string;

export interface AssistantResponse {
  content: string;
  suggestions: string[];
  intent?: string;
  confidence?: number;
  recommendations?: RecommendationItem[];
  actions?: ActionItem[];
  sources?: SourceCitation[];
  actionType?: ActionType;
  actionLabel?: string;
  actionPayload?: unknown;
}

type AssistantMessage = ChatMessage & Partial<Pick<AssistantResponse, 'actionType' | 'actionLabel' | 'actionPayload'>>;
type AssistantContext = { page?: string; user?: Partial<User> };

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\u0900-\u097f₹\s-]/gi, ' ');
const hasAny = (text: string, words: string[]) => words.some((word) => text.includes(word));

const educationLabel = (education?: string) => {
  const value = education?.toLowerCase() || '';
  if (value.includes('post') || value.includes('mca') || value.includes('master')) return 'Post Graduate / MCA';
  if (value.includes('graduate') || value.includes('bca') || value.includes('bachelor')) return 'Graduate';
  return education || 'Not specified';
};

const scoreScheme = (scheme: Scheme, user: Partial<User> = {}) => {
  let score = 45;
  const age = user.age;
  const income = user.annualIncome;
  const education = user.education?.toLowerCase() || '';
  const state = user.state?.toLowerCase() || '';
  const category = user.category?.toLowerCase() || '';

  if (typeof age === 'number') {
    if (scheme.eligibility.minAge === undefined || age >= scheme.eligibility.minAge) score += 10;
    if (scheme.eligibility.maxAge === undefined || age <= scheme.eligibility.maxAge) score += 10;
  }
  if (typeof income === 'number' && scheme.eligibility.income !== undefined) {
    score += income <= scheme.eligibility.income ? 15 : -20;
  }
  if (scheme.eligibility.state?.some((s) => state.includes(s.toLowerCase()))) score += 10;
  if (scheme.eligibility.category?.some((c) => category.includes(c.toLowerCase()))) score += 5;
  if (scheme.eligibility.education?.some((e) => education.includes(e.toLowerCase()))) score += 10;
  if (scheme.tags.some((tag) => education.includes(tag.toLowerCase()) || tag.toLowerCase().includes('education'))) score += 5;

  return Math.max(20, Math.min(98, score));
};

const scoreJob = (job: Job, user: Partial<User> = {}) => {
  let score = 45;
  const education = user.education?.toLowerCase() || '';
  const skills = (user.skills || []).map((s) => s.toLowerCase());
  const state = user.state?.toLowerCase() || '';
  const age = user.age;

  if (job.qualification.some((q) => {
    const qualification = q.toLowerCase();
    return qualification.includes('graduate') || qualification.includes('degree') ||
      (education && (qualification.includes(education) || education.includes('mca') && qualification.includes('computer')));
  })) score += 20;
  if (job.tags.some((tag) => skills.some((skill) => tag.toLowerCase().includes(skill) || skill.includes(tag.toLowerCase())))) score += 15;
  if (job.state.toLowerCase() === 'central' || job.state.toLowerCase() === state) score += 8;
  if (typeof age === 'number' && age >= job.ageLimit.min && age <= job.ageLimit.max) score += 10;

  return Math.max(20, Math.min(98, score));
};

const schemeResults = (user: Partial<User>) =>
  mockSchemes
    .map((scheme) => ({ scheme, score: scoreScheme(scheme, user) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

const jobResults = (user: Partial<User>) =>
  mockJobs
    .map((job) => ({ job, score: scoreJob(job, user) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

const makeMessage = (response: AssistantResponse): AssistantMessage => ({
  id: generateId(),
  role: 'assistant',
  timestamp: new Date().toISOString(),
  ...response,
});

// Backend AI integration is coming soon. Assistant uses local fallback logic only.

export const sendMessage = async (
  message: string,
  history: ChatMessage[] = [],
  currentContext?: AssistantContext,
): Promise<AssistantMessage> => {
  const text = message.trim();
  if (!text) {
    return makeMessage({
      content: 'Please type your question and I will help you with schemes, jobs, documents, services or grievances.',
      suggestions: ['Show schemes for me', 'Find jobs for me', 'Draft a complaint'],
    });
  }

  await randomDelay(150, 350);

  if (!text) {
    return makeMessage({
      content: 'Please type your question and I will help you with schemes, jobs, documents, services or grievances.',
      suggestions: ['Show schemes for me', 'Find jobs for me', 'Draft a complaint'],
    });
  }

  const lower = normalize(text);
  const user = currentContext?.user || {};
  const userName = user.name || 'Citizen';
  const state = user.state || 'your state';
  const education = educationLabel(user.education);

  // Intent detection is deliberately ordered from specific to broad.
  // This prevents words like "card", "loan" or "job" from hijacking a more specific request.
  const isGreeting = /^(hi|hello|hey|hlo|namaste|pranam|salaam)$/.test(lower.trim()) ||
    hasAny(lower, ['kaise ho', 'kya haal', 'kem cho']);

  const isGrievance = hasAny(lower, [
    'complaint', 'grievance', 'shikayat', 'pothole', 'sadak', 'road', 'garbage', 'kachra', 'kooda',
    'waterlogging', 'drain', 'sewer', 'paani', 'water supply', 'bijli', 'electricity', 'street light',
  ]);
  const isDocument = hasAny(lower, [
    'document', 'documents', 'vault', 'digilocker', 'aadhaar', 'aadhar', 'pan card', 'marksheet',
    'certificate', 'kaghaz', 'upload file', 'proof',
  ]);
  const isJob = hasAny(lower, [
    'job', 'jobs', 'naukri', 'vacancy', 'vacancies', 'recruitment', 'ssc', 'upsc', 'railway', 'ibps',
    'bank po', 'cgl', 'career', 'government post',
  ]);
  const isHealth = hasAny(lower, ['ayushman', 'pm jay', 'health insurance', 'hospital', 'health scheme']);
  const isHousing = hasAny(lower, ['pmay', 'awas', 'housing', 'ghar', 'makaan']);
  const isScheme = hasAny(lower, [
    'scheme', 'schemes', 'yojana', 'eligible', 'eligibility', 'subsidy', 'benefit', 'scholarship',
    'financial help', 'pension', 'ration', 'mudra', 'loan', 'startup',
  ]);

  if (isGreeting) {
    return makeMessage({
      content: `Namaste **${userName}**! 🙏\n\nMain **Ask Sarkar** hoon. Main aapke GovConnect profile ke context ke saath schemes, jobs, documents, local services aur grievance drafting mein help kar sakta hoon.\n\n**Current profile:** ${education} • ${state}${user.skills?.length ? ` • ${user.skills.slice(0, 3).join(', ')}` : ''}\n\nAap normal language mein sawaal pooch sakte hain — Hindi, English ya Hinglish mein.`,
      suggestions: ['Meri schemes check karo', 'Mere liye jobs dhoondo', 'Complaint draft karo', 'Mere documents batao'],
    });
  }

  if (isGrievance) {
    let category = 'Public Services';
    let department = 'Relevant local civic authority';
    let title = 'Civic Service Complaint';
    let priority: 'low' | 'medium' | 'high' = 'medium';

    if (hasAny(lower, ['garbage', 'kachra', 'kooda'])) {
      category = 'Sanitation'; department = 'Municipal Sanitation Department'; title = 'Garbage collection / sanitation issue'; priority = 'high';
    } else if (hasAny(lower, ['paani', 'water supply', 'sewer', 'drain', 'waterlogging'])) {
      category = 'Water & Drainage'; department = 'Local Water / Municipal Department'; title = 'Water supply / drainage issue'; priority = 'high';
    } else if (hasAny(lower, ['bijli', 'electricity', 'street light'])) {
      category = 'Electricity / Street Lighting'; department = 'Electricity utility / Municipal authority'; title = 'Electricity or street-light issue';
    } else if (hasAny(lower, ['road', 'sadak', 'pothole'])) {
      category = 'Road & Infrastructure'; department = 'Municipal authority / PWD'; title = 'Road / pothole repair request';
    }

    const draft = `Subject: ${title}\n\nRespected Authority,\n\nI would like to report a ${category.toLowerCase()} issue in ${state}. The issue described by the citizen requires review and appropriate action. Kindly inspect the location and take necessary remedial action.\n\nLocation: ${state}\n\nRegards,\n${userName}`;

    return makeMessage({
      content: `### 📝 Complaint Analysis\n\n**Detected issue:** ${category}\n**Suggested department:** ${department}\n**Suggested priority:** ${priority}\n\nI have prepared a **draft only**. Please review/edit it before submitting through the official portal.\n\n**Draft:**\n${draft}`,
      suggestions: ['Edit this complaint', 'Track my grievances', 'Open grievance form'],
      actionType: 'navigate_grievance',
      actionLabel: 'Review Grievance Draft',
      actionPayload: { title, category, department, priority, draft },
    });
  }

  if (isDocument) {
    return makeMessage({
      content: `### 📁 Document Vault\n\nI can help you understand which documents may be needed, but I won't claim that your files are verified unless the application actually has verification data.\n\nFor a typical government application, requirements can include identity proof, address proof, education/certificate documents and income/category certificates depending on the service.\n\n**For your profile:** ${education} • ${state}\n\nOpen the vault to see the documents currently stored in this demo.`,
      suggestions: ['Open my document vault', 'Documents for a scholarship', 'Documents for a job application'],
      actionType: 'navigate_vault',
      actionLabel: 'Open Document Vault',
    });
  }

  if (isHealth) {
    const scheme = mockSchemes.find((item) => item.id === 'sch_ayushman_01') || mockSchemes.find((item) => item.title.toLowerCase().includes('ayushman'));
    return makeMessage({
      content: scheme
        ? `### 🏥 ${scheme.title}\n\n${scheme.description}\n\n**Benefits**\n${scheme.benefits.slice(0, 2).map((b) => `• ${b}`).join('\n')}\n\nEligibility can depend on the beneficiary database and applicable rules. Please verify your final eligibility on the official portal.`
        : 'I can help you explore health-related government schemes. Please open the scheme explorer for the current demo data.',
      suggestions: ['Show health schemes', 'What documents may be needed?', 'Check my scheme matches'],
      actionType: 'navigate_schemes',
      actionLabel: 'Open Health Schemes',
      actionPayload: scheme ? { schemeId: scheme.id } : undefined,
    });
  }

  if (isHousing) {
    const scheme = mockSchemes.find((item) => item.id === 'sch_pmay_u_03') || mockSchemes.find((item) => item.title.toLowerCase().includes('awas'));
    return makeMessage({
      content: scheme
        ? `### 🏠 ${scheme.title}\n\n${scheme.description}\n\n**Eligibility signals in the demo:**\n${scheme.eligibility.description.slice(0, 3).map((x) => `• ${x}`).join('\n')}\n\nFinal eligibility and current benefits should be verified on the official scheme portal.`
        : 'I can help you explore housing schemes. Open the scheme explorer to view the current demo data.',
      suggestions: ['Check my PMAY eligibility', 'Required documents', 'Explore all schemes'],
      actionType: 'navigate_schemes',
      actionLabel: 'Explore Housing Schemes',
      actionPayload: scheme ? { schemeId: scheme.id } : undefined,
    });
  }

  if (isJob) {
    const results = jobResults(user);
    const lines = results.map(({ job, score }) =>
      `**${job.title}** — ${score}% profile match\n• ${job.organization} • ${job.location}\n• Qualification: ${job.qualification[0]}\n• Deadline: ${job.applicationDeadline}`,
    );

    return makeMessage({
      content: `### 💼 Jobs matched to your profile\n\nProfile used: **${education}**${user.skills?.length ? ` • ${user.skills.slice(0, 4).join(', ')}` : ''}\n\n${lines.join('\n\n')}\n\nThese are **prototype match scores**, not official eligibility decisions. Always verify the recruitment notification before applying.`,
      suggestions: ['Show all jobs', 'Filter jobs by my skills', 'Open my saved jobs'],
      actionType: 'navigate_jobs',
      actionLabel: 'Open Jobs Tracker',
      actionPayload: { jobIds: results.map(({ job }) => job.id) },
    });
  }

  if (isScheme) {
    const results = schemeResults(user);
    const lines = results.map(({ scheme, score }) =>
      `**${scheme.title}** — ${score}% indicative match\n• ${scheme.category.replace(/_/g, ' ')}\n• ${scheme.benefits[0] || 'See scheme details for benefits.'}`,
    );

    return makeMessage({
      content: `### 🎯 Scheme recommendations for ${userName}\n\nProfile used: **${education} • ${state}**${user.annualIncome !== undefined ? ` • Income: ₹${user.annualIncome.toLocaleString('en-IN')}` : ''}\n\n${lines.join('\n\n')}\n\n**Important:** A match score is only a recommendation based on the demo data. It is not a government eligibility decision. Verify the latest criteria on the official portal.`,
      suggestions: ['Show scholarship schemes', 'Show financial schemes', 'Open scheme explorer'],
      actionType: 'navigate_schemes',
      actionLabel: 'Open Scheme Matching',
      actionPayload: { schemeIds: results.map(({ scheme }) => scheme.id) },
    });
  }

  // Context-aware fallback: don't invent facts or pretend a live government database was queried.
  const recentTopics = history.slice(-4).filter((item) => item.role === 'user').map((item) => item.content).join(' ');
  const contextHint = recentTopics ? ` I can continue from your recent question: “${recentTopics.slice(-120)}”.` : '';

  return makeMessage({
    content: `I can help with **government schemes, jobs, documents, grievances and local services**.${contextHint}\n\nI couldn't confidently identify the intent of your question yet. Try asking something specific, for example:\n\n• “Which schemes may match my profile?”\n• “Find government jobs for an MCA graduate.”\n• “What documents do I need for a scholarship?”\n• “Help me draft a complaint about potholes.”`,
    suggestions: ['Find schemes for me', 'Find jobs for me', 'What documents do I need?', 'Draft a grievance'],
  });
};
