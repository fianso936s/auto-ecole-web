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
import { Badge } from "../../components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BarChart3, 
  FileText, 
  CreditCard,
  ChevronRight,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard: React.FC = () => {
  const { user } = useMe();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {user?.profile?.firstName || "Élève"} ! 👋
        </h1>
        <p className="text-gray-500">Prêt pour votre prochaine leçon ?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Lesson Card */}
        <Card className="lg:col-span-2 border-none shadow-md overflow-hidden group">
          <div className="bg-indigo-600 h-2 w-full" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Prochaine leçon</CardTitle>
              <CardDescription>Dans 2 jours</CardDescription>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Calendar size={24} />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-gray-900">22</div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider text-gray-400">Décembre</div>
                    <div className="text-xs font-medium text-indigo-600">Lundi • 14:00 - 16:00</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400" />
                    <span>Rendez-vous : Gare de Lyon, Paris</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Zap size={16} className="text-gray-400" />
                    <span>Moniteur : Jean Moniteur</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="primary" className="w-full md:w-auto">Confirmer</Button>
                <Button variant="ghost" className="w-full md:w-auto text-gray-500">Modifier</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-4">
          <Card className="border-none shadow-sm bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Progression</p>
                  <p className="text-lg font-bold text-gray-900">45% (12/20h)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-green-50/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Solde</p>
                  <p className="text-lg font-bold text-gray-900">À jour</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Documents</p>
                  <p className="text-lg font-bold text-gray-900">1 manquant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Planning", icon: Calendar, link: "/app/planning", color: "bg-purple-100 text-purple-600" },
          { title: "Progression", icon: BarChart3, link: "/app/progression", color: "bg-primary/10 text-primary" },
          { title: "Paiements", icon: CreditCard, link: "/app/paiements", color: "bg-green-100 text-green-600" },
          { title: "Documents", icon: FileText, link: "/app/documents", color: "bg-amber-100 text-amber-600" },
        ].map((item, i) => (
          <Link key={i} to={item.link}>
            <Card className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl ${item.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <item.icon size={24} />
                  </div>
                  <span className="font-bold text-gray-900">{item.title}</span>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;

