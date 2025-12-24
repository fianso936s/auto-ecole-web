import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Phone, 
  Mail, 
  UserPlus, 
  Clock, 
  ChevronRight,
  MessageSquare,
  Calendar
} from "lucide-react";
import { DEMO_LEADS, LEAD_ACTIVITIES } from "../../data/adminMockData";

const CRM: React.FC = () => {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const selectedLead = DEMO_LEADS.find(l => l.id === selectedLeadId);

  const columns = [
    { id: "NEW", title: "Nouveaux", color: "bg-blue-500" },
    { id: "FOLLOW_UP", title: "À relancer", color: "bg-amber-500" },
    { id: "CONVERTED", title: "Convertis", color: "bg-emerald-500" },
    { id: "LOST", title: "Perdus", color: "bg-red-500" },
  ];

  if (selectedLeadId && selectedLead) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedLeadId(null)} className="p-2">
            <ChevronRight className="rotate-180" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedLead.firstName} {selectedLead.lastName}</h1>
            <p className="text-sm text-gray-500">Lead ID: {selectedLead.id} • Créé le {selectedLead.createdAt}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="gap-2">
              <Phone size={16} /> Appeler
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Mail size={16} /> Email
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <UserPlus size={16} /> Convertir en élève
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Fil d'activités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-6 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {LEAD_ACTIVITIES.map((activity) => (
                    <div key={activity.id} className="relative pl-12">
                      <div className={`absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                        activity.type === "CALL" ? "bg-blue-100 text-blue-600" :
                        activity.type === "EMAIL" ? "bg-purple-100 text-purple-600" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {activity.type === "CALL" ? <Phone size={14} /> :
                         activity.type === "EMAIL" ? <Mail size={14} /> :
                         <Clock size={14} />}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-900">{activity.actor}</span>
                          <span className="text-xs text-gray-400">{new Date(activity.date).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="relative pl-12">
                    <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border-4 border-white shadow-sm">
                      <MessageSquare size={14} />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <textarea 
                        className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-gray-400 resize-none"
                        placeholder="Ajouter une note ou un commentaire..."
                        rows={2}
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm" className="text-xs h-8">Enregistrer</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Prochaine action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="flex items-center gap-3 text-indigo-700 mb-2">
                    <Calendar size={18} />
                    <span className="font-bold text-sm">Relance prévue</span>
                  </div>
                  <p className="text-sm text-indigo-600">
                    {selectedLead.nextFollowUp 
                      ? new Date(selectedLead.nextFollowUp).toLocaleString()
                      : "Non planifiée"}
                  </p>
                  <Button variant="link" className="text-indigo-700 p-0 h-auto text-xs mt-2 underline">
                    Modifier l'échéance
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Score de chaleur</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${selectedLead.score > 70 ? "bg-red-500" : "bg-orange-400"}`}
                        style={{width: `${selectedLead.score}%`}}
                      />
                    </div>
                    <span className="text-sm font-bold">{selectedLead.score}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Tâches liées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-4 h-4 rounded border-2" />
                    <span className="text-sm text-gray-700">Vérifier les documents CPF</span>
                  </div>
                  <Button variant="ghost" className="w-full text-xs text-indigo-600 gap-1">
                    <Plus size={14} /> Ajouter une tâche
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Leads</h1>
          <p className="text-gray-500">Suivez et convertissez vos prospects.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border rounded-lg p-1 flex shadow-sm">
            <Button 
              variant={view === "kanban" ? "secondary" : "ghost"} 
              size="sm" 
              className="px-3"
              onClick={() => setView("kanban")}
            >
              <LayoutGrid size={16} className="mr-2" /> Kanban
            </Button>
            <Button 
              variant={view === "list" ? "secondary" : "ghost"} 
              size="sm" 
              className="px-3"
              onClick={() => setView("list")}
            >
              <List size={16} className="mr-2" /> Liste
            </Button>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau prospect
          </Button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide min-h-[600px]">
          {columns.map((col) => (
            <div key={col.id} className="flex-none w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} />
                  <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs">{col.title}</h3>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-500">
                    {DEMO_LEADS.filter(l => l.status === col.id).length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical size={14} />
                </Button>
              </div>
              
              <div className="flex-1 space-y-3">
                {DEMO_LEADS.filter(l => l.status === col.id).map((lead) => (
                  <Card 
                    key={lead.id} 
                    className="border-none shadow-sm cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
                    onClick={() => setSelectedLeadId(lead.id)}
                  >
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-gray-900">{lead.firstName} {lead.lastName}</div>
                        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          lead.score > 70 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                        }`}>
                          HOT {lead.score}%
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail size={12} /> {lead.email}
                        </div>
                        {lead.nextFollowUp && (
                          <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
                            <Clock size={12} /> Relance: {new Date(lead.nextFollowUp).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t mt-2">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">JD</div>
                        </div>
                        <span className="text-[10px] text-gray-400">Ajouté le {lead.createdAt}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher un prospect..."
                className="w-full rounded-lg border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="pb-3 font-medium">Prospect</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium">Score</th>
                  <th className="pb-3 font-medium">Dernière activité</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {DEMO_LEADS.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="group hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedLeadId(lead.id)}
                  >
                    <td className="py-4">
                      <div className="font-semibold">{lead.firstName} {lead.lastName}</div>
                      <div className="text-xs text-gray-500">{lead.email}</div>
                    </td>
                    <td className="py-4">
                      <Badge variant="secondary" className={
                        lead.status === "NEW" ? "bg-blue-50 text-blue-700" :
                        lead.status === "FOLLOW_UP" ? "bg-amber-50 text-amber-700" :
                        "bg-green-50 text-green-700"
                      }>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-4 font-bold">{lead.score}%</td>
                    <td className="py-4 text-gray-500 text-xs">{lead.createdAt}</td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="icon"><MoreVertical size={16} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CRM;
