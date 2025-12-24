import React, { useState } from "react";
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
import { DEMO_STUDENTS, STUDENT_SKILLS, DEMO_EVENTS } from "../../data/adminMockData";
import CalendarCore from "../../components/CalendarCore";

const AdminStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const selectedStudent = DEMO_STUDENTS.find(s => s.id === selectedStudentId);

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
          <Badge className="ml-auto bg-green-100 text-green-700">{selectedStudent.status}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 border-none shadow-sm h-fit">
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold mb-4">
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </div>
                <h2 className="font-bold text-lg">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                <p className="text-sm text-gray-500">Permis B • {selectedStudent.transmission}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedStudent.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-600">Paris, France</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Progression</span>
                  <span className="font-bold">{selectedStudent.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{width: `${selectedStudent.progress}%`}}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-none shadow-sm overflow-hidden">
            <Tabs defaultValue="progression" className="w-full">
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
                  <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full gap-2">
                    <FileText size={16} /> Documents
                  </TabsTrigger>
                  <TabsTrigger value="examens" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full gap-2">
                    <GraduationCap size={16} /> Examens
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-6">
                <TabsContent value="planning" className="m-0 h-[500px]">
                  <CalendarCore 
                    events={DEMO_EVENTS as any} 
                    view="timeGridWeek"
                    editable={false}
                  />
                </TabsContent>
                <TabsContent value="progression" className="m-0 space-y-8">
                  {STUDENT_SKILLS.map((cat, i) => (
                    <div key={i} className="space-y-4">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                          {i+1}
                        </div>
                        {cat.category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cat.skills.map((skill, j) => (
                          <div key={j} className="p-4 border rounded-xl space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-sm font-medium text-gray-700">{skill.label}</span>
                              <Badge variant="secondary" className={
                                skill.status === "ACQUIRED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                              }>
                                {skill.status === "ACQUIRED" ? "Acquis" : "En cours"}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map(level => (
                                <div 
                                  key={level} 
                                  className={`h-1.5 flex-1 rounded-full ${
                                    level <= skill.level ? "bg-indigo-600" : "bg-gray-100"
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="paiements" className="m-0">
                  <div className="text-center py-12 text-gray-500">
                    Historique des paiements en cours de chargement...
                  </div>
                </TabsContent>
                <TabsContent value="documents" className="m-0">
                  <div className="text-center py-12 text-gray-500">
                    Documents de l'élève en cours de chargement...
                  </div>
                </TabsContent>
                <TabsContent value="examens" className="m-0">
                  <div className="text-center py-12 text-gray-500">
                    Historique des examens en cours de chargement...
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} /> Filtres
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="pb-3 font-medium">Élève</th>
                  <th className="pb-3 font-medium">Transmission</th>
                  <th className="pb-3 font-medium">Progression</th>
                  <th className="pb-3 font-medium">Solde</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {DEMO_STUDENTS.map((student) => (
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
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline" className="font-medium">
                        {student.transmission}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-gray-100 rounded-full">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full" 
                            style={{width: `${student.progress}%`}}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${student.balance < 0 ? "text-red-600" : "text-gray-900"}`}>
                        {student.balance}€
                      </span>
                    </td>
                    <td className="py-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {student.status}
                      </Badge>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStudents;
