import { fetchJson } from "./fetch";

export const authApi = {
  me: () => fetchJson<any>("/auth/me"),
  login: (data: any) =>
    fetchJson<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  register: (data: any) =>
    fetchJson<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () =>
    fetchJson<any>("/auth/logout", {
      method: "POST",
    }),
};

