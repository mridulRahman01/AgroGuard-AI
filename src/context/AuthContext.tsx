import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

export interface AuthContextType {
    session: Session | null;
    user: User | null;
    role: 'Farmer' | 'Officer' | 'Admin' | null;
    profileName: string | null;
    isLoading: boolean;
    signInWithOAuth: (provider: Provider) => Promise<{ error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
}

const defaultContext: AuthContextType = {
    session: null,
    user: null,
    role: null,
    profileName: null,
    isLoading: true,
    signInWithOAuth: async () => ({ error: null }),
    signOut: async () => ({ error: null }),
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'Farmer' | 'Officer' | 'Admin' | null>(null);
    const [profileName, setProfileName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('role, name')
                .eq('id', userId)
                .single();

            if (data && !error) {
                setRole(data.role);
                setProfileName(data.name);
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    };

    useEffect(() => {
        // Initial session check
        const initializeAuth = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (currentSession?.user) {
                await fetchUserProfile(currentSession.user.id);
            }
            setIsLoading(false);
        };

        initializeAuth();

        // Listen for auth changes (Login, Logout, Token Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                setSession(newSession);
                setUser(newSession?.user ?? null);

                if (newSession?.user) {
                    await fetchUserProfile(newSession.user.id);
                } else {
                    setRole(null);
                    setProfileName(null);
                }
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signInWithOAuth = async (provider: Provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        });
        return { error };
    };

    const signOut = async () => {
        let err = null;
        try {
            const { error } = await supabase.auth.signOut();
            err = error;
            if (error) {
                console.error('Supabase global signout failed:', error.message);
                // Fallback to clear the local session if the server request fails (common with OAuth)
                await supabase.auth.signOut({ scope: 'local' });
            }
        } catch (e) {
            console.error('Unexpected error during signout:', e);
            // Supreme fallback: clear anything that looks like a supabase token from localStorage
            for (const key in localStorage) {
                if (key.startsWith('sb-')) {
                    localStorage.removeItem(key);
                }
            }
        } finally {
            // 1. Force state reset immediately so UI responds (Navbar disappears, etc.)
            setSession(null);
            setUser(null);
            setRole(null);
            setProfileName(null);
            setIsLoading(false);

            // 2. If the URL still has an OAuth hash (access_token), clear it so it doesn't auto-login again
            if (window.location.hash.includes('access_token')) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        }
        return { error: err };
    };

    // Note: Other signIn methods (Email/Password, Phone OTP) are typically called directly
    // from the respective form components using the supabase client, but the session state 
    // update will automatically be caught by the onAuthStateChange listener here.

    const value = {
        session,
        user,
        role,
        profileName,
        isLoading,
        signInWithOAuth,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
