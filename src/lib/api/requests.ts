import { fetchJson } from "./fetch";

export const requestsApi = {
  createRequest: (data: any) =>
    fetchJson<any>("/lesson-requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  listRequests: (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    return fetchJson<any[]>(`/lesson-requests?${params.toString()}`);
  },
  accept: (id: string) =>
    fetchJson<any>(`/lesson-requests/${id}/accept`, {
      method: "POST",
    }),
  reject: (id: string, reason: string) =>
    fetchJson<any>(`/lesson-requests/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};

