import React, { createContext, useContext, useEffect } from 'react';
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }) => {
    useEffect(() => {
        // Strictly enforce light theme across document and storage
        const root = document.documentElement;
        root.classList.remove('dark');
        localStorage.setItem('govconnect_theme', 'light');
    }, []);
    return (<ThemeContext.Provider value={{
            theme: 'light',
            resolvedTheme: 'light',
            setTheme: () => { },
            toggleTheme: () => { },
        }}>
      {children}
    </ThemeContext.Provider>);
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context)
        throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
