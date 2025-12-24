import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserSquare2,
  Car,
  TrendingUp,
  Bell,
  Search,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useMe } from "../hooks/useMe";
import { logout } from "../lib/api";
import { toast } from "sonner";

const AdminLayout: React.FC = () => {
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

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Tableau de bord" },
    { path: "/admin/planning", icon: Calendar, label: "Planning" },
    { path: "/admin/students", icon: Users, label: "Élèves" },
    { path: "/admin/instructors", icon: UserSquare2, label: "Moniteurs" },
    { path: "/admin/vehicles", icon: Car, label: "Véhicules" },
    { path: "/admin/crm", icon: TrendingUp, label: "CRM / Leads" },
  ];

  const currentPath = location.pathname;
  const breadcrumbs = currentPath.split("/").filter(Boolean);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-slate-900 text-white shadow-xl">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-bold">
              M1
            </div>
            <span className="text-xl font-bold tracking-tight">Moniteur1D</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              (item.path !== "/admin" && currentPath.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="z-10 flex h-16 items-center justify-between border-b bg-white px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="capitalize">Admin</span>
            {breadcrumbs.slice(1).map((crumb, i) => (
              <React.Fragment key={i}>
                <ChevronRight size={14} />
                <span className="font-medium capitalize text-gray-900">
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-64 rounded-full border-none bg-gray-100 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button className="relative text-gray-500 transition-colors hover:text-indigo-600">
              <Bell size={22} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-3 border-l pl-6">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.profile?.firstName}{" "}
                  {user?.profile?.lastName || "Admin"}
                </div>
                <div className="text-xs text-gray-500">{user?.role}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 font-bold text-white shadow-sm">
                {user?.profile?.firstName?.[0] || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
