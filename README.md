# Personal Finance Dashboard

Link a bank account via Plaid (sandbox), sync and categorize transactions, and
view a spending breakdown dashboard.

**Stack:** Next.js 16 (App Router) · NextAuth v5 (credentials) · Prisma ·
PostgreSQL · Plaid API · Recharts

## Features

- Email/password auth (NextAuth v5 + Prisma adapter)
- Plaid Link flow: create link token → exchange public token → store linked
  accounts
- Transaction sync via `transactionsSync` (cursor-based, handles pagination)
- Auto-categorization using Plaid's `personal_finance_category`
- Dashboard: account balances, spending-by-category pie chart, recent
  transactions table

## Getting started

1. Copy `.env.example` to `.env` and fill in the values:
   - `DATABASE_URL` — a Postgres connection string
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `PLAID_CLIENT_ID` / `PLAID_SECRET` — from the
     [Plaid dashboard](https://dashboard.plaid.com/team/keys) (sandbox secret)
   - `PLAID_ENV=sandbox`

2. Install dependencies and set up the database:

   ```bash
   npm install
   npx prisma migrate dev
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Go to [http://localhost:3000](http://localhost:3000), sign up, then click
   **Connect a bank account (Sandbox)**. In Plaid's sandbox Link flow, use:
   - Username: `user_good`
   - Password: `pass_good`

   Then select any institution/accounts. This pulls in fake sandbox
   transactions you can sync and browse on the dashboard.

## Project structure

```
app/
  api/
    auth/[...nextauth]/route.ts   # NextAuth v5 handlers
    register/route.ts             # credentials signup
    plaid/create-link-token/      # Link token for Plaid Link
    plaid/exchange-public-token/  # exchanges public_token, stores accounts
    plaid/sync-transactions/      # pulls + categorizes transactions
  dashboard/page.tsx              # main dashboard (server component)
  login/, register/               # auth pages
components/
  PlaidLinkButton.tsx             # client: launches Plaid Link, triggers sync
  SpendingBreakdownChart.tsx      # recharts pie chart
  TransactionsTable.tsx
lib/
  auth.ts                         # NextAuth config
  plaid.ts                        # Plaid API client
  prisma.ts                       # Prisma client singleton
prisma/schema.prisma              # User, Account, Transaction, Budget models
```

## Notes / next steps

- `Budget` model exists in the schema but isn't wired into the UI yet —
  natural next feature (compare spend-by-category against a monthly limit).
- Currently supports one Plaid Item per sync call fan-out; multiple linked
  institutions per user are supported by the schema and sync route already.
- No route protection middleware yet beyond the `auth()` check inside
  `dashboard/page.tsx` — fine for a single protected route, but add
  `middleware.ts` if more protected routes are added.
