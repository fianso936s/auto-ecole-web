import React, { useState } from "react";
import { Plus, Shield, UserPlus, Trash2, X, Check, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Comptes: React.FC = () => {
  const { user, users, createAccount, deleteAccount } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as "admin" | "prospect",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    const ok = createAccount(form);
    if (ok) {
      setSuccess(`Compte ${form.role} créé pour ${form.email}`);
      setForm({ name: "", email: "", password: "", role: "admin" });
      setShowForm(false);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError("Un compte avec cet email existe déjà");
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Supprimer le compte de ${name} ?`)) {
      deleteAccount(id);
    }
  };

  const admins = users.filter((u) => u.role === "admin");
  const prospectAccounts = users.filter((u) => u.role === "prospect");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des comptes</h1>
          <p className="text-sm text-gray-500">
            Créez et gérez les comptes administrateurs et prospects
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); }}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-dark px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a06868]"
        >
          <Plus className="h-4 w-4" /> Créer un compte
        </button>
      </div>

      {success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* Admin Accounts */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-rose-dark" />
          <h2 className="text-lg font-semibold text-gray-900">Administrateurs</h2>
          <span className="rounded-full bg-rose-light px-2 py-0.5 text-xs font-medium text-rose-dark">
            {admins.length}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((u) => (
            <div
              key={u.id}
              className="relative rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              {u.id === user?.id && (
                <span className="absolute right-3 top-3 rounded-full bg-rose-light px-2 py-0.5 text-xs font-medium text-rose-dark">
                  Vous
                </span>
              )}
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-light text-lg font-bold text-rose-dark">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-semibold text-gray-900">{u.name}</p>
              <p className="text-xs text-gray-400">{u.email}</p>
              <p className="mt-1 text-xs text-gray-400">
                Créé le {new Date(u.createdAt).toLocaleDateString("fr-FR")}
              </p>
              {u.id !== user?.id && (
                <button
                  onClick={() => handleDelete(u.id, u.name)}
                  className="mt-3 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" /> Supprimer
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Prospect Accounts */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900">Comptes Prospects</h2>
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
            {prospectAccounts.length}
          </span>
        </div>
        {prospectAccounts.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {prospectAccounts.map((u) => (
              <div key={u.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Créé le {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                </p>
                <button
                  onClick={() => handleDelete(u.id, u.name)}
                  className="mt-3 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" /> Supprimer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-400">
            Aucun compte prospect créé
          </div>
        )}
      </div>

      {/* Create Account Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Créer un compte</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nom complet</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Baya Naili"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ex: nom@bayanail.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 caractères"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm outline-none focus:border-rose-nude"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Rôle</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "admin" })}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                      form.role === "admin"
                        ? "border-rose-nude bg-rose-light"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Shield className={`h-6 w-6 ${form.role === "admin" ? "text-rose-dark" : "text-gray-400"}`} />
                    <span className={`text-sm font-medium ${form.role === "admin" ? "text-rose-dark" : "text-gray-600"}`}>
                      Admin
                    </span>
                    <span className="text-xs text-gray-400">Accès complet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "prospect" })}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                      form.role === "prospect"
                        ? "border-purple-400 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <UserPlus className={`h-6 w-6 ${form.role === "prospect" ? "text-purple-500" : "text-gray-400"}`} />
                    <span className={`text-sm font-medium ${form.role === "prospect" ? "text-purple-700" : "text-gray-600"}`}>
                      Prospect
                    </span>
                    <span className="text-xs text-gray-400">Accès limité</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-dark px-4 py-2 text-sm font-medium text-white hover:bg-[#a06868]">
                  <Check className="h-4 w-4" /> Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comptes;
