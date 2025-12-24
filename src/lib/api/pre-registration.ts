import { fetchJson } from "./fetch";

export const preRegistrationApi = {
  createDraft: (data: { offerId: string }) =>
    fetchJson<any>("/preinscription/draft", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  submit: (id: string) =>
    fetchJson<any>("/preinscription/submit", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  get: (id: string) => fetchJson<any>(`/preinscription/${id}`),
};

