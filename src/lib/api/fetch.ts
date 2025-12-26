import { resolveApiBaseUrl } from "./apiUrl";

const API_URL = resolveApiBaseUrl();

// Variable pour éviter les boucles infinies de refresh
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function attemptRefresh(): Promise<void> {
  // Si un refresh est déjà en cours, attendre qu'il se termine
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Refresh failed");
      }
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Récupère le token CSRF depuis le cookie ou le récupère depuis l'API
 */
async function getCSRFToken(): Promise<string | null> {
  // Essayer d'abord de récupérer depuis le cookie
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrf-token="))
    ?.split("=")[1];

  if (cookieToken) {
    return cookieToken;
  }

  // Sinon, récupérer depuis l'API
  try {
    const response = await fetch(`${API_URL}/auth/csrf-token`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data.csrfToken || null;
    }
  } catch (error) {
    console.warn("Impossible de récupérer le token CSRF:", error);
  }

  return null;
}

export async function fetchJson<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOn401: boolean = true
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Ajouter le token CSRF pour les méthodes modifiantes
  const modifyingMethods = ["POST", "PUT", "PATCH", "DELETE"];
  if (modifyingMethods.includes(options.method || "")) {
    const csrfToken = await getCSRFToken();
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
      
      // Ajouter aussi dans le body si c'est une requête JSON
      if (!(options.body instanceof FormData) && options.body) {
        try {
          const bodyData = JSON.parse(options.body as string);
          bodyData.csrfToken = csrfToken;
          options.body = JSON.stringify(bodyData);
        } catch {
          // Si le body n'est pas du JSON valide, on garde le header seulement
        }
      }
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: options.credentials || "include",
    });
  } catch (error: any) {
    // Gestion des erreurs réseau (connexion refusée, timeout, etc.)
    if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      // Ne pas logger en console pour éviter le bruit - l'erreur sera gérée par le composant
      throw new ApiError(
        0,
        "Impossible de se connecter au serveur. Vérifiez que le backend est démarré.",
        { networkError: true, originalError: error.message }
      );
    }
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  // Si 401 et que ce n'est pas déjà une tentative de refresh, essayer de rafraîchir
  if (!response.ok && response.status === 401 && retryOn401 && endpoint !== "/auth/refresh") {
    try {
      await attemptRefresh();
      // Réessayer la requête originale après refresh
      return fetchJson<T>(endpoint, options, false); // false pour éviter les boucles
    } catch (refreshError) {
      // Si le refresh échoue, lancer l'erreur originale
      throw new ApiError(
        response.status,
        data.message || "Session expirée. Veuillez vous reconnecter.",
        data
      );
    }
  }

  if (!response.ok) {
    // 409 conflict => message spécifique
    if (response.status === 409) {
      throw new ApiError(409, data.message || "Conflit : cette ressource existe déjà ou est en conflit.", data);
    }
    throw new ApiError(
      response.status,
      data.message || "Une erreur est survenue",
      data
    );
  }

  return data as T;
}

