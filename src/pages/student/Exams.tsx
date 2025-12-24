import React, { useEffect, useState } from "react";
import { examsApi } from "../../lib/api";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const StudentExams: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await examsApi.list();
        setExams(data);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Mes Examens</h1>
        <p className="text-gray-500">Suivez vos dates d'examen et vos résultats.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Chargement...</div>
      ) : exams.length === 0 ? (
        <Card className="border-dashed bg-transparent">
          <CardContent className="py-12 text-center text-gray-400">
            Aucun examen prévu ou passé pour le moment.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="border-none shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={`p-6 md:w-48 flex flex-col justify-center items-center text-center text-white ${
                  exam.status === "PASSED" ? "bg-green-600" :
                  exam.status === "FAILED" ? "bg-red-600" :
                  "bg-blue-600"
                }`}>
                  <Award size={32} className="mb-2" />
                  <div className="text-sm font-bold uppercase tracking-widest opacity-80">{exam.type}</div>
                  <div className="text-2xl font-black mt-1">
                    {exam.status === "PASSED" ? "Réussi" : 
                     exam.status === "FAILED" ? "Échec" : 
                     "Prévu"}
                  </div>
                </div>
                <CardContent className="flex-1 p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">Examen {exam.type}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(new Date(exam.date), "d MMMM yyyy", { locale: fr })}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {format(new Date(exam.date), "HH:mm")}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {exam.location}</span>
                      </div>
                    </div>
                    {exam.resultNote && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border">
                        <span className="text-xs font-bold text-gray-400 uppercase">Note</span>
                        <span className="text-xl font-black text-gray-900">{exam.resultNote}/31</span>
                      </div>
                    )}
                  </div>

                  {exam.status === "FAILED" && exam.examinerComments && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 space-y-2">
                      <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                        <AlertCircle size={16} />
                        Commentaires de l'examinateur
                      </div>
                      <p className="text-sm text-red-600 leading-relaxed italic">
                        "{exam.examinerComments}"
                      </p>
                    </div>
                  )}

                  {exam.status === "PASSED" && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-green-600" />
                      <div>
                        <p className="text-sm font-bold text-green-900">Félicitations !</p>
                        <p className="text-xs text-green-700">Vous recevrez votre permis définitif par courrier sous peu.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentExams;

