import { mockGrievances } from '@/data/mockGrievances';
// In-memory mutable copy
let grievancesStore = mockGrievances.map((g) => ({ ...g }));
// ─── Helpers ─────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const generateId = () => `grv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
// ─── Category → Portal Map ───────────────────────────────────────────────────
const PORTAL_MAP = {
    public_services: {
        name: 'CPGRAMS – Centralised Public Grievance Redress and Monitoring System',
        url: 'https://pgportal.gov.in',
        description: 'Central government public grievance portal',
        type: 'central',
    },
    infrastructure: {
        name: 'Ministry of Road Transport & Highways Grievance Portal',
        url: 'https://morth.nic.in/grievance',
        description: 'Infrastructure and roads related grievances',
        type: 'central',
    },
    corruption: {
        name: 'CVC – Central Vigilance Commission',
        url: 'https://cvc.gov.in',
        description: 'Anti-corruption and vigilance related complaints',
        type: 'central',
    },
    education: {
        name: 'Ministry of Education Grievance Portal',
        url: 'https://pgportal.gov.in',
        description: 'Education related complaints and grievances',
        type: 'central',
    },
    health: {
        name: 'Ministry of Health & Family Welfare Grievance Portal',
        url: 'https://mohfw.gov.in/grievances',
        description: 'Health services complaints and grievances',
        type: 'central',
    },
    police: {
        name: 'State Police Complaint Authority',
        url: 'https://pgportal.gov.in',
        description: 'Police conduct and service related complaints',
        type: 'state',
    },
    revenue: {
        name: 'Revenue & Land Records Grievance Portal',
        url: 'https://pgportal.gov.in',
        description: 'Revenue, land and property related grievances',
        type: 'state',
    },
    utilities: {
        name: 'Consumer Helpline – INGRAM',
        url: 'https://consumerhelpline.gov.in',
        description: 'Electricity, water and utility service complaints',
        type: 'central',
    },
    environment: {
        name: 'MoEF&CC Grievance Portal',
        url: 'https://moef.gov.in',
        description: 'Environmental complaints and violations',
        type: 'central',
    },
    other: {
        name: 'CPGRAMS – Centralised Public Grievance Redress and Monitoring System',
        url: 'https://pgportal.gov.in',
        description: 'Central government public grievance portal',
        type: 'central',
    },
};
// ─── Grievances Service ───────────────────────────────────────────────────────
/**
 * Fetch all grievances for the current user.
 *
 * Future: GET to API_ENDPOINTS.grievances.list
 */
export const getGrievances = async () => {
    await delay(400);
    return grievancesStore.map((g) => ({ ...g }));
};
/**
 * Fetch a single grievance by its ID.
 * Throws if not found.
 *
 * Future: GET to API_ENDPOINTS.grievances.detail(id)
 */
export const getGrievanceById = async (id) => {
    await delay(300);
    const grievance = grievancesStore.find((g) => g.id === id);
    if (!grievance) {
        throw new Error(`Grievance with id "${id}" not found.`);
    }
    return { ...grievance };
};
/**
 * Create a new grievance entry with draft status.
 *
 * Future: POST to API_ENDPOINTS.grievances.create
 */
export const createGrievance = async (data) => {
    await delay(800);
    const now = new Date().toISOString();
    const newGrievance = {
        id: generateId(),
        title: data.title,
        description: data.description,
        category: data.category,
        department: data.department,
        location: data.location,
        district: data.district,
        state: data.state,
        attachments: data.attachments ?? [],
        status: 'draft',
        priority: 'medium',
        createdAt: now,
        updatedAt: now,
        timeline: [
            {
                status: 'draft',
                description: 'Grievance created and saved as draft.',
                timestamp: now,
            },
        ],
    };
    grievancesStore = [newGrievance, ...grievancesStore];
    return { ...newGrievance };
};
/**
 * Simulate AI analysis of a grievance description.
 * Returns an AiAnalysis object with department detection, priority, and portal suggestion.
 *
 * Future: POST to API_ENDPOINTS.grievances.analyze
 */
