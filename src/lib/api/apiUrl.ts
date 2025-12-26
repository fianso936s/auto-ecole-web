const DEV_DEFAULT = ""; // Utiliser le proxy Vite en développement (chemin relatif)
const PROD_URL = "https://api.moniteur1d.com";

const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

export const resolveApiBaseUrl = (): string => {
  // 1. Priorité à la variable d'env
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) {
    console.log('[API URL] Utilisation de VITE_API_URL:', envUrl);
    return normalizeUrl(envUrl);
  }

  // 2. Vérifier si on est en mode développement Vite
  const isDev = import.meta.env.DEV;
  
  // 3. Si on est en production (pas localhost), on force l'URL de l'API
  if (typeof window !== "undefined") {
    const { hostname, port } = window.location;
    const isLocalhost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(hostname) || 
                        (hostname === '' && (port === '5173' || port === '5174'));
    
    if (!isLocalhost && !isDev) {
      console.log('[API URL] Mode production détecté, utilisation de:', PROD_URL);
      return PROD_URL;
    }
  }

  // 4. En développement, utiliser le proxy Vite (chemin relatif)
  // Le proxy Vite redirigera automatiquement vers http://localhost:3001
  // Cela évite les problèmes CORS et permet au proxy de gérer les cookies correctement
  if (isDev) {
    console.log('[API URL] Mode développement, utilisation du proxy Vite (chemin relatif)');
  }
  return DEV_DEFAULT; // "" = chemin relatif, utilise le proxy Vite
};

