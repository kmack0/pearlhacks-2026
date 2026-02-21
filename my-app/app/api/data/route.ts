// app/api/data/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Note:
// const res = await fetch("/api/data");
// const transactions = await res.json();

// API route to serve existing transaction data from a JSON file

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/data/demoSavings.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}