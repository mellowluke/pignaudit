# PignAudit - Architecture File Map

Every source file in the repository mapped to the architectural component it belongs to.

---

## 1. Frontend — Pages & Routes

Next.js App Router pages (`apps/web/src/app/`).

| File | Description |
| ---- | ----------- |
| `apps/web/src/app/layout.tsx` | Root HTML shell, global font/metadata, wraps the entire app |
| `apps/web/src/app/globals.css` | Global CSS reset and Tailwind base styles |
| `apps/web/src/app/page.tsx` | Root redirect — sends unauthenticated users to `/login`, authenticated users to `/dashboard` |
| `apps/web/src/app/(app)/layout.tsx` | Authenticated shell layout: sidebar + main content area |
| `apps/web/src/app/(app)/dashboard/page.tsx` | **Dashboard** — KPI summary cards, open findings count, engagement status breakdown |
| `apps/web/src/app/(app)/engagements/page.tsx` | **Engagements list** — searchable table of all audit engagements |
| `apps/web/src/app/(app)/engagements/new/page.tsx` | **New engagement form** — creates an AuditEngagement record |
| `apps/web/src/app/(app)/engagements/[id]/page.tsx` | **Engagement detail** — work programs, documents, findings, audit trail, policy flags |
| `apps/web/src/app/(app)/findings/page.tsx` | **Findings list** — filterable table of all findings across engagements |
| `apps/web/src/app/(app)/findings/[id]/page.tsx` | **Finding detail** — severity, status, recommendation, management response, action items |
| `apps/web/src/app/(app)/reports/page.tsx` | **Reports** — list of audit reports, status tracking, PDF download links |
| `apps/web/src/app/(app)/admin/policy-rules/page.tsx` | **Admin: Policy Rules** — view and toggle the policy engine rule catalogue |

---

## 2. Frontend — Shared UI Components

Reusable React components consumed by pages (`apps/web/src/components/`).

| File | Description |
| ---- | ----------- |
| `apps/web/src/components/sidebar.tsx` | Left navigation sidebar with module links and active-state highlighting |
| `apps/web/src/components/status-badge.tsx` | Colour-coded badge for `EngagementStatus`, `FindingStatus`, and `RiskRating` |
| `apps/web/src/components/engagement-documents.tsx` | SharePoint-style document folder panel: upload, replace, remove, and audit-trail display per document category |

---

## 3. Frontend — Application Logic & Data

Client-side business logic, mock data, and configuration (`apps/web/src/lib/`).

| File | Description |
| ---- | ----------- |
| `apps/web/src/lib/audit-trail.ts` | **Policy Engine & Audit Trail** — types, default rule catalogue, `evaluatePolicies()`, `recordEventAndEvaluate()`, and in-memory store (migrates server-side when API is built) |
| `apps/web/src/lib/mock-data.ts` | In-memory seed data for engagements, findings, users, and documents used during UI development |

---

## 4. Frontend — Configuration

Build and styling configuration for the web app.

| File | Description |
| ---- | ----------- |
| `apps/web/next.config.js` | Next.js build configuration (transpile packages, env vars) |
| `apps/web/tailwind.config.ts` | Tailwind CSS theme extension — colours, fonts, shadcn/ui integration |
| `apps/web/postcss.config.js` | PostCSS pipeline (Tailwind + Autoprefixer) |
| `apps/web/tsconfig.json` | TypeScript config for the web app, extends root config |
| `apps/web/next-env.d.ts` | Next.js TypeScript ambient declarations (auto-generated) |
| `apps/web/package.json` | Web app dependencies: Next.js, React, TailwindCSS, shadcn/ui, BullMQ client |

---

## 5. Background Workers

Async job processors that run independently of the web server (`apps/workers/`).

| File | Description |
| ---- | ----------- |
| `apps/workers/src/index.ts` | Worker entry point — registers `auditReportWorker` (queue: `audit-reports`) and `notificationWorker` (queue: `notifications`) via BullMQ; handles `SIGTERM` graceful shutdown |
| `apps/workers/tsconfig.json` | TypeScript config for the workers app |
| `apps/workers/package.json` | Worker dependencies: BullMQ, IORedis |

---

## 6. Database Package

Prisma schema, migrations, and database client (`packages/database/`).

| File | Description |
| ---- | ----------- |
| `packages/database/prisma/schema.prisma` | **Canonical data model** — defines all Prisma models: `Organization`, `User`, `AuditPlan`, `AuditEngagement`, `WorkProgram`, `TestProcedure`, `Workpaper`, `Finding`, `ActionItem`, `AuditReport`, `EngagementDocument`, `AuditLog`, `AuditTrailEvent`, `PolicyRule`, `PolicyFlag` |
| `packages/database/prisma/migrations/20260213190301_init/migration.sql` | Initial SQL migration — creates all tables, indexes, enums |
| `packages/database/prisma/migrations/migration_lock.toml` | Prisma migration engine lock (provider = postgresql) |
| `packages/database/src/index.ts` | Exports a singleton `PrismaClient` instance shared across apps |
| `packages/database/src/seed.ts` | Development seed script — populates org, users, plans, and sample engagements |
| `packages/database/tsconfig.json` | TypeScript config for the database package |
| `packages/database/package.json` | Dependencies: `@prisma/client`, `prisma` dev dep |

