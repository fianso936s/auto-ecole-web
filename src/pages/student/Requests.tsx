import React, { useState, useEffect } from "react";
import { requestsApi } from "../../lib/api";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Calendar as CalendarIcon,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface SlotProposal {
  start: string;
  end: string;
}

const StudentRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [newRequest, setNewRequest] = useState<{
    instructorId: string;
    proposals: SlotProposal[];
  }>({
    instructorId: "",
    proposals: [{ start: "", end: "" }]
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await requestsApi.listRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProposal = () => {
    if (newRequest.proposals.length < 3) {
      setNewRequest({
        ...newRequest,
        proposals: [...newRequest.proposals, { start: "", end: "" }]
      });
    } else {
      toast.error("Maximum 3 propositions par demande");
    }
  };

  const removeProposal = (index: number) => {
    const updated = [...newRequest.proposals];
    updated.splice(index, 1);
    setNewRequest({ ...newRequest, proposals: updated });
  };

  const updateProposal = (index: number, field: "start" | "end", value: string) => {
    const updated = [...newRequest.proposals];
    updated[index][field] = value;
    setNewRequest({ ...newRequest, proposals: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRequest.proposals.some(p => !p.start || !p.end)) {
      toast.error("Veuillez remplir toutes les propositions");
      return;
    }

    setSubmitting(true);
    try {
      await requestsApi.createRequest(newRequest);
      toast.success("Demande envoyée avec succès");
      setNewRequest({ instructorId: "", proposals: [{ start: "", end: "" }] });
      fetchRequests();
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Mes Demandes</h1>
        <p className="text-gray-500">Demandez des créneaux de conduite à votre moniteur.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-none shadow-md">
            <CardHeader>
              <CardTitle>Nouvelle demande</CardTitle>
              <CardDescription>Proposez jusqu'à 3 créneaux qui vous arrangent.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {newRequest.proposals.map((proposal, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gray-50 border space-y-3 relative group">
                      {index > 0 && (
                        <button 
                          type="button"
                          onClick={() => removeProposal(index)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border shadow-sm text-red-500 flex items-center justify-center hover:bg-red-50"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                      <p className="text-[10px] font-bold uppercase text-gray-400">Proposition {index + 1}</p>
                      <div className="space-y-2">
                        <Label className="text-xs">Début</Label>
                        <Input 
                          type="datetime-local" 
                          value={proposal.start}
                          onChange={(e) => updateProposal(index, "start", e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Fin</Label>
                        <Input 
                          type="datetime-local" 
                          value={proposal.end}
                          onChange={(e) => updateProposal(index, "end", e.target.value)}
                          className="bg-white"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {newRequest.proposals.length < 3 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-dashed"
                      onClick={addProposal}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Ajouter une proposition
                    </Button>
                  )}
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" type="submit" disabled={submitting}>
                  {submitting ? "Envoi..." : "Envoyer la demande"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Historique des demandes</h2>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Chargement...</div>
          ) : requests.length === 0 ? (
            <Card className="border-dashed bg-transparent">
              <CardContent className="py-12 text-center text-gray-400">
                Vous n'avez pas encore fait de demande.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-none shadow-sm overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            request.status === "ACCEPTED" ? "default" : 
                            request.status === "REJECTED" ? "destructive" : 
                            "secondary"
                          }>
                            {request.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            Demandée le {format(new Date(request.createdAt), "d MMM HH:mm", { locale: fr })}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {request.proposals.map((p: any, idx: number) => (
                            <div key={idx} className={`p-3 rounded-lg border ${p.isAccepted ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 'bg-white'}`}>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-400 mb-1">
                                <CalendarIcon size={10} /> Option {idx + 1}
                              </div>
                              <p className="text-sm font-semibold text-gray-700">
                                {format(new Date(p.start), "d MMM", { locale: fr })}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(p.start), "HH:mm")} - {format(new Date(p.end), "HH:mm")}
                              </p>
                            </div>
                          ))}
                        </div>

                        {request.rejectionReason && (
                          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                            <AlertCircle size={14} />
                            <span>Motif du refus : {request.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentRequests;

