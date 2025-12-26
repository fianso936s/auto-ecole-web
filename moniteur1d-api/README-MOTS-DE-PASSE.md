# 🔐 Mots de Passe - Guide Rapide

## ✅ Mot de passe uniforme activé

**Tous les utilisateurs utilisent le même mot de passe :** `fianso936s@@@`

## 🚀 Connexion rapide

### Frontend
- **Email** : `admin@moniteur1d.com` (ou n'importe quel autre compte)
- **Mot de passe** : `fianso936s@@@`

### API
```bash
npm run test:api-login -- admin@moniteur1d.com fianso936s@@@
```

## 📋 Comptes de test

| Email | Rôle | Mot de passe |
|-------|------|--------------|
| `admin@moniteur1d.com` | ADMIN | `fianso936s@@@` |
| `jean.moniteur@moniteur1d.fr` | INSTRUCTOR | `fianso936s@@@` |
| `marie.monitrice@moniteur1d.fr` | INSTRUCTOR | `fianso936s@@@` |
| `student1@moniteur1d.fr` | STUDENT | `fianso936s@@@` |
| ... (student2 à student10) | STUDENT | `fianso936s@@@` |

## 🔧 Changer le mot de passe uniforme

1. Ajoutez dans `.env` :
   ```env
   UNIFORM_PASSWORD="VotreNouveauMotDePasse"
   ```

2. Réuniformisez les mots de passe :
   ```bash
   npm run uniformize-passwords
   ```

## 📚 Documentation complète

Voir `MOTS-DE-PASSE-UNIFORMES.md` pour plus de détails.

