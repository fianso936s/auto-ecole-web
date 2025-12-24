import { useState, useEffect } from "react";
import api from "../lib/api";

export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface User {
  id: string;
  email: string;
  role: Role;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

export function useMe() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const data = await api.getMe();
        // Le backend retourne { user: {...} }
        setUser(data.user || data);
      } catch (err: any) {
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  return { user, loading, error, isAuthenticated: !!user };
}
