import { fetchJson } from "./fetch";

export const offersApi = {
  list: () => fetchJson<any[]>("/offers"),
  get: (slug: string) => fetchJson<any>(`/offers/${slug}`),
};

