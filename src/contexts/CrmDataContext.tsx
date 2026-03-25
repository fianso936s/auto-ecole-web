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
  time?: string;
  artisan?: string;
  confirmed?: boolean;
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

export interface TimelineEntry {
  id: string;
  entityType: "prospect" | "client";
  entityId: string;
  type: "call" | "email" | "note" | "status_change" | "rdv" | "conversion";
  content: string;
  author: string;
  createdAt: string;
}

export interface AppointmentWithClient extends Appointment {
  clientName: string;
  clientId: string;
}

interface CrmDataContextType {
  prospects: Prospect[];
  clients: Client[];
  timeline: TimelineEntry[];
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
  addTimelineEntry: (entry: Omit<TimelineEntry, "id" | "createdAt">) => void;
  getTimelineForEntity: (entityType: string, entityId: string) => TimelineEntry[];
  getAllAppointments: () => AppointmentWithClient[];
  findClientByEmail: (email: string) => Client | undefined;
  findProspectByEmail: (email: string) => Prospect | undefined;
  getUnconfirmedBookingsCount: () => number;
  confirmBooking: (clientId: string, aptId: string) => void;
  createWebBooking: (data: {
    firstName: string; lastName: string; email: string; phone: string;
    service: string; date: string; time: string; amount: number; artisan: string;
  }) => void;
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
      { id: "a1", clientId: "c1", service: "Glazed Donut", date: "2026-03-20", time: "14:00", amount: 45, status: "termine", confirmed: true },
      { id: "a2", clientId: "c1", service: "French Revisitée", date: "2026-02-15", time: "10:30", amount: 50, status: "termine", confirmed: true },
      { id: "a3", clientId: "c1", service: "Glazed Donut", date: "2026-01-10", time: "11:00", amount: 45, status: "termine", confirmed: true },
      { id: "a4", clientId: "c1", service: "Chrome Nacré", date: "2025-12-05", time: "15:00", amount: 55, status: "termine", confirmed: true },
      { id: "a5", clientId: "c1", service: "Milky Nails", date: "2025-11-01", time: "09:30", amount: 40, status: "termine", confirmed: true },
      { id: "a6", clientId: "c1", service: "Glazed Donut", date: "2025-10-15", time: "14:30", amount: 45, status: "termine", confirmed: true },
      { id: "a7", clientId: "c1", service: "Cat Eye", date: "2025-10-01", time: "16:00", amount: 50, status: "termine", confirmed: true },
      { id: "a8", clientId: "c1", service: "Milky Nails", date: "2025-09-15", time: "10:00", amount: 55, status: "termine", confirmed: true },
      { id: "a-future1", clientId: "c1", service: "Glazed Donut", date: "2026-04-03", time: "14:00", artisan: "ines", amount: 45, status: "planifie", confirmed: true },
    ],
  },
  {
    id: "c2", firstName: "Inès", lastName: "Boudjema", email: "ines.b@email.com", phone: "07 20 30 40 50",
    totalSpent: 210, visitCount: 5, lastVisit: "2026-03-18", preferredService: "Cat Eye Magnétique",
    notes: "Aime les couleurs sombres", createdAt: "2025-11-20T14:00:00Z",
    appointments: [
      { id: "a9", clientId: "c2", service: "Cat Eye Magnétique", date: "2026-03-18", time: "11:00", amount: 48, status: "termine", confirmed: true },
      { id: "a10", clientId: "c2", service: "Cat Eye Magnétique", date: "2026-02-10", time: "15:30", amount: 48, status: "termine", confirmed: true },
      { id: "a11", clientId: "c2", service: "Blooming Gel", date: "2026-01-05", time: "10:00", amount: 55, status: "termine", confirmed: true },
      { id: "a12", clientId: "c2", service: "Chrome Nacré", date: "2025-12-10", time: "14:00", amount: 30, status: "termine", confirmed: true },
      { id: "a13", clientId: "c2", service: "Cat Eye Magnétique", date: "2025-11-20", time: "16:30", amount: 29, status: "termine", confirmed: true },
    ],
  },
  {
    id: "c3", firstName: "Maya", lastName: "Toure", email: "maya.t@email.com", phone: "06 30 40 50 60",
    totalSpent: 155, visitCount: 3, lastVisit: "2026-03-22", preferredService: "Blooming Gel Japonais",
    notes: "Adore les motifs floraux", createdAt: "2026-01-10T09:00:00Z",
    appointments: [
      { id: "a14", clientId: "c3", service: "Blooming Gel Japonais", date: "2026-03-22", time: "09:30", amount: 60, status: "termine", confirmed: true },
      { id: "a15", clientId: "c3", service: "Milky Nails", date: "2026-02-20", time: "14:30", amount: 40, status: "termine", confirmed: true },
      { id: "a16", clientId: "c3", service: "Blooming Gel Japonais", date: "2026-01-10", time: "11:00", amount: 55, status: "termine", confirmed: true },
    ],
  },
  {
    id: "c4", firstName: "Yasmine", lastName: "Hadj", email: "yasmine@email.com", phone: "07 40 50 60 70",
    totalSpent: 95, visitCount: 2, lastVisit: "2026-03-05", preferredService: "Milky & Jelly Nails",
    notes: "Nouvelle cliente, très satisfaite", createdAt: "2026-02-10T11:00:00Z",
    appointments: [
      { id: "a17", clientId: "c4", service: "Milky Nails", date: "2026-03-05", time: "10:30", amount: 45, status: "termine", confirmed: true },
      { id: "a18", clientId: "c4", service: "Milky Nails", date: "2026-02-10", time: "15:00", amount: 50, status: "termine", confirmed: true },
    ],
  },
  {
    id: "c5", firstName: "Camille", lastName: "Roy", email: "camille.r@email.com", phone: "06 50 60 70 80",
    totalSpent: 310, visitCount: 6, lastVisit: "2026-03-15", nextAppointment: "2026-04-01",
    preferredService: "French Revisitée", notes: "Préfère les RDV en matinée", createdAt: "2025-10-05T10:00:00Z",
    appointments: [
      { id: "a19", clientId: "c5", service: "French Revisitée", date: "2026-03-15", time: "10:00", amount: 55, status: "termine", confirmed: true },
      { id: "a20", clientId: "c5", service: "3D Nail Art", date: "2026-02-08", time: "09:30", amount: 65, status: "termine", confirmed: true },
      { id: "a21", clientId: "c5", service: "French Revisitée", date: "2026-01-12", time: "11:00", amount: 50, status: "termine", confirmed: true },
      { id: "a22", clientId: "c5", service: "Glazed Donut", date: "2025-12-01", time: "14:00", amount: 45, status: "termine", confirmed: true },
      { id: "a23", clientId: "c5", service: "French Revisitée", date: "2025-11-05", time: "10:30", amount: 50, status: "termine", confirmed: true },
      { id: "a24", clientId: "c5", service: "Milky Nails", date: "2025-10-05", time: "15:00", amount: 45, status: "termine", confirmed: true },
      { id: "a-future2", clientId: "c5", service: "French Revisitée", date: "2026-04-01", time: "10:00", artisan: "sofia", amount: 55, status: "planifie", confirmed: true },
    ],
  },
];

