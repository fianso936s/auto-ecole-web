import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Galerie from "./pages/Galerie";
import Tarifs from "./pages/Tarifs";
import Reservation from "./pages/Reservation";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./contexts/AuthContext";
import { CrmDataProvider } from "./contexts/CrmDataContext";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Prospects from "./pages/admin/Prospects";
import Clients from "./pages/admin/Clients";
import Comptes from "./pages/admin/Comptes";
import Agenda from "./pages/admin/Agenda";

function App() {
  return (
    <AuthProvider>
      <CrmDataProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* Site public bayaNail */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="galerie" element={<Galerie />} />
              <Route path="soins" element={<Tarifs />} />
              <Route path="reservation" element={<Reservation />} />
            </Route>

            {/* CRM Admin bayaNail */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="prospects" element={<Prospects />} />
              <Route path="clients" element={<Clients />} />
              <Route path="comptes" element={<Comptes />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CrmDataProvider>
    </AuthProvider>
  );
}

export default App;
