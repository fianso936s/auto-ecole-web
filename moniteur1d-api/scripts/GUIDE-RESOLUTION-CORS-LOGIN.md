# Guide de Résolution : Problèmes CORS et Login

## 🔍 Diagnostic

### 1. Exécuter le script de diagnostic

```bash
cd moniteur1d-api
npm run diagnose:cors-login
```

Ce script vérifie :
- ✅ Connexion à la base de données Neon
- ✅ Existence de l'utilisateur admin
- ✅ Format du hash du mot de passe
- ✅ Vérification du mot de passe
- ✅ Configuration CORS

## 🚨 Problème 1 : CORS entre www.moniteur1d.com et api.moniteur1d.com

### Symptômes
```
Access to XMLHttpRequest at 'https://api.moniteur1d.com/...' from origin 'https://www.moniteur1d.com' 
has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 
'https://moniteur1d.com' that is not equal to the supplied origin.
```

### Cause
Le serveur renvoie `Access-Control-Allow-Origin: https://moniteur1d.com` alors que le frontend est sur `https://www.moniteur1d.com`.

### Solution

#### 1. Vérifier la configuration CORS dans `src/index.ts`

Les origines autorisées doivent inclure **les deux domaines** :
```typescript
const allowedCorsOrigins: Array<string | RegExp> = [
  "https://www.moniteur1d.com",  // ✅ Avec www
  "https://moniteur1d.com",       // ✅ Sans www
  // ... autres origines
];
```

#### 2. Vérifier que la fonction CORS retourne l'origine exacte

Dans `src/index.ts`, la fonction `origin` doit retourner l'origine exacte :
```typescript
if (isAllowed) {
  callback(null, origin);  // ✅ Retourner l'origine exacte
} else {
  callback(new Error("Not allowed by CORS"));
}
```

#### 3. Vérifier Socket.IO

Dans `src/lib/socket.ts`, la configuration CORS doit être identique :
```typescript
cors: {
  origin: (origin, callback) => {
    // Même logique que Express CORS
    if (isAllowed) {
      callback(null, origin);  // ✅ Retourner l'origine exacte
    }
  },
  credentials: true,
}
```

#### 4. Redéployer l'API

Après modification, redéployer l'API sur Hostinger :
```bash
# Sur le serveur Hostinger
cd /path/to/moniteur1d-api
git pull
npm install
npm run build
pm2 restart moniteur1d-api  # ou votre commande de restart
```

#### 5. Vérifier les logs serveur

Les logs CORS devraient maintenant afficher :
```
[CORS] Requête depuis origine: https://www.moniteur1d.com
[CORS] ✅ Origine autorisée: https://www.moniteur1d.com
```

### Vérification côté production

Si le problème persiste après redéploiement :

1. **Vérifier qu'il n'y a pas de reverse proxy** (Nginx, Apache) qui modifie les headers CORS
2. **Vérifier les variables d'environnement** sur le serveur :
   ```bash
   echo $FRONTEND_URL
   echo $NODE_ENV
   ```
3. **Tester directement l'API** :
   ```bash
   curl -H "Origin: https://www.moniteur1d.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://api.moniteur1d.com/auth/login \
        -v
   ```
   
   La réponse doit contenir :
   ```
   Access-Control-Allow-Origin: https://www.moniteur1d.com
   ```

## 🔐 Problème 2 : "Mot de passe incorrect" avec Neon

### Symptômes
- Le login renvoie toujours "Identifiants invalides"
- Le mot de passe est correct dans Neon
- Le diagnostic montre que l'utilisateur existe mais le mot de passe ne correspond pas

### Causes possibles

#### 1. Problème de connexion à Neon

