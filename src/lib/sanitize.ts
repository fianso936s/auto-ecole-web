import DOMPurify from "dompurify";

/**
 * Utilitaire de sanitisation côté frontend avec DOMPurify
 * Utilisé pour nettoyer le contenu HTML avant affichage
 * 
 * Note: React échappe automatiquement les valeurs dans le JSX,
 * donc cette fonction est principalement utile pour:
 * - Le contenu HTML dynamique (si nécessaire)
 * - Les cas où dangerouslySetInnerHTML serait utilisé (à éviter)
 * - La validation côté client avant envoi au serveur
 */

/**
 * Sanitise une chaîne de caractères pour prévenir les attaques XSS
 * @param dirty - La chaîne à sanitiser
 * @returns La chaîne sanitizée
 */
export function sanitizeString(dirty: string | null | undefined): string {
  if (!dirty || typeof dirty !== "string") {
    return "";
  }

  // DOMPurify nettoie le HTML malveillant tout en préservant le texte
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Ne pas autoriser de balises HTML
    ALLOWED_ATTR: [], // Ne pas autoriser d'attributs
    KEEP_CONTENT: true, // Garder le contenu texte mais supprimer les balises
  });
}

/**
 * Vérifie si une chaîne contient du HTML/JavaScript potentiellement dangereux
 * @param input - La chaîne à vérifier
 * @returns true si du HTML est détecté
 */
export function containsHTML(input: string | null | undefined): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  const htmlPattern = /<[^>]*>/i;
  const scriptPattern = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
  const eventPattern = /on\w+\s*=/gi;
  const javascriptPattern = /javascript:/gi;

  return (
    htmlPattern.test(input) ||
    scriptPattern.test(input) ||
    eventPattern.test(input) ||
    javascriptPattern.test(input)
  );
}

/**
 * Valide qu'une chaîne ne contient pas de HTML
 * @param input - La chaîne à valider
 * @throws Error si du HTML est détecté
 */
export function validateNoHTML(input: string | null | undefined): void {
  if (containsHTML(input)) {
    throw new Error("Les balises HTML et JavaScript ne sont pas autorisées");
  }
}

