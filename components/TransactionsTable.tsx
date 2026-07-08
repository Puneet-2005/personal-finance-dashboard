type TransactionRow = {
  id: string;
  merchantName: string | null;
  category: string | null;
  amount: number;
  date: Date;
  pending: boolean;
  accountName: string;
};

export function TransactionsTable({
  transactions,
}: {
  transactions: TransactionRow[];
}) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No transactions yet. Link an account and sync to pull in Plaid
        sandbox data.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-black/5 text-left dark:bg-white/5">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Merchant</th>
            <th className="px-4 py-2">Account</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr
              key={txn.id}
              className="border-t border-black/5 dark:border-white/5"
            >
              <td className="px-4 py-2 whitespace-nowrap">
                {new Date(txn.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                {txn.merchantName ?? "Unknown"}
                {txn.pending && (
                  <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Pending
                  </span>
                )}
              </td>
              <td className="px-4 py-2">{txn.accountName}</td>
              <td className="px-4 py-2">{txn.category ?? "Uncategorized"}</td>
              <td className="px-4 py-2 text-right">
                {txn.amount < 0 ? "-" : ""}${Math.abs(txn.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
