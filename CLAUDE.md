# Zinfurn Backend

NestJS monorepo API server for the Zinfurn furniture marketplace — GraphQL, WebSocket, JWT auth, Google and Telegram OAuth.

## Tech Stack

- Framework: NestJS 10 + TypeScript
- Database: MongoDB + Mongoose ODM
- API: GraphQL (Apollo Server, code-first) + WebSocket gateway
- Auth: JWT (1h access + 30d refresh) + Google OAuth + Telegram OAuth
- Monorepo: 2 apps managed via `nest-cli.json`
- Deploy: Docker + VPS

## Architecture

```
apps/
├── zinfurn-api/src/
│   ├── main.ts                    # Entry point (port 3007)
│   ├── app.module.ts
│   ├── components/                # 13 business modules
│   │   ├── auth/                  # JWT + Google + Telegram OAuth
│   │   │   ├── guards/            # AuthGuard, RolesGuard, WithoutGuard
│   │   │   └── decorators/        # @AuthMember, @Roles
│   │   ├── member/                # Users and agents
│   │   ├── property/              # Furniture CRUD, search, filter
│   │   ├── repair-property/       # Repair service
│   │   ├── order/                 # Orders
│   │   ├── board-article/         # Community articles
│   │   ├── comment/               # Comments
│   │   ├── like/                  # Favorites
│   │   ├── follow/                # Following
│   │   ├── view/                  # View count tracking
│   │   ├── notification/          # Real-time notifications
│   │   ├── notice/                # Admin announcements
│   │   └── review/                # Reviews
│   ├── database/                  # MongoDB connection
│   ├── schemas/                   # Mongoose models
│   ├── libs/
│   │   ├── dto/                   # GraphQL DTOs per module
│   │   ├── enums/                 # Shared enums
│   │   ├── types/                 # Shared types
│   │   └── interceptor/           # NestJS interceptors
│   └── socket/                    # WebSocket gateway
└── zinfurn-batch/src/             # Cron: monthly ranking refresh

uploads/                           # Static files
├── property/                      # Furniture images
├── member/                        # Profile images
└── article/                       # Article images
```

## Key Conventions

- Each module follows `module + resolver + service` pattern — resolver is thin, logic lives in service
- GraphQL schema is code-first — generated automatically from decorators
- `NestJS Logger` only: `private readonly logger = new Logger(ClassName.name)` — never `console.log`
- DTOs use `class-validator` decorators — always required
- ObjectId conversion: use `shapeIntoMongoObjectId()` from `libs/config.ts`
- Check `libs/config.ts` for shared aggregation lookups before writing new ones
- Response format: `{ success, data, message }`

## Auth Guards

| Guard | Purpose |
|---|---|
| `AuthGuard` | JWT required |
| `RolesGuard` | Role check (ADMIN, AGENT, USER) |
| `WithoutGuard` | JWT optional — anonymous allowed |

Current user: `@AuthMember('_id')` decorator on resolver methods.

## Auth Flow

1. Login/signup returns access token (1h) + refresh token (30d), both JWT
2. Access token carries full profile, signed with `SECRET_TOKEN`
3. Refresh token stores bcrypt hash in DB — single-use rotation
4. Google OAuth: callback at `auth.controller.ts` → `/auth/google/callback`
5. Telegram OAuth: callback at `auth.controller.ts` → `/auth/telegram/callback`

## Commands

```bash
npm run start:dev          # API dev server (watch mode, port 3007)
npm run start:dev:batch    # Batch dev server (watch mode)
npm run build              # TypeScript build
npm run lint               # ESLint
```

## Docker

```bash
docker compose up -d                              # Dev
docker compose -f docker-compose.prod.yml up -d  # Prod
```

## Environment Variables

See `.env.example`. Key variables:

- `MONGO_URI` — MongoDB connection string
- `SECRET_TOKEN` — JWT signing key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth
- `TELEGRAM_BOT_TOKEN` — Telegram OAuth

## Deployment

VPS: Docker container behind Nginx with SSL. Port 3007. Deployed via `deploy.sh` or GitHub Actions SSH deploy.
