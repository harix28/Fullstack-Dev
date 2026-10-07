import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

interface SavedContextType {
  savedSchemeIds: string[];
  savedJobIds: string[];
  savedServiceIds: string[];
  toggleSaveScheme: (id: string, title?: string) => boolean;
  toggleSaveJob: (id: string, title?: string) => boolean;
  toggleSaveService: (id: string, title?: string) => boolean;
  isSchemeSaved: (id: string) => boolean;
  isJobSaved: (id: string) => boolean;
  isServiceSaved: (id: string) => boolean;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

const SCHEMES_KEY = 'govconnect_saved_schemes';
const JOBS_KEY = 'govconnect_saved_jobs';
const SERVICES_KEY = 'govconnect_saved_services';

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SCHEMES_KEY);
      return saved ? JSON.parse(saved) : ['sch_mudra_01', 'sch_nsp_03'];
    } catch {
      return ['sch_mudra_01', 'sch_nsp_03'];
    }
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(JOBS_KEY);
      return saved ? JSON.parse(saved) : ['job_ssc_cgl_01', 'job_ibps_po_02'];
    } catch {
      return ['job_ssc_cgl_01', 'job_ibps_po_02'];
    }
  });

  const [savedServiceIds, setSavedServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SERVICES_KEY);
      return saved ? JSON.parse(saved) : ['srv_hosp_01'];
    } catch {
      return ['srv_hosp_01'];
    }
  });

  useEffect(() => {
    localStorage.setItem(SCHEMES_KEY, JSON.stringify(savedSchemeIds));
  }, [savedSchemeIds]);

  useEffect(() => {
    localStorage.setItem(JOBS_KEY, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(savedServiceIds));
  }, [savedServiceIds]);

  const toggleSaveScheme = useCallback((id: string, title?: string): boolean => {
    let nowSaved = false;
    setSavedSchemeIds(prev => {
      if (prev.includes(id)) {
        nowSaved = false;
        showToast({
          title: 'Removed from Saved Schemes',
          description: title || 'Scheme removed from your saved list.',
          variant: 'info',
        });
        return prev.filter(item => item !== id);
      } else {
        nowSaved = true;
        showToast({
          title: 'Scheme Saved',
          description: title ? `"${title}" has been saved.` : 'Scheme added to your saved list.',
          variant: 'success',
        });
        return [...prev, id];
      }
    });
    return nowSaved;
  }, [showToast]);

  const toggleSaveJob = useCallback((id: string, title?: string): boolean => {
    let nowSaved = false;
    setSavedJobIds(prev => {
      if (prev.includes(id)) {
        nowSaved = false;
        showToast({
          title: 'Bookmark Removed',
          description: title || 'Job opportunity removed from bookmarks.',
          variant: 'info',
        });
        return prev.filter(item => item !== id);
      } else {
        nowSaved = true;
        showToast({
          title: 'Job Bookmarked',
          description: title ? `"${title}" added to bookmarks.` : 'Job saved to your bookmarks.',
          variant: 'success',
        });
        return [...prev, id];
      }
    });
    return nowSaved;
  }, [showToast]);

  const toggleSaveService = useCallback((id: string, title?: string): boolean => {
    let nowSaved = false;
    setSavedServiceIds(prev => {
      if (prev.includes(id)) {
        nowSaved = false;
        showToast({
          title: 'Service Removed',
          description: title || 'Service removed from saved places.',
          variant: 'info',
        });
        return prev.filter(item => item !== id);
      } else {
        nowSaved = true;
        showToast({
          title: 'Service Saved',
          description: title ? `"${title}" added to saved places.` : 'Service saved for quick access.',
          variant: 'success',
        });
        return [...prev, id];
      }
    });
    return nowSaved;
  }, [showToast]);

  const isSchemeSaved = useCallback((id: string) => savedSchemeIds.includes(id), [savedSchemeIds]);
  const isJobSaved = useCallback((id: string) => savedJobIds.includes(id), [savedJobIds]);
  const isServiceSaved = useCallback((id: string) => savedServiceIds.includes(id), [savedServiceIds]);

  return (
    <SavedContext.Provider value={{
      savedSchemeIds,
      savedJobIds,
      savedServiceIds,
      toggleSaveScheme,
      toggleSaveJob,
      toggleSaveService,
      isSchemeSaved,
      isJobSaved,
      isServiceSaved,
    }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) throw new Error('useSaved must be used within SavedProvider');
  return context;
};
