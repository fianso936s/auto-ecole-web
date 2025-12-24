import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentsApi, lessonsApi } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  ChevronLeft, 
  Calendar, 
  BarChart3, 
  FileText, 
  Phone, 
  Mail, 
  Clock, 
  MapPin 
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CoachStudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [studentData, lessonsData, progressData] = await Promise.all([
          studentsApi.read(id),
          lessonsApi.list({ studentId: id }),
          studentsApi.progress(id)
        ]);
        setStudent(studentData);
        setLessons(lessonsData);
        setProgress(progressData);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Élève introuvable</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {student.firstName} {student.lastName}
          </h2>
          <p className="text-gray-500">Élève depuis le {format(new Date(student.createdAt), "d MMMM yyyy", { locale: fr })}</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
          En formation
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact & Infos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-400" />
              <span className="text-sm">{student.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-400" />
              <span className="text-sm">{student.profile?.phone || "Non renseigné"}</span>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Notes moniteur</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {student.instructorNotes || "Aucune note pour cet élève."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <Tabs defaultValue="planning" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="planning" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Planning
                </TabsTrigger>
                <TabsTrigger 
                  value="progression" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Progression
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="planning" className="p-6 m-0">
                <div className="space-y-4">
                  {lessons.length === 0 ? (
                    <p className="text-center py-8 text-gray-500 text-sm">Aucune leçon enregistrée.</p>
                  ) : (
                    lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl border bg-white hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-gray-50 border text-gray-600">
                            <span className="text-[10px] uppercase font-bold">{format(new Date(lesson.startTime), "MMM", { locale: fr })}</span>
                            <span className="text-lg font-bold leading-none">{format(new Date(lesson.startTime), "d")}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {format(new Date(lesson.startTime), "HH:mm")} - {format(new Date(lesson.endTime), "HH:mm")}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin size={12} />
                              <span>{lesson.location || "RDV habituel"}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={lesson.status === "COMPLETED" ? "default" : "secondary"}>
                          {lesson.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="progression" className="p-6 m-0">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-blue-50 border-none">
                      <CardContent className="p-4">
                        <p className="text-xs font-bold text-primary uppercase">Heures effectuées</p>
                        <p className="text-2xl font-black text-blue-900 mt-1">{progress?.hoursDone || 0}h / {progress?.hoursTotal || 20}h</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-none">
                      <CardContent className="p-4">
                        <p className="text-xs font-bold text-green-600 uppercase">Compétences validées</p>
                        <p className="text-2xl font-black text-green-900 mt-1">{progress?.skillsValidated || 0} / {progress?.skillsTotal || 32}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-700 uppercase">Détail par catégorie</h4>
                    {progress?.categories?.map((cat: any) => (
                      <div key={cat.id} className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{cat.name}</span>
                          <span>{cat.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${cat.percentage}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachStudentDetail;

