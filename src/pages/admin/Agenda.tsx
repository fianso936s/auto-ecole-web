import React, { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X, Check, Ban, CheckCircle, User, Clock } from "lucide-react";
import { useCrmData } from "../../contexts/CrmDataContext";
import type { AppointmentWithClient } from "../../contexts/CrmDataContext";

const STATUS_COLORS: Record<string, string> = {
  planifie: "#3B82F6",
  termine: "#10B981",
  annule: "#9CA3AF",
};

const ARTISAN_LABELS: Record<string, string> = {
  ines: "Inès",
  sofia: "Sofia",
  any: "Sans préférence",
};

const SERVICES = [
  "Milky & Jelly Nails", "Cat Eye Magnétique", "Blooming Gel Japonais",
  "Glazed Donut", "French Revisitée", "Chrome Nacré Soft", "Nail Art 3D Miniature",
];

const Agenda: React.FC = () => {
  const { getAllAppointments, clients, updateAppointment, confirmBooking, addAppointment } = useCrmData();
  const appointments = getAllAppointments();

  const [selectedApt, setSelectedApt] = useState<AppointmentWithClient | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createDate, setCreateDate] = useState("");
  const [createTime, setCreateTime] = useState("10:00");
  const [createForm, setCreateForm] = useState({
    clientId: "",
    service: SERVICES[0],
    amount: 45,
    artisan: "any",
  });

  const events = useMemo(() =>
    appointments.map((apt) => ({
      id: apt.id,
      title: `${apt.clientName} - ${apt.service}`,
      start: `${apt.date}T${apt.time || "10:00"}:00`,
      end: (() => {
        const [h, m] = (apt.time || "10:00").split(":").map(Number);
        const endH = h + 1;
        return `${apt.date}T${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
      })(),
      backgroundColor: apt.confirmed === false ? "#F59E0B" : STATUS_COLORS[apt.status] || "#3B82F6",
      borderColor: apt.confirmed === false ? "#D97706" : STATUS_COLORS[apt.status] || "#3B82F6",
      textColor: "#fff",
      classNames: apt.confirmed === false ? ["fc-unconfirmed"] : [],
      extendedProps: { ...apt },
    })),
    [appointments]
  );

  const handleEventClick = (info: { event: { extendedProps: Record<string, unknown> } }) => {
    setSelectedApt(info.event.extendedProps as AppointmentWithClient);
  };

  const handleDateClick = (info: { dateStr: string; date: Date }) => {
    const dateStr = info.dateStr.split("T")[0];
    const timeStr = info.date.getHours() ? `${String(info.date.getHours()).padStart(2, "0")}:${String(info.date.getMinutes()).padStart(2, "0")}` : "10:00";
    setCreateDate(dateStr);
    setCreateTime(timeStr);
    setCreateForm({ clientId: clients[0]?.id || "", service: SERVICES[0], amount: 45, artisan: "any" });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.clientId) return;
    await addAppointment(createForm.clientId, {
      service: createForm.service,
      date: createDate,
      time: createTime,
      amount: createForm.amount,
      status: "planifie",
      artisan: createForm.artisan,
      confirmed: true,
    });
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
        <p className="text-sm text-gray-500">Calendrier des rendez-vous</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-3 w-3 rounded-full bg-blue-500" /> Planifié
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-3 w-3 rounded-full bg-emerald-500" /> Terminé
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-3 w-3 rounded-full bg-gray-400" /> Annulé
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-3 w-3 rounded-full bg-amber-500" /> En attente
        </span>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm agenda-calendar">
        <style>{`
          .agenda-calendar .fc { font-family: inherit; }
          .agenda-calendar .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 700; color: #2C2C2C; }
          .agenda-calendar .fc-button-primary { background: #B87878 !important; border-color: #B87878 !important; font-size: 0.75rem !important; padding: 4px 12px !important; }
          .agenda-calendar .fc-button-primary:hover { background: #a06868 !important; border-color: #a06868 !important; }
          .agenda-calendar .fc-button-active { background: #2C2C2C !important; border-color: #2C2C2C !important; }
          .agenda-calendar .fc-col-header-cell { background: #fdf8f5; }
          .agenda-calendar .fc-col-header-cell-cushion { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; font-weight: 600; }
          .agenda-calendar .fc-timegrid-slot-label-cushion { font-size: 0.7rem; color: #999; }
          .agenda-calendar .fc-event { border-radius: 6px !important; font-size: 0.7rem !important; cursor: pointer; }
          .agenda-calendar .fc-daygrid-event { border-radius: 4px !important; padding: 1px 4px; }
          .agenda-calendar .fc-unconfirmed { border-style: dashed !important; border-width: 2px !important; opacity: 0.85; }
          .agenda-calendar .fc-day-today { background: #fdf8f5 !important; }
          .agenda-calendar .fc-scrollgrid { border-color: #f0ede9 !important; }
          .agenda-calendar td, .agenda-calendar th { border-color: #f0ede9 !important; }
        `}</style>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth",
          }}
          locale="fr"
          firstDay={1}
          slotMinTime="09:00:00"
          slotMaxTime="19:30:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          height="auto"
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          buttonText={{
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
          }}
          nowIndicator
          expandRows
        />
      </div>

      {/* Appointment Detail Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Détail du rendez-vous</h2>
              <button onClick={() => setSelectedApt(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-light text-sm font-bold text-rose-dark">
                  {selectedApt.clientName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedApt.clientName}</p>
                  <p className="text-xs text-gray-400">{selectedApt.service}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400"><Clock className="h-3 w-3" /> Date & Heure</div>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(selectedApt.date).toLocaleDateString("fr-FR")} {selectedApt.time && `à ${selectedApt.time}`}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400"><User className="h-3 w-3" /> Artisan</div>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedApt.artisan ? ARTISAN_LABELS[selectedApt.artisan] || selectedApt.artisan : "Non défini"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Montant</span>
                <span className="text-lg font-bold text-gray-900">{selectedApt.amount}€</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Statut :</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  selectedApt.status === "termine" ? "bg-green-100 text-green-700"
                    : selectedApt.status === "planifie" ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {selectedApt.status === "termine" ? "Terminé" : selectedApt.status === "planifie" ? "Planifié" : "Annulé"}
                </span>
                {selectedApt.confirmed === false && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                    En attente de confirmation
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedApt.confirmed === false && (
                <button
                  onClick={async () => {
                    await confirmBooking(selectedApt.clientId, selectedApt.id);
                    setSelectedApt(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                >
                  <CheckCircle className="h-4 w-4" /> Confirmer
                </button>
              )}
              {selectedApt.status === "planifie" && (
                <>
                  <button
                    onClick={async () => {
                      await updateAppointment(selectedApt.clientId, selectedApt.id, { status: "termine" });
                      setSelectedApt(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                  >
                    <Check className="h-4 w-4" /> Terminé
                  </button>
                  <button
                    onClick={async () => {
                      await updateAppointment(selectedApt.clientId, selectedApt.id, { status: "annule" });
                      setSelectedApt(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
                  >
                    <Ban className="h-4 w-4" /> Annuler
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedApt(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Nouveau rendez-vous</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Client</label>
                <select
                  value={createForm.clientId}
                  onChange={(e) => setCreateForm({ ...createForm, clientId: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Service</label>
                <select
                  value={createForm.service}
                  onChange={(e) => setCreateForm({ ...createForm, service: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude"
                >
                  {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Heure</label>
                  <input
                    type="time"
                    value={createTime}
                    onChange={(e) => setCreateTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Montant (€)</label>
                  <input
                    type="number"
                    min={0}
                    value={createForm.amount}
                    onChange={(e) => setCreateForm({ ...createForm, amount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Artisan</label>
                  <select
                    value={createForm.artisan}
                    onChange={(e) => setCreateForm({ ...createForm, artisan: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rose-nude"
                  >
                    <option value="ines">Inès</option>
                    <option value="sofia">Sofia</option>
                    <option value="any">Sans préférence</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Annuler
                </button>
                <button type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-dark px-4 py-2 text-sm font-medium text-white hover:bg-[#a06868]">
                  <Check className="h-4 w-4" /> Créer le RDV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
