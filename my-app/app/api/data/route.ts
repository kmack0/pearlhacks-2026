import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GET: Handle fetching transaction data
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/data/demoSavings.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

// DELETE: Clear transaction data by overwriting the JSON file w/ an empty array
export async function DELETE() {
  try {
    const filePath = path.join(process.cwd(), "public/data/demoSavings.json");
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return NextResponse.json({ ok: true, message: "Data cleared" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to clear data" }, { status: 500 });
  }
}