import React, { useState, useEffect } from "react";
import { calendarApi, lessonsApi } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from "date-fns";
import { fr } from "date-fns/locale";

const CoachPlanning: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const start = startOfMonth(currentDate).toISOString();
        const end = endOfMonth(currentDate).toISOString();
        const data = await calendarApi.getEvents(start, end);
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </h2>
          <p className="text-sm text-gray-500">Gérez votre emploi du temps et vos leçons.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button className="ml-2">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle leçon
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div key={day} className="py-3">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dayEvents = events.filter((event) => 
                isSameDay(new Date(event.start), day)
              );
              
              return (
                <div
                  key={day.toString()}
                  className={`min-h-[120px] border-b border-r p-2 transition-colors ${
                    !isSameMonth(day, currentDate) ? "bg-gray-50 text-gray-400" : "bg-white"
                  } ${idx % 7 === 6 ? "border-r-0" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? "flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white" : ""}`}>
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          event.type === "LESSON" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {format(new Date(event.start), "HH:mm")} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-gray-400 font-medium pl-1">
                        + {dayEvents.length - 3} de plus
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachPlanning;

