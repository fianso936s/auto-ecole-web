@echo off
cd /d "%~dp0\moniteur1d-api"
echo === Test d'authentification ===
echo.
echo Assurez-vous que le serveur est demarre avec: npm run dev
echo.
node test-auth.js admin@moniteur1d.com lounes92
pause

