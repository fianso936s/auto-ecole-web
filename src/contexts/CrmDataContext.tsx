import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

// ─── Interfaces ───────────────────────────────────
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
  loading: boolean;
  addProspect: (p: Omit<Prospect, "id" | "createdAt">) => Promise<void>;
  updateProspect: (id: string, p: Partial<Prospect>) => Promise<void>;
  deleteProspect: (id: string) => Promise<void>;
  convertProspect: (id: string) => Promise<void>;
  addClient: (c: Omit<Client, "id" | "createdAt" | "appointments" | "totalSpent" | "visitCount">) => Promise<void>;
  updateClient: (id: string, c: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addAppointment: (clientId: string, apt: Omit<Appointment, "id" | "clientId">) => Promise<void>;
  updateAppointment: (clientId: string, aptId: string, data: Partial<Appointment>) => Promise<void>;
  getMonthlyRevenue: () => { month: string; revenue: number; clients: number }[];
  getStats: () => { totalRevenue: number; totalClients: number; totalProspects: number; conversionRate: number; avgSpend: number; appointmentsThisMonth: number };
  addTimelineEntry: (entry: Omit<TimelineEntry, "id" | "createdAt">) => Promise<void>;
  getTimelineForEntity: (entityType: string, entityId: string) => TimelineEntry[];
  getAllAppointments: () => AppointmentWithClient[];
  findClientByEmail: (email: string) => Client | undefined;
  findProspectByEmail: (email: string) => Prospect | undefined;
  getUnconfirmedBookingsCount: () => number;
  confirmBooking: (clientId: string, aptId: string) => Promise<void>;
  createWebBooking: (data: {
    firstName: string; lastName: string; email: string; phone: string;
    service: string; date: string; time: string; amount: number; artisan: string;
  }) => Promise<void>;
}

const CrmDataContext = createContext<CrmDataContextType | null>(null);

const STATUS_LABELS: Record<string, string> = {
  nouveau: "nouveau",
  contacte: "contacté",
  rdv_pris: "RDV pris",
  converti: "converti",
  perdu: "perdu",
};

// ─── Supabase row mappers ───────────────────────────
function mapProspectRow(row: Record<string, unknown>): Prospect {
  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: row.email as string,
    phone: row.phone as string,
    source: row.source as Prospect["source"],
    status: row.status as Prospect["status"],
    notes: (row.notes as string) || "",
    createdAt: row.created_at as string,
    lastContact: (row.last_contact as string) || undefined,
  };
}

function mapAppointmentRow(row: Record<string, unknown>): Appointment {
  return {
    id: row.id as string,
    clientId: row.client_id as string,
    service: row.service as string,
    date: row.date as string,
    amount: Number(row.amount),
    status: row.status as Appointment["status"],
    time: (row.time as string) || undefined,
    artisan: (row.artisan as string) || undefined,
    confirmed: row.confirmed as boolean | undefined,
  };
}

function mapClientRow(row: Record<string, unknown>, appointments: Appointment[]): Client {
  const clientApts = appointments.filter((a) => a.clientId === (row.id as string));
  const completedApts = clientApts.filter((a) => a.status === "termine");
  const totalSpent = completedApts.reduce((sum, a) => sum + a.amount, 0);
  const visitCount = completedApts.length;
  const lastVisit = completedApts.sort((a, b) => b.date.localeCompare(a.date))[0]?.date;
  const nextApt = clientApts
    .filter((a) => a.status === "planifie")
    .sort((a, b) => a.date.localeCompare(b.date))[0]?.date;

  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: row.email as string,
    phone: row.phone as string,
    preferredService: (row.preferred_service as string) || "",
    notes: (row.notes as string) || "",
    createdAt: row.created_at as string,
    totalSpent,
    visitCount,
    lastVisit,
    nextAppointment: nextApt,
    appointments: clientApts,
  };
}

function mapTimelineRow(row: Record<string, unknown>): TimelineEntry {
  return {
    id: row.id as string,
    entityType: row.entity_type as TimelineEntry["entityType"],
    entityId: row.entity_id as string,
    type: row.type as TimelineEntry["type"],
    content: row.content as string,
    author: row.author as string,
    createdAt: row.created_at as string,
  };
}

