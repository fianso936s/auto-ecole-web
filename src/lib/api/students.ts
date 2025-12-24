import { fetchJson } from "./fetch";

export const studentsApi = {
  list: (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    return fetchJson<any[]>(`/students?${params.toString()}`);
  },
  create: (data: any) =>
    fetchJson<any>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  read: (id: string) => fetchJson<any>(`/students/${id}`),
  update: (id: string, data: any) =>
    fetchJson<any>(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  progress: (id: string) => fetchJson<any>(`/students/${id}/progress`),
};

