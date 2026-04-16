import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate("/admin");
    } else {
      setError("Email ou mot de passe incorrect");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-nude/20">
              <Sparkles className="h-8 w-8 text-rose-nude" />
            </div>
            <h1 className="text-2xl font-bold text-white">bayaNail CRM</h1>
            <p className="mt-1 text-sm text-gray-400">Espace administration</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bayanail.com"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-rose-nude focus:ring-2 focus:ring-rose-nude/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-gray-500 outline-none transition focus:border-rose-nude focus:ring-2 focus:ring-rose-nude/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-rose-dark px-4 py-3 font-medium text-white transition-all hover:bg-rose-nude hover:shadow-lg hover:shadow-rose-dark/25 active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Connectez-vous avec vos identifiants administrateur
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
