import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";
import {
  SpendingBreakdownChart,
  type CategoryTotal,
} from "@/components/SpendingBreakdownChart";
import { TransactionsTable } from "@/components/TransactionsTable";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
    },
  });

  const transactions = accounts.flatMap((account) =>
    account.transactions.map((txn) => ({
      id: txn.id,
      merchantName: txn.merchantName,
      category: txn.category,
      amount: Number(txn.amount),
      date: txn.date,
      pending: txn.pending,
      accountName: account.accountName,
    }))
  );

  const categoryTotals = new Map<string, number>();
  for (const txn of transactions) {
    // Plaid convention: positive amount = money leaving the account (a spend).
    if (txn.amount <= 0) continue;
    const key = txn.category ?? "Uncategorized";
    categoryTotals.set(key, (categoryTotals.get(key) ?? 0) + txn.amount);
  }

  const breakdown: CategoryTotal[] = Array.from(
    categoryTotals.entries()
  ).map(([category, total]) => ({ category, total }));

  const totalBalance = accounts.reduce(
    (sum, account) => sum + Number(account.balance),
    0
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Personal Finance Dashboard</h1>
          <p className="text-sm text-zinc-500">
            Signed in as {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm text-zinc-500">Linked accounts</p>
          <p className="text-2xl font-semibold">{accounts.length}</p>
        </div>
        <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm text-zinc-500">Total balance</p>
          <p className="text-2xl font-semibold">${totalBalance.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <p className="text-sm text-zinc-500">Transactions</p>
          <p className="text-2xl font-semibold">{transactions.length}</p>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <PlaidLinkButton />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-medium">Spending by category</h2>
          <SpendingBreakdownChart data={breakdown} />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-medium">Recent transactions</h2>
          <TransactionsTable transactions={transactions.slice(0, 15)} />
        </div>
      </section>
    </div>
  );
}