---

## 7. Shared Package

Cross-cutting types, constants, and utilities consumed by all apps and packages (`packages/shared/`).

| File | Description |
| ---- | ----------- |
| `packages/shared/src/types.ts` | Shared TypeScript types: `UserRole`, `EngagementStatus`, `RiskRating`, `FindingStatus`, `PaginationParams`, `PaginatedResponse`, `ApiError` |
| `packages/shared/src/constants.ts` | Runtime constants: status label maps, `MAX_FILE_SIZE_BYTES`, `ALLOWED_FILE_TYPES` |
| `packages/shared/src/index.ts` | Barrel export for the shared package |
| `packages/shared/tsconfig.json` | TypeScript config for the shared package |
| `packages/shared/package.json` | Package manifest (no external runtime deps) |

---

## 8. UI Component Library

Shared design-system components used across apps (`packages/ui/`).

| File | Description |
| ---- | ----------- |
| `packages/ui/src/button.tsx` | Base `Button` component with variant and size props |
| `packages/ui/src/index.ts` | Barrel export for the UI package |
| `packages/ui/tsconfig.json` | TypeScript config for the UI package |
| `packages/ui/package.json` | Package manifest (peer deps: React, TailwindCSS) |

---

## 9. Shared Configuration

Linting and compiler configs shared across the monorepo (`packages/config/`).

| File | Description |
| ---- | ----------- |
| `packages/config/eslint-preset.js` | Base ESLint rule-set (extends Next.js + TypeScript recommended) shared by all apps |
| `packages/config/package.json` | Package manifest for the config package |

---

## 10. Infrastructure — Docker

Container image definitions (`infra/docker/`).

| File | Description |
| ---- | ----------- |
| `infra/docker/Dockerfile.web` | Multi-stage Dockerfile for the Next.js web app — build stage + minimal production image |
| `infra/docker/Dockerfile.workers` | Multi-stage Dockerfile for the BullMQ workers service |

---

## 11. Infrastructure — Terraform (IaC)

AWS resource definitions (`infra/terraform/`).

| File | Description |
| ---- | ----------- |
| `infra/terraform/main.tf` | **Full AWS infrastructure** — VPC, Aurora PostgreSQL (RDS), ElastiCache Redis, S3 (document storage with KMS encryption + versioning), ECR repositories, ECS Fargate cluster, Application Load Balancer, security groups |
| `infra/terraform/staging.tfvars.example` | Example variable values for the staging environment |
| `infra/terraform/production.tfvars.example` | Example variable values for the production environment |

---

## 12. CI/CD Pipelines

GitHub Actions workflows (`.github/workflows/`).

| File | Description |
| ---- | ----------- |
| `.github/workflows/ci.yml` | **CI pipeline** — lint, type-check, test on every push and pull request |
| `.github/workflows/deploy.yml` | **Deploy pipeline** — builds Docker images, pushes to ECR, deploys to ECS Fargate on merge to `develop` (staging) and `main` (production) |

---

## 13. Root Workspace Configuration

Monorepo-level files at the repository root.

| File | Description |
| ---- | ----------- |
| `turbo.json` | Turborepo pipeline — defines task dependencies (`build`, `test`, `lint`) and caching rules |
| `package.json` | Root workspace manifest — declares pnpm workspaces, global dev tools (TypeScript, ESLint, Prettier) |
| `pnpm-workspace.yaml` | pnpm workspace glob — includes `apps/*` and `packages/*` |
| `pnpm-lock.yaml` | Locked dependency tree for reproducible installs |
| `tsconfig.json` | Root TypeScript config — base `compilerOptions` extended by all packages |
| `docker-compose.yml` | Local development stack — PostgreSQL, Redis, and the web/worker services with hot-reload |
| `vercel.json` | Vercel deployment config — maps Next.js app root for preview deployments |
| `.env.example` | Template listing all required environment variables (`DATABASE_URL`, `REDIS_URL`, `NEXTAUTH_SECRET`, S3 settings, etc.) |
| `.gitignore` | VCS ignore rules — `node_modules`, `.env`, build outputs, Terraform state |
| `scripts/test-vercel-build.sh` | Helper script to validate the Next.js build locally before deploying to Vercel |
| `ARCHITECTURE.md` | High-level architecture narrative: modules, tech stack diagram, domain model, auth, NFRs |
| `ARCHITECTURE-FILE-MAP.md` | *(this file)* Every file mapped to its architectural component |
