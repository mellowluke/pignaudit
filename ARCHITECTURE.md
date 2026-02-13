# PignAudit - Application Architecture

## Overview

PignAudit is an internal audit management platform inspired by Wolters Kluwer TeamMate+.
It provides tools for audit planning, fieldwork execution, issue tracking, reporting,
and analytics — delivered as a modern SaaS application.

## Core Modules

| Module               | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| **Audit Planning**   | Risk-based audit universe, annual planning, resource scheduling   |
| **Fieldwork**        | Work programs, test procedures, evidence collection, sign-offs    |
| **Issue Management** | Finding lifecycle, remediation tracking, follow-up workflows      |
| **Reporting**        | Audit report generation, templates, distribution, dashboards      |
| **Analytics**        | KPI dashboards, trend analysis, risk heatmaps, audit coverage     |
| **Admin & IAM**      | Org management, RBAC, SSO/SAML, audit trail of system actions     |
| **Document Mgmt**    | Workpaper storage, version control, cross-referencing, retention  |

## Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  Next.js 14+ (App Router) · React 18 · TypeScript       │
│  TailwindCSS · shadcn/ui · React Query · Zustand        │
├─────────────────────────────────────────────────────────┤
│                      API LAYER                          │
│  Next.js API Routes (BFF) · tRPC or REST                │
│  Express.js standalone services (background workers)    │
├─────────────────────────────────────────────────────────┤
│                      BACKEND SERVICES                   │
│  Node.js · TypeScript · Prisma ORM                      │
│  Bull/BullMQ (job queues) · Node-cron (scheduling)      │
├─────────────────────────────────────────────────────────┤
│                      DATA LAYER                         │
│  PostgreSQL (primary) · Redis (cache/sessions/queues)   │
│  S3 (document storage) · OpenSearch (full-text search)  │
├─────────────────────────────────────────────────────────┤
│                      INFRASTRUCTURE                     │
│  AWS (ECS Fargate · RDS · ElastiCache · S3 · CloudFront)│
│  Docker · Terraform · GitHub Actions CI/CD              │
└─────────────────────────────────────────────────────────┘
```

## Repository Structure (Monorepo — Turborepo)

```
pignaudit/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── apps/
│   ├── web/                # Next.js frontend + BFF API routes
│   └── workers/            # Background job processors
├── packages/
│   ├── database/           # Prisma schema, migrations, seed
│   ├── shared/             # Shared types, utils, constants
│   ├── ui/                 # Shared UI component library
│   └── config/             # Shared ESLint, TS, Tailwind configs
├── infra/
│   ├── terraform/          # IaC for AWS resources
│   ├── docker/             # Dockerfiles
│   └── scripts/            # Deployment & utility scripts
├── turbo.json              # Turborepo pipeline config
├── package.json            # Root workspace config
├── tsconfig.json           # Base TypeScript config
├── .env.example            # Environment variable template
└── docker-compose.yml      # Local development stack
```

## Domain Model (Core Entities)

```
Organization
 ├── User (role: admin | audit_manager | auditor | viewer)
 ├── AuditUniverse
 │    └── AuditableEntity (department, process, business unit)
 ├── AuditPlan (annual/quarterly)
 │    └── AuditEngagement
 │         ├── WorkProgram
 │         │    └── TestProcedure
 │         │         ├── Workpaper (evidence files)
 │         │         └── TestResult
 │         ├── Finding / Issue
 │         │    ├── Recommendation
 │         │    └── ManagementResponse
 │         └── AuditReport
 ├── RiskAssessment
 │    └── RiskRating (inherent, residual, control effectiveness)
 └── ActionItem (remediation tracking)
```

## Authentication & Authorization

- **Auth Provider**: NextAuth.js with database sessions
- **SSO**: SAML 2.0 / OIDC support for enterprise customers
- **RBAC**: Role-based access control at organization + engagement level
- **Audit Trail**: Every state change logged with actor, timestamp, diff

## Key Non-Functional Requirements

| Requirement      | Target                                               |
| ---------------- | ---------------------------------------------------- |
| Availability     | 99.9% uptime SLA                                     |
| Data Residency   | Multi-region support, configurable per tenant         |
| Encryption       | AES-256 at rest, TLS 1.3 in transit                  |
| Compliance       | SOC 2 Type II, GDPR-ready                            |
| Multi-tenancy    | Logical isolation (shared DB, tenant column)          |
| Scalability      | Horizontal scaling via ECS Fargate auto-scaling       |
| Backup/Recovery  | Automated daily snapshots, 30-day retention, PITR     |

## Environments

| Environment | Purpose                        | Branch Trigger   |
| ----------- | ------------------------------ | ---------------- |
| Development | Local Docker Compose stack     | —                |
| Staging     | AWS preview environment        | `develop` branch |
| Production  | AWS production environment     | `main` branch    |
