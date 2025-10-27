# jrdriving monorepo

This repository hosts the modernized **JR Driving** SaaS stack:

- **Next.js** application in `apps/web` for the public site and dashboards.
- **NestJS** API in `apps/api` that exposes authentication, missions, quotes and admin services backed by MySQL and Drizzle ORM.
- **Shared TypeScript utilities** in `packages/shared` that are consumed by both the API and the web application.

The project is designed to run locally with Docker on Windows/WSL2 and to be deployed in production on Hostinger (static front-end) plus a Node/Nest host for the API.

---

## 1. Prerequisites

| Tool | Version (min) | Notes |
| ---- | ------------- | ----- |
| [Node.js](https://nodejs.org/) | 20.x LTS | Required for local builds and the Nest/Next CLIs. |
| [pnpm](https://pnpm.io/) | 9.x | Enabled automatically through `corepack` (`corepack enable`). |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | latest | Runs the MySQL, API and web containers on Windows (enable WSL2 integration). |
| [Git](https://git-scm.com/) | any recent | Source control. |

> 💡 **Windows setup tip**: use **WSL2 (Ubuntu)** for the smoothest experience. Install with `wsl --install`, reboot, then install Docker Desktop and enable the “Use WSL 2 based engine” option.

### Optional global CLIs
- `pnpm dlx @nestjs/cli` (Nest scaffolding when working outside Docker)
- `pnpm dlx drizzle-kit` (running migrations outside package scripts)

---

## 2. Repository layout
```
jrdriving_bolt/
├── apps/
│   ├── api/        # NestJS project (@jrdriving/api)
│   └── web/        # Next.js project (@jrdriving/web)
├── packages/
│   └── shared/     # Reusable types, DTOs and helpers
├── docker/         # Dockerfiles used by docker-compose
├── docker-compose.yml
├── pnpm-workspace.yaml
└── .env.example    # Template for environment variables
```

---

## 3. Bootstrap the project

1. **Clone the repository**
   ```bash
   git clone <your-fork-url>
   cd jrdriving_bolt
   ```

2. **Install pnpm (if not already available)**
   ```bash
   corepack enable
   corepack prepare pnpm@9.12.0 --activate
   ```

3. **Install workspace dependencies** (optional when working outside Docker)
   ```bash
   pnpm install
   ```

4. **Create your environment file**
   ```bash
   cp .env.example .env
   ```
   Adjust secrets, database credentials and public URLs as needed.

---

## 4. Local development (Docker + MySQL)

The repository ships with a ready-to-run Docker Compose stack that starts MySQL, the Nest API and the Next.js front.

```bash
docker compose up --build
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api
- **MySQL**: localhost:3306 (user/password from `.env`)

### Installing missing dependencies inside containers
The `docker-compose.yml` commands already run `pnpm install` inside each service. If you add new packages:
```bash
docker compose exec api pnpm add <package>
docker compose exec web pnpm add <package>
```
(The lockfile will be updated inside the mounted workspace.)

### Applying database migrations
Drizzle migrations are generated from the schema in `apps/api/src/database/schema.ts`.

```bash
# Generate SQL migration files
docker compose exec api pnpm db:generate

# Apply migrations to the running MySQL instance
docker compose exec api pnpm db:migrate
```

### Running tests & linters
```bash
# API tests (Jest)
docker compose exec api pnpm test

# API lint
docker compose exec api pnpm lint

# Web lint
docker compose exec web pnpm lint
```

To stop the stack:
```bash
docker compose down
```
Add `-v` to remove MySQL volumes for a clean slate.

---

## 5. Manual local development (without Docker)
This is useful if you prefer running the services directly on your machine.

1. Start MySQL locally and create the `jrdriving` database with the user/password defined in `.env`.
2. Install dependencies if not already done:
   ```bash
   pnpm install
   ```
3. Apply migrations:
   ```bash
   pnpm --filter @jrdriving/api db:migrate
   ```
4. Run the API:
   ```bash
   pnpm --filter @jrdriving/api start:dev
   ```
5. In a second terminal, run the Next.js dev server:
   ```bash
   pnpm --filter @jrdriving/web dev
   ```

---

## 6. Production builds & deployment

### 6.1 Building artifacts
```bash
pnpm install --frozen-lockfile

# Build the Nest API (outputs to apps/api/dist)
pnpm --filter @jrdriving/api build

# Build the Next.js app (outputs to apps/web/.next)
pnpm --filter @jrdriving/web build
```

For a static export of the public site (if you want to serve static files on Hostinger):
```bash
pnpm --filter @jrdriving/web exec next export
```
The generated `apps/web/out` directory can be uploaded to a static host.

### 6.2 Deploying the API (NestJS)
1. Provision a Node-compatible host (VPS, Docker host, or Hostinger Node.js environment).
2. Copy the following directories/files: `apps/api/dist`, `apps/api/package.json`, the workspace `pnpm-lock.yaml`, and `packages/shared` (for shared DTOs).
3. Install production dependencies:
   ```bash
   pnpm install --filter @jrdriving/api --prod
   ```
4. Configure environment variables (`DATABASE_URL`, `JWT_SECRET`, `AUTH_COOKIE_NAME`, etc.).
5. Run the API:
   ```bash
   pnpm --filter @jrdriving/api start
   ```
   or `node dist/main.js` from inside `apps/api`.

> ✅ Recommended: containerize the API and run it via Docker on the server for parity with local development. Build images from `docker/api.Dockerfile` and `docker/web.Dockerfile`.

### 6.3 Deploying the front-end
- **Static hosting (Hostinger Business)**: Upload the `apps/web/out` directory contents to the public web root. Set `NEXT_PUBLIC_API_URL` to your public API URL before running `next export`.
- **Node hosting (SSR)**: Upload the built `.next` folder along with `package.json` and run `pnpm start` in production mode.

### 6.4 Database migrations in production
Use the same Drizzle commands pointed at your production database:
```bash
DATABASE_URL="mysql://user:pass@host:3306/db" pnpm --filter @jrdriving/api db:migrate
```
(Prefer running this inside your deployment pipeline or directly on the server.)

---

## 7. Troubleshooting

| Issue | Fix |
| ----- | --- |
| Containers fail with `EADDRINUSE` | Ensure ports 3000/4000/3306 are free or edit `docker-compose.yml`. |
| `pnpm` command not found | Run `corepack enable` or install pnpm globally (`npm install -g pnpm`). |
| Drizzle migration errors | Verify `DATABASE_URL` and that the database is reachable from the container/host. |
| Next.js cannot reach the API | Confirm `NEXT_PUBLIC_API_URL` matches the API’s public URL and CORS is configured in the Nest app. |

---

## 8. Useful commands quick reference
```bash
# Install dependencies
pnpm install

# Start Docker stack
docker compose up --build

# Run API tests
docker compose exec api pnpm test

# Create a new migration
docker compose exec api pnpm db:generate

# Apply migrations
pnpm --filter @jrdriving/api db:migrate

# Build everything for production
pnpm build
```

---

Happy hacking! Feel free to tailor the stack to your deployment environment and extend the modules/routes provided in the Nest API.
