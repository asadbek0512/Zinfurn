# Zinfurn

Backend for zinfurn.uz — a furniture e-commerce marketplace in Uzbekistan. GraphQL API with WebSocket support, JWT auth, Google and Telegram OAuth, and a batch service for monthly rankings.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 10 (monorepo) + TypeScript |
| API | GraphQL (Apollo Server, code-first) + WebSocket gateway |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (1h access + 30d refresh) + Google OAuth + Telegram OAuth |
| AI | Gemini API (chat assistant) |
| Deploy | Docker + GitHub Actions CI/CD |

## Getting Started

**Prerequisites:** Node.js 20+, npm, MongoDB

```bash
git clone <repo-url>
cd zinfurn

npm install

cp apps/zinfurn-api/.env.example apps/zinfurn-api/.env
# Fill in: MONGO_URI, SECRET_TOKEN, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, TELEGRAM_BOT_TOKEN

npm run start:dev        # API server (port 3007)
npm run start:dev:batch  # Batch server (cron jobs)
```

## Docker

```bash
# Development
docker compose up -d

# Production
docker compose -f docker-compose.prod.yml up -d
```

## Features

**Core API (13 business modules)**
- **Member** — user and agent registration, profile management, monthly rankings, top agents
- **Property** — furniture listings with full CRUD, search, filtering by type/price/material/location, view tracking
- **Repair Property** — repair service listings, booking, and management
- **Order** — order creation, status management, tracking (PAUSE / PROCESS / FINISH)
- **Board Article** — community articles with likes, views, and comment counts
- **Comment** — nested comments on articles
- **Like** — favorites system for properties and articles
- **Follow** — agent/member following system
- **View** — view count tracking for properties and articles
- **Notification** — real-time in-app notifications via WebSocket
- **Notice** — admin announcements and FAQ management
- **Review** — user reviews for agents

**Auth**
- JWT access token (1h) + refresh token (30d) with single-use rotation
- Google OAuth — callback at `/auth/google/callback`
- Telegram OAuth — callback at `/auth/telegram/callback`
- 3 guard levels: `AuthGuard` (required), `WithoutGuard` (optional), `RolesGuard` (ADMIN / AGENT / USER)

**Batch Service**
- Monthly ranking cron job — recalculates agent and property rankings

## Project Structure

```
apps/
├── zinfurn-api/src/
│   ├── components/        # 13 business modules (each: module + resolver + service)
│   │   ├── auth/          # JWT + Google + Telegram OAuth, guards, decorators
│   │   ├── member/        # Users and agents
│   │   ├── property/      # Furniture CRUD and search
│   │   ├── repair-property/
│   │   ├── order/
│   │   ├── board-article/
│   │   ├── comment/
│   │   ├── like/
│   │   ├── follow/
│   │   ├── view/
│   │   ├── notification/
│   │   ├── notice/
│   │   └── review/
│   ├── schemas/           # Mongoose models
│   ├── libs/              # DTOs, enums, types, shared helpers
│   └── socket/            # WebSocket gateway
└── zinfurn-batch/src/     # Cron: monthly ranking refresh
uploads/                   # Static files (furniture, member, article images)
```

## Deployment

Auto-deploys via GitHub Actions on push to `develop`:
1. Build + lint check
2. SSH into VPS
3. Docker rebuild and container restart

## Live

[https://zinfurn.uz](https://zinfurn.uz)
