import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import * as api from '../lib/api';

export const useAuth = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [appUser, setAppUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const users = await api.getUsers();
          const matchedUser = users.find(u => u.email === session.user.email);
          setAppUser(matchedUser || null);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const users = await api.getUsers();
          const matchedUser = users.find(u => u.email === session.user.email);
          setAppUser(matchedUser || null);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAppUser(null);
        }
      } else {
        setAppUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    appUser,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};