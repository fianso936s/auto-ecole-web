import React, { useState } from "react";
import CalendarCore from "../../components/CalendarCore";
import type { CalendarEvent } from "../../types/calendar";
import { DEMO_EVENTS } from "../../data/adminMockData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Plus,
  Filter,
  Download,
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import LessonModal from "../../components/modals/LessonModal";
import { toast } from "sonner";

const AdminPlanning: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(DEMO_EVENTS as any);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [hasConflict, setHasConflict] = useState(false);

  const handleCreate = (start: Date, end: Date) => {
    setSelectedEvent({ start, end });
    setIsModalOpen(true);
  };

  const handleMove = (eventId: string, start: Date, end: Date) => {
    // Simuler une détection de conflit si l'heure est 10h
    if (start.getHours() === 10) {
      setHasConflict(true);
      toast.error("Conflit détecté : Le moniteur est déjà occupé.");
      return;
    }

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, start, end } : e))
    );
    toast.success("Leçon déplacée avec succès");
  };

  const handleResize = (eventId: string, start: Date, end: Date) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, start, end } : e))
    );
    toast.success("Durée de la leçon mise à jour");
  };

  const handleSelect = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveLesson = (data: any) => {
    if (selectedEvent?.id) {
      setEvents((prev) =>
        prev.map((e) => (e.id === selectedEvent.id ? { ...e, ...data } : e))
      );
      toast.success("Leçon modifiée");
    } else {
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Leçon - ${data.studentId}`,
        ...data,
        status: "PLANNED",
      };
      setEvents((prev) => [...prev, newEvent]);
      toast.success("Nouvelle leçon créée");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planning Global</h1>
          <p className="text-gray-500">
            Gérez l'ensemble des leçons et disponibilités.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            size="sm"
            onClick={() => {
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle leçon
          </Button>
        </div>
      </div>

      {hasConflict && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3 rounded-r-lg">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-red-800">Conflit détecté</h3>
            <p className="text-xs text-red-700 mt-1">
              Jean Moniteur a déjà une leçon prévue avec Alice Martin sur ce créneau.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="xs" variant="destructive" onClick={() => setHasConflict(false)}>
                Ignorer et forcer
              </Button>
              <Button size="xs" variant="outline" className="bg-white" onClick={() => setHasConflict(false)}>
                Annuler le déplacement
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 flex-1 overflow-hidden">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Rechercher
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Élève, moniteur..."
                    className="w-full rounded-lg border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Moniteur
                </label>
                <select className="w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:ring-2 focus:ring-indigo-500">
                  <option>Tous les moniteurs</option>
                  <option>Jean Dupont</option>
                  <option>Marie Curie</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Statut
                </label>
                <div className="space-y-2 pt-1">
                  {[
                    { label: "Plannifié", color: "bg-primary" },
                    { label: "Confirmé", color: "bg-emerald-500" },
                    { label: "Terminé", color: "bg-indigo-500" },
                    { label: "Annulé", color: "bg-red-500" },
                    { label: "No-show", color: "bg-amber-500" },
                  ].map((status) => (
                    <label key={status.label} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                      <div className={`w-2 h-2 rounded-full ${status.color}`} />
                      {status.label}
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-none shadow-sm h-fit bg-indigo-900 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-80">
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10 text-white border-white/20 border">
                <CheckCircle2 size={18} className="text-emerald-400" />
                Confirmer sélection
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10 text-white border-white/20 border">
                <XCircle size={18} className="text-red-400" />
                Annuler sélection
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-white/10 text-white border-white/20 border">
                <Clock size={18} className="text-amber-400" />
                Marquer no-show
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <div className="lg:col-span-3 min-h-[700px]">
          <CalendarCore
            events={events}
            onCreate={handleCreate}
            onMove={handleMove}
            onResize={handleResize}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <LessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLesson}
        initialData={selectedEvent}
      />
    </div>
  );
};

export default AdminPlanning;

