"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-md border border-black/10 px-3 py-1.5 text-sm dark:border-white/10"
    >
      Sign out
    </button>
  );
}
