import { fetchJson } from "./fetch";

export const instructorsApi = {
  list: (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    return fetchJson<any[]>(`/instructors?${params.toString()}`);
  },
  create: (data: any) =>
    fetchJson<any>("/instructors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  read: (id: string) => fetchJson<any>(`/instructors/${id}`),
  update: (id: string, data: any) =>
    fetchJson<any>(`/instructors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  availability: (id: string) => fetchJson<any>(`/instructors/${id}/availability`),
};

