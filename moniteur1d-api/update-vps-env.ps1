# Script PowerShell pour mettre à jour le .env sur le VPS
# Usage: .\update-vps-env.ps1

$ErrorActionPreference = "Continue"

Write-Host "🔧 Mise à jour du fichier .env sur le VPS" -ForegroundColor Cyan
Write-Host ""

# Secrets générés (à utiliser)
$JWT_SECRET = "f08067b81db8ea38c7da688b7d395d73c30bfe3f5e8bc5327f5ff4514e86f91d"
$JWT_REFRESH_SECRET = "3ec65f61dd7764a3bb1bacc3050217754fcca9a3e75ae89a1f4541af125376bb"

Write-Host "📝 Secrets JWT générés:" -ForegroundColor Yellow
Write-Host "   JWT_SECRET: $($JWT_SECRET.Substring(0, 20))..." -ForegroundColor Gray
Write-Host "   JWT_REFRESH_SECRET: $($JWT_REFRESH_SECRET.Substring(0, 20))..." -ForegroundColor Gray
Write-Host ""

# Demander confirmation
$confirm = Read-Host "Voulez-vous continuer avec la connexion SSH ? (O/N)"
if ($confirm -ne "O" -and $confirm -ne "o") {
    Write-Host "❌ Opération annulée" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔌 Connexion au VPS..." -ForegroundColor Cyan
Write-Host ""

# Créer le script à exécuter sur le VPS
$remoteScript = @"
#!/bin/bash
echo '🔧 Mise à jour du fichier .env'
echo ''

# Trouver le dossier de l'API
cd /root/moniteur1d-api 2>/dev/null || cd ~/moniteur1d-api 2>/dev/null || cd /opt/moniteur1d-api 2>/dev/null || cd /var/www/moniteur1d-api 2>/dev/null

if [ ! -f .env ]; then
    echo '❌ Fichier .env non trouvé'
    echo '   Veuillez spécifier le chemin manuellement'
    exit 1
fi

echo "📁 Dossier trouvé: $(pwd)"
echo ''

# Sauvegarder l'ancien .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo '✅ Backup créé'
echo ''

# Mettre à jour les variables
sed -i 's/^NODE_ENV=.*/NODE_ENV=production/' .env
sed -i 's|^FRONTEND_URL=.*|FRONTEND_URL="https://moniteur1d.com"|' .env
sed -i "s|^JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env
sed -i "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=\"$JWT_REFRESH_SECRET\"|" .env

# Ajouter si n'existe pas
grep -q "^NODE_ENV=" .env || echo "NODE_ENV=production" >> .env
grep -q "^FRONTEND_URL=" .env || echo 'FRONTEND_URL="https://moniteur1d.com"' >> .env
grep -q "^JWT_SECRET=" .env || echo "JWT_SECRET=\"$JWT_SECRET\"" >> .env
grep -q "^JWT_REFRESH_SECRET=" .env || echo "JWT_REFRESH_SECRET=\"$JWT_REFRESH_SECRET\"" >> .env

echo '✅ Fichier .env mis à jour'
echo ''
echo '📋 Vérification:'
grep -E "^(NODE_ENV|FRONTEND_URL|JWT_SECRET|JWT_REFRESH_SECRET)=" .env
echo ''
echo '🔄 Redémarrage du serveur...'
pm2 restart moniteur1d-api 2>/dev/null || systemctl restart moniteur1d-api 2>/dev/null || echo '⚠️  Redémarrez manuellement le serveur'
echo ''
echo '✅ Mise à jour terminée !'
"@

# Remplacer les variables dans le script
$remoteScript = $remoteScript -replace '\$JWT_SECRET', $JWT_SECRET
$remoteScript = $remoteScript -replace '\$JWT_REFRESH_SECRET', $JWT_REFRESH_SECRET

# Écrire le script temporaire
$tempScript = [System.IO.Path]::GetTempFileName()
$remoteScript | Out-File -FilePath $tempScript -Encoding UTF8 -NoNewline

try {
    # Copier le script sur le VPS
    Write-Host "📤 Copie du script sur le VPS..." -ForegroundColor Yellow
    scp $tempScript root@62.72.18.224:/tmp/update-env.sh
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Script copié" -ForegroundColor Green
        Write-Host ""
        
        # Exécuter le script sur le VPS
        Write-Host "🚀 Exécution sur le VPS..." -ForegroundColor Yellow
        ssh root@62.72.18.224 "bash /tmp/update-env.sh"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Mise à jour terminée avec succès !" -ForegroundColor Green
            Write-Host ""
            Write-Host "🧪 Testez avec:" -ForegroundColor Cyan
            Write-Host "   npm run audit:production" -ForegroundColor Gray
        } else {
            Write-Host ""
            Write-Host "⚠️  Erreur lors de l'exécution" -ForegroundColor Yellow
            Write-Host "   Vérifiez les logs ci-dessus" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Erreur lors de la copie du script" -ForegroundColor Red
        Write-Host "   Vérifiez votre connexion SSH" -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternative: Utilisez les commandes manuelles dans COMMANDES-VPS.md" -ForegroundColor Yellow
} finally {
    # Nettoyer
    Remove-Item $tempScript -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "=== FIN ===" -ForegroundColor Cyan

