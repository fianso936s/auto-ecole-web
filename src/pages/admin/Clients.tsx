import React, { useState } from "react";
import {
  Plus, Search, MoreHorizontal, Phone, Mail, Calendar, DollarSign,
  Trash2, Edit3, X, Check, Eye, ChevronDown, ChevronUp, Download, FileText,
} from "lucide-react";
import { useCrmData } from "../../contexts/CrmDataContext";
import type { Client, Appointment } from "../../contexts/CrmDataContext";
import Timeline from "../../components/admin/Timeline";
import { exportClientsCSV } from "../../utils/exportCsv";
import { printReport } from "../../utils/exportPdf";

const SERVICES = [
  "Milky & Jelly Nails", "Cat Eye Magnétique", "Blooming Gel Japonais",
  "Glazed Donut", "French Revisitée", "Chrome Nacré Soft", "Nail Art 3D Miniature",
];

const emptyClientForm = {
  firstName: "", lastName: "", email: "", phone: "",
  preferredService: "", notes: "",
};

const emptyAptForm = {
  service: SERVICES[0], date: "", amount: 0, status: "planifie" as Appointment["status"],
};

const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, addAppointment, updateAppointment } = useCrmData();
  const [search, setSearch] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAptForm, setShowAptForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [clientForm, setClientForm] = useState(emptyClientForm);
  const [aptForm, setAptForm] = useState(emptyAptForm);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = clients
    .filter((c) => {
      const q = search.toLowerCase();
      return !q || `${c.firstName} ${c.lastName} ${c.email} ${c.phone} ${c.preferredService}`.toLowerCase().includes(q);
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);

  const openAddClient = () => {
    setClientForm(emptyClientForm);
    setEditingId(null);
    setShowClientForm(true);
  };

  const openEditClient = (c: Client) => {
    setClientForm({
      firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone,
      preferredService: c.preferredService, notes: c.notes,
    });
    setEditingId(c.id);
    setShowClientForm(true);
    setMenuOpen(null);
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateClient(editingId, clientForm);
    } else {
      await addClient(clientForm);
    }
    setShowClientForm(false);
    setEditingId(null);
  };

  const openAddApt = (clientId: string) => {
    setSelectedClient(clientId);
    setAptForm(emptyAptForm);
    setShowAptForm(true);
    setMenuOpen(null);
  };

  const handleAptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient) {
      await addAppointment(selectedClient, aptForm);
    }
    setShowAptForm(false);
    setSelectedClient(null);
  };

  const markAptDone = async (clientId: string, aptId: string) => {
    await updateAppointment(clientId, aptId, { status: "termine" });
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Supprimer ce client et tout son historique ?")) {
      await deleteClient(id);
      setMenuOpen(null);
    }
  };

  const handleExportCSV = () => {
    exportClientsCSV(filtered);
  };

  const handlePrintPDF = () => {
    const totalCA = filtered.reduce((s, c) => s + c.totalSpent, 0);
    const avgSpend = filtered.length > 0 ? Math.round(totalCA / filtered.length) : 0;
    printReport({
      title: "Liste des Clients",
      subtitle: `${filtered.length} clients`,
      stats: [
        { label: "Clients", value: filtered.length },
        { label: "CA Total", value: `${totalCA}€` },
        { label: "Panier moyen", value: `${avgSpend}€` },
        { label: "Total visites", value: filtered.reduce((s, c) => s + c.visitCount, 0) },
      ],
      columns: ["Prénom", "Nom", "Email", "Téléphone", "Total dépensé", "Visites", "Service préféré"],
      rows: filtered.map((c) => [
        c.firstName, c.lastName, c.email, c.phone,
        `${c.totalSpent}€`, String(c.visitCount), c.preferredService || "—",
      ]),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500">{clients.length} clients &bull; CA total : {clients.reduce((s, c) => s + c.totalSpent, 0)}€</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            title="Exporter en CSV"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            title="Imprimer PDF"
          >
            <FileText className="h-4 w-4" /> PDF
          </button>
          <button onClick={openAddClient}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-dark px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a06868]">
            <Plus className="h-4 w-4" /> Nouveau client
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-nude focus:ring-2 focus:ring-rose-light" />
      </div>

      {/* Clients List */}
      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {/* Client row */}
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-light text-sm font-bold text-rose-dark">
                {c.firstName[0]}{c.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{c.firstName} {c.lastName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>
                </div>
              </div>
              <div className="hidden gap-6 sm:flex">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{c.totalSpent}€</p>
                  <p className="text-xs text-gray-400">Total dépensé</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{c.visitCount}</p>
                  <p className="text-xs text-gray-400">Visites</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-rose-dark">{c.preferredService || "—"}</p>
                  <p className="text-xs text-gray-400">Service préféré</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setExpandedClient(expandedClient === c.id ? null : c.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  {expandedClient === c.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <div className="relative">
                  <button onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {menuOpen === c.id && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                      <button onClick={() => openEditClient(c)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Edit3 className="h-4 w-4" /> Modifier
                      </button>
                      <button onClick={() => openAddApt(c.id)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50">
                        <Calendar className="h-4 w-4" /> Ajouter un RDV
                      </button>
                      <button onClick={() => handleDeleteClient(c.id)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded: appointments + timeline */}
            {expandedClient === c.id && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">Historique des rendez-vous</h4>
                  <button onClick={() => openAddApt(c.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-[#a06868]">
                    <Plus className="h-3 w-3" /> RDV
                  </button>
                </div>
                {c.notes && (
                  <p className="mb-3 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                    <strong>Notes :</strong> {c.notes}
                  </p>
                )}
                {c.nextAppointment && (
                  <p className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                    <Calendar className="mr-1 inline h-3 w-3" /> Prochain RDV : <strong>{c.nextAppointment}</strong>
                  </p>
                )}
                <div className="space-y-2">
                  {c.appointments
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((apt) => (
                      <div key={apt.id} className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm">
                        <span className={`h-2 w-2 rounded-full ${
                          apt.status === "termine" ? "bg-green-400" : apt.status === "planifie" ? "bg-blue-400" : "bg-gray-300"
                        }`} />
                        <span className="text-xs text-gray-400 w-20">{apt.date}</span>
                        <span className="flex-1 font-medium text-gray-700">{apt.service}</span>
                        {apt.time && <span className="text-xs text-gray-400">{apt.time}</span>}
                        <span className="text-sm font-bold text-gray-900">{apt.amount}€</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          apt.status === "termine" ? "bg-green-100 text-green-700"
                            : apt.status === "planifie" ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {apt.status === "termine" ? "Terminé" : apt.status === "planifie" ? "Planifié" : "Annulé"}
                        </span>
                        {apt.confirmed === false && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">En attente</span>
                        )}
                        {apt.status === "planifie" && (
                          <button onClick={() => markAptDone(c.id, apt.id)}
                            className="rounded p-1 text-green-500 hover:bg-green-50" title="Marquer terminé">
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  {c.appointments.length === 0 && (
                    <p className="py-4 text-center text-xs text-gray-400">Aucun rendez-vous enregistré</p>
                  )}
                </div>

                {/* Timeline / Journal d'activité */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700">Journal d'activité</h4>
                  <Timeline entityType="client" entityId={c.id} />
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white py-12 text-center text-sm text-gray-400 shadow-sm">
            Aucun client trouvé
          </div>
        )}
      </div>

      {/* Client Form Modal */}
      {showClientForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? "Modifier le client" : "Nouveau client"}</h2>
              <button onClick={() => setShowClientForm(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Prénom</label>
                  <input required value={clientForm.firstName} onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
                  <input required value={clientForm.lastName} onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" required value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Téléphone</label>
                  <input required value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Service préféré</label>
                <select value={clientForm.preferredService} onChange={(e) => setClientForm({ ...clientForm, preferredService: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude">
                  <option value="">Aucun</option>
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                <textarea rows={3} value={clientForm.notes} onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowClientForm(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
                <button type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-dark px-4 py-2 text-sm font-medium text-white hover:bg-[#a06868]">
                  <Check className="h-4 w-4" /> {editingId ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Form Modal */}
      {showAptForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Nouveau rendez-vous</h2>
              <button onClick={() => setShowAptForm(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAptSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Service</label>
                <select value={aptForm.service} onChange={(e) => setAptForm({ ...aptForm, service: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude">
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" required value={aptForm.date} onChange={(e) => setAptForm({ ...aptForm, date: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Montant (€)</label>
                  <input type="number" required min={0} value={aptForm.amount || ""} onChange={(e) => setAptForm({ ...aptForm, amount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Statut</label>
                <select value={aptForm.status} onChange={(e) => setAptForm({ ...aptForm, status: e.target.value as Appointment["status"] })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude">
                  <option value="planifie">Planifié</option>
                  <option value="termine">Terminé</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAptForm(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
                <button type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-dark px-4 py-2 text-sm font-medium text-white hover:bg-[#a06868]">
                  <Check className="h-4 w-4" /> Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
