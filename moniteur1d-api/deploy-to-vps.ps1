# Script PowerShell pour déployer sur le VPS
# Usage: .\deploy-to-vps.ps1

$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot

Write-Host "🚀 Déploiement sur le VPS" -ForegroundColor Cyan
Write-Host ""

# 1. Build le projet
Write-Host "📦 Build du projet..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build réussi" -ForegroundColor Green
Write-Host ""

# 2. Trouver le chemin sur le VPS
Write-Host "🔍 Recherche du chemin sur le VPS..." -ForegroundColor Yellow

$findPathScript = @'
#!/bin/bash
# Chercher le dossier moniteur1d-api
for dir in /root/moniteur1d-api ~/moniteur1d-api /opt/moniteur1d-api /var/www/moniteur1d-api /home/*/moniteur1d-api; do
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
        echo "$dir"
        exit 0
    fi
done
# Si pas trouvé, chercher par package.json
find / -name "package.json" -path "*/moniteur1d-api/*" 2>/dev/null | head -1 | xargs dirname
'@

$tempScript = [System.IO.Path]::GetTempFileName()
$findPathScript | Out-File -FilePath $tempScript -Encoding UTF8 -NoNewline

try {
    # Copier le script de recherche
    scp $tempScript root@62.72.18.224:/tmp/find-api-path.sh 2>&1 | Out-Null
    
    # Exécuter pour trouver le chemin
    $apiPath = ssh root@62.72.18.224 "bash /tmp/find-api-path.sh" 2>&1
    
    if ($LASTEXITCODE -eq 0 -and $apiPath) {
        $apiPath = $apiPath.Trim()
        Write-Host "✅ Chemin trouvé: $apiPath" -ForegroundColor Green
        Write-Host ""
        
        # 3. Copier le dossier dist
        Write-Host "📤 Copie du dossier dist vers $apiPath..." -ForegroundColor Yellow
        
        if (Test-Path "dist") {
            scp -r dist root@62.72.18.224:"$apiPath/"
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Fichiers copiés avec succès" -ForegroundColor Green
                Write-Host ""
                
                # 4. Redémarrer le serveur
                Write-Host "🔄 Redémarrage du serveur..." -ForegroundColor Yellow
                ssh root@62.72.18.224 "cd $apiPath && pm2 restart moniteur1d-api"
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Serveur redémarré" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "📋 Vérification des logs:" -ForegroundColor Cyan
                    ssh root@62.72.18.224 "cd $apiPath && pm2 logs moniteur1d-api --lines 10 --nostream"
                } else {
                    Write-Host "⚠️  Erreur lors du redémarrage" -ForegroundColor Yellow
                }
            } else {
                Write-Host "❌ Erreur lors de la copie" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Dossier dist non trouvé. Lancez d'abord: npm run build" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Chemin non trouvé sur le VPS" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Essayez de vous connecter manuellement:" -ForegroundColor Yellow
        Write-Host "   ssh root@62.72.18.224" -ForegroundColor Gray
        Write-Host "   find / -name 'package.json' -path '*/moniteur1d-api/*' 2>/dev/null" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    if (Test-Path $tempScript) {
        Remove-Item $tempScript -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "=== FIN ===" -ForegroundColor Cyan

