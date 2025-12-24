import { fetchJson } from "./fetch";

export const contactApi = {
  send: (data: any) =>
    fetchJson<any>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

