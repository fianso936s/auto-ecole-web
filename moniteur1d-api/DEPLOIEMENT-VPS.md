# 🚀 Guide de Déploiement sur le VPS

## ✅ Modifications Appliquées Localement

1. ✅ Pattern Hostinger ajouté dans CORS (`/\.hostingersite\.com$/`)
2. ✅ Domaine spécifique ajouté (`https://powderblue-turtle-426494.hostingersite.com`)
3. ✅ Configuration cookies cross-domain corrigée
4. ✅ Erreurs TypeScript corrigées
5. ✅ Build réussi

## 📋 Actions à Effectuer sur le VPS

### Option 1 : Déploiement via Git (Recommandé)

```bash
# 1. Se connecter au VPS
ssh root@62.72.18.224

# 2. Aller dans le dossier de l'API
cd /root/moniteur1d-api  # ou le chemin de votre API

# 3. Récupérer les dernières modifications
git pull origin main  # ou la branche que vous utilisez

# 4. Installer les dépendances (si nécessaire)
npm install

# 5. Build le projet
npm run build

# 6. Redémarrer le serveur
pm2 restart moniteur1d-api
```

### Option 2 : Copie Manuelle des Fichiers

Si vous n'utilisez pas Git, copiez les fichiers modifiés :

```bash
# Depuis votre machine locale
scp moniteur1d-api/src/index.ts root@62.72.18.224:/root/moniteur1d-api/src/index.ts
scp moniteur1d-api/src/controllers/auth.controller.ts root@62.72.18.224:/root/moniteur1d-api/src/controllers/auth.controller.ts
scp moniteur1d-api/src/middleware/auth.ts root@62.72.18.224:/root/moniteur1d-api/src/middleware/auth.ts

# Puis sur le VPS
cd /root/moniteur1d-api
npm run build
pm2 restart moniteur1d-api
```

### Option 3 : Copie du Dossier dist/ Complet

```bash
# Depuis votre machine locale
cd moniteur1d-api
npm run build

# Copier le dossier dist/
scp -r dist root@62.72.18.224:/root/moniteur1d-api/

# Sur le VPS, redémarrer
ssh root@62.72.18.224 'cd /root/moniteur1d-api && pm2 restart moniteur1d-api'
```

## 🔧 Mise à Jour du .env sur le VPS

N'oubliez pas de mettre à jour le `.env` avec Neon PostgreSQL :

```bash
# Sur le VPS
cd /root/moniteur1d-api
nano .env
```

Modifiez pour avoir :

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL="https://moniteur1d.com"

DATABASE_URL="postgresql://neondb_owner:npg_UiGw9m0hqsvS@ep-muddy-cell-ahzxxj69-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"
JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"

ADMIN_EMAIL="admin@moniteur1d.com"
ADMIN_PASSWORD="lounes92"
```

## ✅ Vérification Après Déploiement

### 1. Vérifier les Logs

```bash
pm2 logs moniteur1d-api --lines 50
```

Recherchez :
- ✅ `Server is running on port 3001` (ou 3000)
- ❌ Plus d'erreurs `CORS blocked origin: https://powderblue-turtle-426494.hostingersite.com`

### 2. Tester l'API

```bash
curl https://api.moniteur1d.com/health
```

### 3. Tester CORS depuis le Frontend

Depuis le frontend Hostinger, essayez de vous connecter. Les erreurs CORS ne devraient plus apparaître.

### 4. Audit de Production

```bash
# Depuis votre machine locale
cd moniteur1d-api
npm run audit:production
```

Score attendu : **95-100/100**

## 📝 Résumé des Modifications

### Fichiers Modifiés

1. **src/index.ts**
   - Ajout du pattern `/\.hostingersite\.com$/`
   - Ajout du domaine `https://powderblue-turtle-426494.hostingersite.com`

2. **src/controllers/auth.controller.ts**
   - Configuration cookies cross-domain avec `SameSite=None`

3. **src/middleware/auth.ts**
   - Configuration cookies cross-domain pour refresh token

4. **src/controllers/contact.controller.ts**
   - Correction pour utiliser `LeadActivity` au lieu de champ `message`

5. **src/controllers/instructor.controller.ts** et **student.controller.ts**
   - Correction des imports et types

## 🆘 En Cas de Problème

### Le Serveur ne Démarre Pas

```bash
# Vérifier les erreurs
pm2 logs moniteur1d-api --err

# Vérifier la configuration
cat .env | grep -E "^(NODE_ENV|DATABASE_URL|FRONTEND_URL)"
```

### Erreurs CORS Persistent

1. Vérifiez que le build a bien été fait
2. Vérifiez que le serveur a bien redémarré
3. Vérifiez les logs pour confirmer que le nouveau code est utilisé

### Erreurs de Connexion à la Base

```bash
# Tester la connexion
npm run check:db
```

---

**✅ Une fois déployé, les erreurs CORS devraient disparaître !**

