"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlaidLink } from "react-plaid-link";

export function PlaidLinkButton() {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "syncing" | "error"
  >("idle");

  useEffect(() => {
    fetch("/api/plaid/create-link-token", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setLinkToken(data.linkToken ?? null))
      .catch(() => setStatus("error"));
  }, []);

  const onSuccess = useCallback(
    async (publicToken: string) => {
      setStatus("loading");

      const exchangeRes = await fetch("/api/plaid/exchange-public-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicToken }),
      });

      if (!exchangeRes.ok) {
        setStatus("error");
        return;
      }

      setStatus("syncing");

      const syncRes = await fetch("/api/plaid/sync-transactions", {
        method: "POST",
      });

      if (!syncRes.ok) {
        setStatus("error");
        return;
      }

      setStatus("idle");
      router.refresh();
    },
    [router]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  const busy = status === "loading" || status === "syncing";

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => open()}
        disabled={!ready || busy}
        className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-50"
      >
        {status === "loading" && "Linking account..."}
        {status === "syncing" && "Syncing transactions..."}
        {status === "idle" && "Connect a bank account (Sandbox)"}
        {status === "error" && "Try again"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Something went wrong linking your account. Check the server logs.
        </p>
      )}
    </div>
  );
}
