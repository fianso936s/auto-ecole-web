import { useState, useEffect } from "react";
import api from "../lib/api";
import { ApiError } from "../lib/api/fetch";

export type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface User {
  id: string;
  email: string;
  role: Role;
  profile?: {
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
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
        setError(null);
      } catch (err: any) {
        // Distinguer les erreurs d'authentification des erreurs réseau/temporaires
        if (err instanceof ApiError) {
          // Erreur 401 = non authentifié (normal si pas connecté)
          if (err.status === 401) {
            setUser(null);
            setError(null); // Pas d'erreur, juste pas authentifié
          } else if (err.status === 0) {
            // Erreur réseau (backend non démarré, etc.)
            setError(err);
            // Ne pas réinitialiser user si c'est juste une erreur réseau temporaire
            // pour éviter de déconnecter l'utilisateur en cas de problème réseau
          } else {
            // Autre erreur API
            setError(err);
            setUser(null);
          }
        } else {
          // Erreur inconnue
          setError(err);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  return { user, loading, error, isAuthenticated: !!user };
}
