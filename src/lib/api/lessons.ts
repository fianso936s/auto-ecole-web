import { fetchJson } from "./fetch";

export const lessonsApi = {
  list: (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    return fetchJson<any[]>(`/lessons?${params.toString()}`);
  },
  get: (id: string) => fetchJson<any>(`/lessons/${id}`),
  create: (data: any) =>
    fetchJson<any>("/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchJson<any>(`/lessons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  confirm: (id: string) =>
    fetchJson<any>(`/lessons/${id}/confirm`, {
      method: "POST",
    }),
  cancel: (id: string, reason: string) =>
    fetchJson<any>(`/lessons/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  complete: (id: string, data: any) =>
    fetchJson<any>(`/lessons/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  saveSkills: (id: string, skills: any[]) =>
    fetchJson<any>(`/lessons/${id}/skills`, {
      method: "POST",
      body: JSON.stringify({ skills }),
    }),
};

