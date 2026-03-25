import React, { useState } from "react";
import {
  Plus, Search, Filter, MoreHorizontal, Phone, Mail, ArrowUpRight,
  Trash2, Edit3, X, Check,
} from "lucide-react";
import { useCrmData, Prospect } from "../../contexts/CrmDataContext";

const STATUS_CONFIG = {
  nouveau: { label: "Nouveau", color: "bg-blue-100 text-blue-700" },
  contacte: { label: "Contacté", color: "bg-yellow-100 text-yellow-700" },
  rdv_pris: { label: "RDV pris", color: "bg-purple-100 text-purple-700" },
  converti: { label: "Converti", color: "bg-green-100 text-green-700" },
  perdu: { label: "Perdu", color: "bg-gray-100 text-gray-500" },
};

const SOURCE_LABELS: Record<string, string> = {
  instagram: "Instagram",
  site: "Site web",
  "bouche-a-oreille": "Bouche à oreille",
  google: "Google",
  autre: "Autre",
};

const emptyForm = {
  firstName: "", lastName: "", email: "", phone: "",
  source: "instagram" as Prospect["source"],
  status: "nouveau" as Prospect["status"],
  notes: "",
};

const Prospects: React.FC = () => {
  const { prospects, addProspect, updateProspect, deleteProspect, convertProspect } = useCrmData();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = prospects
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || `${p.firstName} ${p.lastName} ${p.email} ${p.phone}`.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p: Prospect) => {
    setForm({
      firstName: p.firstName, lastName: p.lastName, email: p.email, phone: p.phone,
      source: p.source, status: p.status, notes: p.notes,
    });
    setEditingId(p.id);
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProspect(editingId, form);
    } else {
      addProspect(form);
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce prospect ?")) {
      deleteProspect(id);
      setMenuOpen(null);
    }
  };

  const handleConvert = (id: string) => {
    if (confirm("Convertir ce prospect en client ?")) {
      convertProspect(id);
      setMenuOpen(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prospects</h1>
          <p className="text-sm text-gray-500">{prospects.length} prospects au total</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-dark px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a06868]"
        >
          <Plus className="h-4 w-4" /> Nouveau prospect
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un prospect..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-nude focus:ring-2 focus:ring-rose-light"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none rounded-lg border border-gray-200 py-2.5 pl-10 pr-8 text-sm outline-none focus:border-rose-nude"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => {
          const count = prospects.filter((p) => p.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filterStatus === key ? color + " ring-2 ring-offset-1" : color + " opacity-70 hover:opacity-100"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Prospect</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Source</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr key={p.id} className="transition hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600">
                      {p.firstName[0]}{p.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.firstName} {p.lastName}</p>
                      {p.notes && <p className="max-w-[200px] truncate text-xs text-gray-400">{p.notes}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500"><Mail className="h-3 w-3" /> {p.email}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500"><Phone className="h-3 w-3" /> {p.phone}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{SOURCE_LABELS[p.source]}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CONFIG[p.status].color}`}>
                    {STATUS_CONFIG[p.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {menuOpen === p.id && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                        <button onClick={() => openEdit(p)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Edit3 className="h-4 w-4" /> Modifier
                        </button>
                        {p.status !== "converti" && (
                          <button onClick={() => handleConvert(p.id)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50">
                            <ArrowUpRight className="h-4 w-4" /> Convertir en client
                          </button>
                        )}
                        <button onClick={() => handleDelete(p.id)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                  Aucun prospect trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Modifier le prospect" : "Nouveau prospect"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Prénom</label>
                  <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
                  <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Téléphone</label>
                  <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Source</label>
                  <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as Prospect["source"] })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude">
                    <option value="instagram">Instagram</option>
                    <option value="site">Site web</option>
                    <option value="bouche-a-oreille">Bouche à oreille</option>
                    <option value="google">Google</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Statut</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Prospect["status"] })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude">
                    {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-dark px-4 py-2 text-sm font-medium text-white hover:bg-[#a06868]">
                  <Check className="h-4 w-4" /> {editingId ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prospects;