**Vérifier la `DATABASE_URL`** :
```bash
# Dans moniteur1d-api/.env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

**Points critiques** :
- Le **user** doit correspondre à celui configuré dans Neon
- Le **password** doit être correct
- Si vous utilisez `endpoint_id` dans le password, vérifiez la syntaxe : `endpoint=ep-xxxx;password`

**Tester la connexion** :
```bash
npm run diagnose:cors-login
```

Si vous voyez "❌ Connexion DB", vérifiez :
- La `DATABASE_URL` dans `.env`
- Les credentials Neon dans le dashboard
- Le réseau/firewall qui bloque la connexion

#### 2. Problème de hash du mot de passe

**Vérifier le format du hash** :
Le diagnostic affiche le format du hash (Argon2 ou bcrypt).

**Si le hash est corrompu ou invalide** :
```bash
# Réinitialiser le mot de passe admin
npm run create:admin
```

**Si le hash est en bcrypt mais ne fonctionne pas** :
- Vérifier que le mot de passe testé correspond à celui utilisé lors de la création
- Le script `create:admin` utilise `ADMIN_PASSWORD` ou `UNIFORM_PASSWORD` de `.env`

#### 3. Problème de normalisation d'email

Le code normalise l'email en minuscules :
```typescript
const normalizedEmail = email.toLowerCase().trim();
```

**Vérifier que l'email dans la DB correspond** :
```bash
npm run diagnose:cors-login
```

Le diagnostic affiche l'email recherché et celui trouvé.

#### 4. Erreur lors de la vérification

**Vérifier les logs serveur** lors d'une tentative de login :
```
[LOGIN] Tentative de connexion avec email: admin@moniteur1d.com, origine: https://www.moniteur1d.com
[LOGIN] ✅ Utilisateur trouvé: admin@moniteur1d.com, rôle: ADMIN, a un mot de passe: true
[LOGIN] Format du hash: Argon2, longueur: 97
[LOGIN] Comparaison du mot de passe pour admin@moniteur1d.com...
[LOGIN] Vérification Argon2: ✅
[LOGIN] ✅ Connexion réussie pour admin@moniteur1d.com
```

Si vous voyez une erreur, elle sera affichée dans les logs.

### Solutions

#### Solution 1 : Réinitialiser le mot de passe admin

```bash
cd moniteur1d-api

# Vérifier les variables d'environnement
cat .env | grep -E "ADMIN_EMAIL|ADMIN_PASSWORD|UNIFORM_PASSWORD"

# Réinitialiser le mot de passe
npm run create:admin
```

#### Solution 2 : Vérifier manuellement dans Neon

1. Connectez-vous au dashboard Neon
2. Ouvrez la table `User`
3. Trouvez l'utilisateur `admin@moniteur1d.com`
4. Vérifiez que le champ `password` contient un hash valide (commence par `$argon2id$` ou `$2a$`)

#### Solution 3 : Recréer l'admin via seed

```bash
cd moniteur1d-api
npm run prisma:seed
```

## 🧪 Tests

### Test 1 : Diagnostic complet
```bash
npm run diagnose:cors-login
```

### Test 2 : Test de connexion API
```bash
npm run test:api-db
```

### Test 3 : Test depuis le frontend (local)
```bash
# Terminal 1 : Démarrer l'API
cd moniteur1d-api
npm run dev

# Terminal 2 : Démarrer le frontend
cd ..
npm run dev

# Terminal 3 : Tester la connexion
cd moniteur1d-api
npm run test:frontend-api
```

### Test 4 : Test production
```bash
npm run test:prod
```

## 📋 Checklist de résolution

- [ ] Exécuter `npm run diagnose:cors-login`
- [ ] Vérifier que la connexion DB fonctionne
- [ ] Vérifier que l'utilisateur admin existe
- [ ] Vérifier que le format du hash est correct
- [ ] Vérifier que la vérification du mot de passe fonctionne
- [ ] Vérifier la configuration CORS dans `src/index.ts`
- [ ] Vérifier la configuration Socket.IO dans `src/lib/socket.ts`
- [ ] Redéployer l'API sur Hostinger
- [ ] Vérifier les logs serveur après redéploiement
- [ ] Tester le login depuis `https://www.moniteur1d.com`

## 🔗 Ressources

- [Documentation CORS MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSAllowOriginNotMatchingOrigin)
- [Documentation Socket.IO CORS](https://socket.io/docs/v4/handling-cors/)
- [Documentation Neon Connection Errors](https://neon.com/docs/connect/connection-errors)

