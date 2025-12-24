import React from "react";
import { useMe } from "../../hooks/useMe";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { User, Mail, Phone, MapPin, Award, Settings } from "lucide-react";

const CoachProfile: React.FC = () => {
  const { user } = useMe();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 h-fit">
          <CardContent className="pt-8 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground mb-4 ring-4 ring-primary/10">
              {user?.profile?.firstName?.[0] || "C"}
            </div>
            <h2 className="text-xl font-bold">{user?.profile?.firstName} {user?.profile?.lastName}</h2>
            <p className="text-gray-500 text-sm mt-1">Moniteur Expert</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">ACTIF</Badge>
              <Badge variant="outline">BOÎTE MANUELLE</Badge>
            </div>
            <div className="mt-6 w-full border-t pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={16} className="text-gray-400" />
                {user?.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={16} className="text-gray-400" />
                {user?.profile?.phone || "Non renseigné"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>Mettez à jour vos informations publiques et professionnelles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" defaultValue={user?.profile?.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" defaultValue={user?.profile?.lastName} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie professionnelle</Label>
              <textarea 
                id="bio" 
                rows={4}
                className="w-full rounded-lg border-border text-sm focus:ring-primary p-3 bg-muted"
                placeholder="Décrivez votre expérience et votre pédagogie..."
              />
            </div>
            <div className="space-y-2">
              <Label>Zones couvertes</Label>
              <div className="flex flex-wrap gap-2">
                {["Paris 15e", "Issy-les-Moulineaux", "Vanves"].map(zone => (
                  <Badge key={zone} variant="outline" className="flex items-center gap-1 bg-white">
                    <MapPin size={12} className="text-primary" /> {zone}
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-7 text-primary">+ Ajouter</Button>
              </div>
            </div>
            <div className="pt-4 border-t flex justify-end">
              <Button>Enregistrer les modifications</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-primary" />
            Certifications & Expérience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border shadow-sm">
                  <Award className="text-amber-500" />
                </div>
                <div>
                  <p className="font-semibold">BEPECASER</p>
                  <p className="text-xs text-gray-500">Obtenu en 2018 • ID: 123456789</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white">Vérifié</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachProfile;

