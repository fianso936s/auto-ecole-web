import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useMe, type Role } from "../../hooks/useMe";

export const RequireAuth: React.FC = () => {
  const { user, loading } = useMe();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const RequireRole: React.FC<{ allowedRoles: Role[] }> = ({
  allowedRoles,
}) => {
  const { user, loading } = useMe();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export const Unauthorized: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-red-600">Accès refusé</h1>
      <p className="mb-8 text-lg text-gray-600">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <button
        onClick={() => window.history.back()}
        className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Retour
      </button>
    </div>
  );
};
