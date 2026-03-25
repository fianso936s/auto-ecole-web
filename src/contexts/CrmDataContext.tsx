import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: "instagram" | "site" | "bouche-a-oreille" | "google" | "autre";
  status: "nouveau" | "contacte" | "rdv_pris" | "converti" | "perdu";
  notes: string;
  createdAt: string;
  lastContact?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  service: string;
  date: string;
  amount: number;
  status: "planifie" | "termine" | "annule";
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalSpent: number;
  visitCount: number;
  lastVisit?: string;
  nextAppointment?: string;
  preferredService: string;
  notes: string;
  createdAt: string;
  appointments: Appointment[];
}

interface CrmDataContextType {
  prospects: Prospect[];
  clients: Client[];
  addProspect: (p: Omit<Prospect, "id" | "createdAt">) => void;
  updateProspect: (id: string, p: Partial<Prospect>) => void;
  deleteProspect: (id: string) => void;
  convertProspect: (id: string) => void;
  addClient: (c: Omit<Client, "id" | "createdAt" | "appointments" | "totalSpent" | "visitCount">) => void;
  updateClient: (id: string, c: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addAppointment: (clientId: string, apt: Omit<Appointment, "id" | "clientId">) => void;
  updateAppointment: (clientId: string, aptId: string, data: Partial<Appointment>) => void;
  getMonthlyRevenue: () => { month: string; revenue: number; clients: number }[];
  getStats: () => { totalRevenue: number; totalClients: number; totalProspects: number; conversionRate: number; avgSpend: number; appointmentsThisMonth: number };
}

const CrmDataContext = createContext<CrmDataContextType | null>(null);

// Demo data
const DEMO_PROSPECTS: Prospect[] = [
  { id: "p1", firstName: "Amira", lastName: "Benali", email: "amira@email.com", phone: "06 12 34 56 78", source: "instagram", status: "nouveau", notes: "Intéressée par glazed donut", createdAt: "2026-03-20T10:00:00Z" },
  { id: "p2", firstName: "Fatima", lastName: "Ouali", email: "fatima@email.com", phone: "06 98 76 54 32", source: "site", status: "contacte", notes: "A demandé les tarifs cat eye", createdAt: "2026-03-18T14:00:00Z", lastContact: "2026-03-22T11:00:00Z" },
  { id: "p3", firstName: "Léa", lastName: "Dupont", email: "lea@email.com", phone: "07 11 22 33 44", source: "bouche-a-oreille", status: "rdv_pris", notes: "RDV le 28 mars", createdAt: "2026-03-15T09:00:00Z", lastContact: "2026-03-24T16:00:00Z" },
  { id: "p4", firstName: "Nadia", lastName: "Khelifi", email: "nadia@email.com", phone: "06 55 44 33 22", source: "google", status: "perdu", notes: "Trop loin, préfère un salon plus proche", createdAt: "2026-03-10T12:00:00Z" },
  { id: "p5", firstName: "Chloé", lastName: "Martin", email: "chloe@email.com", phone: "07 66 77 88 99", source: "instagram", status: "nouveau", notes: "Story vue, a DM pour infos", createdAt: "2026-03-24T18:00:00Z" },
];

const DEMO_CLIENTS: Client[] = [
  {
    id: "c1", firstName: "Sarah", lastName: "Mansouri", email: "sarah.m@email.com", phone: "06 10 20 30 40",
    totalSpent: 385, visitCount: 8, lastVisit: "2026-03-20", nextAppointment: "2026-04-03",
    preferredService: "Glazed Donut", notes: "Cliente fidèle, adore les finitions nacrées", createdAt: "2025-09-15T10:00:00Z",
    appointments: [
      { id: "a1", clientId: "c1", service: "Glazed Donut", date: "2026-03-20", amount: 45, status: "termine" },
      { id: "a2", clientId: "c1", service: "French Revisitée", date: "2026-02-15", amount: 50, status: "termine" },
      { id: "a3", clientId: "c1", service: "Glazed Donut", date: "2026-01-10", amount: 45, status: "termine" },
      { id: "a4", clientId: "c1", service: "Chrome Nacré", date: "2025-12-05", amount: 55, status: "termine" },
      { id: "a5", clientId: "c1", service: "Milky Nails", date: "2025-11-01", amount: 40, status: "termine" },
      { id: "a6", clientId: "c1", service: "Glazed Donut", date: "2025-10-15", amount: 45, status: "termine" },
      { id: "a7", clientId: "c1", service: "Cat Eye", date: "2025-10-01", amount: 50, status: "termine" },
      { id: "a8", clientId: "c1", service: "Milky Nails", date: "2025-09-15", amount: 55, status: "termine" },
    ],
  },
  {
    id: "c2", firstName: "Inès", lastName: "Boudjema", email: "ines.b@email.com", phone: "07 20 30 40 50",
    totalSpent: 210, visitCount: 5, lastVisit: "2026-03-18", preferredService: "Cat Eye Magnétique",
    notes: "Aime les couleurs sombres", createdAt: "2025-11-20T14:00:00Z",
    appointments: [
      { id: "a9", clientId: "c2", service: "Cat Eye Magnétique", date: "2026-03-18", amount: 48, status: "termine" },
      { id: "a10", clientId: "c2", service: "Cat Eye Magnétique", date: "2026-02-10", amount: 48, status: "termine" },
      { id: "a11", clientId: "c2", service: "Blooming Gel", date: "2026-01-05", amount: 55, status: "termine" },
      { id: "a12", clientId: "c2", service: "Chrome Nacré", date: "2025-12-10", amount: 30, status: "termine" },
      { id: "a13", clientId: "c2", service: "Cat Eye Magnétique", date: "2025-11-20", amount: 29, status: "termine" },
    ],
  },
  {
    id: "c3", firstName: "Maya", lastName: "Toure", email: "maya.t@email.com", phone: "06 30 40 50 60",
    totalSpent: 155, visitCount: 3, lastVisit: "2026-03-22", preferredService: "Blooming Gel Japonais",
    notes: "Adore les motifs floraux", createdAt: "2026-01-10T09:00:00Z",
    appointments: [
      { id: "a14", clientId: "c3", service: "Blooming Gel Japonais", date: "2026-03-22", amount: 60, status: "termine" },
      { id: "a15", clientId: "c3", service: "Milky Nails", date: "2026-02-20", amount: 40, status: "termine" },
      { id: "a16", clientId: "c3", service: "Blooming Gel Japonais", date: "2026-01-10", amount: 55, status: "termine" },
    ],
  },
  {
    id: "c4", firstName: "Yasmine", lastName: "Hadj", email: "yasmine@email.com", phone: "07 40 50 60 70",
    totalSpent: 95, visitCount: 2, lastVisit: "2026-03-05", preferredService: "Milky & Jelly Nails",
    notes: "Nouvelle cliente, très satisfaite", createdAt: "2026-02-10T11:00:00Z",
    appointments: [
      { id: "a17", clientId: "c4", service: "Milky Nails", date: "2026-03-05", amount: 45, status: "termine" },
      { id: "a18", clientId: "c4", service: "Milky Nails", date: "2026-02-10", amount: 50, status: "termine" },
    ],
  },
  {
    id: "c5", firstName: "Camille", lastName: "Roy", email: "camille.r@email.com", phone: "06 50 60 70 80",
    totalSpent: 310, visitCount: 6, lastVisit: "2026-03-15", nextAppointment: "2026-04-01",
    preferredService: "French Revisitée", notes: "Préfère les RDV en matinée", createdAt: "2025-10-05T10:00:00Z",
    appointments: [
      { id: "a19", clientId: "c5", service: "French Revisitée", date: "2026-03-15", amount: 55, status: "termine" },
      { id: "a20", clientId: "c5", service: "3D Nail Art", date: "2026-02-08", amount: 65, status: "termine" },
      { id: "a21", clientId: "c5", service: "French Revisitée", date: "2026-01-12", amount: 50, status: "termine" },
      { id: "a22", clientId: "c5", service: "Glazed Donut", date: "2025-12-01", amount: 45, status: "termine" },
      { id: "a23", clientId: "c5", service: "French Revisitée", date: "2025-11-05", amount: 50, status: "termine" },
      { id: "a24", clientId: "c5", service: "Milky Nails", date: "2025-10-05", amount: 45, status: "termine" },
    ],
  },
];

export const CrmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const d = localStorage.getItem("bayanail_prospects");
    return d ? JSON.parse(d) : DEMO_PROSPECTS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const d = localStorage.getItem("bayanail_clients");
    return d ? JSON.parse(d) : DEMO_CLIENTS;
  });

  useEffect(() => { localStorage.setItem("bayanail_prospects", JSON.stringify(prospects)); }, [prospects]);
  useEffect(() => { localStorage.setItem("bayanail_clients", JSON.stringify(clients)); }, [clients]);

  const addProspect = useCallback((p: Omit<Prospect, "id" | "createdAt">) => {
    setProspects((prev) => [...prev, { ...p, id: `p-${Date.now()}`, createdAt: new Date().toISOString() }]);
  }, []);

  const updateProspect = useCallback((id: string, data: Partial<Prospect>) => {
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deleteProspect = useCallback((id: string) => {
    setProspects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const convertProspect = useCallback((id: string) => {
    const prospect = prospects.find((p) => p.id === id);
    if (!prospect) return;
    const newClient: Client = {
      id: `c-${Date.now()}`,
      firstName: prospect.firstName,
      lastName: prospect.lastName,
      email: prospect.email,
      phone: prospect.phone,
      totalSpent: 0,
      visitCount: 0,
      preferredService: "",
      notes: prospect.notes,
      createdAt: new Date().toISOString(),
      appointments: [],
    };
    setClients((prev) => [...prev, newClient]);
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, status: "converti" as const } : p)));
  }, [prospects]);

  const addClient = useCallback((c: Omit<Client, "id" | "createdAt" | "appointments" | "totalSpent" | "visitCount">) => {
    setClients((prev) => [...prev, { ...c, id: `c-${Date.now()}`, createdAt: new Date().toISOString(), appointments: [], totalSpent: 0, visitCount: 0 }]);
  }, []);

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addAppointment = useCallback((clientId: string, apt: Omit<Appointment, "id" | "clientId">) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const newApt: Appointment = { ...apt, id: `a-${Date.now()}`, clientId };
        const updated = { ...c, appointments: [...c.appointments, newApt] };
        if (apt.status === "termine") {
          updated.totalSpent = c.totalSpent + apt.amount;
          updated.visitCount = c.visitCount + 1;
          updated.lastVisit = apt.date;
        }
        if (apt.status === "planifie") {
          updated.nextAppointment = apt.date;
        }
        return updated;
      })
    );
  }, []);

  const updateAppointment = useCallback((clientId: string, aptId: string, data: Partial<Appointment>) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const updatedApts = c.appointments.map((a) => (a.id === aptId ? { ...a, ...data } : a));
        const totalSpent = updatedApts.filter((a) => a.status === "termine").reduce((sum, a) => sum + a.amount, 0);
        const visitCount = updatedApts.filter((a) => a.status === "termine").length;
        return { ...c, appointments: updatedApts, totalSpent, visitCount };
      })
    );
  }, []);

  const getMonthlyRevenue = useCallback(() => {
    const months: Record<string, { revenue: number; clients: Set<string> }> = {};
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = { revenue: 0, clients: new Set() };
    }

    clients.forEach((c) => {
      c.appointments.forEach((a) => {
        if (a.status === "termine") {
          const key = a.date.substring(0, 7);
          if (months[key]) {
            months[key].revenue += a.amount;
            months[key].clients.add(c.id);
          }
        }
      });
    });

    return Object.entries(months).map(([key, val]) => {
      const [, m] = key.split("-");
      return { month: monthNames[parseInt(m) - 1], revenue: val.revenue, clients: val.clients.size };
    });
  }, [clients]);

  const getStats = useCallback(() => {
    const totalRevenue = clients.reduce((s, c) => s + c.totalSpent, 0);
    const totalClients = clients.length;
    const totalProspects = prospects.filter((p) => p.status !== "converti" && p.status !== "perdu").length;
    const converted = prospects.filter((p) => p.status === "converti").length;
    const conversionRate = prospects.length > 0 ? Math.round((converted / prospects.length) * 100) : 0;
    const avgSpend = totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0;

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const appointmentsThisMonth = clients.reduce(
      (count, c) => count + c.appointments.filter((a) => a.date.startsWith(thisMonth) && a.status === "termine").length,
      0
    );

    return { totalRevenue, totalClients, totalProspects, conversionRate, avgSpend, appointmentsThisMonth };
  }, [clients, prospects]);

  return (
    <CrmDataContext.Provider
      value={{
        prospects, clients,
        addProspect, updateProspect, deleteProspect, convertProspect,
        addClient, updateClient, deleteClient,
        addAppointment, updateAppointment,
        getMonthlyRevenue, getStats,
      }}
    >
      {children}
    </CrmDataContext.Provider>
  );
};

export const useCrmData = () => {
  const ctx = useContext(CrmDataContext);
  if (!ctx) throw new Error("useCrmData must be used within CrmDataProvider");
  return ctx;
};
