import React, { createContext, useContext, useEffect, useState } from "react";

import {
  isSupabaseConfigured,
  supabase,
  SupabaseSession,
  SupabaseUser,
} from "@/services/supabaseService";

type AuthContextType = {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  loading: boolean;
  error: string;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      setSession(data.session);
      setError(sessionError?.message ?? "");
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const runAuthAction = async (action: () => Promise<{ error: Error | null }>) => {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await action();

      if (result.error) {
        setError(result.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await runAuthAction(() =>
      supabase!.auth.signInWithPassword({ email, password }),
    );
  };

  const register = async (email: string, password: string) => {
    await runAuthAction(() => supabase!.auth.signUp({ email, password }));
  };

  const forgotPassword = async (email: string) => {
    await runAuthAction(() => supabase!.auth.resetPasswordForEmail(email));
  };

  const logout = async () => {
    await runAuthAction(() => supabase!.auth.signOut());
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        error,
        isConfigured: isSupabaseConfigured,
        login,
        register,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
