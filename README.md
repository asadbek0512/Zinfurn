# Zinfurn API — NestJS Backend

GraphQL + WebSocket backend for the [Zinfurn furniture marketplace](https://github.com/asadbek0512/Zinfurn-Next) · **Live:** api.zinfurn.uz/graphql

NestJS 10 monorepo (code-first Apollo Server, MongoDB/Mongoose): 14 feature modules — members/agents, properties, orders with **coupons**, repair service, community, comments, likes, follows, views, reviews, notifications (WebSocket), notices, messages, and AI-powered content **translation**.

## Highlights

- **Auth**: JWT pair (1h access + 30d refresh with rotation, `tokenType`-separated), Google OAuth, Telegram OAuth + account linking; `AuthGuard` / `RolesGuard` / `WithoutGuard` + `@AuthMember` decorator
- **Rate limiting**: `@nestjs/throttler` with a GraphQL-aware guard (login/signup 5/min, refresh 20/min, global 300/min), `trust proxy` for real client IPs behind nginx
- **Coupons**: atomic redemption (`$inc` guarded by usage limit — race-safe), server-side discount math, admin CRUD
- **Telegram notifications**: non-blocking order-status messages to customers + optional admin new-order alerts (`ADMIN_TELEGRAM_CHAT_ID`)
- **Translation service**: Groq (Llama 3.3 70B, JSON mode) primary / Gemini fallback — auto-translates products, articles, notices into 5 locales on create/update, preserving brand names
- **Uploads**: target whitelist (no path traversal), `sharp` transcode-to-JPEG (content validation by re-encoding), forced extensions
- **GraphQL hardening**: depth limit 8, introspection/playground off in production
- Batch app: scheduled ranking recalculation

## Layout

```
apps/
├── zinfurn-api/src/
│   ├── components/        # module + resolver + service per feature
│   │   └── auth/guards/   # AuthGuard, RolesGuard, WithoutGuard, GqlThrottlerGuard
│   ├── schemas/           # Mongoose models
│   ├── libs/dto|enums/    # GraphQL DTOs (class-validator enforced)
│   └── socket/            # WebSocket gateway
└── zinfurn-batch/src/     # cron jobs
```

## Run

```bash
npm i
npm run start:dev          # API :3007 (watch)
npm run start:dev:batch    # batch (watch)
npm test                   # unit tests (auth token system)
```

`.env` (see `.env.example`): `MONGO_DEV`, `SECRET_TOKEN`, `FRONTEND_URL`, `GOOGLE_CLIENT_ID/SECRET`, `TELEGRAM_BOT_TOKEN`, `GROQ_API_KEY`, optional `ADMIN_TELEGRAM_CHAT_ID`, `SESSION_SECRET`.

## Known Limitations

- Refresh tokens are stateless (no server-side revocation store); rotation only
- Rate-limit counters are in-memory — single-instance assumption (Redis needed to scale out)
- Demo order auto-progression uses in-process timers (showcase feature, not production ops)
- Test coverage focused on the auth/token system; other modules rely on typed DTO contracts

Deployed via Docker on a VPS behind nginx/SSL; a cron watches `main` and redeploys within a minute of a push (a committed pre-push hook build-gates every push).
