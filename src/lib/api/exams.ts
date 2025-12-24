import { fetchJson } from "./fetch";

export const examsApi = {
  list: () => fetchJson<any[]>("/exams"),
  get: (id: string) => fetchJson<any>(`/exams/${id}`),
};

