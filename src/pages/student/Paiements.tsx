import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  ChevronRight
} from "lucide-react";

const MOCK_PAIEMENTS = [
  { id: "1", date: "2023-12-05", label: "Acompte inscription", amount: "250€", status: "PAID", type: "DEPOSIT" },
  { id: "2", date: "2023-11-20", label: "Pack Initial (Solde)", amount: "1040€", status: "PAID", type: "FINAL" },
];

const StudentPaiements: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Paiements</h1>
          <p className="text-gray-500">Gérez vos factures et votre budget formation.</p>
        </div>
        <Button variant="primary">
          <CreditCard className="mr-2 h-4 w-4" />
          Effectuer un paiement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Total Payé</p>
            <div className="text-3xl font-bold text-gray-900">1,290€</div>
            <div className="flex items-center gap-1.5 text-xs text-green-600 mt-2 font-semibold">
              <CheckCircle2 size={14} /> Solde à jour
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Heures restantes</p>
            <div className="text-3xl font-bold text-gray-900">8h</div>
            <p className="text-xs text-gray-500 mt-2">Incluses dans votre forfait</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Coût additionnel</p>
            <div className="text-3xl font-bold text-gray-900">0€</div>
            <p className="text-xs text-gray-500 mt-2">Aucune heure supp. facturée</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="pb-3 font-medium">Libellé</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Montant</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium text-right">Facture</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {MOCK_PAIEMENTS.map((p) => (
                  <tr key={p.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="font-semibold text-gray-900">{p.label}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">{p.type}</div>
                    </td>
                    <td className="py-4 text-gray-600">{p.date}</td>
                    <td className="py-4 font-bold text-gray-900">{p.amount}</td>
                    <td className="py-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-none">
                        Payé
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-600">
                        <Download size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50/50 border-blue-100">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
            <FileText size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-blue-900">Financement CPF</h4>
            <p className="text-sm text-blue-800 mt-1">
              Saviez-vous que vous pouvez financer vos heures de conduite supplémentaires via votre compte CPF ?
            </p>
            <Button variant="link" className="p-0 h-auto text-blue-600 font-bold mt-2 flex items-center gap-1">
              En savoir plus sur les aides <ChevronRight size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPaiements;

