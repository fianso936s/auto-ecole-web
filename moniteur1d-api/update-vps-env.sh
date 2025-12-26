#!/bin/bash
# Script pour mettre à jour le .env sur le VPS
# Usage: ./update-vps-env.sh

echo "🔧 Mise à jour du fichier .env sur le VPS"
echo ""

# Générer les secrets
echo "📝 Génération des secrets JWT..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo "JWT_SECRET généré: ${JWT_SECRET:0:20}..."
echo "JWT_REFRESH_SECRET généré: ${JWT_REFRESH_SECRET:0:20}..."
echo ""

# Créer le fichier de mise à jour
cat > /tmp/update-env.sh << EOF
#!/bin/bash
cd /root/moniteur1d-api || cd ~/moniteur1d-api || cd /opt/moniteur1d-api

# Sauvegarder l'ancien .env
cp .env .env.backup.\$(date +%Y%m%d_%H%M%S)

# Mettre à jour les variables critiques
sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env
sed -i 's|^FRONTEND_URL=.*|FRONTEND_URL="https://moniteur1d.com"|' .env
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"${JWT_SECRET}\"|" .env
sed -i "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=\"${JWT_REFRESH_SECRET}\"|" .env

# Si les variables n'existent pas, les ajouter
grep -q "^NODE_ENV=" .env || echo "NODE_ENV=production" >> .env
grep -q "^FRONTEND_URL=" .env || echo 'FRONTEND_URL="https://moniteur1d.com"' >> .env
grep -q "^JWT_SECRET=" .env || echo "JWT_SECRET=\"${JWT_SECRET}\"" >> .env
grep -q "^JWT_REFRESH_SECRET=" .env || echo "JWT_REFRESH_SECRET=\"${JWT_REFRESH_SECRET}\"" >> .env

echo "✅ Fichier .env mis à jour"
echo ""
echo "📋 Vérification:"
grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET)=" .env
EOF

chmod +x /tmp/update-env.sh

echo "📤 Copie du script sur le VPS..."
scp /tmp/update-env.sh root@62.72.18.224:/tmp/update-env.sh

echo ""
echo "🚀 Exécution sur le VPS..."
ssh root@62.72.18.224 "bash /tmp/update-env.sh"

echo ""
echo "✅ Mise à jour terminée !"
echo ""
echo "🔄 Redémarrez le serveur avec:"
echo "   ssh root@62.72.18.224 'pm2 restart moniteur1d-api'"
echo "   ou"
echo "   ssh root@62.72.18.224 'systemctl restart moniteur1d-api'"

