import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-semibold">Personal Finance Dashboard</h1>
      <p className="max-w-md text-zinc-500">
        Link a bank account via Plaid sandbox, categorize your transactions,
        and see where your money goes.
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded-md bg-foreground px-4 py-2 text-background"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-black/10 px-4 py-2 dark:border-white/10"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
