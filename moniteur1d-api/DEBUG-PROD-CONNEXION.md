# 🔍 Debug Connexion Production

## Problème identifié

- ✅ API accessible sur `https://api.moniteur1d.com`
- ✅ Serveur répond (Status 200 sur `/health`)
- ❌ Connexion échoue avec Status 401 "Identifiants invalides"
- ❌ Mot de passe testé : `fianso936s@@@` ne fonctionne pas

## Causes possibles

### 1. Email incorrect
- L'email admin en production pourrait être différent
- Vérifier dans la base de données de production

### 2. Mot de passe incorrect
- Le mot de passe en production est différent
- Les caractères spéciaux `@@@` pourraient être mal encodés
- Le mot de passe pourrait avoir été changé

### 3. Utilisateur n'existe pas
- L'utilisateur admin n'a pas été créé sur le serveur de production
- Le seed n'a pas été exécuté en production

### 4. Problème de hash
- Le mot de passe en production a été hashé différemment
- Problème lors de la création de l'utilisateur

## Solutions à tester

### Solution 1: Vérifier l'email exact
```bash
# Tester avec différents emails possibles
npm run test:prod-details -- admin@moniteur1d.com fianso936s@@@
npm run test:prod-details -- admin@moniteur1d.com fianso936s@@@
```

### Solution 2: Vérifier le mot de passe
- Vérifier dans la base de données de production quel est le vrai mot de passe
- Vérifier si le mot de passe a des espaces ou caractères invisibles

### Solution 3: Recréer l'utilisateur admin en production
```bash
# Se connecter au serveur de production
# Exécuter le seed avec le bon mot de passe
ADMIN_PASSWORD="fianso936s@@@" npm run prisma:seed
```

### Solution 4: Vérifier les logs du serveur
- Regarder les logs du serveur de production lors de la tentative de connexion
- Vérifier les messages d'erreur détaillés

## Commandes de test

```bash
# Test détaillé
npm run test:prod-details -- admin@moniteur1d.com fianso936s@@@

# Test avec curl (plus de détails)
curl -X POST "https://api.moniteur1d.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@moniteur1d.com","password":"fianso936s@@@"}' \
  -v
```

## Prochaines étapes

1. ✅ Vérifier les logs du serveur de production
2. ✅ Vérifier la base de données de production pour voir l'utilisateur admin
3. ✅ Tester avec différents formats d'email
4. ✅ Vérifier si le mot de passe a des caractères spéciaux mal encodés

