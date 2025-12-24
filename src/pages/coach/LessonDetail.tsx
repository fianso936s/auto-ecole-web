import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonsApi } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Car, 
  CheckCircle, 
  XCircle, 
  Save, 
  Eraser,
  ChevronLeft
} from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const SKILL_CATEGORIES = [
  {
    id: "cat1",
    name: "Maîtriser le véhicule",
    skills: [
      { id: "s1", name: "Installer et sécuriser" },
      { id: "s2", name: "Démarrer et s'arrêter" },
      { id: "s3", name: "Diriger le véhicule" },
    ]
  },
  {
    id: "cat2",
    name: "Appréhender la route",
    skills: [
      { id: "s4", name: "Choisir la position" },
      { id: "s5", name: "Franchir les intersections" },
      { id: "s6", name: "Changer de direction" },
    ]
  }
];

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [summary, setSummary] = useState("");
  const [nextGoals, setNextGoals] = useState("");
  const [skillRatings, setSkillRatings] = useState<Record<string, { level: number, comment: string }>>({});
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        if (!id) return;
        const data = await lessonsApi.get(id);
        setLesson(data);
        setSummary(data.report?.summary || "");
        setNextGoals(data.report?.nextGoals || "");
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
        toast.error("Erreur lors du chargement de la leçon");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleMarkPresent = async () => {
    try {
      if (!id) return;
      await lessonsApi.update(id, { status: "IN_PROGRESS" });
      setLesson({ ...lesson, status: "IN_PROGRESS" });
      toast.success("Élève marqué présent");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleNoShow = async () => {
    try {
      if (!id) return;
      await lessonsApi.update(id, { status: "NO_SHOW" });
      setLesson({ ...lesson, status: "NO_SHOW" });
      toast.success("Élève marqué absent (No-show)");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleSkillChange = (skillId: string, level: number) => {
    setSkillRatings(prev => ({
      ...prev,
      [skillId]: { ...prev[skillId], level }
    }));
  };

  const handleSkillCommentChange = (skillId: string, comment: string) => {
    setSkillRatings(prev => ({
      ...prev,
      [skillId]: { ...prev[skillId], comment }
    }));
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleSubmit = async () => {
    if (!id) return;
    if (sigCanvas.current?.isEmpty()) {
      toast.error("La signature de l'élève est requise");
      return;
    }

    setSubmitting(true);
    try {
      const signatureDataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
      
      // 1. Save skills
      const skillsArray = Object.entries(skillRatings).map(([skillId, data]) => ({
        skillId,
        level: data.level,
        comment: data.comment
      }));
      if (skillsArray.length > 0) {
        await lessonsApi.saveSkills(id, skillsArray);
      }

      // 2. Complete lesson
      await lessonsApi.complete(id, {
        summary,
        nextGoals,
        signatureDataUrl
      });

      toast.success("Leçon terminée avec succès");
      navigate("/coach");
    } catch (error) {
      console.error("Failed to complete lesson:", error);
      toast.error("Erreur lors de la validation de la leçon");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!lesson) return <div className="p-8 text-center text-red-500">Leçon introuvable</div>;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            Détails de la séance
          </h2>
          <p className="text-gray-500">
            {format(new Date(lesson.startTime), "EEEE d MMMM", { locale: fr })}
          </p>
        </div>
        <Badge className="text-lg py-1 px-4">{lesson.status}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="font-semibold">{lesson.student?.firstName} {lesson.student?.lastName}</p>
                <p className="text-xs text-gray-500">Élève</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-semibold">
                  {format(new Date(lesson.startTime), "HH:mm")} - {format(new Date(lesson.endTime), "HH:mm")}
                </p>
                <p className="text-xs text-gray-500">Horaires</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-semibold">{lesson.location || "Lieu de rendez-vous"}</p>
                <p className="text-xs text-gray-500">Lieu</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <Car size={20} />
              </div>
              <div>
                <p className="font-semibold">{lesson.vehicle?.brand} {lesson.vehicle?.model}</p>
                <p className="text-xs text-gray-500">{lesson.vehicle?.plate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">Présence</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
              disabled={lesson.status !== "CONFIRMED"}
              onClick={handleMarkPresent}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Marquer présent
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-600 hover:bg-red-50 h-12 text-lg"
              disabled={lesson.status !== "CONFIRMED"}
              onClick={handleNoShow}
            >
              <XCircle className="mr-2 h-5 w-5" />
              Élève absent (No-show)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rapport de séance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="summary">Résumé de la séance</Label>
            <Textarea 
              id="summary" 
              placeholder="Qu'avons-nous travaillé aujourd'hui ?"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <Label>Compétences travaillées</Label>
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{cat.name}</h4>
                <div className="grid gap-4">
                  {cat.skills.map((skill) => (
                    <div key={skill.id} className="rounded-lg border bg-gray-50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{skill.name}</span>
                        <div className="flex items-center gap-1">
                          {[0, 1, 2, 3].map((level) => (
                            <button
                              key={level}
                              onClick={() => handleSkillChange(skill.id, level)}
                              className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${
                                (skillRatings[skill.id]?.level ?? -1) >= level 
                                  ? "bg-primary border-primary text-primary-foreground" 
                                  : "bg-card text-muted-foreground"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Input 
                        placeholder="Commentaire sur cette compétence..."
                        className="bg-white"
                        value={skillRatings[skill.id]?.comment || ""}
                        onChange={(e) => handleSkillCommentChange(skill.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextGoals">Objectifs pour la prochaine fois</Label>
            <Textarea 
              id="nextGoals" 
              placeholder="Points à améliorer..."
              value={nextGoals}
              onChange={(e) => setNextGoals(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Signature de l'élève</Label>
              <Button variant="ghost" size="sm" onClick={clearSignature} className="text-gray-500">
                <Eraser className="mr-1 h-3 w-3" /> Effacer
              </Button>
            </div>
            <div className="rounded-lg border-2 border-dashed bg-white overflow-hidden h-40">
              <SignatureCanvas 
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ className: "w-full h-full" }}
              />
            </div>
          </div>

          <Button 
            className="w-full h-12 text-lg" 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Enregistrement..." : "Terminer et valider la séance"}
            <Save className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonDetail;
