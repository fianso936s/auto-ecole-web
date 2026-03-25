import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Mail, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

const Settings: React.FC = () => {
  const [notificationEmail, setNotificationEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "notification_email")
        .single();
      if (data) setNotificationEmail(data.value);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("settings")
      .upsert({ key: "notification_email", value: notificationEmail, updated_at: new Date().toISOString() }, { onConflict: "key" });

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-nude border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-charcoal">Paramètres</h1>
        <p className="mt-1 text-sm text-gray-500">Configuration du CRM bayaNail</p>
      </div>

      <div className="mx-auto max-w-xl">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-nude/10">
              <Mail className="h-5 w-5 text-rose-nude" />
            </div>
            <div>
              <h2 className="font-semibold text-charcoal">Notifications par email</h2>
              <p className="text-sm text-gray-500">
                Recevez un email à chaque nouvelle réservation en ligne
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Adresse email de notification
              </label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="votre-email@exemple.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-rose-nude focus:ring-2 focus:ring-rose-nude/20"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Cette adresse recevra les notifications de réservation. Elle peut être différente de votre compte admin.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-charcoal/90 disabled:opacity-60"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>

              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Sauvegardé
                </span>
              )}
            </div>
          </form>
        </div>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex gap-3">
            <SettingsIcon className="mt-0.5 h-5 w-5 text-blue-500" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Comment ça marche ?</p>
              <p className="mt-1 text-blue-600">
                Quand un client réserve en ligne via le site, un email de notification est automatiquement envoyé à l'adresse configurée ci-dessus avec les détails de la réservation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
