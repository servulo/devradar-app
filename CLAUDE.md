# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

```
devradar-app/
├── devradar-backend/   # NestJS API
├── infra/              # Terraform (Azure)
└── docker-compose.yml  # Local PostgreSQL
```

## Backend — devradar-backend

### Commands (run from `devradar-backend/`)

```bash
npm run start:dev     # dev server with watch
npm run build         # compile to dist/
npm run start:prod    # run compiled output
npm run test          # unit tests
npm run test:cov      # with coverage report
npm run test:e2e      # end-to-end tests
npm run lint          # eslint --fix
npm run format        # prettier --write
```

Run a single test file:
```bash
npx jest src/weather/weather.service.spec.ts
```

### Local database

```bash
docker compose up -d   # starts PostgreSQL on localhost:5432
```

Copy `devradar-backend/.env` and set the required variables (DB credentials, `WEATHER_API_KEY`, `WEATHER_API_URL`). TypeORM runs with `synchronize: true`, so schema migrations are automatic in dev.

### Architecture

The app has two NestJS modules:

**WeatherModule** — `GET /weather?city=<name>`
- Calls the OpenWeatherMap API (`WEATHER_API_URL/weather`) with `units=metric&lang=pt_br`.
- Results are cached via `@nestjs/cache-manager` (TTL 60s, key `weather:<city_lowercase>`).
- On a cache miss, the result is persisted to `search_history` via `HistoryService` before returning.

**HistoryModule** — `GET /history?page=&limit=` / `DELETE /history/:id`
- Stores every unique weather fetch in the `search_history` table (TypeORM entity).
- `findAll` returns paginated results ordered by `searchedAt DESC`.

`ValidationPipe({ transform: true })` is global. Swagger docs are served at `/api`.

`WEATHER_API_KEY` is intentionally absent from `container_apps.tf` — it must be injected as a secret manually or via CI when deploying to Azure Container Apps.

## Infra — infra/ (Terraform + Azure)

### Commands (run from `infra/`)

```bash
terraform init
terraform plan -var="postgres_admin_password=<pwd>"
terraform apply -var="postgres_admin_password=<pwd>"
```

`postgres_admin_password` is the only required variable without a default; all other variables have defaults in `variables.tf`.

### What it provisions (Azure, region `brazilsouth`)

- **Resource group** `sprj-rg-devradar`
- **Azure Container App** (`sprj-ca-devradar-backend`) pulling from an existing shared ACR (`sprjacrshared` in `sprj-rg-shared`)
- **PostgreSQL Flexible Server** v16 (`B_Standard_B1ms`, 32 GB) with database `devradardb`
- **Log Analytics Workspace** + Container App Environment

The Container App reads DB credentials from Terraform outputs and exposes port 3000 externally. The backend image must be pushed to the shared ACR before `terraform apply`.
