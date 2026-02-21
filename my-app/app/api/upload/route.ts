// app/api/upload/route.ts
import { NextResponse } from "next/server";

type Tx = {
  date: string;
  amount: number;
};

/**
 * API route to receive uploaded transactions, validate and normalize them, and respond with a summary.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const txs = body?.transactions as Tx[] | undefined;

    if (!Array.isArray(txs)) {
      return NextResponse.json({ error: "transactions must be an array" }, { status: 400 });
    }

    // basic validation & normalization
    const cleaned = txs
      .map((t, i) => {
        if (!t) return null;
        const date = t.date ? String(t.date) : "";
        const amount = typeof t.amount === "number" ? t.amount : Number(t.amount || 0);
        // drop clearly invalid rows
        if (!date || Number.isNaN(amount)) return null;
        return { date,  amount };
      })
      .filter(Boolean);

   const count = cleaned.length;

    return NextResponse.json({ ok: true, count, transactions: cleaned }, { status: 200 });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}