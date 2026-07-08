import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicToken } = await request.json();

  if (!publicToken) {
    return NextResponse.json(
      { error: "publicToken is required" },
      { status: 400 }
    );
  }

  try {
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    const [accountsResponse, itemResponse] = await Promise.all([
      plaidClient.accountsGet({ access_token: accessToken }),
      plaidClient.itemGet({ access_token: accessToken }),
    ]);

    const institutionName =
      itemResponse.data.item.institution_id ?? "Unknown institution";

    await Promise.all(
      accountsResponse.data.accounts.map((account) =>
        prisma.account.upsert({
          where: { plaidAccountId: account.account_id },
          create: {
            plaidAccountId: account.account_id,
            plaidItemId: itemId,
            plaidAccessToken: accessToken,
            institutionName,
            accountName: account.name,
            accountType: account.subtype ?? account.type,
            balance: account.balances.current ?? 0,
            userId: session.user.id,
          },
          update: {
            plaidAccessToken: accessToken,
            accountName: account.name,
            accountType: account.subtype ?? account.type,
            balance: account.balances.current ?? 0,
          },
        })
      )
    );

    return NextResponse.json({ success: true, itemId });
  } catch (error) {
    console.error("Failed to exchange Plaid public token", error);
    return NextResponse.json(
      { error: "Failed to link account" },
      { status: 500 }
    );
  }
}