const DEMO_TIMELINE: TimelineEntry[] = [
  { id: "t1", entityType: "prospect", entityId: "p1", type: "note", content: "Nouveau prospect via Instagram, intéressée par le glazed donut", author: "Système", createdAt: "2026-03-20T10:00:00Z" },
  { id: "t2", entityType: "prospect", entityId: "p2", type: "call", content: "Appelée pour donner les tarifs cat eye. Intéressée, à relancer.", author: "Baya", createdAt: "2026-03-22T11:00:00Z" },
  { id: "t3", entityType: "prospect", entityId: "p2", type: "status_change", content: "Statut changé de nouveau → contacté", author: "Système", createdAt: "2026-03-22T11:05:00Z" },
  { id: "t4", entityType: "prospect", entityId: "p3", type: "rdv", content: "RDV pris pour le 28 mars - Blooming Gel", author: "Baya", createdAt: "2026-03-24T16:00:00Z" },
  { id: "t5", entityType: "prospect", entityId: "p3", type: "status_change", content: "Statut changé de contacté → rdv_pris", author: "Système", createdAt: "2026-03-24T16:01:00Z" },
  { id: "t6", entityType: "client", entityId: "c1", type: "rdv", content: "RDV Glazed Donut - 45€ terminé", author: "Système", createdAt: "2026-03-20T16:00:00Z" },
  { id: "t7", entityType: "client", entityId: "c1", type: "note", content: "Très contente du résultat, a recommandé à une amie", author: "Baya", createdAt: "2026-03-20T16:30:00Z" },
  { id: "t8", entityType: "client", entityId: "c2", type: "rdv", content: "RDV Cat Eye Magnétique - 48€ terminé", author: "Système", createdAt: "2026-03-18T13:00:00Z" },
  { id: "t9", entityType: "client", entityId: "c3", type: "rdv", content: "RDV Blooming Gel Japonais - 60€ terminé", author: "Système", createdAt: "2026-03-22T11:30:00Z" },
  { id: "t10", entityType: "prospect", entityId: "p5", type: "email", content: "DM Instagram reçu, envoi du catalogue par email", author: "Baya", createdAt: "2026-03-24T18:30:00Z" },
  { id: "t11", entityType: "prospect", entityId: "p4", type: "status_change", content: "Statut changé de contacté → perdu", author: "Système", createdAt: "2026-03-12T10:00:00Z" },
  { id: "t12", entityType: "prospect", entityId: "p4", type: "note", content: "Habite trop loin, préfère un salon plus proche de chez elle", author: "Baya", createdAt: "2026-03-12T10:05:00Z" },
];

