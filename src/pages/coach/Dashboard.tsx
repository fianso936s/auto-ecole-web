import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lessonsApi } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Clock, MapPin, User, Play, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CoachDashboard: React.FC = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayLessons = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const data = await lessonsApi.list({ date: today });
        setLessons(data);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayLessons();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Chargement des leçons...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Leçons du jour</h2>
        <Button variant="outline" size="sm" onClick={() => navigate("/coach/planning")}>
          Voir tout le planning <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {lessons.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-50 p-3">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Aucune leçon prévue pour aujourd'hui.</p>
            <Button className="mt-4" onClick={() => navigate("/coach/planning")}>
              Ajouter une leçon
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-blue-600 p-4 text-white md:w-32 md:flex-col md:justify-center md:text-center">
                  <div className="text-sm font-medium opacity-80">
                    {format(new Date(lesson.startTime), "HH:mm")}
                  </div>
                  <div className="text-xs opacity-60 md:mt-1">
                    {format(new Date(lesson.endTime), "HH:mm")}
                  </div>
                </div>
                <CardContent className="flex-1 p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          {lesson.student?.firstName} {lesson.student?.lastName}
                        </CardTitle>
                        <Badge variant={lesson.status === "CONFIRMED" ? "default" : "secondary"}>
                          {lesson.status}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={14} />
                          <span>{lesson.location || "Lieu non précisé"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User size={14} />
                          <span>{lesson.vehicle?.brand} {lesson.vehicle?.model} ({lesson.vehicle?.plate})</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => navigate(`/coach/lessons/${lesson.id}`)}
                    >
                      <Play className="mr-2 h-4 w-4 fill-current" />
                      Démarrer
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;

