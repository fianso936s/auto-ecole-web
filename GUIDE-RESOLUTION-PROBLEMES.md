# 🔧 Guide de Résolution des Problèmes - Test Full Stack

Ce guide vous aide à résoudre les deux problèmes principaux rencontrés lors des tests :

1. **API Production : Login échoué** (Identifiants invalides)
2. **Frontend Local : Non accessible** (Serveur non démarré)

## 📋 Étape par Étape

### Problème 1 : API Production - Login échoué

#### Symptôme
```
❌ [API-Production] Login: Échec: Identifiants invalides (401)
```

#### Cause
Les identifiants de test (`ADMIN_EMAIL` et `ADMIN_PASSWORD`) dans votre fichier `.env` local ne correspondent pas à ceux configurés sur l'API de production Hostinger.

#### Solution

**Option A : Utiliser le script de diagnostic**
```bash
cd moniteur1d-api
npm run fix:full-stack
```

**Option B : Configuration manuelle**

1. **Connectez-vous à Hostinger**
   - Via SSH ou via le hPanel (Gestionnaire de fichiers)

2. **Accédez au dossier de l'API**
   ```bash
   cd moniteur1d-api
   ```

3. **Vérifiez/modifiez le fichier `.env`**
   ```env
   ADMIN_EMAIL="admin@moniteur1d.com"
   ADMIN_PASSWORD="votre_mot_de_passe_production"
   ```

4. **Vérifiez que l'utilisateur existe en base de données**
   - Connectez-vous à votre base de données (Neon PostgreSQL)
   - Vérifiez que l'utilisateur avec cet email existe
   - Si nécessaire, créez-le avec le seed :
     ```bash
     npm run prisma:seed
     ```

5. **Redémarrez l'application Node.js**
   - Dans le hPanel Hostinger : **Avancé** → **Node.js**
   - Cliquez sur **Redémarrer** pour votre application

6. **Testez la connexion**
   ```bash
   npm run test:prod
   ```

#### Vérification
```bash
cd moniteur1d-api
npm run test:prod
```

Vous devriez voir :
```
✅ Health check OK
✅ Login réussi: admin@moniteur1d.com
```

---

### Problème 2 : Frontend Local - Non accessible

#### Symptôme
```
❌ [Frontend-Local] Accessibilité: Erreur: fetch failed
```

#### Cause
Le serveur de développement frontend (Vite) n'est pas démarré.

#### Solution

**Option A : Utiliser le script automatique (Recommandé)**

1. **Ouvrez un NOUVEAU terminal PowerShell**
   - Gardez le terminal actuel ouvert pour les tests

2. **Exécutez le script**
   ```powershell
   .\start-frontend.ps1
   ```

3. **Attendez que le serveur démarre**
   - Vous verrez : `Local: http://localhost:5173`
   - Le serveur reste actif dans ce terminal

4. **Revenez dans le terminal de test**
   - Relancez : `npm run test:full-stack`

**Option B : Démarrage manuel**

1. **Ouvrez un NOUVEAU terminal**
   ```powershell
   cd C:\Users\asus\Desktop\moniteur1d-web
   ```

2. **Installez les dépendances si nécessaire**
   ```powershell
   npm install
   ```

3. **Démarrez le serveur**
   ```powershell
   npm run dev
   ```

4. **Vérifiez que le serveur est démarré**
   - Ouvrez votre navigateur : http://localhost:5173
   - Vous devriez voir l'application

5. **Revenez dans le terminal de test**
   - Relancez : `npm run test:full-stack`

#### Vérification
Ouvrez votre navigateur et allez sur : http://localhost:5173

Vous devriez voir l'application Moniteur1D.

---

## 🚀 Commandes Utiles

### Tests
```bash
# Test complet (tous les composants)
npm run test:full-stack

# Test uniquement la production
npm run test:prod

# Test API ↔ Database
npm run test:api-db

# Guide de résolution interactif
npm run fix:full-stack
```

### Démarrage des serveurs
```bash
# Frontend (dans un terminal séparé)
.\start-frontend.ps1
# ou
npm run dev

# Backend API (dans un terminal séparé)
cd moniteur1d-api
npm run dev
```

---

## 📊 Résultats Attendus

Après avoir résolu les problèmes, vous devriez voir :

```
✅ Succès: 14+
⚠️  Avertissements: 0-1
❌ Erreurs: 0

📊 RÉSUMÉ PAR COMPOSANT:
✅ Database: 3/3 tests réussis
✅ API-Production: 3/3 tests réussis
✅ API-Local: 6/6 tests réussis
✅ Frontend-Hostinger: 2/2 tests réussis
✅ Frontend-Local: 2/2 tests réussis
```

---

## 🔍 Dépannage Avancé

### Le frontend démarre mais le test échoue toujours

1. Vérifiez que le port est correct (5173 par défaut)
2. Vérifiez les logs du terminal frontend pour des erreurs
3. Vérifiez que le proxy Vite est configuré correctement dans `vite.config.ts`

### L'API de production répond mais le login échoue toujours

1. Vérifiez les logs de l'application Node.js sur Hostinger
2. Vérifiez que la base de données de production est accessible
3. Vérifiez que les identifiants sont corrects (sans espaces, avec les bonnes majuscules/minuscules)
4. Testez avec curl depuis le serveur :
   ```bash
   curl -X POST https://api.moniteur1d.com/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@moniteur1d.com","password":"votre_mot_de_passe"}'
   ```

### Les deux serveurs (frontend et backend) doivent-ils être démarrés ?

**Pour le test complet** :
- ✅ Backend API local : **OUI** (pour tester l'API locale)
- ✅ Frontend local : **OUI** (pour tester le frontend local)
- ❌ Backend API production : **NON** (déjà démarré sur Hostinger)

**Pour tester uniquement la production** :
- ❌ Backend API local : **NON**
- ❌ Frontend local : **NON**
- ✅ Backend API production : **OUI** (déjà démarré sur Hostinger)

---

## 📝 Notes Importantes

1. **Ne fermez pas les terminaux** où les serveurs sont démarrés
2. **Les serveurs doivent rester actifs** pendant les tests
3. **Les identifiants de production** doivent être différents des identifiants de développement (sécurité)
4. **Le fichier `.env`** ne doit jamais être commité sur Git (contient des secrets)

---

## 🆘 Besoin d'aide ?

Si les problèmes persistent :

1. Vérifiez les logs des serveurs
2. Vérifiez la configuration des variables d'environnement
3. Vérifiez la connectivité réseau
4. Consultez la documentation : `moniteur1d-api/scripts/README-TEST-FULL-STACK.md`

