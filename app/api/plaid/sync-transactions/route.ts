import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const accounts = await prisma.account.findMany({
    where: { userId },
  });

  if (accounts.length === 0) {
    return NextResponse.json(
      { error: "No linked accounts. Link an account first." },
      { status: 400 }
    );
  }

  // Group accounts by their Plaid item, since transactionsSync is per-item (per access token).
  const accessTokensByItem = new Map<string, string>();
  for (const account of accounts) {
    accessTokensByItem.set(account.plaidItemId, account.plaidAccessToken);
  }

  const accountIdByPlaidAccountId = new Map(
    accounts.map((account) => [account.plaidAccountId, account.id])
  );

  let totalSynced = 0;

  try {
    for (const accessToken of accessTokensByItem.values()) {
      let cursor: string | undefined;
      let hasMore = true;

      while (hasMore) {
        const response = await plaidClient.transactionsSync({
          access_token: accessToken,
          cursor,
        });

        const { added, modified, has_more, next_cursor } = response.data;

        const upserts = [...added, ...modified]
          .filter((txn) => accountIdByPlaidAccountId.has(txn.account_id))
          .map((txn) =>
            prisma.transaction.upsert({
              where: { plaidTxnId: txn.transaction_id },
              create: {
                plaidTxnId: txn.transaction_id,
                merchantName: txn.merchant_name ?? txn.name,
                category:
                  txn.personal_finance_category?.primary ??
                  txn.category?.[0] ??
                  "Uncategorized",
                amount: txn.amount,
                date: new Date(txn.date),
                pending: txn.pending,
                accountId: accountIdByPlaidAccountId.get(txn.account_id)!,
              },
              update: {
                merchantName: txn.merchant_name ?? txn.name,
                category:
                  txn.personal_finance_category?.primary ??
                  txn.category?.[0] ??
                  "Uncategorized",
                amount: txn.amount,
                date: new Date(txn.date),
                pending: txn.pending,
              },
            })
          );

        await Promise.all(upserts);
        totalSynced += upserts.length;

        hasMore = has_more;
        cursor = next_cursor;
      }
    }

    return NextResponse.json({ success: true, synced: totalSynced });
  } catch (error) {
    console.error("Failed to sync Plaid transactions", error);
    return NextResponse.json(
      { error: "Failed to sync transactions" },
      { status: 500 }
    );
  }
}