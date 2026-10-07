import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser, updateProfile } from '@/services/auth';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [state, setState] = useState(() => {
        const existing = getCurrentUser();
        if (existing) {
            return { user: existing, isAuthenticated: true, isLoading: false };
        }
        return { user: null, isAuthenticated: false, isLoading: false };
    });
    // Check persisted session on mount
    useEffect(() => {
        const existing = getCurrentUser();
        if (existing) {
            setState({ user: existing, isAuthenticated: true, isLoading: false });
        }
        else {
            setState({ user: null, isAuthenticated: false, isLoading: false });
        }
    }, []);
    const login = useCallback(async (credentials) => {
        setState(s => ({ ...s, isLoading: true }));
        try {
            const user = await loginUser(credentials);
            setState({ user, isAuthenticated: true, isLoading: false });
        }
        catch (err) {
            setState(s => ({ ...s, isLoading: false }));
            throw err;
        }
    }, []);
    const register = useCallback(async (data) => {
        setState(s => ({ ...s, isLoading: true }));
        try {
            const user = await registerUser(data);
            setState({ user, isAuthenticated: true, isLoading: false });
        }
        catch (err) {
            setState(s => ({ ...s, isLoading: false }));
            throw err;
        }
    }, []);
    const logout = useCallback(() => {
        logoutUser();
        setState({ user: null, isAuthenticated: false, isLoading: false });
    }, []);
    const updateUser = useCallback(async (data) => {
        const updated = await updateProfile(data);
        setState(s => ({ ...s, user: updated }));
    }, []);
    const switchPreset = useCallback((_presetKey) => { }, []);
    return (<AuthContext.Provider value={{ ...state, login, register, logout, updateUser, updateProfile: updateUser, switchPreset }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
