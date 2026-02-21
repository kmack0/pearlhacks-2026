// app/api/data/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/data/demoSavings.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const filePath = path.join(process.cwd(), "public/data/demoSavings.json");
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return NextResponse.json({ ok: true, message: "Data cleared" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to clear data" }, { status: 500 });
  }
}