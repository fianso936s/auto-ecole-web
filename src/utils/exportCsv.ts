import type { Prospect, Client } from "../contexts/CrmDataContext";

const SOURCE_LABELS: Record<string, string> = {
  instagram: "Instagram",
  site: "Site web",
  "bouche-a-oreille": "Bouche à oreille",
  google: "Google",
  autre: "Autre",
};

const STATUS_LABELS: Record<string, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  rdv_pris: "RDV pris",
  converti: "Converti",
  perdu: "Perdu",
};

function downloadCSV(content: string, filename: string) {
  // BOM for UTF-8 Excel compatibility
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(val: string): string {
  if (val.includes(";") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export function exportProspectsCSV(prospects: Prospect[]) {
  const headers = ["Prénom", "Nom", "Email", "Téléphone", "Source", "Statut", "Notes", "Date de création"];
  const rows = prospects.map((p) => [
    escapeCSV(p.firstName),
    escapeCSV(p.lastName),
    escapeCSV(p.email),
    escapeCSV(p.phone),
    escapeCSV(SOURCE_LABELS[p.source] || p.source),
    escapeCSV(STATUS_LABELS[p.status] || p.status),
    escapeCSV(p.notes),
    new Date(p.createdAt).toLocaleDateString("fr-FR"),
  ].join(";"));

  const csv = [headers.join(";"), ...rows].join("\n");
  const date = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `bayanail-prospects-${date}.csv`);
}

export function exportClientsCSV(clients: Client[]) {
  const headers = ["Prénom", "Nom", "Email", "Téléphone", "Total dépensé (€)", "Visites", "Dernier RDV", "Service préféré", "Notes", "Date de création"];
  const rows = clients.map((c) => [
    escapeCSV(c.firstName),
    escapeCSV(c.lastName),
    escapeCSV(c.email),
    escapeCSV(c.phone),
    String(c.totalSpent),
    String(c.visitCount),
    c.lastVisit || "",
    escapeCSV(c.preferredService),
    escapeCSV(c.notes),
    new Date(c.createdAt).toLocaleDateString("fr-FR"),
  ].join(";"));

  const csv = [headers.join(";"), ...rows].join("\n");
  const date = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `bayanail-clients-${date}.csv`);
}
