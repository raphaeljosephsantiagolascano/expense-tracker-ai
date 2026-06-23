import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://pbdzqkssewfvwypolgph.supabase.co";
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZHpxa3NzZXdmdnd5cG9sZ3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDM1MjksImV4cCI6MjA5Nzc3OTUyOX0.nVSNm9crxFQcb7fOFdsv-QPT5h5PAKwD-SC6yxtfzfY";

type SupabaseAuthResult<T = unknown> = Promise<{
  data: T;
  error: Error | null;
}>;

export type SupabaseSession = {
  user: SupabaseUser;
};

export type SupabaseUser = {
  id: string;
  email?: string;
};

type SupabaseClient = {
  auth: {
    getSession: () => SupabaseAuthResult<{ session: SupabaseSession | null }>;
    onAuthStateChange: (
      callback: (event: string, session: SupabaseSession | null) => void,
    ) => { data: { subscription: { unsubscribe: () => void } } };
    signInWithPassword: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ error: Error | null }>;
    signUp: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ error: Error | null }>;
    resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
    startAutoRefresh: () => void;
    stopAutoRefresh: () => void;
  };
  from: (table: string) => {
    upsert: (
      rows: unknown,
      options?: unknown,
    ) => Promise<{ error: Error | null }>;
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => Promise<{
        data: Array<{ item_data: unknown }> | null;
        error: Error | null;
      }> & {
        maybeSingle: () => Promise<{
          data: { item_data: unknown } | null;
          error: Error | null;
        }>;
      };
    };
  };
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? (createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: processLock,
      },
    }) as unknown as SupabaseClient)
  : null;

if (supabase && Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
