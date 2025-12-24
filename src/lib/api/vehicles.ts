import { fetchJson } from "./fetch";

export const vehiclesApi = {
  list: (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    return fetchJson<any[]>(`/vehicles?${params.toString()}`);
  },
  create: (data: any) =>
    fetchJson<any>("/vehicles", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchJson<any>(`/vehicles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