export const analyzeGrievance = async (description, title, category) => {
    await delay(2000);
    const text = `${title} ${description}`.toLowerCase();
    // Derive priority from urgency keywords
    let priority = 'medium';
    if (text.includes('urgent') ||
        text.includes('immediate') ||
        text.includes('emergency') ||
        text.includes('life') ||
        text.includes('death')) {
        priority = 'urgent';
    }
    else if (text.includes('serious') ||
        text.includes('critical') ||
        text.includes('major')) {
        priority = 'high';
    }
    else if (text.includes('minor') || text.includes('small')) {
        priority = 'low';
    }
    // Department detection per category
    const departmentMap = {
        public_services: 'Department of Administrative Reforms & Public Grievances',
        infrastructure: 'Ministry of Road Transport & Highways',
        corruption: 'Central Vigilance Commission',
        education: 'Ministry of Education',
        health: 'Ministry of Health & Family Welfare',
        police: 'State Police Department',
        revenue: 'Revenue & District Administration',
        utilities: 'Ministry of Power / State Electricity Board',
        environment: 'Ministry of Environment, Forest and Climate Change',
        other: 'Department of Administrative Reforms & Public Grievances',
    };
    const reasoningMap = {
        public_services: 'Based on the complaint content, this falls under public service delivery issues handled by DARPG.',
        infrastructure: 'The complaint relates to infrastructure – roads, bridges, or public works – under MoRTH jurisdiction.',
        corruption: 'Corruption allegations are routed to the Central Vigilance Commission for impartial investigation.',
        education: 'Education-related grievances are managed by the Ministry of Education through CPGRAMS.',
        health: 'Health service complaints are addressed by the Ministry of Health & Family Welfare.',
        police: 'Police-related complaints are handled at the state level by the Police Complaint Authority.',
        revenue: 'Revenue and land record disputes fall under the State Revenue Department.',
        utilities: 'Utility service failures (electricity/water) are addressed via INGRAM consumer helpline.',
        environment: 'Environmental violations are investigated by MoEF&CC under the Environment Protection Act.',
        other: 'This complaint has been routed to CPGRAMS, the central public grievance portal for general complaints.',
    };
    return {
        detectedDepartment: departmentMap[category],
        complaintCategory: category.replace('_', ' '),
        prioritySuggestion: priority,
        suggestedPortal: PORTAL_MAP[category],
        confidence: Math.round(75 + Math.random() * 20), // 75–95%
        reasoning: reasoningMap[category],
    };
};
/**
 * Simulate AI draft generation for a grievance.
 * Returns a formal 3-paragraph complaint letter as a string.
 *
 * Future: POST to API_ENDPOINTS.grievances.draft
 */
export const generateDraft = async (grievanceId, analysis) => {
    await delay(1500);
    const grievance = grievancesStore.find((g) => g.id === grievanceId);
    if (!grievance) {
        throw new Error(`Grievance with id "${grievanceId}" not found.`);
    }
    const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    const draft = `To,
The ${analysis.detectedDepartment},
${analysis.suggestedPortal.name},
Government of India.

Subject: Formal Complaint Regarding ${grievance.title}

Respected Sir/Madam,

I, the undersigned, am writing to bring to your kind attention a matter of serious concern pertaining to ${grievance.category.replace(/_/g, ' ')} in ${grievance.district}, ${grievance.state}. The issue has been adversely affecting citizens and requires immediate intervention from the competent authority.

${grievance.description} I have made repeated attempts to resolve this matter at the local level; however, no satisfactory resolution has been provided to date. The situation has been ongoing and demands prompt attention in the interest of justice and public welfare.

I respectfully request that the concerned authority investigate this matter thoroughly, take appropriate corrective action within the stipulated time frame, and inform me of the action taken. I am available to provide any further information or documentation as required.

Yours faithfully,
[Complainant Name]
[Address]
[Contact Number]
Date: ${date}

Reference: ${grievanceId.toUpperCase()}`;
    return draft;
};
/**
 * Save an AI-generated draft back to the grievance record.
 * Returns the updated grievance.
 *
 * Future: PATCH to API_ENDPOINTS.grievances.detail(id)
 */
export const saveDraft = async (id, draft) => {
    await delay(300);
    const index = grievancesStore.findIndex((g) => g.id === id);
    if (index === -1) {
        throw new Error(`Grievance with id "${id}" not found.`);
    }
    const now = new Date().toISOString();
    grievancesStore[index] = {
        ...grievancesStore[index],
        aiDraft: draft,
        status: 'drafted',
        updatedAt: now,
        timeline: [
            ...grievancesStore[index].timeline,
            {
                status: 'drafted',
                description: 'AI-generated draft saved successfully.',
                timestamp: now,
            },
        ],
    };
    return { ...grievancesStore[index] };
};
