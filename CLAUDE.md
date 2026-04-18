# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DevRadar** is a full-stack weather search application with search history tracking. It has two main sub-projects:

- `devradar-frontend/` — Angular 21.2 SPA (standalone components, no NgModules)
- `devradar-backend/` — NestJS 11 REST API backed by PostgreSQL

## Local Development Setup

Start PostgreSQL via Docker Compose (required before running the backend):
```bash
docker-compose up -d
```

**Backend** (NestJS on port 3000):
```bash
cd devradar-backend
npm install
npm run start:dev
```
Swagger docs available at http://localhost:3000/api

**Frontend** (Angular on port 4200, proxies to backend at http://localhost:3000):
```bash
cd devradar-frontend
npm install
npm start
```

## Common Commands

### Frontend (`devradar-frontend/`)
```bash
npm start           # dev server (ng serve)
npm run build       # production build → dist/
npm run watch       # dev build in watch mode
npm run test        # Vitest unit tests
```

### Backend (`devradar-backend/`)
```bash
npm run start:dev   # watch mode (development)
npm run build       # compile TypeScript → dist/
npm run start:prod  # run compiled production build
npm run test        # Jest unit tests
npm run test:e2e    # end-to-end tests
npm run test:cov    # coverage report
npm run lint        # ESLint with auto-fix
npm run format      # Prettier formatting
```

## Architecture

### Backend (NestJS)

Feature modules under `src/`:

- **`weather/`** — `GET /weather?city=<name>` — calls OpenWeatherMap API, caches result 60s, saves to history DB
- **`history/`** — `GET /history?page=&limit=` and `DELETE /history/:id` — paginated search history backed by `search_history` PostgreSQL table

Key patterns:
- Input validation via DTOs + `class-validator` (global `ValidationPipe`)
- Global in-memory cache (`@nestjs/cache-manager`, 60s TTL) checked before hitting external API
- TypeORM with `synchronize: true` (schema auto-sync in all environments)
- All config via env vars loaded by `@nestjs/config` from `.env`

Required env vars (see `devradar-backend/.env`):
```
DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
PORT
WEATHER_API_KEY, WEATHER_API_URL
```

### Frontend (Angular)

- Standalone bootstrap: `bootstrapApplication(App, appConfig)` in `main.ts`
- `appConfig` provides `provideRouter(routes)` and `provideHttpClient()`
- Environment switching: `environment.development.ts` (localhost:3000) vs `environment.ts` (Azure URL) — Angular CLI handles the file replacement on build
- Routes are defined in `src/app/app.routes.ts` (currently empty — ready for feature development)

### Infrastructure

- `docker-compose.yml` — PostgreSQL 16 only (backend runs on host during dev)
- `devradar-backend/Dockerfile` — multi-stage Node 20-alpine build for production
- Production target: Azure Container Apps (URL in `environment.ts`)
