import { fetchJson } from "./fetch";

export const crmApi = {
  leads: {
    list: (filters: any = {}) => {
      const params = new URLSearchParams(filters);
      return fetchJson<any[]>(`/crm/leads?${params.toString()}`);
    },
    create: (data: any) =>
      fetchJson<any>("/crm/leads", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    read: (id: string) => fetchJson<any>(`/crm/leads/${id}`),
    update: (id: string, data: any) =>
      fetchJson<any>(`/crm/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchJson<any>(`/crm/leads/${id}`, {
        method: "DELETE",
      }),
    convert: (id: string) =>
      fetchJson<any>(`/crm/leads/${id}/convert`, {
        method: "POST",
      }),
  },
  activities: {
    list: (leadId: string) => fetchJson<any[]>(`/crm/leads/${leadId}/activities`),
    create: (leadId: string, data: any) =>
      fetchJson<any>(`/crm/leads/${leadId}/activities`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  tasks: {
    list: (filters: any = {}) => {
      const params = new URLSearchParams(filters);
      return fetchJson<any[]>(`/crm/tasks?${params.toString()}`);
    },
    create: (data: any) =>
      fetchJson<any>("/crm/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchJson<any>(`/crm/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
};

