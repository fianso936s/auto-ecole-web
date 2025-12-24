import React, { useState, useEffect } from "react";
import CalendarCore from "../../components/CalendarCore";
import type { CalendarEvent } from "../../types/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Info,
  Calendar as CalendarIcon
} from "lucide-react";
import { lessonsApi } from "../../lib/api/lessons";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const StudentPlanning: React.FC = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyLessons();
  }, []);

  const fetchMyLessons = async () => {
    setLoading(true);
    try {
      const data = await lessonsApi.list();
      const formatted = data.map((l: any) => ({
        id: l.id,
        title: "Leçon de conduite",
        start: l.startAt,
        end: l.endAt,
        status: l.status,
        instructorName: `${l.instructor.firstName} ${l.instructor.lastName}`,
        location: l.location,
      }));
      setEvents(formatted);
    } catch (error) {
      toast.error("Erreur lors de la récupération de votre planning");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await lessonsApi.cancel(id, "Annulation par l'élève");
      toast.success("Leçon annulée");
      fetchMyLessons();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'annulation");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Planning</h1>
          <p className="text-gray-500">Visualisez et réservez vos prochaines séances.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-lg border bg-white p-1">
            <Button
              variant={view === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              Calendrier
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              Liste
            </Button>
          </div>
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Demander un créneau
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : view === "calendar" ? (
        <div className="min-h-[600px]">
          <CalendarCore 
            events={events} 
            editable={false}
            view="timeGridWeek"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed">
              Aucune leçon prévue.
            </div>
          ) : events.map((event) => (
            <Card key={event.id} className="border-none shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={`p-6 md:w-48 flex flex-col justify-center items-center text-center text-white ${
                  event.status === "CONFIRMED" ? "bg-indigo-600" : 
                  event.status === "PLANNED" ? "bg-blue-500" :
                  event.status === "CANCELLED" ? "bg-red-500" : "bg-gray-400"
                }`}>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-80">
                    {format(new Date(event.start), "d MMMM", { locale: fr })}
                  </div>
                  <div className="text-2xl font-black mt-1">
                    {format(new Date(event.start), "HH:mm")}
                  </div>
                  <Badge variant="outline" className="mt-2 border-white/30 text-white bg-white/10">
                    {event.status}
                  </Badge>
                </div>
                <CardContent className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={16} className="text-indigo-500" />
                        <span className="text-sm">Moniteur : <span className="font-semibold">{event.instructorName}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} className="text-indigo-500" />
                        <span className="text-sm">Lieu : <span className="font-semibold">{event.location}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {["PLANNED", "CONFIRMED"].includes(event.status) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancel(event.id)}
                      >
                        Annuler
                      </Button>
                    )}
                    <Button variant="secondary" size="sm">Détails</Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Info Banner */}
      <Card className="bg-indigo-50 border-indigo-100">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-indigo-900 text-sm">Politique d'annulation</h4>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Toute leçon annulée moins de 48 heures à l'avance sera décomptée de votre forfait, 
              sauf justificatif médical. Merci de votre compréhension.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPlanning;

