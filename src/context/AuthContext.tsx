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
                .from('profiles')
                .select('role, full_name')
                .eq('id', userId)
                .maybeSingle();

            if (data && !error) {
                setRole(data.role);
                setProfileName(data.full_name);
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    };

    useEffect(() => {
        // Initial session check
        const initializeAuth = async () => {
            try {
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();
                if (error) throw error;

                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                if (currentSession?.user) {
                    await fetchUserProfile(currentSession.user.id);
                }
            } catch (error) {
                console.error('Error during init session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes (Login, Logout, Token Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                try {
                    setSession(newSession);
                    setUser(newSession?.user ?? null);

                    if (newSession?.user) {
                        await fetchUserProfile(newSession.user.id);
                    } else {
                        setRole(null);
                        setProfileName(null);
                    }
                } catch (error) {
                    console.error('Error during auth state change:', error);
                } finally {
                    setIsLoading(false);
                }
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
                await supabase.auth.signOut({ scope: 'local' });
            }
        } catch (e) {
            console.error('Unexpected error during signout:', e);
            err = e instanceof Error ? e : new Error(String(e));
        } finally {
            // Supreme fallback: aggressively clear localStorage directly
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('sb-')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));

            // Check sessionStorage too
            const sessionKeysToRemove = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith('sb-')) {
                    sessionKeysToRemove.push(key);
                }
            }
            sessionKeysToRemove.forEach(k => sessionStorage.removeItem(k));

            // Force state reset
            setSession(null);
            setUser(null);
            setRole(null);
            setProfileName(null);
            setIsLoading(false);

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
