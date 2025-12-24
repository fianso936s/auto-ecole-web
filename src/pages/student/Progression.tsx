import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  BarChart3, 
  CheckCircle2, 
  Target, 
  Award,
  Zap,
  Clock,
  ChevronRight
} from "lucide-react";

const SKILLS_CATEGORIES = [
  {
    name: "Maîtriser le véhicule",
    progress: 85,
    skills: [
      { name: "Démarrage et arrêt", status: "ACQUIRED" },
      { name: "Passage des vitesses", status: "ACQUIRED" },
      { name: "Maintien de la trajectoire", status: "IN_PROGRESS" },
    ]
  },
  {
    name: "Appréhender la route",
    progress: 40,
    skills: [
      { name: "Signalisation", status: "IN_PROGRESS" },
      { name: "Règles de priorité", status: "NOT_STARTED" },
      { name: "Adaptation de la vitesse", status: "IN_PROGRESS" },
    ]
  },
  {
    name: "Partager l'espace public",
    progress: 15,
    skills: [
      { name: "Usagers vulnérables", status: "NOT_STARTED" },
      { name: "Communication", status: "NOT_STARTED" },
    ]
  }
];

const StudentProgression: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ma Progression</h1>
        <p className="text-gray-500">Suivez votre évolution vers l'obtention du permis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <Badge variant="outline" className="border-white/30 text-white bg-white/10">Global</Badge>
            </div>
            <div className="text-4xl font-bold mb-2">45%</div>
            <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-white" style={{ width: '45%' }} />
            </div>
            <p className="text-xs text-white/70 mt-4">12 heures effectuées sur 20h minimum</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <Target size={20} />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Objectif</Badge>
            </div>
            <div className="text-lg font-bold text-gray-900">Examen Blanc</div>
            <p className="text-sm text-gray-500 mt-1">Prévu après 18h de conduite</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gray-400">
              <div className="h-2 w-2 rounded-full bg-gray-200" />
              Dans environ 6 leçons
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Award size={20} />
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">Code</Badge>
            </div>
            <div className="text-lg font-bold text-gray-900">Validé !</div>
            <p className="text-sm text-gray-500 mt-1">Obtenu le 12 Oct. 2023</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-green-600">
              <CheckCircle2 size={14} />
              Dossier complet en préfecture
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Compétences REMC</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SKILLS_CATEGORIES.map((category, idx) => (
            <Card key={idx} className="border-none shadow-sm overflow-hidden group">
              <CardHeader className="bg-gray-50/50 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <span className="text-sm font-bold text-indigo-600">{category.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-200 mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${category.progress}%` }} />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {category.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          skill.status === "ACQUIRED" ? "bg-green-100 text-green-600" :
                          skill.status === "IN_PROGRESS" ? "bg-primary/10 text-primary" :
                          "bg-gray-100 text-gray-400"
                        }`}>
                          {skill.status === "ACQUIRED" ? <CheckCircle2 size={14} /> : 
                           skill.status === "IN_PROGRESS" ? <Zap size={14} /> : 
                           <Clock size={14} />}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] uppercase tracking-tighter border-none ${
                        skill.status === "ACQUIRED" ? "bg-green-50 text-green-700" :
                        skill.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700" :
                        "bg-gray-50 text-gray-400"
                      }`}>
                        {skill.status.replace('_', ' ')}
                      </Badge>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" className="w-full mt-4 text-gray-400 text-xs hover:text-indigo-600">
                  Détails de la grille <ChevronRight size={12} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgression;

