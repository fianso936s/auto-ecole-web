const DEV_DEFAULT = ""; // Utiliser le proxy Vite en développement (chemin relatif)
const PROD_URL = "https://api.moniteur1d.com";

const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

export const resolveApiBaseUrl = (): string => {
  // 1. Priorité à la variable d'env
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return normalizeUrl(envUrl);

  // 2. Si on est en production (pas localhost), on force l'URL de l'API
  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (!/^(localhost|127\.0\.0\.1)/i.test(hostname)) {
      return PROD_URL;
    }
  }

  // 3. En développement, utiliser le proxy Vite (chemin relatif)
  // Le proxy redirige /api vers http://localhost:3001
  return DEV_DEFAULT;
};

