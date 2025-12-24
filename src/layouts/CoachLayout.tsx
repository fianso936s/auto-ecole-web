import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  User,
  PlusCircle,
  Clock,
  ChevronLeft,
  Settings,
  LogOut,
} from "lucide-react";
import { useMe } from "../hooks/useMe";
import { logout } from "../lib/api";
import { toast } from "sonner";

const CoachLayout: React.FC = () => {
  const { user } = useMe();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/coach";

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

  const menuItems = [
    { path: "/coach", icon: Calendar, label: "Planning" },
    { path: "/coach/students", icon: Users, label: "Élèves" },
    { path: "/coach/profile", icon: User, label: "Profil" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-20 md:pb-0 md:pl-64">
      {/* Mobile Header */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
        {!isHome ? (
          <button
            onClick={() => window.history.back()}
            className="-ml-2 p-2 text-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="text-xl font-bold text-primary">M1 Coach</div>
        )}
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500">
            <PlusCircle size={24} className="text-primary" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-blue-100 text-xs font-bold text-blue-700">
            {user?.profile?.firstName?.[0] || "C"}
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 flex-col border-r bg-white md:flex">
        <div className="p-6">
          <div className="text-2xl font-bold text-primary">Moniteur1D</div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-400">
            Espace Moniteur
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t p-4">
          <Link
            to="/coach/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-500 transition-all hover:bg-gray-50"
          >
            <Settings size={20} />
            <span className="text-sm font-medium">Paramètres</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 transition-all hover:bg-red-50"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {isHome && (
          <div className="mb-6 border-b bg-white p-6 md:p-8">
            <div className="mx-auto flex max-w-4xl flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  Bonjour {user?.profile?.firstName || "Coach"} 👋
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-gray-500">
                  <Clock size={16} />
                  Aujourd'hui :{" "}
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-1">
                <button className="flex-none rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover">
                  Nouvelle leçon
                </button>
                <button className="flex-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                  Indisponibilité
                </button>
              </div>
            </div>
          </div>
        )}
        <div className={`p-4 md:p-8 ${!isHome ? "pt-8" : ""}`}>
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 flex h-16 items-center justify-around border-t bg-white px-2 md:hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex h-full w-20 flex-col items-center justify-center transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={24} />
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default CoachLayout;
