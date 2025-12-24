import { fetchJson } from "./fetch";

export const billingApi = {
  createCheckout: (preRegistrationId: string) =>
    fetchJson<any>("/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ preRegistrationId, type: "DEPOSIT" }),
    }),
};

