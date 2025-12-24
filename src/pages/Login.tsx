import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "sonner";
import { login } from "../lib/api";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await login(data);
      toast.success("Connexion réussie !");
      
      // Déterminer la redirection selon le rôle
      const user = response.user || response;
      let redirectPath = from !== "/" ? from : "/";
      
      if (from === "/" && user?.role) {
        switch (user.role) {
          case "ADMIN":
            redirectPath = "/admin";
            break;
          case "INSTRUCTOR":
            redirectPath = "/coach";
            break;
          case "STUDENT":
            redirectPath = "/app";
            break;
        }
      }
      
      navigate(redirectPath, { replace: true });
      // Recharger la page pour mettre à jour le hook useMe
      setTimeout(() => window.location.reload(), 100);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600">
              <span className="text-2xl font-bold text-white">M1</span>
            </div>
            <CardTitle className="text-3xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 dark:bg-slate-800">
                    Comptes de test
                  </span>
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-blue-50 p-4 text-sm dark:bg-blue-900/20">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  🔐 Comptes de test disponibles :
                </p>
                <div className="space-y-2 text-xs text-blue-800 dark:text-blue-200">
                  <div className="rounded bg-white/50 p-2 dark:bg-blue-800/30">
                    <p className="font-semibold">👑 Admin</p>
                    <p className="font-mono">admin@moniteur1d.fr</p>
                    <p className="font-mono">password123</p>
                  </div>
                  <div className="rounded bg-white/50 p-2 dark:bg-blue-800/30">
                    <p className="font-semibold">👨‍🏫 Moniteur</p>
                    <p className="font-mono">jean.moniteur@moniteur1d.fr</p>
                    <p className="font-mono">password123</p>
                  </div>
                  <div className="rounded bg-white/50 p-2 dark:bg-blue-800/30">
                    <p className="font-semibold">🎓 Élève</p>
                    <p className="font-mono">student1@moniteur1d.fr</p>
                    <p className="font-mono">password123</p>
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-blue-600 dark:text-blue-300">
                  💡 Exécutez <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">npm run prisma:seed</code> dans moniteur1d-api pour créer ces comptes
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <Link
                to="/"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;

