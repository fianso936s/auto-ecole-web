import React, { useState, useEffect } from "react";
import CalendarCore from "../../components/CalendarCore";
import type { CalendarEvent } from "../../types/calendar";
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
import { lessonsApi } from "../../lib/api/lessons";
import { instructorsApi } from "../../lib/api/instructors";
import { useSocketEvent } from "../../hooks/useSocketEvent";

const AdminPlanning: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterInstructor, setFilterInstructor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInstructors();
    fetchLessons();
  }, [filterInstructor]);

  useSocketEvent("lesson:create", () => {
    fetchLessons();
    toast.info("Une nouvelle leçon a été créée");
  });

  useSocketEvent("lesson:update", () => {
    fetchLessons();
  });

  const fetchInstructors = async () => {
    try {
      const data = await instructorsApi.list();
      setInstructors(data);
    } catch (error) {
      console.error("Failed to fetch instructors");
    }
  };

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const data = await lessonsApi.list({ 
        instructorId: filterInstructor || undefined 
      });
      
      const formattedEvents = data.map((lesson: any) => ({
        id: lesson.id,
        title: `${lesson.student.firstName} ${lesson.student.lastName} (${lesson.vehicle?.name || "Sans véhicule"})`,
        start: lesson.startAt,
        end: lesson.endAt,
        status: lesson.status,
        instructorName: `${lesson.instructor.firstName} ${lesson.instructor.lastName}`,
        location: lesson.location,
        studentName: `${lesson.student.firstName} ${lesson.student.lastName}`,
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      toast.error("Erreur lors de la récupération du planning");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (start: Date, end: Date) => {
    setSelectedEvent({ startAt: start.toISOString(), endAt: end.toISOString() });
    setIsModalOpen(true);
  };

  const handleMove = async (eventId: string, start: Date, end: Date) => {
    try {
      await lessonsApi.update(eventId, { 
        startAt: start.toISOString(), 
        endAt: end.toISOString() 
      });
      toast.success("Leçon déplacée avec succès");
      fetchLessons();
    } catch (error: any) {
      if (error.status === 409) {
        setHasConflict(true);
        toast.error(error.message || "Conflit détecté");
      } else {
        toast.error("Erreur lors du déplacement");
      }
    }
  };

  const handleResize = async (eventId: string, start: Date, end: Date) => {
    try {
      await lessonsApi.update(eventId, { 
        startAt: start.toISOString(), 
        endAt: end.toISOString() 
      });
      toast.success("Durée de la leçon mise à jour");
      fetchLessons();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la durée");
    }
  };

  const handleSelect = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleSaveLesson = async (data: any) => {
    try {
      if (selectedEvent?.id) {
        await lessonsApi.update(selectedEvent.id, data);
        toast.success("Leçon modifiée");
      } else {
        await lessonsApi.create(data);
        toast.success("Nouvelle leçon créée");
      }
      setIsModalOpen(false);
      fetchLessons();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
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
              Un conflit a été détecté pour ce créneau (moniteur, élève ou véhicule déjà occupé).
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="xs" variant="outline" className="bg-white" onClick={() => setHasConflict(false)}>
                Fermer
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Moniteur
                </label>
                <select 
                  className="w-full rounded-lg border-gray-200 bg-gray-50 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  value={filterInstructor}
                  onChange={(e) => setFilterInstructor(e.target.value)}
                >
                  <option value="">Tous les moniteurs</option>
                  {instructors.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.firstName} {inst.lastName}</option>
                  ))}
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

