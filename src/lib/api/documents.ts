import { fetchJson } from "./fetch";

export const documentsApi = {
  list: () => fetchJson<any[]>("/documents"),
  upload: (formData: FormData) =>
    fetchJson<any>("/documents/upload", {
      method: "POST",
      body: formData,
    }),
  delete: (id: string) =>
    fetchJson<any>(`/documents/${id}`, {
      method: "DELETE",
    }),
};

