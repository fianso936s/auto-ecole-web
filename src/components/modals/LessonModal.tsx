import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Search, MapPin, Calendar, Clock, Car, User } from "lucide-react";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    studentId: initialData?.studentId || "",
    instructorId: initialData?.instructorId || "",
    vehicleId: initialData?.vehicleId || "",
    startAt: initialData?.start || "",
    endAt: initialData?.end || "",
    location: initialData?.location || "Centre Ville",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {initialData?.id ? "Modifier la leçon" : "Nouvelle leçon"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Student Search */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User size={16} className="text-indigo-500" />
                Élève
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Rechercher un élève..." 
                  className="pl-10"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                />
              </div>
            </div>

            {/* Instructor & Vehicle */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User size={16} className="text-emerald-500" />
                  Moniteur
                </Label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.instructorId}
                  onChange={(e) => setFormData({...formData, instructorId: e.target.value})}
                >
                  <option value="">Sélectionner</option>
                  <option value="1">Jean Dupont</option>
                  <option value="2">Marie Curie</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Car size={16} className="text-amber-500" />
                  Véhicule
                </Label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                >
                  <option value="">Sélectionner</option>
                  <option value="1">Peugeot 208 (MANUAL)</option>
                  <option value="2">Renault Zoe (AUTO)</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  Début
                </Label>
                <Input 
                  type="datetime-local" 
                  value={formData.startAt ? new Date(formData.startAt).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setFormData({...formData, startAt: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" />
                  Fin
                </Label>
                <Input 
                  type="datetime-local" 
                  value={formData.endAt ? new Date(formData.endAt).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setFormData({...formData, endAt: e.target.value})}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin size={16} className="text-red-500" />
                Lieu de rendez-vous
              </Label>
              <Input 
                placeholder="Ex: Gare de Lyon, Agence..." 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              {initialData?.id ? "Enregistrer les modifications" : "Créer la leçon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonModal;

