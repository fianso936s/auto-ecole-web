# 🔧 Guide de Correction - Configuration Production

Ce guide vous aide à corriger les problèmes identifiés par l'audit de production.

## 📋 Problèmes Identifiés

1. ❌ **NODE_ENV=development** au lieu de `production`
2. ❌ **FRONTEND_URL** incorrecte (`http://localhost:5173` au lieu de `https://moniteur1d.com`)
3. ⚠️ **Secrets JWT** faibles
4. ⚠️ **Cookies cross-domain** peuvent être bloqués

## ✅ Corrections Appliquées dans le Code

### 1. Configuration des Cookies Cross-Domain

Les cookies ont été modifiés pour supporter les domaines différents (`api.moniteur1d.com` ↔ `moniteur1d.com`) :

- **SameSite=None** avec **Secure=true** en production cross-domain
- Détection automatique basée sur `FRONTEND_URL` et `NODE_ENV`

**Fichiers modifiés :**
- `src/controllers/auth.controller.ts` (login et refresh)
- `src/middleware/auth.ts` (refresh token)

## 🚀 Actions à Effectuer sur le VPS

### Étape 1 : Mettre à jour le fichier `.env` sur le VPS

Connectez-vous à votre VPS et modifiez le fichier `.env` dans le dossier `moniteur1d-api` :

```bash
# Se connecter au VPS
ssh user@votre-vps

# Aller dans le dossier de l'API
cd moniteur1d-api

# Éditer le fichier .env
nano .env
```

### Étape 2 : Configurer les Variables d'Environnement

Remplacez/modifiez ces lignes dans `.env` :

```env
# ⚠️ IMPORTANT : Changer development en production
NODE_ENV=production

# ⚠️ IMPORTANT : Mettre l'URL de production du frontend
FRONTEND_URL="https://moniteur1d.com"

# ⚠️ IMPORTANT : Générer des secrets forts (min 32 caractères)
# Utilisez cette commande pour générer des secrets :
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="votre_secret_fort_de_32_caracteres_minimum"
JWT_REFRESH_SECRET="autre_secret_fort_de_32_caracteres_minimum"

# Base de données (vérifier que c'est correct)
DATABASE_URL="postgresql://..."

# Admin (vérifier les credentials)
ADMIN_EMAIL="admin@moniteur1d.com"
ADMIN_PASSWORD="votre_mot_de_passe_admin_production"

# Port (généralement 3000 ou 3001 selon votre config)
PORT=3000
```

### Étape 3 : Générer des Secrets JWT Forts

Sur votre machine locale ou sur le VPS :

```bash
# Générer un secret JWT
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copier le résultat et l'utiliser pour JWT_SECRET
# Répéter pour JWT_REFRESH_SECRET avec une valeur différente
```

**Exemple de sortie :**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Étape 4 : Redémarrer le Serveur

Après avoir modifié `.env`, redémarrez le serveur :

```bash
# Si vous utilisez PM2
pm2 restart moniteur1d-api

# Ou si vous utilisez systemd
sudo systemctl restart moniteur1d-api

# Ou si vous utilisez directement Node.js
# Arrêter le processus actuel (Ctrl+C) puis :
npm run start
```

### Étape 5 : Vérifier la Configuration

Testez la configuration avec l'audit de production :

```bash
# Sur votre machine locale
cd moniteur1d-api
npm run audit:production
```

## 🔍 Vérification des Credentials de Production

Si la connexion échoue avec "Identifiants invalides", vérifiez :

### Option 1 : Vérifier dans la Base de Données

```bash
# Se connecter au VPS
ssh user@votre-vps
cd moniteur1d-api

# Lancer Prisma Studio (si accessible)
npm run prisma:studio

# Ou utiliser un script de vérification
npm run check:db
```

### Option 2 : Recréer l'Admin en Production

```bash
# Sur le VPS, dans moniteur1d-api
# Assurez-vous que ADMIN_PASSWORD est défini dans .env
npm run prisma:seed
```

### Option 3 : Mettre à Jour le Mot de Passe d'un Utilisateur Existant

```bash
# Utiliser le script de mise à jour
npm run update-passwords
```

## 🛡️ Configuration Reverse Proxy (Nginx)

Si vous utilisez Nginx comme reverse proxy, assurez-vous que la configuration inclut :

```nginx
server {
    listen 443 ssl http2;
    server_name api.moniteur1d.com;

    # Certificat SSL
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;  # Port de votre API
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Important pour les cookies cross-domain
        proxy_cookie_path / "/; SameSite=None; Secure";
    }
}
```

## 📝 Checklist de Vérification

- [ ] `NODE_ENV=production` dans `.env`
- [ ] `FRONTEND_URL="https://moniteur1d.com"` dans `.env`
- [ ] `JWT_SECRET` et `JWT_REFRESH_SECRET` sont des secrets forts (32+ caractères)
- [ ] Serveur redémarré après modification de `.env`
- [ ] Test de connexion réussi avec l'audit de production
- [ ] Cookies reçus avec `SameSite=None; Secure`
- [ ] Reverse proxy configuré correctement (si utilisé)

## 🧪 Test Final

Après toutes les corrections, testez :

```bash
# Sur votre machine locale
cd moniteur1d-api
npm run audit:production
```

Le score devrait être proche de 100/100 avec seulement des avertissements mineurs.

## 🆘 En Cas de Problème

1. **Vérifier les logs du serveur** :
   ```bash
   # Sur le VPS
   pm2 logs moniteur1d-api
   # ou
   journalctl -u moniteur1d-api -f
   ```

2. **Vérifier que le serveur écoute sur le bon port** :
   ```bash
   netstat -tulpn | grep :3000
   ```

3. **Tester la connexion directement** :
   ```bash
   curl https://api.moniteur1d.com/health
   ```

4. **Vérifier les certificats SSL** :
   ```bash
   curl -vI https://api.moniteur1d.com
   ```

## 📚 Ressources

- [Documentation CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS)
- [Documentation Cookies SameSite](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Guide de déploiement Hostinger](HOSTINGER_DEPLOY.md)

