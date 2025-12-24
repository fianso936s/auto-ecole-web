import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import CoachLayout from "./layouts/CoachLayout";
import StudentLayout from "./layouts/StudentLayout";
// Coach Pages
import CoachDashboard from "./pages/coach/Dashboard";
import CoachPlanning from "./pages/coach/Planning";
import CoachStudents from "./pages/coach/Students";
import CoachStudentDetail from "./pages/coach/StudentDetail";
import CoachProfile from "./pages/coach/Profile";
import LessonDetail from "./pages/coach/LessonDetail";
import Home from "./pages/Home";
import Offres from "./pages/Offres";
import Tarifs from "./pages/Tarifs";
import Financement from "./pages/Financement";
import Avis from "./pages/Avis";
import Zones from "./pages/Zones";
import Contact from "./pages/Contact";
import Preinscription from "./pages/Preinscription";
import PaiementSucces from "./pages/PaiementSucces";
import PaiementEchec from "./pages/PaiementEchec";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPlanning from "./pages/admin/Planning";
import AdminStudents from "./pages/admin/Students";
import AdminInstructors from "./pages/admin/Instructors";
import AdminVehicles from "./pages/admin/Vehicles";
import AdminCRM from "./pages/admin/CRM";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentPlanning from "./pages/student/Planning";
import StudentRequests from "./pages/student/Requests";
import StudentProgression from "./pages/student/Progression";
import StudentPaiements from "./pages/student/Paiements";
import StudentDocuments from "./pages/student/Documents";
import StudentExams from "./pages/student/Exams";

import {
  RequireAuth,
  RequireRole,
  Unauthorized,
} from "./components/auth/AuthGuards";
import "./App.css";

// Placeholder Pages
const DashboardPlaceholder = ({ title }: { title: string }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-2 text-gray-600">Contenu en cours de développement...</p>
  </div>
);

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="offres" element={<Offres />} />
          <Route path="tarifs" element={<Tarifs />} />
          <Route path="financement" element={<Financement />} />
          <Route path="avis" element={<Avis />} />
          <Route path="zones" element={<Zones />} />
          <Route path="contact" element={<Contact />} />
          <Route path="preinscription" element={<Preinscription />} />
          <Route path="paiement/succes" element={<PaiementSucces />} />
          <Route path="paiement/echec" element={<PaiementEchec />} />
          <Route path="legal/*" element={<Legal />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Protected Routes - ADMIN */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="planning" element={<AdminPlanning />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="instructors" element={<AdminInstructors />} />
              <Route path="vehicles" element={<AdminVehicles />} />
              <Route path="crm" element={<AdminCRM />} />
            </Route>
          </Route>

          {/* Protected Routes - COACH (ADMIN + INSTRUCTOR) */}
          <Route
            element={<RequireRole allowedRoles={["ADMIN", "INSTRUCTOR"]} />}
          >
            <Route path="/coach" element={<CoachLayout />}>
              <Route index element={<CoachDashboard />} />
              <Route path="planning" element={<CoachPlanning />} />
              <Route path="students" element={<CoachStudents />} />
              <Route path="students/:id" element={<CoachStudentDetail />} />
              <Route path="lessons/:id" element={<LessonDetail />} />
              <Route path="profile" element={<CoachProfile />} />
            </Route>
          </Route>

          {/* Protected Routes - STUDENT */}
          <Route element={<RequireRole allowedRoles={["STUDENT"]} />}>
            <Route path="/app" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="planning" element={<StudentPlanning />} />
              <Route path="demandes" element={<StudentRequests />} />
              <Route path="progression" element={<StudentProgression />} />
              <Route path="paiements" element={<StudentPaiements />} />
              <Route path="documents" element={<StudentDocuments />} />
              <Route path="examens" element={<StudentExams />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
