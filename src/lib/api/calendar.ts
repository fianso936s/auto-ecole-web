import { fetchJson } from "./fetch";

export const calendarApi = {
  getEvents: (from: string, to: string, filters: any = {}) => {
    const params = new URLSearchParams({ from, to, ...filters });
    return fetchJson<any[]>(`/calendar/events?${params.toString()}`);
  },
};

