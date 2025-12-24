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
  MoreVertical, 
  User, 
  Calendar, 
  Clock, 
  ChevronRight,
  Phone,
  Mail,
  ShieldCheck,
  Star
} from "lucide-react";
import { DEMO_INSTRUCTORS, DEMO_EVENTS } from "../../data/adminMockData";
import CalendarCore from "../../components/CalendarCore";

const AdminInstructors: React.FC = () => {
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  const selectedInstructor = DEMO_INSTRUCTORS.find(i => i.id === selectedInstructorId);

  if (selectedInstructorId && selectedInstructor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedInstructorId(null)} className="p-2">
            <ChevronRight className="rotate-180" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedInstructor.firstName} {selectedInstructor.lastName}</h1>
            <p className="text-sm text-gray-500">Moniteur ID: {selectedInstructor.id}</p>
          </div>
          <Badge className="ml-auto bg-green-100 text-green-700">ACTIF</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 border-none shadow-sm h-fit">
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold mb-4">
                  {selectedInstructor.firstName[0]}{selectedInstructor.lastName[0]}
                </div>
                <h2 className="font-bold text-lg">{selectedInstructor.firstName} {selectedInstructor.lastName}</h2>
                <div className="flex items-center gap-1 text-amber-500 mt-1">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold">{selectedInstructor.rating}</span>
                  <span className="text-gray-400 text-xs">({selectedInstructor.lessonsCount} leçons)</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedInstructor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedInstructor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ShieldCheck size={16} className="text-gray-400" />
                  <span className="text-gray-600">{selectedInstructor.licenseNumber}</span>
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
                  <TabsTrigger value="availability" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full gap-2">
                    <Clock size={16} /> Disponibilités
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none h-full gap-2">
                    <User size={16} /> Profil complet
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-6">
                <TabsContent value="planning" className="m-0 h-[500px]">
                  <CalendarCore 
                    events={DEMO_EVENTS as any} 
                    view="timeGridWeek"
                    editable={true}
                  />
                </TabsContent>
                <TabsContent value="availability" className="m-0 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Horaires de travail récurrents</h3>
                    <Button size="sm" variant="outline">Gérer les créneaux</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map(day => (
                      <div key={day} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <span className="font-medium">{day}</span>
                        <span className="text-sm text-gray-600">08:00 - 12:00, 13:00 - 18:00</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="profile" className="m-0">
                  <div className="text-center py-12 text-gray-500">
                    Informations contractuelles en cours de chargement...
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
          <h1 className="text-3xl font-bold text-gray-900">Moniteurs</h1>
          <p className="text-gray-500">Gérez votre équipe de moniteurs.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un moniteur
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="pb-3 font-medium">Moniteur</th>
                  <th className="pb-3 font-medium">N° Autorisation</th>
                  <th className="pb-3 font-medium">Performance</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {DEMO_INSTRUCTORS.map((instructor) => (
                  <tr 
                    key={instructor.id} 
                    className="group hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedInstructorId(instructor.id)}
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                          {instructor.firstName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{instructor.firstName} {instructor.lastName}</div>
                          <div className="text-xs text-gray-500">{instructor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600 font-mono text-xs">
                      {instructor.licenseNumber}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="font-bold">{instructor.rating}</span>
                        <span className="text-gray-400 text-xs">({instructor.lessonsCount}h)</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${instructor.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className="text-xs font-medium">{instructor.isActive ? "Actif" : "Inactif"}</span>
                      </div>
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

export default AdminInstructors;
