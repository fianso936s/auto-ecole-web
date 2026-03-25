import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "prospect";
  createdAt: string;
  createdBy?: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  createAccount: (data: { email: string; password: string; name: string; role: "admin" | "prospect" }) => boolean;
  deleteAccount: (id: string) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_ADMIN: StoredUser = {
  id: "admin-001",
  email: "admin@bayanail.com",
  password: "admin123",
  name: "Baya Admin",
  role: "admin",
  createdAt: new Date().toISOString(),
};

function getStoredUsers(): StoredUser[] {
  const data = localStorage.getItem("bayanail_users");
  if (!data) {
    localStorage.setItem("bayanail_users", JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
  return JSON.parse(data);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const session = localStorage.getItem("bayanail_session");
    return session ? JSON.parse(session) : null;
  });

  const [storedUsers, setStoredUsers] = useState<StoredUser[]>(getStoredUsers);

  useEffect(() => {
    localStorage.setItem("bayanail_users", JSON.stringify(storedUsers));
  }, [storedUsers]);

  const login = useCallback((email: string, password: string): boolean => {
    const found = storedUsers.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem("bayanail_session", JSON.stringify(safeUser));
      return true;
    }
    return false;
  }, [storedUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("bayanail_session");
  }, []);

  const createAccount = useCallback(
    (data: { email: string; password: string; name: string; role: "admin" | "prospect" }): boolean => {
      if (storedUsers.some((u) => u.email === data.email)) return false;
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        createdAt: new Date().toISOString(),
        createdBy: user?.id,
      };
      setStoredUsers((prev) => [...prev, newUser]);
      return true;
    },
    [storedUsers, user]
  );

  const deleteAccount = useCallback(
    (id: string): boolean => {
      if (id === user?.id) return false;
      setStoredUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    },
    [user]
  );

  const users: User[] = storedUsers.map(({ password: _, ...u }) => u);

  return (
    <AuthContext.Provider value={{ user, users, login, logout, createAccount, deleteAccount, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
