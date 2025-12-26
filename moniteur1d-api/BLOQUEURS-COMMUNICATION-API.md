# 🔒 Éléments qui peuvent bloquer la communication API

Ce document liste tous les éléments qui peuvent empêcher ou bloquer la communication entre le frontend et l'API.

---

## 1. ⚠️ CORS (Cross-Origin Resource Sharing)

### Problème
Les requêtes depuis une origine non autorisée sont bloquées.

### Configuration actuelle
```76:98:moniteur1d-api/src/index.ts
app.use(cors({
  origin: (origin, callback) => {
    // En développement, permettre les requêtes sans origine (ex: Postman, curl)
    if (!origin && process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    // Vérifier si l'origine est autorisée
    if (!origin || allowedCorsOrigins.some(allowed => {
      if (typeof allowed === "string") {
        return allowed === origin;
      }
      return allowed.test(origin);
    })) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"],
}));
```

### Origines autorisées par défaut
```41:49:moniteur1d-api/src/index.ts
const allowedCorsOrigins: Array<string | RegExp> = [
  "https://www.moniteur1d.com",
  "https://moniteur1d.com",
  "http://localhost:5173",
  "http://localhost:5174", // Port alternatif Vite
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  /\.moniteur1d\.com$/,
];
```

### Solutions
- **En développement** : Les requêtes sans origine (Postman, curl) sont autorisées si `NODE_ENV !== "production"`
- **Ajouter une origine** : Définir `FRONTEND_URL` dans `.env` (peut contenir plusieurs URLs séparées par des virgules)
- **Erreur** : `"Not allowed by CORS"` → Vérifier que l'origine du frontend est dans la liste

---

## 2. 🚦 Rate Limiting (Limitation de débit)

### Limite globale
```62:68:moniteur1d-api/src/index.ts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes effectuées depuis cette adresse IP, réessayez plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Limite spécifique pour l'authentification
```12:18:moniteur1d-api/src/routes/auth.routes.ts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 tentatives par IP
  message: "Trop de tentatives de connexion, réessayez dans 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Problème
- **100 requêtes max** par IP toutes les 15 minutes (toutes routes confondues)
- **10 tentatives max** de connexion par IP toutes les 15 minutes
- Message d'erreur : `"Trop de requêtes effectuées depuis cette adresse IP"`

### Solution
- Attendre 15 minutes ou changer d'IP
- En développement, réduire les limites si nécessaire

---

## 3. 🔐 Authentification (Middleware)

### Problème
Les routes protégées nécessitent un token JWT valide dans les cookies.

### Middleware d'authentification
```13:75:moniteur1d-api/src/middleware/auth.ts
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // Si pas de token du tout, retourner 401
  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  // ... vérification des tokens ...
```

### Erreurs possibles
- `401 - "Non authentifié"` : Aucun token présent
- `401 - "Session expirée. Veuillez vous reconnecter."` : RefreshToken invalide
- `401 - "Utilisateur non trouvé"` : Utilisateur supprimé de la base

### Solution
- S'assurer que les cookies sont envoyés avec les requêtes (`credentials: 'include'` côté frontend)
- Vérifier que les cookies ne sont pas bloqués par le navigateur

---

## 4. 🛡️ Autorisation (Rôles)

### Problème
Certaines routes nécessitent un rôle spécifique (ADMIN, INSTRUCTOR, etc.).

### Middleware d'autorisation
```77:84:moniteur1d-api/src/middleware/auth.ts
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }
    next();
  };
};
```

### Erreur
- `403 - "Accès refusé"` : Rôle insuffisant

---

## 5. 🗄️ Base de données (Prisma)

### Problème
Si la connexion à la base de données échoue, toutes les requêtes qui nécessitent la DB échouent.

### Configuration
```1:5:moniteur1d-api/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### Causes possibles
- `DATABASE_URL` manquante ou incorrecte dans `.env`
- Base de données inaccessible (réseau, firewall)
- Credentials incorrects
- Timeout de connexion
- Pool de connexions saturé

### Erreurs
- `P1001: Can't reach database server`
- `P1000: Authentication failed`
- `P1017: Server has closed the connection`

### Solution
- Vérifier `DATABASE_URL` dans `.env`
- Tester la connexion : `npm run check:db`
- Vérifier les logs du serveur

---

## 6. 🍪 Cookies (Configuration)

### Problème
En production, les cookies nécessitent HTTPS et une configuration stricte.

### Configuration des cookies
```52:57:moniteur1d-api/src/middleware/auth.ts
res.cookie("accessToken", newAccessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 15 * 60 * 1000 // 15 mins
});
```

### En production
- `secure: true` → Nécessite HTTPS
- `sameSite: "strict"` → Cookies bloqués si origine différente

