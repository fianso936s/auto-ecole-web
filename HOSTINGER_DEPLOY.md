# Guide de Déploiement Hostinger - Moniteur1D

## 1. Base de Données (MySQL)
1. Dans le hPanel Hostinger, allez dans **Bases de données** -> **Gestion des bases de données**.
2. Créez une nouvelle base de données (ex: `u123456789_moniteur1d`).
3. Notez l'utilisateur, le nom de la base et le mot de passe.
4. L'URL DATABASE_URL sera : `mysql://utilisateur:mot_de_passe@localhost:3306/nom_db`

## 2. Configuration du Dépôt Git
1. Dans le hPanel, allez dans **Avancé** -> **Git**.
2. Déployez le dépôt : `https://github.com/fianso936s/auto-ecole-web.git`
3. Branche : `main`.

## 3. Configuration du Backend (Node.js)
1. Allez dans **Avancé** -> **Node.js**.
2. Créez une application :
   - Dossier : `/moniteur1d-api`
   - Version Node : 18 ou 20
   - Fichier d'entrée : `dist/index.js`
3. Dans le dossier `moniteur1d-api` sur Hostinger (via le Gestionnaire de fichiers), créez un fichier `.env` :
```env
DATABASE_URL="votre_url_mysql"
JWT_SECRET="choisissez_un_secret_long"
JWT_REFRESH_SECRET="choisissez_un_autre_secret"
FRONTEND_URL="https://votre-domaine.com"
PORT=3000
```

## 4. Build du Frontend
Le frontend doit être construit (build) avant d'être envoyé dans `public_html`.
1. Dans Cursor, lancez : `npm run build`
2. Cela va créer un dossier `dist/` à la racine de votre projet.
3. Compressez le contenu du dossier `dist/` et envoyez-le dans le dossier `public_html` de votre site via le Gestionnaire de fichiers Hostinger.

## 5. Initialisation de la base de données
Connectez-vous en SSH à votre serveur Hostinger et lancez ces commandes dans le dossier `/moniteur1d-api` :
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

