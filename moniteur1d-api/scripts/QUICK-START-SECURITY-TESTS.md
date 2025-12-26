# Guide Rapide - Tests de Sécurité

## Démarrage Rapide

### 1. Démarrer le serveur API
```bash
cd moniteur1d-api
npm run dev
```

### 2. Dans un autre terminal, exécuter les tests complets
```bash
cd moniteur1d-api
npm run test:security
```

## Tests Individuels

### Test XSS uniquement (PowerShell)
```powershell
cd moniteur1d-api/scripts
.\test-security-xss.ps1
```

### Test CSRF uniquement (PowerShell)
```powershell
cd moniteur1d-api/scripts
.\test-security-csrf.ps1
```

### Test XSS uniquement (Bash/Linux)
```bash
cd moniteur1d-api/scripts
chmod +x test-security-xss.sh
./test-security-xss.sh
```

### Test CSRF uniquement (Bash/Linux)
```bash
cd moniteur1d-api/scripts
chmod +x test-security-csrf.sh
./test-security-csrf.sh
```

## Résultats Attendus

### ✅ Succès
- Tous les payloads XSS sont **bloqués** (HTTP 400/403)
- Les requêtes sans CSRF sont **bloquées** (HTTP 403)
- Les headers de sécurité sont **présents**
- Taux de réussite : **100%**

### ❌ Échec
- Des payloads XSS sont **acceptés** → Vulnérabilité XSS
- Les requêtes sans CSRF sont **acceptées** → Vulnérabilité CSRF
- Des headers de sécurité sont **manquants** → Configuration incomplète

## Dépannage

**Erreur : "Cannot find module 'node-fetch'"**
```bash
cd moniteur1d-api
npm install node-fetch@2
```

**Erreur : "ECONNREFUSED"**
- Vérifiez que le serveur API est démarré sur le port 3001
- Vérifiez l'URL : `http://localhost:3001`

**Tests CSRF échouent**
- Vérifiez que le middleware CSRF est activé dans `src/index.ts`
- Vérifiez que les cookies sont activés dans CORS

## Exemple de Sortie

```
============================================================
🧪 TESTS DE SÉCURITÉ - MONITEUR1D API
============================================================

API URL: http://localhost:3001

🔒 Test 1: Protection contre XSS
✅ XSS Payload bloqué: <script>alert('XSS')</sc...
✅ XSS Payload bloqué: <img src=x onerror=alert(...

🔒 Test 2: Protection contre CSRF
✅ CSRF Protection - Requête sans token
✅ CSRF Token - Génération
✅ CSRF Protection - Requête avec token valide

📊 RÉSUMÉ DES TESTS
============================================================
Total: 25 tests
✅ Réussis: 25
❌ Échoués: 0
📈 Taux de réussite: 100.0%

🎉 Tous les tests de sécurité sont passés !
```

