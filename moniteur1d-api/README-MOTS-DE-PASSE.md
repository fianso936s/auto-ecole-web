# 🔐 Mots de Passe - Guide Rapide

## ✅ Mot de passe uniforme activé

**Tous les utilisateurs utilisent le même mot de passe :** `Admin123!`

## 🚀 Connexion rapide

### Frontend
- **Email** : `admin@moniteur1d.fr` (ou n'importe quel autre compte)
- **Mot de passe** : `Admin123!`

### API
```bash
npm run test:api-login -- admin@moniteur1d.fr Admin123!
```

## 📋 Comptes de test

| Email | Rôle | Mot de passe |
|-------|------|--------------|
| `admin@moniteur1d.fr` | ADMIN | `Admin123!` |
| `jean.moniteur@moniteur1d.fr` | INSTRUCTOR | `Admin123!` |
| `marie.monitrice@moniteur1d.fr` | INSTRUCTOR | `Admin123!` |
| `student1@moniteur1d.fr` | STUDENT | `Admin123!` |
| ... (student2 à student10) | STUDENT | `Admin123!` |

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