const STATUS_LABELS: Record<string, string> = {
  nouveau: "nouveau",
  contacte: "contacté",
  rdv_pris: "RDV pris",
  converti: "converti",
  perdu: "perdu",
};

export const CrmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const d = localStorage.getItem("bayanail_prospects");
    return d ? JSON.parse(d) : DEMO_PROSPECTS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const d = localStorage.getItem("bayanail_clients");
    return d ? JSON.parse(d) : DEMO_CLIENTS;
  });

  const [timeline, setTimeline] = useState<TimelineEntry[]>(() => {
    const d = localStorage.getItem("bayanail_timeline");
    return d ? JSON.parse(d) : DEMO_TIMELINE;
  });

  useEffect(() => { localStorage.setItem("bayanail_prospects", JSON.stringify(prospects)); }, [prospects]);
  useEffect(() => { localStorage.setItem("bayanail_clients", JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem("bayanail_timeline", JSON.stringify(timeline)); }, [timeline]);

  // Timeline methods
  const addTimelineEntry = useCallback((entry: Omit<TimelineEntry, "id" | "createdAt">) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: `t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setTimeline((prev) => [...prev, newEntry]);
  }, []);

  const getTimelineForEntity = useCallback((entityType: string, entityId: string) => {
    return timeline
      .filter((t) => t.entityType === entityType && t.entityId === entityId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [timeline]);

  // Prospect methods
  const addProspect = useCallback((p: Omit<Prospect, "id" | "createdAt">) => {
    const id = `p-${Date.now()}`;
    setProspects((prev) => [...prev, { ...p, id, createdAt: new Date().toISOString() }]);
    // Auto-log timeline
    const newEntry: TimelineEntry = {
      id: `t-${Date.now()}`,
      entityType: "prospect",
      entityId: id,
      type: "note",
      content: `Nouveau prospect ajouté (source: ${p.source})`,
      author: "Système",
      createdAt: new Date().toISOString(),
    };
    setTimeline((prev) => [...prev, newEntry]);
  }, []);

  const updateProspect = useCallback((id: string, data: Partial<Prospect>) => {
    setProspects((prev) => {
      const old = prev.find((p) => p.id === id);
      if (old && data.status && data.status !== old.status) {
        // Auto-log status change
        const entry: TimelineEntry = {
          id: `t-${Date.now()}`,
          entityType: "prospect",
          entityId: id,
          type: "status_change",
          content: `Statut changé de ${STATUS_LABELS[old.status] || old.status} → ${STATUS_LABELS[data.status] || data.status}`,
          author: "Système",
          createdAt: new Date().toISOString(),
        };
        setTimeline((prev) => [...prev, entry]);
      }
      return prev.map((p) => (p.id === id ? { ...p, ...data } : p));
    });
  }, []);

  const deleteProspect = useCallback((id: string) => {
    setProspects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const convertProspect = useCallback((id: string) => {
    const prospect = prospects.find((p) => p.id === id);
    if (!prospect) return;
    const clientId = `c-${Date.now()}`;
    const newClient: Client = {
      id: clientId,
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
    // Auto-log conversion on both
    const now = new Date().toISOString();
    setTimeline((prev) => [
      ...prev,
      { id: `t-${Date.now()}-a`, entityType: "prospect" as const, entityId: id, type: "conversion" as const, content: `Prospect converti en client`, author: "Système", createdAt: now },
      { id: `t-${Date.now()}-b`, entityType: "client" as const, entityId: clientId, type: "conversion" as const, content: `Client créé depuis le prospect ${prospect.firstName} ${prospect.lastName}`, author: "Système", createdAt: now },
    ]);
  }, [prospects]);

  // Client methods
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
    const aptId = `a-${Date.now()}`;
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const newApt: Appointment = { ...apt, id: aptId, clientId };
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
    // Auto-log timeline
    const client = clients.find((c) => c.id === clientId);
    const entry: TimelineEntry = {
      id: `t-${Date.now()}`,
      entityType: "client",
      entityId: clientId,
      type: "rdv",
      content: `RDV ${apt.service} - ${apt.amount}€ (${apt.status === "termine" ? "terminé" : apt.status === "planifie" ? "planifié" : "annulé"})${apt.date ? ` le ${apt.date}` : ""}${apt.time ? ` à ${apt.time}` : ""}`,
      author: "Système",
      createdAt: new Date().toISOString(),
    };
    setTimeline((prev) => [...prev, entry]);
  }, [clients]);

  const updateAppointment = useCallback((clientId: string, aptId: string, data: Partial<Appointment>) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const oldApt = c.appointments.find((a) => a.id === aptId);
        const updatedApts = c.appointments.map((a) => (a.id === aptId ? { ...a, ...data } : a));
        const totalSpent = updatedApts.filter((a) => a.status === "termine").reduce((sum, a) => sum + a.amount, 0);
        const visitCount = updatedApts.filter((a) => a.status === "termine").length;

        // Auto-log status change
        if (oldApt && data.status && data.status !== oldApt.status) {
          const statusLabel = data.status === "termine" ? "terminé" : data.status === "annule" ? "annulé" : "planifié";
          const entry: TimelineEntry = {
            id: `t-${Date.now()}`,
            entityType: "client",
            entityId: clientId,
            type: "rdv",
            content: `RDV ${oldApt.service} marqué comme ${statusLabel}`,
            author: "Système",
            createdAt: new Date().toISOString(),
          };
          setTimeline((prev) => [...prev, entry]);
        }

        return { ...c, appointments: updatedApts, totalSpent, visitCount };
      })
    );
  }, []);

  // Lookup helpers
  const findClientByEmail = useCallback((email: string) => {
    return clients.find((c) => c.email.toLowerCase() === email.toLowerCase());
  }, [clients]);

  const findProspectByEmail = useCallback((email: string) => {
    return prospects.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }, [prospects]);

  // Agenda helpers
  const getAllAppointments = useCallback((): AppointmentWithClient[] => {
    const result: AppointmentWithClient[] = [];
    clients.forEach((c) => {
      c.appointments.forEach((apt) => {
        result.push({
          ...apt,
          clientName: `${c.firstName} ${c.lastName}`,
          clientId: c.id,
        });
      });
    });
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [clients]);

  const getUnconfirmedBookingsCount = useCallback(() => {
    let count = 0;
    clients.forEach((c) => {
      c.appointments.forEach((apt) => {
        if (apt.confirmed === false && apt.status === "planifie") count++;
      });
    });
    return count;
  }, [clients]);

  const confirmBooking = useCallback((clientId: string, aptId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          appointments: c.appointments.map((a) =>
            a.id === aptId ? { ...a, confirmed: true } : a
          ),
        };
      })
    );
    const entry: TimelineEntry = {
      id: `t-${Date.now()}`,
      entityType: "client",
      entityId: clientId,
      type: "rdv",
      content: "Réservation en ligne confirmée par l'admin",
      author: "Système",
      createdAt: new Date().toISOString(),
    };
    setTimeline((prev) => [...prev, entry]);
  }, []);

  // Web booking: creates prospect + client + appointment in one go
  const createWebBooking = useCallback((data: {
    firstName: string; lastName: string; email: string; phone: string;
    service: string; date: string; time: string; amount: number; artisan: string;
  }) => {
    const existingClient = clients.find((c) => c.email.toLowerCase() === data.email.toLowerCase());

    if (existingClient) {
      // Existing client → just add appointment
      const aptId = `a-web-${Date.now()}`;
      setClients((prev) =>
        prev.map((c) => {
          if (c.id !== existingClient.id) return c;
          const newApt = {
            id: aptId, clientId: c.id, service: data.service, date: data.date,
            time: data.time, amount: data.amount, status: "planifie" as const,
            artisan: data.artisan, confirmed: false,
          };
          return { ...c, appointments: [...c.appointments, newApt], nextAppointment: data.date };
        })
      );
      const entry: TimelineEntry = {
        id: `t-${Date.now()}`, entityType: "client", entityId: existingClient.id,
        type: "rdv", content: `Réservation en ligne: ${data.service} le ${data.date} à ${data.time} (en attente de confirmation)`,
        author: "Site web", createdAt: new Date().toISOString(),
      };
      setTimeline((prev) => [...prev, entry]);
    } else {
      // New visitor → create prospect + client + appointment
      const prospectId = `p-web-${Date.now()}`;
      const clientId = `c-web-${Date.now()}`;
      const aptId = `a-web-${Date.now()}`;
      const now = new Date().toISOString();

      // Create prospect
      setProspects((prev) => [...prev, {
        id: prospectId, firstName: data.firstName, lastName: data.lastName,
        email: data.email, phone: data.phone, source: "site" as const,
        status: "rdv_pris" as const,
        notes: `Réservation en ligne: ${data.service} le ${data.date} à ${data.time}`,
        createdAt: now,
      }]);

      // Create client with appointment
      setClients((prev) => [...prev, {
        id: clientId, firstName: data.firstName, lastName: data.lastName,
        email: data.email, phone: data.phone, totalSpent: 0, visitCount: 0,
        preferredService: data.service, notes: "Créé via réservation en ligne",
        createdAt: now, nextAppointment: data.date,
        appointments: [{
          id: aptId, clientId, service: data.service, date: data.date,
          time: data.time, amount: data.amount, status: "planifie" as const,
          artisan: data.artisan, confirmed: false,
        }],
      }]);

      // Timeline entries
      setTimeline((prev) => [
        ...prev,
        { id: `t-${Date.now()}-a`, entityType: "prospect" as const, entityId: prospectId, type: "note" as const, content: `Nouveau prospect via réservation en ligne`, author: "Site web", createdAt: now },
        { id: `t-${Date.now()}-b`, entityType: "client" as const, entityId: clientId, type: "rdv" as const, content: `Réservation en ligne: ${data.service} le ${data.date} à ${data.time} (en attente de confirmation)`, author: "Site web", createdAt: now },
      ]);
    }
  }, [clients]);

  // Stats
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
        prospects, clients, timeline,
        addProspect, updateProspect, deleteProspect, convertProspect,
        addClient, updateClient, deleteClient,
        addAppointment, updateAppointment,
        getMonthlyRevenue, getStats,
        addTimelineEntry, getTimelineForEntity,
        getAllAppointments, findClientByEmail, findProspectByEmail,
        getUnconfirmedBookingsCount, confirmBooking, createWebBooking,
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