### Solution
- En développement : Utiliser HTTP avec `sameSite: "lax"`
- En production : Utiliser HTTPS et vérifier que le domaine correspond

---

## 7. 📦 Taille des payloads

### Limite
```108:108:moniteur1d-api/src/index.ts
app.use(express.json({ limit: "10kb" })); // Protection against large payloads
```

### Problème
Les requêtes avec un body > 10kb sont rejetées.

### Erreur
- `413 - Payload Too Large`

### Solution
- Augmenter la limite si nécessaire (attention aux attaques DoS)
- Optimiser les données envoyées

---

## 8. 🔑 Variables d'environnement manquantes

### Variables critiques
- `DATABASE_URL` → Connexion à la base de données
- `JWT_SECRET` → Signature des tokens (défaut : `"access_secret"`)
- `JWT_REFRESH_SECRET` → Signature des refresh tokens (défaut : `"refresh_secret"`)
- `FRONTEND_URL` → Pour CORS et redirections
- `ADMIN_PASSWORD` ou `UNIFORM_PASSWORD` → Création de l'admin

### Problème
- Si `JWT_SECRET` manque, les tokens peuvent être invalides
- Si `DATABASE_URL` manque, aucune connexion DB possible

---

## 9. 🛡️ Helmet (Sécurité HTTP)

### Configuration
```72:75:moniteur1d-api/src/index.ts
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));
```

### Problème
Helmet peut bloquer certaines requêtes selon les headers HTTP.

### Solution
- Configuration actuelle : `cross-origin` autorisé
- `crossOriginEmbedderPolicy: false` → Désactivé pour éviter les problèmes

---

## 10. 🚫 HPP (HTTP Parameter Pollution)

### Configuration
```100:100:moniteur1d-api/src/index.ts
app.use(hpp() as any);
```

### Problème
Bloque les paramètres HTTP dupliqués (protection contre les attaques).

### Solution
- Normalement transparent, mais peut rejeter des requêtes malformées

---

## 11. ✅ Validation (Zod)

### Problème
Les schémas de validation Zod peuvent rejeter les requêtes invalides.

### Exemple
```20:21:moniteur1d-api/src/routes/auth.routes.ts
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
```

### Erreur
- `400 - Bad Request` avec détails des erreurs de validation

---

## 12. 🔄 Proxy (Trust Proxy)

### Configuration
```38:39:moniteur1d-api/src/index.ts
// Trust proxy (Nginx reverse proxy)
app.set('trust proxy', true);
```

### Problème
Si derrière un proxy (Nginx), l'IP réelle peut être incorrecte, affectant le rate limiting.

### Solution
- `trust proxy: true` → Fait confiance au header `X-Forwarded-For`

---

## 13. 🌐 Socket.io (WebSocket)

### Configuration CORS
```8:10:moniteur1d-api/src/lib/socket.ts
cors: {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
```

### Problème
Les connexions WebSocket peuvent être bloquées si l'origine n'est pas autorisée.

---

## 📋 Checklist de diagnostic

### 1. Vérifier CORS
```bash
# Tester depuis le frontend
curl -H "Origin: http://localhost:5173" http://localhost:3001/health
```

### 2. Vérifier la base de données
```bash
cd moniteur1d-api
npm run check:db
```

### 3. Vérifier les variables d'environnement
```bash
cd moniteur1d-api
# Vérifier que .env existe et contient les variables nécessaires
cat .env | grep -E "(DATABASE_URL|JWT_SECRET|FRONTEND_URL)"
```

### 4. Tester l'authentification
```bash
cd moniteur1d-api
npm run test:login -- admin@moniteur1d.com lounes92
```

### 5. Vérifier le serveur
```bash
curl http://localhost:3001/health
```

### 6. Vérifier les logs
- Regarder les logs du serveur pour les erreurs
- Vérifier les erreurs dans la console du navigateur (F12)

---

## 🎯 Solutions rapides

### Problème : CORS bloqué
```env
# Dans moniteur1d-api/.env
FRONTEND_URL="http://localhost:5173,http://localhost:5174"
```

### Problème : Rate limiting trop strict
Modifier les limites dans `src/index.ts` et `src/routes/auth.routes.ts`

### Problème : Cookies non envoyés
Vérifier côté frontend :
```typescript
fetch(url, {
  credentials: 'include', // Important !
  // ...
})
```

### Problème : Base de données inaccessible
```bash
# Vérifier DATABASE_URL
cd moniteur1d-api
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

---

## 📝 Notes importantes

1. **En développement** : Les requêtes sans origine sont autorisées (Postman, curl)
2. **En production** : CORS strict, cookies sécurisés (HTTPS requis)
3. **Rate limiting** : Peut bloquer les tests intensifs
4. **Base de données** : Vérifier la connexion avant de tester l'API
5. **Cookies** : Doivent être envoyés avec `credentials: 'include'` côté frontend

