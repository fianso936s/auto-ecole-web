# 🚀 Commandes Finales pour Mettre à Jour le VPS avec Neon

## 📋 Configuration Complète

### URL Neon PostgreSQL
```
postgresql://neondb_owner:npg_UiGw9m0hqsvS@ep-muddy-cell-ahzxxj69-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Secrets JWT
```
JWT_SECRET=f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d
JWT_REFRESH_SECRET=3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb
```

---

## 🎯 Commande Unique (Copier-Coller)

```bash
ssh root@62.72.18.224 'cd $(find / -name ".env" -path "*/moniteur1d-api/*" 2>/dev/null | head -1 | xargs dirname) && cp .env .env.backup.$(date +%Y%m%d_%H%M%S) && (grep -q "^NODE_ENV=" .env || echo "NODE_ENV=production" >> .env) && sed -i "s/^NODE_ENV=.*/NODE_ENV=production/" .env && sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"postgresql://neondb_owner:npg_UiGw9m0hqsvS@ep-muddy-cell-ahzxxj69-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require\&channel_binding=require\"|" .env && sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d\"|" .env && sed -i "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=\"3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb\"|" .env && grep -q "^FRONTEND_URL=" .env || echo "FRONTEND_URL=\"https://moniteur1d.com\"" >> .env && grep -q "^PORT=" .env || echo "PORT=3000" >> .env && echo "✅ Modifications:" && grep -E "^(NODE_ENV|DATABASE_URL|JWT_SECRET|JWT_REFRESH_SECRET|FRONTEND_URL|PORT)=" .env && pm2 restart moniteur1d-api'
```

---

## 📝 Méthode Manuelle (Recommandée)

### 1. Se Connecter

```bash
ssh root@62.72.18.224
```

### 2. Trouver le Dossier

```bash
find / -name ".env" -path "*/moniteur1d-api/*" 2>/dev/null
```

### 3. Aller dans le Dossier

```bash
cd /root/moniteur1d-api  # ou le chemin trouvé
```

### 4. Sauvegarder

```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### 5. Éditer avec nano

```bash
nano .env
```

### 6. Remplacer Tout le Contenu par :

```env
NODE_ENV=production
PORT=3000
FRONTEND_URL="https://moniteur1d.com"

# Base de données Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_UiGw9m0hqsvS@ep-muddy-cell-ahzxxj69-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Secrets
JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"
JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"

# Admin (optionnel - ajustez selon vos besoins)
ADMIN_EMAIL="admin@moniteur1d.com"
ADMIN_PASSWORD="votre_mot_de_passe_admin"
```

Dans nano :
- `Ctrl+O` pour sauvegarder
- `Enter` pour confirmer
- `Ctrl+X` pour quitter

### 7. Vérifier

```bash
grep -E "^(NODE_ENV|DATABASE_URL|JWT_SECRET|JWT_REFRESH_SECRET|FRONTEND_URL|PORT)=" .env
```

Vous devriez voir :
```
NODE_ENV=production
DATABASE_URL="postgresql://neondb_owner:npg_UiGw9m0hqsvS@ep-muddy-cell-ahzxxj69-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"
JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"
FRONTEND_URL="https://moniteur1d.com"
PORT=3000
```

### 8. Redémarrer le Serveur

```bash
pm2 restart moniteur1d-api
pm2 logs moniteur1d-api --lines 50
```

---

## ✅ Vérifications

### 1. Vérifier la Connexion à la Base

```bash
# Sur le VPS
cd moniteur1d-api
npm run check:db
```

Résultat attendu :
```
✅ Connexion à la base de données réussie
```

### 2. Vérifier les Logs

```bash
pm2 logs moniteur1d-api --lines 50
```

Recherchez les erreurs de connexion.

### 3. Tester l'API

```bash
curl https://api.moniteur1d.com/health
```

Résultat attendu :
```json
{"status":"OK","timestamp":"..."}
```

### 4. Audit de Production

```bash
# Depuis votre machine locale
cd moniteur1d-api
npm run audit:production
```

Score attendu : **95-100/100**

---

## 📋 Résumé des Changements

| Variable | Avant | Après |
|----------|-------|-------|
| NODE_ENV | (absent) | `production` ✅ |
| DATABASE_URL | `mysql://...` | `postgresql://neondb_owner:...@ep-muddy-cell...` ✅ |
| JWT_SECRET | `soufiane_moniteur_936_secret` | `f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d` ✅ |
| JWT_REFRESH_SECRET | `soufiane_moniteur_936_refresh` | `3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb` ✅ |
| FRONTEND_URL | `https://moniteur1d.com` | ✅ Déjà correct |
| PORT | `3000` | ✅ Déjà correct |

---

## 🆘 En Cas de Problème

### Erreur de Connexion à la Base

```bash
# Tester la connexion directement
psql 'postgresql://neondb_owner:npg_UiGw9m0hqsvS@ep-muddy-cell-ahzxxj69-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

### Restaurer l'Ancien .env

```bash
# Lister les backups
ls -la .env.backup.*

# Restaurer
cp .env.backup.[DATE] .env
pm2 restart moniteur1d-api
```

---

**✅ Toutes les valeurs sont prêtes. Il suffit de les copier dans le .env du VPS !**

