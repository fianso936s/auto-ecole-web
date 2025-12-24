const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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

export async function fetchJson<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
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

