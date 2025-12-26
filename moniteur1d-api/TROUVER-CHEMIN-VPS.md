# 🔍 Trouver le Chemin sur le VPS

## Méthode 1 : Connexion SSH et Recherche

```bash
# Se connecter au VPS
ssh root@62.72.18.224

# Chercher le dossier moniteur1d-api
find / -name "package.json" -path "*/moniteur1d-api/*" 2>/dev/null

# Ou chercher le dossier directement
find / -type d -name "moniteur1d-api" 2>/dev/null

# Ou chercher le fichier .env
find / -name ".env" -path "*/moniteur1d-api/*" 2>/dev/null
```

## Méthode 2 : Chemins Communs à Essayer

```bash
# Essayer ces chemins un par un
ls -la /root/moniteur1d-api
ls -la ~/moniteur1d-api
ls -la /opt/moniteur1d-api
ls -la /var/www/moniteur1d-api
ls -la /home/*/moniteur1d-api
ls -la /usr/local/moniteur1d-api
ls -la /srv/moniteur1d-api
```

## Méthode 3 : Via PM2

```bash
# Si PM2 est utilisé, voir où le processus tourne
ssh root@62.72.18.224 'pm2 list'
ssh root@62.72.18.224 'pm2 info moniteur1d-api | grep "script path"'
```

## Une Fois le Chemin Trouvé

Remplacez `/root/moniteur1d-api` par le chemin trouvé dans les commandes suivantes :

### Copie du Dossier dist

```bash
# Depuis votre machine locale
cd moniteur1d-api
npm run build

# Copier (remplacez CHEMIN_TROUVE par le vrai chemin)
scp -r dist root@62.72.18.224:/CHEMIN_TROUVE/
```

### Redémarrer

```bash
ssh root@62.72.18.224 'cd /CHEMIN_TROUVE && pm2 restart moniteur1d-api'
```

## Script Automatique

Utilisez le script PowerShell créé :

```powershell
cd moniteur1d-api
.\deploy-to-vps.ps1
```

Le script trouvera automatiquement le chemin et déploiera.

