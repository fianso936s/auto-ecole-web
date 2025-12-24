import React, { useState, useEffect } from "react";
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
import { studentsApi } from "../../lib/api/students";
import { instructorsApi } from "../../lib/api/instructors";
import { vehiclesApi } from "../../lib/api/vehicles";

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
    studentId: "",
    instructorId: "",
    vehicleId: "",
    startAt: "",
    endAt: "",
    location: "Centre Ville",
  });

  const [students, setStudents] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        studentId: initialData?.studentId || "",
        instructorId: initialData?.instructorId || "",
        vehicleId: initialData?.vehicleId || "",
        startAt: initialData?.startAt || initialData?.start || "",
        endAt: initialData?.endAt || initialData?.end || "",
        location: initialData?.location || "Centre Ville",
      });
      fetchData();
    }
  }, [isOpen, initialData]);

  const fetchData = async () => {
    try {
      const [s, i, v] = await Promise.all([
        studentsApi.list(),
        instructorsApi.list(),
        vehiclesApi.list()
      ]);
      setStudents(s);
      setInstructors(i);
      setVehicles(v);
    } catch (error) {
      console.error("Failed to fetch data for modal");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatDateTimeLocal = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    } catch {
      return "";
    }
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
            {/* Student selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User size={16} className="text-indigo-500" />
                Élève
              </Label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.studentId}
                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                required
              >
                <option value="">Sélectionner un élève</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
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
                  required
                >
                  <option value="">Sélectionner</option>
                  {instructors.map(i => (
                    <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>
                  ))}
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
                  <option value="">Facultatif</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.transmission})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  Début
                </Label>
                <Input 
                  type="datetime-local" 
                  value={formatDateTimeLocal(formData.startAt)}
                  onChange={(e) => setFormData({...formData, startAt: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Fin
                </Label>
                <Input 
                  type="datetime-local" 
                  value={formatDateTimeLocal(formData.endAt)}
                  onChange={(e) => setFormData({...formData, endAt: e.target.value})}
                  required
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
                required
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

