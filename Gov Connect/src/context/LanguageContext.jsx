import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/i18n';
const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => localStorage.getItem('govconnect_language') || 'en');
    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('govconnect_language', lang);
        i18n.changeLanguage(lang);
        document.documentElement.lang = lang;
    };
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);
    return (<LanguageContext.Provider value={{ language, setLanguage, isHindi: language === 'hi' }}>
      {children}
    </LanguageContext.Provider>);
}
export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx)
        throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
}
