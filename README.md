# jrdriving monorepo

Ce dépôt héberge la pile SaaS modernisée **JR Driving** :

- **Application Next.js** dans `apps/web` pour le site public et les tableaux de bord.
- **API NestJS** dans `apps/api` qui expose l'authentification, les missions, les devis et les services d'administration, reposant sur MySQL et Drizzle ORM.
- **Utilitaires TypeScript partagés** dans `packages/shared` consommés à la fois par l'API et l'application web.

Le projet est conçu pour s'exécuter localement avec Docker sur Windows/WSL2 et pour être déployé en production sur Hostinger (front-end statique) plus un hôte Node/Nest pour l'API.

---

## 1. Prérequis

| Outil | Version (min) | Remarques |
| ---- | ------------- | ----- |
| [Node.js](https://nodejs.org/) | 20.x LTS | Nécessaire pour les builds locaux et les CLI Nest/Next. |
| [pnpm](https://pnpm.io/) | 9.x | Activé automatiquement via `corepack` (`corepack enable`). |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | latest | Exécute MySQL, l'API et les conteneurs web sur Windows (activer l'intégration WSL2). |
| [Git](https://git-scm.com/) | toute version récente | Contrôle de version. |

> 💡 **Astuce pour Windows** : utilisez **WSL2 (Ubuntu)** pour une expérience plus fluide. Installez avec `wsl --install`, redémarrez, puis installez Docker Desktop et activez l'option « Use WSL 2 based engine ».

### CLI globaux optionnels
- `pnpm dlx @nestjs/cli` (scaffolding Nest lorsqu'on travaille hors Docker)
- `pnpm dlx drizzle-kit` (exécuter des migrations en dehors des scripts de package)

---

## 2. Structure du dépôt
````markdown
```
jrdriving_bolt/
├── apps/
│   ├── api/        # Projet NestJS (@jrdriving/api)
│   └── web/        # Projet Next.js (@jrdriving/web)
├── packages/
│   └── shared/     # Types réutilisables, DTOs et helpers
├── docker/         # Dockerfiles utilisés par docker-compose
├── docker-compose.yml
├── pnpm-workspace.yaml
└── .env.example    # Modèle pour les variables d'environnement
```
````

---

## 3. Initialiser le projet

1. **Cloner le dépôt**
   ```bash
   git clone <your-fork-url>
   cd jrdriving_bolt
   ```

2. **Installer pnpm (si non disponible)**
   ```bash
   corepack enable
   corepack prepare pnpm@9.12.0 --activate
   ```

3. **Installer les dépendances du workspace** (optionnel si vous travaillez hors Docker)
   ```bash
   pnpm install
   ```

4. **Créer votre fichier d'environnement**
   ```bash
   cp .env.example .env
   ```
   Ajustez les secrets, les identifiants de base de données et les URL publiques selon vos besoins.

---

## 4. Développement local (Docker + MySQL)

Le dépôt inclut une stack Docker Compose prête à l'emploi qui démarre MySQL, l'API Nest et le front Next.js.

```bash
docker compose up --build
```

- **Frontend** : http://localhost:3000
- **API** : http://localhost:4000/api
- **MySQL** : localhost:3306 (utilisateur/mot de passe depuis `.env`)

### Installer des dépendances manquantes dans les conteneurs
Les commandes dans `docker-compose.yml` exécutent déjà `pnpm install` dans chaque service. Si vous ajoutez de nouveaux packages :
```bash
docker compose exec api pnpm add <package>
docker compose exec web pnpm add <package>
```
(Le fichier lock sera mis à jour dans l'espace de travail monté.)

### Appliquer les migrations de base de données
Les migrations Drizzle sont générées à partir du schéma dans `apps/api/src/database/schema.ts`.

```bash
# Générer les fichiers SQL de migration
docker compose exec api pnpm db:generate

# Appliquer les migrations sur l'instance MySQL en cours d'exécution
docker compose exec api pnpm db:migrate
```

### Exécuter les tests & linters
```bash
# Tests API (Jest)
docker compose exec api pnpm test

# Lint API
docker compose exec api pnpm lint

# Lint Web
docker compose exec web pnpm lint
```

Pour arrêter la stack :
```bash
docker compose down
```
Ajoutez `-v` pour supprimer les volumes MySQL pour repartir d'une base propre.

---

## 5. Développement local manuel (sans Docker)
Utile si vous préférez exécuter les services directement sur votre machine.

1. Démarrez MySQL localement et créez la base de données `jrdriving` avec l'utilisateur/mot de passe définis dans `.env`.
2. Installez les dépendances si ce n'est pas déjà fait :
   ```bash
   pnpm install
   ```
3. Appliquez les migrations :
   ```bash
   pnpm --filter @jrdriving/api db:migrate
   ```
4. Lancez l'API :
   ```bash
   pnpm --filter @jrdriving/api start:dev
   ```
5. Dans un second terminal, lancez le serveur dev Next.js :
   ```bash
   pnpm --filter @jrdriving/web dev
   ```

---

## 6. Builds de production & déploiement

### 6.1 Générer les artefacts
```bash
pnpm install --frozen-lockfile

# Builder l'API Nest (sortie dans apps/api/dist)
pnpm --filter @jrdriving/api build

# Builder l'app Next.js (sortie dans apps/web/.next)
pnpm --filter @jrdriving/web build
```

Pour une exportation statique du site public (si vous souhaitez servir des fichiers statiques sur Hostinger) :
```bash
pnpm --filter @jrdriving/web exec next export
```
Le dossier généré `apps/web/out` peut être uploadé sur un hébergeur statique.

### 6.2 Déployer l'API (NestJS)
1. Provisionnez un hôte compatible Node (VPS, hôte Docker, ou environnement Node.js Hostinger).
2. Copiez les répertoires/fichiers suivants : `apps/api/dist`, `apps/api/package.json`, le fichier `pnpm-lock.yaml` du workspace, et `packages/shared` (pour les DTOs partagés).
3. Installez les dépendances de production :
   ```bash
   pnpm install --filter @jrdriving/api --prod
   ```
4. Configurez les variables d'environnement (`DATABASE_URL`, `JWT_SECRET`, `AUTH_COOKIE_NAME`, etc.).
5. Lancez l'API :
   ```bash
   pnpm --filter @jrdriving/api start
   ```
   ou `node dist/main.js` depuis `apps/api`.

> ✅ Recommandation : containerisez l'API et exécutez-la via Docker sur le serveur pour garder la parité avec le développement local. Construisez les images à partir de `docker/api.Dockerfile` et `docker/web.Dockerfile`.

### 6.3 Déployer le front-end
- **Hébergement statique (Hostinger Business)** : uploadez le contenu du dossier `apps/web/out` dans la racine publique. Définissez `NEXT_PUBLIC_API_URL` sur l'URL publique de votre API avant d'exécuter `next export`.
- **Hébergement Node (SSR)** : uploadez le dossier `.next` construit ainsi que `package.json` et lancez `pnpm start` en mode production.

### 6.4 Migrations de base de données en production
Utilisez les mêmes commandes Drizzle en les pointant sur votre base de données de production :
```bash
DATABASE_URL="mysql://user:pass@host:3306/db" pnpm --filter @jrdriving/api db:migrate
```
(Privilégiez l'exécution dans votre pipeline de déploiement ou directement sur le serveur.)

---

## 7. Dépannage

| Problème | Solution |
| ----- | --- |
| Les conteneurs échouent avec `EADDRINUSE` | Assurez-vous que les ports 3000/4000/3306 sont libres ou modifiez `docker-compose.yml`. |
| `pnpm` commande introuvable | Exécutez `corepack enable` ou installez pnpm globalement (`npm install -g pnpm`). |
| Erreurs de migration Drizzle | Vérifiez `DATABASE_URL` et que la base est accessible depuis le conteneur/hôte. |
| Next.js ne peut pas atteindre l'API | Confirmez que `NEXT_PUBLIC_API_URL` correspond à l'URL publique de l'API et que le CORS est configuré dans l'app Nest. |

---

## 8. Rappel des commandes utiles
````markdown
```bash
# Installer les dépendances
pnpm install

# Démarrer la stack Docker
docker compose up --build

# Exécuter les tests API
docker compose exec api pnpm test

# Créer une nouvelle migration
docker compose exec api pnpm db:generate

# Appliquer les migrations
pnpm --filter @jrdriving/api db:migrate

# Builder tout pour la production
pnpm build
```
````

---

Bon hacking ! N'hésitez pas à adapter la stack à votre environnement de déploiement et à étendre les modules/routes fournis dans l'API Nest.