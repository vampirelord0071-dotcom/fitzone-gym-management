import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types/database';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInAsDemoOwner: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_OWNER_PROFILE: Profile = {
  id: 'usr-demo-owner',
  full_name: 'Vikram Sengupta (Gym Owner)',
  role: 'owner',
  created_at: new Date().toISOString()
};

const DEMO_AUTH_STORAGE_KEY = 'fitzone_demo_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      // 1. Check if Supabase is configured and has an active session
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            setUser(session.user);
            setIsDemoMode(false);
            // Fetch profile
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (prof && mounted) {
              setProfile(prof);
            } else if (mounted) {
              // Default fallback profile if not found
              setProfile({
                id: session.user.id,
                full_name: session.user.email?.split('@')[0] || 'Gym Owner',
                role: 'owner',
                created_at: new Date().toISOString()
              });
            }
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Error checking Supabase auth session:', err);
        }
      }

      // 2. Check for local demo session fallback
      const savedDemo = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
      if (savedDemo === 'active' && mounted) {
        setUser({ id: 'demo-owner-id', email: 'owner@fitzonegym.in' });
        setProfile(DEMO_OWNER_PROFILE);
        setIsDemoMode(true);
      }

      if (mounted) {
        setLoading(false);
      }
    }

    checkSession();

    // Listen for auth changes if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsDemoMode(false);
          const { data: prof } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          if (prof) setProfile(prof);
        } else if (!localStorage.getItem(DEMO_AUTH_STORAGE_KEY)) {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: error.message };
      }
      return {};
    }

    // Demo fallback check
    if (email === 'owner@fitzonegym.in' && password === 'fitzone2025') {
      signInAsDemoOwner();
      return {};
    }

    return { error: 'Invalid owner credentials. Use demo credentials or configure Supabase.' };
  };

  const signInAsDemoOwner = () => {
    localStorage.setItem(DEMO_AUTH_STORAGE_KEY, 'active');
    setUser({ id: 'demo-owner-id', email: 'owner@fitzonegym.in' });
    setProfile(DEMO_OWNER_PROFILE);
    setIsDemoMode(true);
  };

  const signOut = async () => {
    localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setIsDemoMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDemoMode,
        signIn,
        signInAsDemoOwner,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
