#!/bin/bash
# Script pour mettre à jour le .env sur le VPS avec les valeurs actuelles
# Usage: Copiez ce script sur le VPS et exécutez-le

echo "🔧 Mise à jour du fichier .env sur le VPS"
echo ""

# Trouver le dossier de l'API
API_DIR=""
for dir in /root/moniteur1d-api ~/moniteur1d-api /opt/moniteur1d-api /var/www/moniteur1d-api /home/*/moniteur1d-api; do
    if [ -d "$dir" ] && [ -f "$dir/.env" ]; then
        API_DIR="$dir"
        break
    fi
done

if [ -z "$API_DIR" ]; then
    echo "❌ Dossier moniteur1d-api non trouvé"
    echo "   Veuillez spécifier le chemin manuellement"
    exit 1
fi

echo "📁 Dossier trouvé: $API_DIR"
cd "$API_DIR"

# Sauvegarder l'ancien .env
BACKUP_FILE=".env.backup.$(date +%Y%m%d_%H%M%S)"
cp .env "$BACKUP_FILE"
echo "✅ Backup créé: $BACKUP_FILE"
echo ""

# Secrets forts générés
JWT_SECRET="f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"
JWT_REFRESH_SECRET="3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"

echo "📝 Mise à jour des variables..."
echo ""

# NODE_ENV - Ajouter ou remplacer
if grep -q "^NODE_ENV=" .env; then
    sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env
    echo "✅ NODE_ENV mis à jour"
else
    echo "NODE_ENV=production" >> .env
    echo "✅ NODE_ENV ajouté"
fi

# FRONTEND_URL - Vérifier qu'il est correct
if grep -q "^FRONTEND_URL=" .env; then
    CURRENT_FRONTEND=$(grep "^FRONTEND_URL=" .env | cut -d'=' -f2 | tr -d '"')
    if [ "$CURRENT_FRONTEND" != "https://moniteur1d.com" ]; then
        sed -i 's|^FRONTEND_URL=.*|FRONTEND_URL="https://moniteur1d.com"|' .env
        echo "✅ FRONTEND_URL mis à jour"
    else
        echo "✅ FRONTEND_URL déjà correct"
    fi
else
    echo 'FRONTEND_URL="https://moniteur1d.com"' >> .env
    echo "✅ FRONTEND_URL ajouté"
fi

# JWT_SECRET - Remplacer par le secret fort
if grep -q "^JWT_SECRET=" .env; then
    sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"${JWT_SECRET}\"|" .env
    echo "✅ JWT_SECRET mis à jour (secret fort)"
else
    echo "JWT_SECRET=\"${JWT_SECRET}\"" >> .env
    echo "✅ JWT_SECRET ajouté"
fi

# JWT_REFRESH_SECRET - Remplacer par le secret fort
if grep -q "^JWT_REFRESH_SECRET=" .env; then
    sed -i "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=\"${JWT_REFRESH_SECRET}\"|" .env
    echo "✅ JWT_REFRESH_SECRET mis à jour (secret fort)"
else
    echo "JWT_REFRESH_SECRET=\"${JWT_REFRESH_SECRET}\"" >> .env
    echo "✅ JWT_REFRESH_SECRET ajouté"
fi

echo ""
echo "📋 Vérification des modifications:"
echo ""
grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET|DATABASE_URL|PORT)=" .env | head -6
echo ""

# Redémarrer le serveur
echo "🔄 Redémarrage du serveur..."
if command -v pm2 &> /dev/null; then
    pm2 restart moniteur1d-api && echo "✅ Serveur redémarré avec PM2"
elif systemctl list-units --type=service 2>/dev/null | grep -q moniteur1d-api; then
    systemctl restart moniteur1d-api && echo "✅ Serveur redémarré avec systemd"
else
    echo "⚠️  Redémarrez manuellement le serveur"
fi

echo ""
echo "✅ Mise à jour terminée !"
echo ""
echo "💡 Vérifiez avec: curl https://api.moniteur1d.com/health"

