# 🔧 Commandes pour Mettre à Jour le VPS

## Option 1 : Connexion SSH Manuelle (Recommandé)

### Étape 1 : Générer les Secrets

Sur votre machine locale :

```bash
cd moniteur1d-api
npm run generate:secrets
```

Copiez les deux secrets générés.

### Étape 2 : Se Connecter au VPS

```bash
ssh root@62.72.18.224
```

### Étape 3 : Aller dans le Dossier de l'API

```bash
# Trouver le dossier (essayez ces chemins)
cd /root/moniteur1d-api
# ou
cd ~/moniteur1d-api
# ou
cd /opt/moniteur1d-api
# ou
cd /var/www/moniteur1d-api
```

### Étape 4 : Sauvegarder l'Ancien .env

```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### Étape 5 : Éditer le Fichier .env

```bash
nano .env
```

### Étape 6 : Modifier les Variables Suivantes

Remplacez/modifiez ces lignes :

```env
NODE_ENV=production
FRONTEND_URL="https://moniteur1d.com"
JWT_SECRET="[COLLER_LE_SECRET_GENERE]"
JWT_REFRESH_SECRET="[COLLER_LE_SECRET_GENERE]"
```

**Important :**
- Remplacez `[COLLER_LE_SECRET_GENERE]` par les secrets générés à l'étape 1
- Assurez-vous que `NODE_ENV=production` (pas `development`)
- Assurez-vous que `FRONTEND_URL` pointe vers `https://moniteur1d.com` (pas `http://localhost:5173`)

### Étape 7 : Sauvegarder et Quitter

Dans nano :
- `Ctrl+O` pour sauvegarder
- `Enter` pour confirmer
- `Ctrl+X` pour quitter

### Étape 8 : Vérifier les Modifications

```bash
grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET)=" .env
```

Vous devriez voir :
```
NODE_ENV=production
FRONTEND_URL="https://moniteur1d.com"
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."
```

### Étape 9 : Redémarrer le Serveur

```bash
# Si vous utilisez PM2
pm2 restart moniteur1d-api

# Ou si vous utilisez systemd
systemctl restart moniteur1d-api

# Ou si vous utilisez directement Node.js
# Trouvez le processus et redémarrez-le
ps aux | grep node
kill -9 [PID]
npm run start &
```

---

## Option 2 : Script Automatique (Si Node.js est installé sur le VPS)

### Sur votre Machine Locale

```bash
cd moniteur1d-api
chmod +x update-vps-env.sh
./update-vps-env.sh
```

---

## Option 3 : Commandes SSH Directes

### Générer les Secrets et Mettre à Jour en Une Commande

```bash
# Générer les secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Se connecter et mettre à jour
ssh root@62.72.18.224 << EOF
cd /root/moniteur1d-api || cd ~/moniteur1d-api || cd /opt/moniteur1d-api
cp .env .env.backup.\$(date +%Y%m%d_%H%M%S)
sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env
sed -i 's|^FRONTEND_URL=.*|FRONTEND_URL="https://moniteur1d.com"|' .env
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"${JWT_SECRET}\"|" .env
sed -i "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=\"${JWT_REFRESH_SECRET}\"|" .env
grep -q "^NODE_ENV=" .env || echo "NODE_ENV=production" >> .env
grep -q "^FRONTEND_URL=" .env || echo 'FRONTEND_URL="https://moniteur1d.com"' >> .env
grep -q "^JWT_SECRET=" .env || echo "JWT_SECRET=\"${JWT_SECRET}\"" >> .env
grep -q "^JWT_REFRESH_SECRET=" .env || echo "JWT_REFRESH_SECRET=\"${JWT_REFRESH_SECRET}\"" >> .env
grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET)=" .env
pm2 restart moniteur1d-api || systemctl restart moniteur1d-api
EOF
```

---

## ✅ Vérification Après Modification

### Depuis votre Machine Locale

```bash
cd moniteur1d-api
npm run audit:production
```

Le score devrait être proche de 100/100.

### Depuis le VPS

```bash
# Vérifier que le serveur tourne
pm2 status
# ou
systemctl status moniteur1d-api

# Vérifier les logs
pm2 logs moniteur1d-api
# ou
journalctl -u moniteur1d-api -f

# Tester l'endpoint health
curl https://api.moniteur1d.com/health
```

---

## 🆘 En Cas de Problème

### Le Serveur ne Démarre Pas

```bash
# Vérifier les erreurs
pm2 logs moniteur1d-api --err
# ou
journalctl -u moniteur1d-api -n 50

# Vérifier la syntaxe du .env
cat .env | grep -v "^#" | grep -v "^$"
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

## 📝 Notes Importantes

1. **Sauvegardez toujours** l'ancien `.env` avant modification
2. **Vérifiez** que les secrets sont bien copiés (pas d'espaces)
3. **Redémarrez** toujours le serveur après modification
4. **Testez** avec l'audit de production après les modifications

