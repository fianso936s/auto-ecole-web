import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Plus, 
  Car, 
  Settings2, 
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { vehiclesApi } from "../../lib/api/vehicles";
import { toast } from "sonner";
import { useSocketEvent } from "../../hooks/useSocketEvent";

const AdminVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useSocketEvent("vehicle:create", () => fetchVehicles());
  useSocketEvent("vehicle:update", () => fetchVehicles());
  useSocketEvent("vehicle:delete", () => fetchVehicles());

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.list();
      setVehicles(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des véhicules");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await vehiclesApi.toggleActive(id, !currentStatus);
      toast.success("Statut du véhicule mis à jour");
      fetchVehicles();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Véhicules</h1>
          <p className="text-gray-500">Gérez votre parc automobile et les transmissions.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Car size={24} />
              </div>
              <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">Total</Badge>
            </div>
            <div className="text-3xl font-bold text-blue-900">{vehicles.length}</div>
            <p className="text-sm text-primary font-medium mt-1">Véhicules enregistrés</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">Actifs</Badge>
            </div>
            <div className="text-3xl font-bold text-emerald-900">
              {vehicles.filter(v => v.isActive).length}
            </div>
            <p className="text-sm text-emerald-600 font-medium mt-1">Prêts pour les leçons</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Settings2 size={24} />
              </div>
              <Badge variant="outline" className="bg-white border-amber-200 text-amber-700">Auto</Badge>
            </div>
            <div className="text-3xl font-bold text-amber-900">
              {vehicles.filter(v => v.transmission === "AUTO").length}
            </div>
            <p className="text-sm text-amber-600 font-medium mt-1">Véhicules automatiques</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par plaque, nom..."
              className="w-full rounded-lg border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">Chargement...</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-3 font-medium">Véhicule</th>
                    <th className="pb-3 font-medium">Immatriculation</th>
                    <th className="pb-3 font-medium">Transmission</th>
                    <th className="pb-3 font-medium">Statut</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <Car size={20} />
                          </div>
                          <div className="font-semibold text-gray-900">{vehicle.name}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-bold text-gray-700 border">
                          {vehicle.plateNumber}
                        </span>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary" className={
                          vehicle.transmission === "MANUAL" ? "bg-slate-100 text-slate-700" : "bg-indigo-100 text-indigo-700"
                        }>
                          {vehicle.transmission === "MANUAL" ? "Manuelle" : "Automatique"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <button 
                          onClick={() => handleToggleActive(vehicle.id, vehicle.isActive)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            vehicle.isActive 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {vehicle.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {vehicle.isActive ? "Actif" : "Hors service"}
                        </button>
                      </td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="sm">Modifier</Button>
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

export default AdminVehicles;
