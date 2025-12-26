# 🔧 Guide de Résolution - Problème d'Endpoints Frontend → API

## 🐛 Problème Identifié

Le frontend essaie de se connecter à `https://api.moniteur1d.com` (production) au lieu de `http://localhost:3001` (développement).

**Symptômes:**
- Erreur: `POST https://api.moniteur1d.com/auth/login 401 (Unauthorized)`
- Socket.IO essaie de se connecter à `https://api.moniteur1d.com/socket.io/`
- Les endpoints ne fonctionnent pas depuis le frontend

## ✅ Corrections Appliquées

### 1. Correction de `src/lib/api/apiUrl.ts`
- ✅ Utilise maintenant le proxy Vite en développement (chemin relatif)
- ✅ Ajout de logs pour debug
- ✅ Détection améliorée du mode développement

### 2. Correction de `src/contexts/SocketContext.tsx`
- ✅ Socket.IO utilise `window.location.origin` si l'URL API est vide
- ✅ Support du proxy Vite pour Socket.IO

### 3. Correction de `vite.config.ts`
- ✅ Ajout du proxy pour `/socket.io`

## 🔍 Diagnostic

### Étape 1: Ouvrir le fichier de diagnostic

Ouvrez dans votre navigateur:
```
scripts/check-frontend-config.html
```

Ce fichier vous montrera:
- Le hostname actuel
- Les variables d'environnement
- L'URL API résolue
- Les problèmes détectés

### Étape 2: Vérifier la console du navigateur

Ouvrez la console (F12) et cherchez:
```
[API URL] Mode développement, utilisation du proxy Vite (chemin relatif)
```

Si vous voyez:
```
[API URL] Mode production détecté, utilisation de: https://api.moniteur1d.com
```

Cela signifie que le hostname n'est pas détecté comme localhost.

## 🛠️ Solutions

### Solution 1: Vérifier l'URL d'accès

**Assurez-vous d'accéder au site via:**
- ✅ `http://localhost:5173`
- ✅ `http://127.0.0.1:5173`

**Évitez:**
- ❌ `http://votre-nom-pc:5173`
- ❌ `http://192.168.x.x:5173`
- ❌ Tout autre nom de domaine

### Solution 2: Vérifier les variables d'environnement

**Créez un fichier `.env.local` à la racine** (si nécessaire):
```env
# Ne PAS définir VITE_API_URL pour utiliser le proxy Vite
# VITE_API_URL=http://localhost:3001  ← Commentez ou supprimez cette ligne
```

**Ou si vous voulez forcer l'URL directe:**
```env
VITE_API_URL=http://localhost:3001
```

### Solution 3: Redémarrer le serveur de développement

1. **Arrêtez le serveur** (Ctrl+C)
2. **Videz le cache**:
   ```powershell
   Remove-Item -Recurse -Force node_modules/.vite
   ```
3. **Redémarrez**:
   ```powershell
   npm run dev
   ```

### Solution 4: Vider le cache du navigateur

1. Ouvrez les outils de développement (F12)
2. Clic droit sur le bouton de rafraîchissement
3. Sélectionnez "Vider le cache et effectuer une actualisation forcée"
4. Ou appuyez sur **Ctrl+F5**

### Solution 5: Vérifier le mode de build

**Assurez-vous que vous utilisez le mode développement:**

Vérifiez dans la console:
```javascript
console.log(import.meta.env.DEV)  // Doit être true
console.log(import.meta.env.MODE) // Doit être "development"
```

Si ce n'est pas le cas, vous utilisez peut-être un build de production.

## 🧪 Test de Vérification

### Test 1: Vérifier la résolution de l'URL

Ouvrez la console du navigateur et exécutez:
```javascript
// Simuler la fonction resolveApiBaseUrl
const DEV_DEFAULT = "";
const PROD_URL = "https://api.moniteur1d.com";

function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, "");
  
  const isDev = import.meta.env.DEV;
  const { hostname, port } = window.location;
  const isLocalhost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(hostname) || 
                      (hostname === '' && (port === '5173' || port === '5174'));
  
  if (!isLocalhost && !isDev) {
    return PROD_URL;
  }
  
  return DEV_DEFAULT;
}

console.log('URL API résolue:', resolveApiBaseUrl() || '(vide - proxy Vite)');
console.log('Hostname:', window.location.hostname);
console.log('Port:', window.location.port);
console.log('Mode DEV:', import.meta.env.DEV);
```

### Test 2: Tester la connexion

Dans la console:
```javascript
// Test avec le proxy Vite
fetch('/health', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

Vous devriez voir:
```json
{ "status": "OK", "timestamp": "..." }
```

## 📋 Checklist de Résolution

- [ ] Accéder au site via `http://localhost:5173`
- [ ] Vérifier qu'aucun fichier `.env` ne définit `VITE_API_URL=https://api.moniteur1d.com`
- [ ] Redémarrer le serveur de développement
- [ ] Vider le cache du navigateur (Ctrl+F5)
- [ ] Vérifier la console pour les logs `[API URL]`
- [ ] Tester avec `scripts/check-frontend-config.html`
- [ ] Vérifier que `import.meta.env.DEV` est `true`

## 🎯 Résultat Attendu

Après les corrections, vous devriez voir dans la console:
```
[API URL] Mode développement, utilisation du proxy Vite (chemin relatif)
```

Et les requêtes doivent aller vers:
- ✅ `http://localhost:5173/auth/login` (via proxy)
- ✅ `http://localhost:5173/socket.io/` (via proxy)

Au lieu de:
- ❌ `https://api.moniteur1d.com/auth/login`
- ❌ `https://api.moniteur1d.com/socket.io/`

## 🆘 Si le problème persiste

1. **Ouvrez `scripts/check-frontend-config.html`** dans votre navigateur
2. **Cliquez sur "Tester la résolution"**
3. **Notez les résultats** et partagez-les
4. **Vérifiez les logs dans la console** du navigateur (F12)

