import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  XCircle,
  Download
} from "lucide-react";

const MOCK_DOCS = [
  { id: "1", name: "Pièce d'identité", status: "PENDING", required: true, description: "Carte d'identité ou passeport en cours de validité." },
  { id: "2", name: "Justificatif de domicile", status: "APPROVED", required: true, description: "Facture de moins de 6 mois." },
  { id: "3", name: "Photo d'identité (e-photo)", status: "REJECTED", required: true, description: "Code e-photo valide requis.", reason: "Code déjà utilisé ou expiré." },
  { id: "4", name: "ASSR 2 / ASR", status: "MISSING", required: false, description: "Si vous avez moins de 21 ans." },
];

const StudentDocuments: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
        <p className="text-gray-500">Gérez vos pièces justificatives pour votre dossier préfectoral.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {MOCK_DOCS.map((doc) => (
            <Card key={doc.id} className={`border-none shadow-sm overflow-hidden ${
              doc.status === "REJECTED" ? "ring-1 ring-red-100" : ""
            }`}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      doc.status === "APPROVED" ? "bg-green-100 text-green-600" :
                      doc.status === "PENDING" ? "bg-primary/10 text-primary" :
                      doc.status === "REJECTED" ? "bg-red-100 text-red-600" :
                      "bg-gray-100 text-gray-400"
                    }`}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{doc.name}</CardTitle>
                        {doc.required && (
                          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase">Obligatoire</span>
                        )}
                      </div>
                      <CardDescription className="text-sm">{doc.description}</CardDescription>
                      
                      {doc.status === "REJECTED" && (
                        <div className="mt-3 p-2 rounded bg-red-50 border border-red-100 flex items-start gap-2 text-xs text-red-700">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span><strong>Motif du refus :</strong> {doc.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end justify-center gap-3">
                    <Badge variant="secondary" className={`border-none ${
                      doc.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      doc.status === "PENDING" ? "bg-blue-100 text-blue-700" :
                      doc.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {doc.status === "APPROVED" ? "Validé" :
                       doc.status === "PENDING" ? "En cours de vérification" :
                       doc.status === "REJECTED" ? "Refusé" : "Manquant"}
                    </Badge>
                    
                    <div className="flex gap-2">
                      {(doc.status === "APPROVED" || doc.status === "PENDING") && (
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <Download size={16} className="mr-2" /> Voir
                        </Button>
                      )}
                      {(doc.status === "MISSING" || doc.status === "REJECTED") ? (
                        <Button size="sm" className="bg-indigo-600">
                          <Upload size={16} className="mr-2" /> Uploader
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          Remplacer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="border-none shadow-md bg-slate-900 text-white sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">État du dossier</CardTitle>
              <CardDescription className="text-slate-400">Dossier NEPH</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Progression</span>
                  <span className="font-bold">60%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '60%' }} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <span className="text-slate-300">Inscription validée</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Clock size={14} className="text-blue-400" />
                  <span className="text-slate-300">Vérification des pièces (1/3)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <AlertCircle size={14} className="text-slate-600" />
                  <span className="text-slate-500">Demande NEPH (en attente docs)</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 italic">
                * Le délai moyen de validation par l'administration est de 3 à 4 semaines après envoi complet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDocuments;

