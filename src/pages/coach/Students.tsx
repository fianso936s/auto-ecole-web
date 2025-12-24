import React, { useState, useEffect } from "react";
import { studentsApi } from "../../lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Search, User, Mail, Phone, ChevronRight, BarChart3 } from "lucide-react";

import { useNavigate } from "react-router-dom";

const CoachStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyStudents = async () => {
      try {
        const data = await studentsApi.list({});
        setStudents(data);
      } catch (error) {
        console.error("Error fetching coach students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mes Élèves</h2>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Rechercher un élève..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Chargement de vos élèves...</div>
      ) : filteredStudents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-gray-500">
            Aucun élève trouvé.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {student.firstName} {student.lastName}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{student.profile?.phone || "Pas de téléphone"}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    Actif
                  </Badge>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Progression</p>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '45%' }} />
                      </div>
                      <span className="text-xs font-semibold">45%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Dernière leçon</p>
                    <p className="text-xs font-medium text-gray-700">20 Déc. 2023</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/coach/students/${student.id}`)}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Progression
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/coach/students/${student.id}`)}
                  >
                    Profil <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoachStudents;

