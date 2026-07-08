-- Add Plaid item/access token tracking to Account, needed to call the
-- Plaid API (e.g. transactionsSync) for an already-linked item.

-- These are added with temporary defaults so the migration can run against
-- existing rows, then the defaults are dropped since new rows must always
-- supply real values.
ALTER TABLE "Account" ADD COLUMN "plaidItemId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Account" ADD COLUMN "plaidAccessToken" TEXT NOT NULL DEFAULT '';

ALTER TABLE "Account" ALTER COLUMN "plaidItemId" DROP DEFAULT;
ALTER TABLE "Account" ALTER COLUMN "plaidAccessToken" DROP DEFAULT;

CREATE INDEX "Account_plaidItemId_idx" ON "Account"("plaidItemId");
