import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/data/demoSavings.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const transactions = JSON.parse(data);
    const total = Array.isArray(transactions)
      ? transactions.reduce((sum, tx) => sum + tx.amount, 0)
      : 0;
    return NextResponse.json({ total });
  } catch (err) {
    return NextResponse.json({ error: "Failed to calculate total" }, { status: 500 });
  }
}