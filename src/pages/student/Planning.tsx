import React, { useState } from "react";
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

// Mock Data
const STUDENT_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Leçon de conduite",
    start: "2023-12-22T14:00:00",
    end: "2023-12-22T16:00:00",
    status: "CONFIRMED",
    instructorName: "Jean Moniteur",
    location: "Gare de Lyon",
  },
  {
    id: "2",
    title: "Leçon de conduite",
    start: "2023-12-27T10:00:00",
    end: "2023-12-27T12:00:00",
    status: "PLANNED",
    instructorName: "Jean Moniteur",
    location: "Gare de Lyon",
  },
];

const StudentPlanning: React.FC = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");

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

      {view === "calendar" ? (
        <div className="min-h-[600px]">
          <CalendarCore 
            events={STUDENT_EVENTS} 
            editable={false}
            view="timeGridWeek"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {STUDENT_EVENTS.map((event) => (
            <Card key={event.id} className="border-none shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={`p-6 md:w-48 flex flex-col justify-center items-center text-center text-white ${
                  event.status === "CONFIRMED" ? "bg-indigo-600" : "bg-gray-400"
                }`}>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-80">22 Décembre</div>
                  <div className="text-2xl font-black mt-1">14:00</div>
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
                    <Button variant="outline" size="sm">Annuler</Button>
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

