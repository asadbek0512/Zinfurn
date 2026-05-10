# AI Agent Guide — Zinfurn Backend

This file helps AI coding agents understand the NestJS backend quickly.

## What is this?

A NestJS 10 monorepo with GraphQL API and WebSocket support for the Zinfurn furniture marketplace. Code-first GraphQL — schema is generated automatically. Two apps: `zinfurn-api` (main) and `zinfurn-batch` (cron jobs).

## Quick orientation

| What | Where |
|---|---|
| Entry point | `apps/zinfurn-api/src/main.ts` |
| Root module | `apps/zinfurn-api/src/app.module.ts` |
| Business modules | `apps/zinfurn-api/src/components/{feature}/` |
| Mongoose schemas | `apps/zinfurn-api/src/schemas/` |
| GraphQL DTOs | `apps/zinfurn-api/src/libs/dto/{feature}/` |
| Shared enums | `apps/zinfurn-api/src/libs/enums/` |
| Auth guards | `apps/zinfurn-api/src/components/auth/guards/` |
| Shared helpers | `apps/zinfurn-api/src/libs/config.ts` |
| Batch jobs | `apps/zinfurn-batch/src/` |
| Static uploads | `uploads/` |

## Architecture decisions

- NestJS monorepo — `zinfurn-api` and `zinfurn-batch` share code via `libs/`
- Code-first GraphQL — never edit the generated schema file directly
- Resolver is thin: validate input, call service, return result
- All business logic lives in the service layer
- Auth uses 3 strategies: JWT, Google OAuth, Telegram OAuth

## Key patterns to follow

- New module: create `{feature}.module.ts` + `{feature}.resolver.ts` + `{feature}.service.ts` in `components/{feature}/`, then import in `app.module.ts`
- New DTO: add to `libs/dto/{feature}/` and use `class-validator` decorators
- New schema: add Mongoose model to `schemas/` and sync with DTOs
- Logger: `private readonly logger = new Logger(FeatureName.name)` — every service and resolver
- ObjectId: always use `shapeIntoMongoObjectId()` from `libs/config.ts`

## Auth flow

1. `auth.resolver.ts` calls `auth.service.ts` → validates credentials
2. Service generates JWT access token (1h) and refresh token (30d)
3. Refresh token bcrypt hash is saved to DB — used for rotation
4. Guards applied per-resolver: `@UseGuards(AuthGuard)`, `@UseGuards(WithoutGuard)`, etc.
5. Current user injected via `@AuthMember()` decorator

## Build and verify

```bash
npm run build              # Catches TypeScript and type errors
npm run lint               # ESLint
npm run start:dev          # Dev server with watch
```

## Things to avoid

- Using `console.log` — use `NestJS Logger` instead
- Mismatching DTO and Mongoose schema — GraphQL will throw at startup
- Bypassing auth guards without a documented reason
- Hardcoding environment variables — always use `ConfigService` or `process.env`
- Writing aggregation lookups from scratch — check `libs/config.ts` first