// ─── Provider ───────────────────────────────────────
export const CrmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── Fetch all data from Supabase ─────────────────
  const fetchAll = useCallback(async () => {
    const [prospectsRes, clientsRes, appointmentsRes, timelineRes] = await Promise.all([
      supabase.from("prospects").select("*").order("created_at", { ascending: false }),
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
      supabase.from("appointments").select("*").order("date", { ascending: true }),
      supabase.from("timeline_entries").select("*").order("created_at", { ascending: false }),
    ]);

    const allAppointments = (appointmentsRes.data || []).map(mapAppointmentRow);

    setProspects((prospectsRes.data || []).map(mapProspectRow));
    setClients((clientsRes.data || []).map((row) => mapClientRow(row, allAppointments)));
    setTimeline((timelineRes.data || []).map(mapTimelineRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ─── Timeline ─────────────────────────────────────
  const addTimelineEntry = useCallback(async (entry: Omit<TimelineEntry, "id" | "createdAt">) => {
    const { data, error } = await supabase.from("timeline_entries").insert({
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      type: entry.type,
      content: entry.content,
      author: entry.author,
    }).select().single();

    if (!error && data) {
      setTimeline((prev) => [mapTimelineRow(data), ...prev]);
    }
  }, []);

  const getTimelineForEntity = useCallback((entityType: string, entityId: string) => {
    return timeline
      .filter((t) => t.entityType === entityType && t.entityId === entityId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [timeline]);

  // ─── Prospects ────────────────────────────────────
  const addProspect = useCallback(async (p: Omit<Prospect, "id" | "createdAt">) => {
    const { data, error } = await supabase.from("prospects").insert({
      first_name: p.firstName,
      last_name: p.lastName,
      email: p.email,
      phone: p.phone,
      source: p.source,
      status: p.status,
      notes: p.notes,
      last_contact: p.lastContact || null,
    }).select().single();

    if (!error && data) {
      const newProspect = mapProspectRow(data);
      setProspects((prev) => [newProspect, ...prev]);

      // Auto-log timeline
      await addTimelineEntry({
        entityType: "prospect",
        entityId: newProspect.id,
        type: "note",
        content: `Nouveau prospect ajouté (source: ${p.source})`,
        author: "Système",
      });
    }
  }, [addTimelineEntry]);

  const updateProspect = useCallback(async (id: string, data: Partial<Prospect>) => {
    const old = prospects.find((p) => p.id === id);

    const updateData: Record<string, unknown> = {};
    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.lastContact !== undefined) updateData.last_contact = data.lastContact;

    const { error } = await supabase.from("prospects").update(updateData).eq("id", id);

    if (!error) {
      setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));

      // Auto-log status change
      if (old && data.status && data.status !== old.status) {
        await addTimelineEntry({
          entityType: "prospect",
          entityId: id,
          type: "status_change",
          content: `Statut changé de ${STATUS_LABELS[old.status] || old.status} → ${STATUS_LABELS[data.status] || data.status}`,
          author: "Système",
        });
      }
    }
  }, [prospects, addTimelineEntry]);

  const deleteProspect = useCallback(async (id: string) => {
    const { error } = await supabase.from("prospects").delete().eq("id", id);
    if (!error) {
      setProspects((prev) => prev.filter((p) => p.id !== id));
    }
  }, []);

  const convertProspect = useCallback(async (id: string) => {
    const prospect = prospects.find((p) => p.id === id);
    if (!prospect) return;

    // Create client in Supabase
    const { data: clientData, error: clientError } = await supabase.from("clients").insert({
      first_name: prospect.firstName,
      last_name: prospect.lastName,
      email: prospect.email,
      phone: prospect.phone,
      preferred_service: "",
      notes: prospect.notes,
    }).select().single();

    if (clientError || !clientData) return;

    const clientId = clientData.id as string;

    // Update prospect status
    await supabase.from("prospects").update({ status: "converti" }).eq("id", id);
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, status: "converti" as const } : p)));

    // Add client to local state
    const newClient = mapClientRow(clientData, []);
    setClients((prev) => [newClient, ...prev]);

    // Auto-log conversion timeline
    await addTimelineEntry({
      entityType: "prospect",
      entityId: id,
      type: "conversion",
      content: "Prospect converti en client",
      author: "Système",
    });
    await addTimelineEntry({
      entityType: "client",
      entityId: clientId,
      type: "conversion",
      content: `Client créé depuis le prospect ${prospect.firstName} ${prospect.lastName}`,
      author: "Système",
    });
  }, [prospects, addTimelineEntry]);

  // ─── Clients ──────────────────────────────────────
  const addClient = useCallback(async (c: Omit<Client, "id" | "createdAt" | "appointments" | "totalSpent" | "visitCount">) => {
    const { data, error } = await supabase.from("clients").insert({
      first_name: c.firstName,
      last_name: c.lastName,
      email: c.email,
      phone: c.phone,
      preferred_service: c.preferredService,
      notes: c.notes,
    }).select().single();

    if (!error && data) {
      const newClient = mapClientRow(data, []);
      setClients((prev) => [newClient, ...prev]);
    }
  }, []);

  const updateClient = useCallback(async (id: string, data: Partial<Client>) => {
    const updateData: Record<string, unknown> = {};
    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.preferredService !== undefined) updateData.preferred_service = data.preferredService;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { error } = await supabase.from("clients").update(updateData).eq("id", id);

    if (!error) {
      setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (!error) {
      setClients((prev) => prev.filter((c) => c.id !== id));
    }
  }, []);

  // ─── Appointments ─────────────────────────────────
  const addAppointment = useCallback(async (clientId: string, apt: Omit<Appointment, "id" | "clientId">) => {
    const { data, error } = await supabase.from("appointments").insert({
      client_id: clientId,
      service: apt.service,
      date: apt.date,
      time: apt.time || null,
      amount: apt.amount,
      status: apt.status,
      artisan: apt.artisan || null,
      confirmed: apt.confirmed !== undefined ? apt.confirmed : true,
    }).select().single();

    if (!error && data) {
      const newApt = mapAppointmentRow(data);
      setClients((prev) =>
        prev.map((c) => {
          if (c.id !== clientId) return c;
          const updatedApts = [...c.appointments, newApt];
          const completedApts = updatedApts.filter((a) => a.status === "termine");
          return {
            ...c,
            appointments: updatedApts,
            totalSpent: completedApts.reduce((s, a) => s + a.amount, 0),
            visitCount: completedApts.length,
            lastVisit: completedApts.sort((a, b) => b.date.localeCompare(a.date))[0]?.date || c.lastVisit,
            nextAppointment: apt.status === "planifie" ? apt.date : c.nextAppointment,
          };
        })
      );

      // Auto-log timeline
      await addTimelineEntry({
        entityType: "client",
        entityId: clientId,
        type: "rdv",
        content: `RDV ${apt.service} - ${apt.amount}€ (${apt.status === "termine" ? "terminé" : apt.status === "planifie" ? "planifié" : "annulé"})${apt.date ? ` le ${apt.date}` : ""}${apt.time ? ` à ${apt.time}` : ""}`,
        author: "Système",
      });
    }
  }, [addTimelineEntry]);

  const updateAppointment = useCallback(async (clientId: string, aptId: string, data: Partial<Appointment>) => {
    const updateData: Record<string, unknown> = {};
    if (data.service !== undefined) updateData.service = data.service;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.time !== undefined) updateData.time = data.time;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.artisan !== undefined) updateData.artisan = data.artisan;
    if (data.confirmed !== undefined) updateData.confirmed = data.confirmed;

    const { error } = await supabase.from("appointments").update(updateData).eq("id", aptId);

    if (!error) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id !== clientId) return c;
          const oldApt = c.appointments.find((a) => a.id === aptId);
          const updatedApts = c.appointments.map((a) => (a.id === aptId ? { ...a, ...data } : a));
          const completedApts = updatedApts.filter((a) => a.status === "termine");

          // Auto-log status change
          if (oldApt && data.status && data.status !== oldApt.status) {
            const statusLabel = data.status === "termine" ? "terminé" : data.status === "annule" ? "annulé" : "planifié";
            addTimelineEntry({
              entityType: "client",
              entityId: clientId,
              type: "rdv",
              content: `RDV ${oldApt.service} marqué comme ${statusLabel}`,
              author: "Système",
            });
          }

          return {
            ...c,
            appointments: updatedApts,
            totalSpent: completedApts.reduce((s, a) => s + a.amount, 0),
            visitCount: completedApts.length,
          };
        })
      );
    }
  }, [addTimelineEntry]);

  // ─── Lookup helpers ───────────────────────────────
  const findClientByEmail = useCallback((email: string) => {
    return clients.find((c) => c.email.toLowerCase() === email.toLowerCase());
  }, [clients]);

  const findProspectByEmail = useCallback((email: string) => {
    return prospects.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }, [prospects]);

  // ─── Agenda helpers ───────────────────────────────
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

  const confirmBooking = useCallback(async (clientId: string, aptId: string) => {
    const { error } = await supabase.from("appointments").update({ confirmed: true }).eq("id", aptId);

    if (!error) {
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

      await addTimelineEntry({
        entityType: "client",
        entityId: clientId,
        type: "rdv",
        content: "Réservation en ligne confirmée par l'admin",
        author: "Système",
      });
    }
  }, [addTimelineEntry]);

  // ─── Web booking (public, no auth needed) ─────────
  const createWebBooking = useCallback(async (data: {
    firstName: string; lastName: string; email: string; phone: string;
    service: string; date: string; time: string; amount: number; artisan: string;
  }) => {
    // Check if client exists
    const existingClient = clients.find((c) => c.email.toLowerCase() === data.email.toLowerCase());

    if (existingClient) {
      // Add appointment to existing client
      const { data: aptData, error: aptError } = await supabase.from("appointments").insert({
        client_id: existingClient.id,
        service: data.service,
        date: data.date,
        time: data.time,
        amount: data.amount,
        status: "planifie",
        artisan: data.artisan,
        confirmed: false,
      }).select().single();

      if (!aptError && aptData) {
        const newApt = mapAppointmentRow(aptData);
        setClients((prev) =>
          prev.map((c) => {
            if (c.id !== existingClient.id) return c;
            return { ...c, appointments: [...c.appointments, newApt], nextAppointment: data.date };
          })
        );

        // Timeline
        await supabase.from("timeline_entries").insert({
          entity_type: "client",
          entity_id: existingClient.id,
          type: "rdv",
          content: `Réservation en ligne: ${data.service} le ${data.date} à ${data.time} (en attente de confirmation)`,
          author: "Site web",
        });
      }
    } else {
      // New visitor → create prospect + client + appointment

      // 1. Create prospect
      const { data: prospectData } = await supabase.from("prospects").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        source: "site",
        status: "rdv_pris",
        notes: `Réservation en ligne: ${data.service} le ${data.date} à ${data.time}`,
      }).select().single();

      // 2. Create client
      const { data: clientData } = await supabase.from("clients").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        preferred_service: data.service,
        notes: "Créé via réservation en ligne",
      }).select().single();

      if (clientData) {
        const clientId = clientData.id as string;

        // 3. Create appointment
        const { data: aptData } = await supabase.from("appointments").insert({
          client_id: clientId,
          service: data.service,
          date: data.date,
          time: data.time,
          amount: data.amount,
          status: "planifie",
          artisan: data.artisan,
          confirmed: false,
        }).select().single();

        // Update local state
        if (prospectData) {
          setProspects((prev) => [mapProspectRow(prospectData), ...prev]);
        }
        const newApt = aptData ? mapAppointmentRow(aptData) : null;
        const newClient = mapClientRow(clientData, newApt ? [newApt] : []);
        setClients((prev) => [newClient, ...prev]);

        // Timeline entries
        if (prospectData) {
          await supabase.from("timeline_entries").insert({
            entity_type: "prospect",
            entity_id: prospectData.id,
            type: "note",
            content: "Nouveau prospect via réservation en ligne",
            author: "Site web",
          });
        }
        await supabase.from("timeline_entries").insert({
          entity_type: "client",
          entity_id: clientId,
          type: "rdv",
          content: `Réservation en ligne: ${data.service} le ${data.date} à ${data.time} (en attente de confirmation)`,
          author: "Site web",
        });
      }
    }
  }, [clients]);

  // ─── Stats ────────────────────────────────────────
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
        prospects, clients, timeline, loading,
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
