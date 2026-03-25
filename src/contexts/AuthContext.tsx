import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "prospect";
  createdAt: string;
  createdBy?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createAccount: (data: { email: string; password: string; name: string; role: "admin" | "prospect" }) => Promise<boolean>;
  deleteAccount: (id: string) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapProfile(profile: { id: string; name: string; role: string; created_at: string; created_by?: string | null }): User {
  return {
    id: profile.id,
    name: profile.name,
    role: profile.role as "admin" | "prospect",
    email: "", // will be filled from auth.users or profiles join
    createdAt: profile.created_at,
    createdBy: profile.created_by || undefined,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Build user object from Supabase session + profile
  const buildUser = useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    if (!profile) return null;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: profile.name,
      role: profile.role as "admin" | "prospect",
      createdAt: profile.created_at,
      createdBy: profile.created_by || undefined,
    };
  }, []);

  // Load all users (profiles) for the Comptes page
  const fetchUsers = useCallback(async () => {
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (!profiles) return;

    // We need emails too — fetch from auth admin or just use profile data
    // Since we can't list auth.users from client-side, we store emails when known
    // For now, map profiles and leave email from session data
    const mapped: User[] = profiles.map((p) => ({
      ...mapProfile(p),
      email: "", // email not available from profiles table
    }));
    setUsers(mapped);
  }, []);

  // Initialize: check existing session
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!cancelled && session?.user) {
          const u = await buildUser(session.user);
          if (!cancelled) setUser(u);
        }
      } catch (err) {
        console.error("Init error:", err);
      }
      if (!cancelled) {
        await fetchUsers();
        setLoading(false);
      }
    };
    init();

    // Listen for auth changes (logout only — login handles user building itself)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setUser(null);
        }
      }
    );

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, [buildUser, fetchUsers]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Login error:", error.message);
        return false;
      }
      if (data.user) {
        const u = await buildUser(data.user);
        setUser(u);
        await fetchUsers();
      }
      return true;
    } catch (err) {
      console.error("Login exception:", err);
      return false;
    }
  }, [buildUser, fetchUsers]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const createAccount = useCallback(
    async (data: { email: string; password: string; name: string; role: "admin" | "prospect" }): Promise<boolean> => {
      // Use Supabase Auth signup — the trigger handle_new_user() creates the profile
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
          },
        },
      });

      if (error) {
        console.error("Create account error:", error.message);
        return false;
      }

      // Refresh users list
      await fetchUsers();
      return true;
    },
    [fetchUsers]
  );

  const deleteAccount = useCallback(
    async (id: string): Promise<boolean> => {
      if (id === user?.id) return false;

      // Delete profile (auth.users deletion requires service_role, handled server-side)
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) {
        console.error("Delete account error:", error.message);
        return false;
      }

      await fetchUsers();
      return true;
    },
    [user, fetchUsers]
  );

  return (
    <AuthContext.Provider
      value={{ user, users, login, logout, createAccount, deleteAccount, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
