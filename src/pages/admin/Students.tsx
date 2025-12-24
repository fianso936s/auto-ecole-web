import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  User, 
  Calendar, 
  BarChart3, 
  FileText, 
  CreditCard,
  GraduationCap,
  ChevronRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { studentsApi } from "../../lib/api/students";
import { lessonsApi } from "../../lib/api/lessons";
import CalendarCore from "../../components/CalendarCore";
import { toast } from "sonner";
import { useSocketEvent } from "../../hooks/useSocketEvent";

const AdminStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [studentLessons, setStudentLessons] = useState<any[]>([]);

  useEffect(() => {
    fetchStudents();
  }, [searchTerm]);

  useSocketEvent("student:create", () => fetchStudents());
  useSocketEvent("student:update", () => {
    fetchStudents();
    if (selectedStudentId) fetchStudentDetails(selectedStudentId);
  });
  useSocketEvent("student:delete", () => {
    fetchStudents();
    setSelectedStudentId(null);
  });

  useEffect(() => {
    if (selectedStudentId) {
      fetchStudentDetails(selectedStudentId);
    }
  }, [selectedStudentId]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentsApi.list({ query: searchTerm });
      setStudents(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des élèves");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (id: string) => {
    try {
      const [details, lessons] = await Promise.all([
        studentsApi.get(id),
        lessonsApi.list({ studentId: id })
      ]);
      setStudentDetails(details);
      
      const formattedLessons = lessons.map((l: any) => ({
        id: l.id,
        title: `Leçon avec ${l.instructor.firstName}`,
        start: l.startAt,
        end: l.endAt,
        status: l.status,
      }));
      setStudentLessons(formattedLessons);
    } catch (error) {
      toast.error("Erreur lors de la récupération des détails de l'élève");
    }
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  if (selectedStudentId && selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedStudentId(null)} className="p-2">
            <ChevronRight className="rotate-180" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedStudent.firstName} {selectedStudent.lastName}</h1>
            <p className="text-sm text-gray-500">Élève ID: {selectedStudent.id}</p>
          </div>
          <Badge className="ml-auto bg-green-100 text-green-700">ACTIF</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 border-none shadow-sm h-fit">
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold mb-4">
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </div>
                <h2 className="font-bold text-lg">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                <p className="text-sm text-gray-500">Permis B</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedStudent.user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedStudent.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedStudent.city}, {selectedStudent.postalCode}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-none shadow-sm overflow-hidden">
            <Tabs defaultValue="planning" className="w-full">
              <CardHeader className="p-0 border-b">
                <TabsList className="w-full justify-start rounded-none bg-transparent h-14 px-4 gap-4">
                  <TabsTrigger value="planning" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full gap-2">
                    <Calendar size={16} /> Planning
                  </TabsTrigger>
                  <TabsTrigger value="progression" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full gap-2">
                    <BarChart3 size={16} /> Progression
                  </TabsTrigger>
                  <TabsTrigger value="paiements" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full gap-2">
                    <CreditCard size={16} /> Paiements
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-6">
                <TabsContent value="planning" className="m-0 h-[500px]">
                  <CalendarCore 
                    events={studentLessons} 
                    view="timeGridWeek"
                    editable={false}
                  />
                </TabsContent>
                <TabsContent value="progression" className="m-0 space-y-8">
                  <div className="text-center py-12 text-gray-500">
                    Suivi des compétences bientôt disponible en direct...
                  </div>
                </TabsContent>
                <TabsContent value="paiements" className="m-0">
                  <div className="text-center py-12 text-gray-500">
                    Historique des paiements bientôt disponible en direct...
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Élèves</h1>
          <p className="text-gray-500">Gérez la base de données de vos élèves.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un élève
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher par nom, email..."
                className="w-full rounded-lg border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">Chargement...</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-3 font-medium">Élève</th>
                    <th className="pb-3 font-medium">Ville</th>
                    <th className="pb-3 font-medium">Téléphone</th>
                    <th className="pb-3 font-medium">Date d'inscription</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map((student) => (
                    <tr 
                      key={student.id} 
                      className="group hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedStudentId(student.id)}
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            {student.firstName[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{student.firstName} {student.lastName}</div>
                            <div className="text-xs text-gray-500">{student.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">
                        {student.city}
                      </td>
                      <td className="py-4 text-gray-600">
                        {student.phone}
                      </td>
                      <td className="py-4 text-gray-500">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStudents;
