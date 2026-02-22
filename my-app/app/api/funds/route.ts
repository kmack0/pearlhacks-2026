import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

type Fund = {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
};

const FUNDS_FILE_PATH = path.join(process.cwd(), "public/data/demoFunds.json");

// Helper function to ensure file exists
const ensureFundsFile = () => {
  if (!fs.existsSync(FUNDS_FILE_PATH)) {
    fs.writeFileSync(FUNDS_FILE_PATH, JSON.stringify([], null, 2));
  }
};

// GET: Fetch all funds
export async function GET() {
  try {
    ensureFundsFile();
    const data = fs.readFileSync(FUNDS_FILE_PATH, "utf-8");
    const funds = JSON.parse(data);
    return NextResponse.json(funds);
  } catch (err) {
    console.error("Failed to read funds", err);
    return NextResponse.json({ error: "Failed to read funds" }, { status: 500 });
  }
}

// POST: Create a new fund
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, goalAmount } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Fund name is required" },
        { status: 400 }
      );
    }

    // Validate goal amount is a positive number
    if (typeof goalAmount !== "number" || goalAmount <= 0) {
      return NextResponse.json(
        { error: "Goal amount must be a positive number" },
        { status: 400 }
      );
    }

    ensureFundsFile();
    const data = fs.readFileSync(FUNDS_FILE_PATH, "utf-8");
    const funds = JSON.parse(data) as Fund[];

    // Create new fund
    const newFund: Fund = {
      id: uuidv4(),
      name: name.trim(),
      goalAmount,
      currentAmount: 0,
    };

    funds.push(newFund);
    fs.writeFileSync(FUNDS_FILE_PATH, JSON.stringify(funds, null, 2));

    // Return the newly created fund
    return NextResponse.json(newFund, { status: 201 });
  } 
  catch (err) {
    console.error("Failed to create fund", err);
    return NextResponse.json(
      { error: "Failed to create fund" },
      { status: 500 }
    );
  }
}

// PUT: Rename an existing fund
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Fund id is required" }, { status: 400 });
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Fund name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();

    ensureFundsFile();
    const data = fs.readFileSync(FUNDS_FILE_PATH, "utf-8");
    const funds = JSON.parse(data) as Fund[];

    const fundIndex = funds.findIndex((fund) => fund.id === id);
    if (fundIndex === -1) {
      return NextResponse.json({ error: "Fund not found" }, { status: 404 });
    }

    funds[fundIndex] = {
      ...funds[fundIndex],
      name: trimmedName,
    };

    fs.writeFileSync(FUNDS_FILE_PATH, JSON.stringify(funds, null, 2));

    return NextResponse.json(funds[fundIndex], { status: 200 });
  } catch (err) {
    console.error("Failed to update fund", err);
    return NextResponse.json({ error: "Failed to update fund" }, { status: 500 });
  }
}
