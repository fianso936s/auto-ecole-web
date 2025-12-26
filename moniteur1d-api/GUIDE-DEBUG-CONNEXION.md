# 🔍 Guide de Débogage de la Connexion

Ce guide vous aide à isoler les problèmes de connexion en vérifiant chaque étape du processus d'authentification.

## 🚀 Démarrage rapide

### 1. Vérifier la base de données (sans authentification)

```bash
# Depuis le répertoire moniteur1d-api
npm run check:db
```

Ou avec les scripts Windows :
```powershell
.\check-db.ps1
```

Ce script affichera :
- ✅ Tous les utilisateurs dans la base
- ✅ Leurs rôles et mots de passe
- ✅ La configuration depuis .env
- ✅ Un test de vérification de mot de passe

### 2. Tester la connexion avec un utilisateur spécifique

```bash
npm run test:login -- admin@moniteur1d.com VotreMotDePasse
```

Ou :
```powershell
.\check-db.ps1 admin@moniteur1d.com VotreMotDePasse
```

## 📋 Checklist de débogage

### ✅ Étape 1: Vérifier la base de données

1. **Exécutez le script de vérification**
   ```bash
   npm run check:db
   ```

2. **Vérifiez que :**
   - ✅ La connexion à la base fonctionne
   - ✅ Au moins un utilisateur ADMIN existe
   - ✅ L'utilisateur a un mot de passe
   - ✅ Le rôle est bien "ADMIN" (en majuscules)

3. **Si problème :**
   - Vérifiez `DATABASE_URL` dans `.env`
   - Exécutez `npm run prisma:seed` pour créer un admin

### ✅ Étape 2: Vérifier les variables d'environnement

1. **Vérifiez `.env` :**
   ```env
   ADMIN_EMAIL=admin@moniteur1d.com
   ADMIN_PASSWORD=VotreMotDePasse
   DATABASE_URL=postgresql://...
   JWT_SECRET=...
   ```

2. **Testez le mot de passe :**
   ```bash
   npm run test:login -- admin@moniteur1d.com VotreMotDePasse
   ```

3. **Si le test échoue :**
   - Le mot de passe dans `.env` ne correspond pas à celui en base
   - Réexécutez `npm run prisma:seed` avec le bon mot de passe

### ✅ Étape 3: Vérifier l'API backend

1. **Démarrez le serveur :**
   ```bash
   npm run dev
   ```

2. **Testez l'endpoint de login :**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"fianso936s@@@","password":"VotreMotDePasse"}'
   ```

3. **Vérifiez la réponse :**
   - ✅ Status 200 avec `user` et cookies
   - ❌ Status 401 = identifiants invalides
   - ❌ Status 500 = erreur serveur

### ✅ Étape 4: Vérifier le frontend

1. **Ouvrez la console du navigateur (F12)**

2. **Essayez de vous connecter**

3. **Vérifiez les requêtes réseau :**
   - Requête POST vers `/api/auth/login`
   - Réponse avec `user` et cookies
   - Requête GET vers `/api/auth/me` après connexion

4. **Vérifiez les cookies :**
   - `accessToken` présent
   - `refreshToken` présent
   - Cookies accessibles (pas en `httpOnly: false`)

## 🐛 Problèmes courants et solutions

### ❌ "Utilisateur non trouvé"

**Cause :** L'email n'existe pas en base ou n'est pas normalisé

**Solution :**
1. Vérifiez avec `npm run check:db`
2. Assurez-vous que l'email est en minuscules
3. Créez l'utilisateur avec `npm run prisma:seed`

### ❌ "Mot de passe invalide"

**Cause :** Le mot de passe ne correspond pas

**Solution :**
1. Testez avec `npm run test:login -- email password`
2. Vérifiez que `ADMIN_PASSWORD` dans `.env` correspond
3. Réexécutez le seed si nécessaire

### ❌ "Non authentifié" après connexion

**Cause :** Les cookies ne sont pas envoyés ou le token est invalide

**Solution :**
1. Vérifiez que `credentials: 'include'` est dans les requêtes fetch
2. Vérifiez que le frontend et backend sont sur le même domaine (ou CORS configuré)
3. Vérifiez `JWT_SECRET` dans `.env`

### ❌ "Accès refusé" sur certaines routes

**Cause :** Le rôle n'est pas correctement vérifié

**Solution :**
1. Vérifiez que le rôle dans le token JWT est "ADMIN" (majuscules)
2. Vérifiez les guards dans `src/lib/auth/guards.ts`
3. Vérifiez que `requireRole(["ADMIN"])` est utilisé sur la route

## 📊 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run check:db` | Vérifie tous les utilisateurs en base |
| `npm run test:login -- email password` | Teste la connexion d'un utilisateur |
| `npm run test:auth-flow -- email password` | Test complet du flux d'authentification |
| `npm run prisma:seed` | Crée/recrée les données de test |

## 🔐 Sécurité

⚠️ **Important :**
- Ces scripts accèdent directement à la base de données
- Utilisez-les uniquement en développement/local
- Ne commitez jamais le fichier `.env`
- Les scripts ne modifient pas les données (lecture seule)

## 📝 Exemple de sortie réussie

```
🔍 Vérification de l'accès à la base de données...

✅ Connexion à la base de données réussie

📋 Liste des utilisateurs dans la base de données:

Total: 1 utilisateur(s)

────────────────────────────────────────────────────────────────────────────────
👤 Utilisateur ID: clx1234567890
   Email: admin@moniteur1d.com
   Rôle: ADMIN
   Mot de passe: ✅ Présent
   Longueur hash: 60 caractères
   Nom: Admin System
   Type: Administrateur
   Créé le: 22/12/2024 14:30:00
────────────────────────────────────────────────────────────────────────────────

🔐 Vérification des administrateurs:

✅ 1 administrateur(s) trouvé(s):

   1. admin@moniteur1d.com
      Mot de passe: ✅ Présent

🧪 Test de vérification de mot de passe:

   Test avec: admin@moniteur1d.com
   Résultat: ✅ Mot de passe valide
```

## 🆘 Besoin d'aide ?

Si le problème persiste après avoir suivi ce guide :

1. Vérifiez les logs du serveur backend
2. Vérifiez la console du navigateur
3. Vérifiez les logs de la base de données
4. Utilisez `npm run check:db` pour voir l'état exact de la base

