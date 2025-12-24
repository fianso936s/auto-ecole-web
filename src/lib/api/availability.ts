import { fetchJson } from "./fetch";

export const availabilityApi = {
  getInstructorAvailability: (instructorId: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const query = params.toString();
    return fetchJson<any>(`/availability/instructors/${instructorId}${query ? `?${query}` : ""}`);
  },
  createSlot: (data: any) =>
    fetchJson<any>("/availability/slots", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSlot: (id: string, data: any) =>
    fetchJson<any>(`/availability/slots/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteSlot: (id: string) =>
    fetchJson<any>(`/availability/slots/${id}`, {
      method: "DELETE",
    }),
  createTimeOff: (data: any) =>
    fetchJson<any>("/availability/timeoff", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteTimeOff: (id: string) =>
    fetchJson<any>(`/availability/timeoff/${id}`, {
      method: "DELETE",
    }),
};

