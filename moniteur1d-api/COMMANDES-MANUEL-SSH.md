# 🔧 Commandes Manuelles SSH - Mise à Jour du VPS

## Secrets à Utiliser

```
JWT_SECRET=f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d
JWT_REFRESH_SECRET=3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb
```

## Méthode Simple : Connexion Interactive

### 1. Se Connecter au VPS

```bash
ssh root@62.72.18.224
```

### 2. Trouver le Dossier de l'API

```bash
# Essayer ces chemins un par un
ls -la /root/moniteur1d-api/.env
ls -la ~/moniteur1d-api/.env
ls -la /opt/moniteur1d-api/.env
ls -la /var/www/moniteur1d-api/.env

# Ou chercher
find / -name ".env" -path "*/moniteur1d-api/*" 2>/dev/null
```

### 3. Aller dans le Dossier Trouvé

```bash
cd /chemin/trouve/moniteur1d-api
```

### 4. Sauvegarder l'Ancien .env

```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### 5. Éditer le Fichier .env

```bash
nano .env
```

### 6. Modifier Ces Lignes

Cherchez et modifiez (ou ajoutez si elles n'existent pas) :

```
NODE_ENV=production
FRONTEND_URL="https://moniteur1d.com"
JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"
JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"
```

**Dans nano :**
- Utilisez les flèches pour naviguer
- Supprimez les anciennes valeurs et tapez les nouvelles
- `Ctrl+O` pour sauvegarder
- `Enter` pour confirmer
- `Ctrl+X` pour quitter

### 7. Vérifier les Modifications

```bash
grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET)=" .env
```

Vous devriez voir :
```
NODE_ENV=production
FRONTEND_URL="https://moniteur1d.com"
JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"
JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"
```

### 8. Redémarrer le Serveur

```bash
# Si vous utilisez PM2
pm2 restart moniteur1d-api
pm2 logs moniteur1d-api

# Ou si vous utilisez systemd
systemctl restart moniteur1d-api
systemctl status moniteur1d-api

# Ou si vous utilisez directement Node.js
# Trouvez le processus
ps aux | grep node
# Tuez-le et redémarrez
kill -9 [PID]
npm run start &
```

### 9. Vérifier que ça Fonctionne

```bash
# Tester l'endpoint health
curl https://api.moniteur1d.com/health

# Voir les logs
pm2 logs moniteur1d-api --lines 50
```

### 10. Quitter le VPS

```bash
exit
```

---

## Méthode Alternative : Commandes sed (Sans Éditeur)

Si vous préférez utiliser des commandes au lieu de nano :

```bash
# Se connecter
ssh root@62.72.18.224

# Aller dans le dossier (remplacez par le bon chemin)
cd /root/moniteur1d-api

# Sauvegarder
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Mettre à jour
sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env
sed -i 's|^FRONTEND_URL=.*|FRONTEND_URL="https://moniteur1d.com"|' .env
sed -i 's|^JWT_SECRET=.*|JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"|' .env
sed -i 's|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"|' .env

# Ajouter si n'existent pas
grep -q "^NODE_ENV=" .env || echo "NODE_ENV=production" >> .env
grep -q "^FRONTEND_URL=" .env || echo 'FRONTEND_URL="https://moniteur1d.com"' >> .env
grep -q "^JWT_SECRET=" .env || echo 'JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"' >> .env
grep -q "^JWT_REFRESH_SECRET=" .env || echo 'JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"' >> .env

# Vérifier
grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET)=" .env

# Redémarrer
pm2 restart moniteur1d-api || systemctl restart moniteur1d-api
```

---

## ✅ Vérification Finale

Depuis votre machine locale :

```bash
cd moniteur1d-api
npm run audit:production
```

Le score devrait être proche de 100/100.

