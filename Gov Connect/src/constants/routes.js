// Application route constants for GovConnect
export const ROUTES = {
    // Public
    HOME: '/',
    ABOUT: '/about',
    HOW_IT_WORKS: '/how-it-works',
    SCHEMES: '/schemes',
    SCHEMES_RECOMMENDED: '/schemes?tab=recommended',
    SCHEMES_EXPLORE: '/schemes?tab=explore',
    SCHEME_DETAIL: (id) => `/schemes/${id}`,
    JOBS: '/jobs',
    JOBS_RECOMMENDED: '/jobs?tab=recommended',
    JOB_DETAIL: (id) => `/jobs/${id}`,
    SERVICES: '/services',
    CONTACT: '/contact',
    ASK_SARKAR: '/ask-sarkar',
    // Auth
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    // Dashboard & Citizen Portal
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    DOCUMENTS: '/documents',
    GRIEVANCES: '/grievances',
    GRIEVANCE_NEW: '/grievances/new',
    GRIEVANCE_DETAIL: (id) => `/grievances/${id}`,
    ASSISTANT: '/ask-sarkar',
    SAVED: '/saved',
    NOTIFICATIONS: '/notifications',
    SETTINGS: '/settings',
};
export default ROUTES;
