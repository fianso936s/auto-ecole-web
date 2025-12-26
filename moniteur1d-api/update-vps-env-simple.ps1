# Script PowerShell simplifié pour mettre à jour le .env sur le VPS
# Usage: .\update-vps-env-simple.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔧 Mise à jour du fichier .env sur le VPS" -ForegroundColor Cyan
Write-Host ""

# Secrets générés
$JWT_SECRET = "f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"
$JWT_REFRESH_SECRET = "3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"

Write-Host "📝 Secrets JWT:" -ForegroundColor Yellow
Write-Host "   JWT_SECRET: $($JWT_SECRET.Substring(0, 20))..." -ForegroundColor Gray
Write-Host "   JWT_REFRESH_SECRET: $($JWT_REFRESH_SECRET.Substring(0, 20))..." -ForegroundColor Gray
Write-Host ""

# Vérifier que SSH est disponible
try {
    $sshTest = ssh -V 2>&1
    Write-Host "✅ SSH détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ SSH non trouvé. Installez OpenSSH ou utilisez PuTTY." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔌 Connexion au VPS (62.72.18.224)..." -ForegroundColor Cyan
Write-Host ""

# Créer le script bash à exécuter sur le VPS
$bashScript = @'
#!/bin/bash
set -e

echo "🔧 Mise à jour du fichier .env"
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

# Mettre à jour les variables
echo "📝 Mise à jour des variables..."

# NODE_ENV
if grep -q "^NODE_ENV=" .env; then
    sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env
else
    echo "NODE_ENV=production" >> .env
fi

# FRONTEND_URL
if grep -q "^FRONTEND_URL=" .env; then
    sed -i 's|^FRONTEND_URL=.*|FRONTEND_URL="https://moniteur1d.com"|' .env
else
    echo 'FRONTEND_URL="https://moniteur1d.com"' >> .env
fi

# JWT_SECRET
if grep -q "^JWT_SECRET=" .env; then
    sed -i 's|^JWT_SECRET=.*|JWT_SECRET="JWT_SECRET_PLACEHOLDER"|' .env
else
    echo 'JWT_SECRET="JWT_SECRET_PLACEHOLDER"' >> .env
fi

# JWT_REFRESH_SECRET
if grep -q "^JWT_REFRESH_SECRET=" .env; then
    sed -i 's|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET="JWT_REFRESH_SECRET_PLACEHOLDER"|' .env
else
    echo 'JWT_REFRESH_SECRET="JWT_REFRESH_SECRET_PLACEHOLDER"' >> .env
fi

# Remplacer les placeholders
sed -i "s|JWT_SECRET_PLACEHOLDER|JWT_SECRET_VALUE|g" .env
sed -i "s|JWT_REFRESH_SECRET_PLACEHOLDER|JWT_REFRESH_SECRET_VALUE|g" .env

echo "✅ Variables mises à jour"
echo ""

# Vérifier
echo "📋 Vérification:"
grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET)=" .env | head -4
echo ""

# Redémarrer le serveur
echo "🔄 Redémarrage du serveur..."
if command -v pm2 &> /dev/null; then
    pm2 restart moniteur1d-api && echo "✅ Serveur redémarré avec PM2"
elif systemctl list-units --type=service | grep -q moniteur1d-api; then
    systemctl restart moniteur1d-api && echo "✅ Serveur redémarré avec systemd"
else
    echo "⚠️  Redémarrez manuellement le serveur"
fi

echo ""
echo "✅ Mise à jour terminée !"
'@

# Remplacer les placeholders avec les vraies valeurs
$bashScript = $bashScript -replace 'JWT_SECRET_VALUE', $JWT_SECRET
$bashScript = $bashScript -replace 'JWT_REFRESH_SECRET_VALUE', $JWT_REFRESH_SECRET

# Écrire le script dans un fichier temporaire
$tempFile = New-TemporaryFile
$bashScript | Out-File -FilePath $tempFile.FullName -Encoding UTF8 -NoNewline

try {
    Write-Host "📤 Copie du script sur le VPS..." -ForegroundColor Yellow
    
    # Copier le script
    $scpResult = scp $tempFile.FullName root@62.72.18.224:/tmp/update-env.sh 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de la copie: $scpResult" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Essayez de vous connecter manuellement:" -ForegroundColor Yellow
        Write-Host "   ssh root@62.72.18.224" -ForegroundColor Gray
        Write-Host ""
        Write-Host "   Puis exécutez les commandes dans COMMANDES-SSH-DIRECTES.md" -ForegroundColor Gray
        exit 1
    }
    
    Write-Host "✅ Script copié" -ForegroundColor Green
    Write-Host ""
    
    # Exécuter le script
    Write-Host "🚀 Exécution sur le VPS..." -ForegroundColor Yellow
    ssh root@62.72.18.224 "bash /tmp/update-env.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Mise à jour terminée avec succès !" -ForegroundColor Green
        Write-Host ""
        Write-Host "🧪 Testez avec:" -ForegroundColor Cyan
        Write-Host "   cd moniteur1d-api" -ForegroundColor Gray
        Write-Host "   npm run audit:production" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "⚠️  Erreur lors de l'exécution (code: $LASTEXITCODE)" -ForegroundColor Yellow
        Write-Host "   Vérifiez les messages ci-dessus" -ForegroundColor Gray
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions:" -ForegroundColor Yellow
    Write-Host "   1. Vérifiez votre connexion SSH" -ForegroundColor Gray
    Write-Host "   2. Vérifiez que la clé SSH est configurée" -ForegroundColor Gray
    Write-Host "   3. Utilisez les commandes manuelles dans COMMANDES-SSH-DIRECTES.md" -ForegroundColor Gray
} finally {
    # Nettoyer
    if (Test-Path $tempFile.FullName) {
        Remove-Item $tempFile.FullName -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "=== FIN ===" -ForegroundColor Cyan

