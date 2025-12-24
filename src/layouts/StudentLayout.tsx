import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  CreditCard,
  FileText,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import { useMe } from "../hooks/useMe";
import { logout } from "../lib/api";
import { toast } from "sonner";

const StudentLayout: React.FC = () => {
  const { user } = useMe();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/");
      window.location.reload();
    } catch (error: any) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const navLinks = [
    { path: "/app", icon: LayoutDashboard, label: "Tableau de bord" },
    { path: "/app/planning", icon: Calendar, label: "Planning" },
    { path: "/app/progression", icon: BarChart3, label: "Ma Progression" },
    { path: "/app/paiements", icon: CreditCard, label: "Paiements" },
    { path: "/app/documents", icon: FileText, label: "Mes Documents" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/app" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              M
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-gray-900 sm:block">
              Moniteur1D
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-400 transition-colors hover:text-indigo-600">
              <Bell size={22} />
            </button>
            <div className="flex items-center gap-3 border-l pl-2 sm:pl-4">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.profile?.firstName || "Élève"}
                </div>
                <div className="text-xs text-gray-500">Permis B • Manuel</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 font-bold text-indigo-700 shadow-sm">
                {user?.profile?.firstName?.[0] || "E"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with secondary nav */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* Horizontal Scrollable Nav */}
        <nav className="scrollbar-hide mb-8 flex gap-2 overflow-x-auto pb-4 sm:gap-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "border border-gray-100 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="bg-transparent">
          <Outlet />
        </div>
      </main>

      {/* Simple Footer for App */}
      <footer className="mt-auto border-t bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="text-sm text-gray-400">
            © 2025 Moniteur1D. Tous droits réservés.
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/app/profile"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
            >
              <User size={16} /> Mon Profil
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600"
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLayout;
