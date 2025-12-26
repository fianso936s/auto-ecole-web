# 🚀 Commandes SSH Directes pour Mettre à Jour le VPS

## Secrets Générés

```
JWT_SECRET=f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d
JWT_REFRESH_SECRET=3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb
```

## Option 1 : Script PowerShell Automatique

```powershell
cd moniteur1d-api
.\update-vps-env.ps1
```

## Option 2 : Commandes SSH Directes (Copier-Coller)

### Commande Complète (Une Ligne)

```bash
ssh root@62.72.18.224 'cd /root/moniteur1d-api 2>/dev/null || cd ~/moniteur1d-api 2>/dev/null || cd /opt/moniteur1d-api 2>/dev/null || cd /var/www/moniteur1d-api 2>/dev/null; cp .env .env.backup.$(date +%Y%m%d_%H%M%S); sed -i "s/^NODE_ENV=.*/NODE_ENV=production/" .env; sed -i "s|^FRONTEND_URL=.*|FRONTEND_URL=\"https://moniteur1d.com\"|" .env; sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d\"|" .env; sed -i "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=\"3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb\"|" .env; grep -q "^NODE_ENV=" .env || echo "NODE_ENV=production" >> .env; grep -q "^FRONTEND_URL=" .env || echo "FRONTEND_URL=\"https://moniteur1d.com\"" >> .env; grep -q "^JWT_SECRET=" .env || echo "JWT_SECRET=\"f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d\"" >> .env; grep -q "^JWT_REFRESH_SECRET=" .env || echo "JWT_REFRESH_SECRET=\"3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb\"" >> .env; grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET)=" .env; pm2 restart moniteur1d-api 2>/dev/null || systemctl restart moniteur1d-api 2>/dev/null || echo "Redémarrez manuellement"'
```

### Commandes Séparées (Plus Lisibles)

```bash
# 1. Se connecter au VPS
ssh root@62.72.18.224

# 2. Aller dans le dossier de l'API
cd /root/moniteur1d-api || cd ~/moniteur1d-api || cd /opt/moniteur1d-api || cd /var/www/moniteur1d-api

# 3. Sauvegarder l'ancien .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# 4. Mettre à jour NODE_ENV
sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env

# 5. Mettre à jour FRONTEND_URL
sed -i 's|^FRONTEND_URL=.*|FRONTEND_URL="https://moniteur1d.com"|' .env

# 6. Mettre à jour JWT_SECRET
sed -i 's|^JWT_SECRET=.*|JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"|' .env

# 7. Mettre à jour JWT_REFRESH_SECRET
sed -i 's|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"|' .env

# 8. Ajouter si n'existent pas
grep -q "^NODE_ENV=" .env || echo "NODE_ENV=production" >> .env
grep -q "^FRONTEND_URL=" .env || echo 'FRONTEND_URL="https://moniteur1d.com"' >> .env
grep -q "^JWT_SECRET=" .env || echo 'JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"' >> .env
grep -q "^JWT_REFRESH_SECRET=" .env || echo 'JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"' >> .env

# 9. Vérifier les modifications
grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET)=" .env

# 10. Redémarrer le serveur
pm2 restart moniteur1d-api || systemctl restart moniteur1d-api
```

## Option 3 : Édition Manuelle avec Nano

```bash
# Se connecter
ssh root@62.72.18.224

# Aller dans le dossier
cd /root/moniteur1d-api || cd ~/moniteur1d-api || cd /opt/moniteur1d-api

# Sauvegarder
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Éditer
nano .env
```

Dans nano, modifiez ces lignes :
```
NODE_ENV=production
FRONTEND_URL="https://moniteur1d.com"
JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"
JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"
```

Sauvegarder : `Ctrl+O`, `Enter`, `Ctrl+X`

Redémarrer :
```bash
pm2 restart moniteur1d-api || systemctl restart moniteur1d-api
```

## ✅ Vérification

```bash
# Depuis votre machine locale
cd moniteur1d-api
npm run audit:production
```

