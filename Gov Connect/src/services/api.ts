// Base API configuration - ready for future REST backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    profile: `${API_BASE_URL}/auth/profile`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  },
  schemes: {
    list: `${API_BASE_URL}/schemes`,
    recommended: `${API_BASE_URL}/schemes/recommended`,
    detail: (id: string) => `${API_BASE_URL}/schemes/${id}`,
    save: (id: string) => `${API_BASE_URL}/schemes/${id}/save`,
  },
  jobs: {
    list: `${API_BASE_URL}/jobs`,
    recommended: `${API_BASE_URL}/jobs/recommended`,
    detail: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    save: (id: string) => `${API_BASE_URL}/jobs/${id}/save`,
  },
  documents: {
    list: `${API_BASE_URL}/documents`,
    upload: `${API_BASE_URL}/documents/upload`,
    delete: (id: string) => `${API_BASE_URL}/documents/${id}`,
  },
  grievances: {
    list: `${API_BASE_URL}/grievances`,
    create: `${API_BASE_URL}/grievances`,
    detail: (id: string) => `${API_BASE_URL}/grievances/${id}`,
    analyze: `${API_BASE_URL}/grievances/analyze`,
    draft: `${API_BASE_URL}/grievances/draft`,
  },
  assistant: {
    chat: `${API_BASE_URL}/assistant/chat`,
  },
  notifications: {
    list: `${API_BASE_URL}/notifications`,
    markRead: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
    markAllRead: `${API_BASE_URL}/notifications/read-all`,
  },
};

// Future: Replace mock services with real fetch calls using this config
export const apiConfig = {
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  getAuthHeaders: () => ({
    Authorization: `Bearer ${localStorage.getItem('govconnect_token') || ''}`,
  }),
};
