# ShipKit

A minimal, production-ready full-stack starter. Clone it, fill in your env vars, and ship.

## Stack

| Layer    | Tech                                              |
|----------|---------------------------------------------------|
| Backend  | Node.js · Express · TypeScript · Prisma · PostgreSQL |
| Auth     | Email + password · bcrypt · JWT (30 day)          |
| Payments | Stripe Checkout · subscriptions + one-time        |
| Web      | Next.js 14 (App Router) · Tailwind CSS            |
| Deploy   | Railway (backend) · Vercel (web)                  |

---

## Quick start

### 1 — Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/ship-kit.git
cd ship-kit

cd backend && npm install
cd ../web && npm install
```

### 2 — Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

# Web
cp web/.env.example web/.env.local
# Fill in NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_STRIPE_*, STRIPE_SECRET_KEY
```

### 3 — Run database migrations

```bash
cd backend
npm run db:migrate   # creates tables
# or for an existing DB:
npm run db:push
```

### 4 — Start development servers

```bash
# Terminal 1
cd backend && npm run dev   # http://localhost:3001

# Terminal 2
cd web && npm run dev       # http://localhost:3000
```

---

## Deploy

### Backend → Railway

```bash
# Install Railway CLI once
npm install -g @railway/cli
railway login

cd backend
railway init          # link or create project
railway up --detach   # deploy

# Set env vars in the Railway dashboard or:
railway variables set DATABASE_URL=... JWT_SECRET=... STRIPE_SECRET_KEY=...
```

The `railway.json` in `backend/` configures the build command and health check automatically.

### Web → Vercel

```bash
npm install -g vercel
cd web
vercel --prod
# Follow prompts — set NEXT_PUBLIC_* and STRIPE_SECRET_KEY in the Vercel dashboard
```

---

## API reference

All responses: `{ success: boolean, data?: T, error?: string }`

### Auth

| Method | Path                   | Auth? | Body / Notes                     |
|--------|------------------------|-------|----------------------------------|
| POST   | `/api/v1/auth/register` | —    | `{ email, password, name? }`     |
| POST   | `/api/v1/auth/login`    | —    | `{ email, password }`            |
| GET    | `/api/v1/auth/me`       | JWT  | Returns current user             |

### Payments

| Method | Path                        | Auth?    | Notes                                          |
|--------|-----------------------------|----------|------------------------------------------------|
| POST   | `/api/v1/payments/checkout`  | Optional | `{ priceId, mode }` → `{ url }` redirect to Stripe |
| POST   | `/api/v1/payments/webhook`   | Stripe   | Raw body — set `STRIPE_WEBHOOK_SECRET`         |
| GET    | `/api/v1/payments/portal`    | JWT      | Stripe billing portal URL                      |

### Waitlist

| Method | Path                     | Notes                     |
|--------|--------------------------|---------------------------|
| POST   | `/api/v1/waitlist`        | `{ email }` — upsert      |
| GET    | `/api/v1/waitlist/count`  | Returns `{ count }`        |

### Health

| Method | Path               | Notes                  |
|--------|--------------------|------------------------|
| GET    | `/api/v1/health`   | DB ping + status check |

---

## Stripe setup

1. Create products + prices in the [Stripe dashboard](https://dashboard.stripe.com/test/products)
2. Copy the price IDs (`price_...`) into your `.env.local`
3. For webhooks during local dev: `stripe listen --forward-to localhost:3001/api/v1/payments/webhook`
4. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`

Events handled by default: `checkout.session.completed`, `customer.subscription.deleted`

---

## Customise

- **Rename the app**: set `NEXT_PUBLIC_APP_NAME` in web env
- **Add a field to User**: edit `backend/prisma/schema.prisma` → `npm run db:migrate`
- **Add a route**: create `backend/src/routes/your-route.ts`, mount in `src/index.ts`
- **Add plan gates**: check `user.plan` in your route handlers

---

## License

MIT
