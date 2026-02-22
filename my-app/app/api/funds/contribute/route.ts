// app/api/funds/contribute/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Fund = {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  createdDate: string;
};

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { fundId, amount } = body;

    // Validation
    if (!fundId || typeof fundId !== "string") {
      return NextResponse.json(
        { error: "Fund ID is required" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Read funds
    const fundPath = path.join(process.cwd(), "public/data/demoFunds.json");
    if (!fs.existsSync(fundPath)) {
      return NextResponse.json({ error: "Funds file not found" }, { status: 404 });
    }

    const fundsData = fs.readFileSync(fundPath, "utf-8");
    const funds = JSON.parse(fundsData) as Fund[];

    // Find and update fund
    const fundIndex = funds.findIndex((f) => f.id === fundId);
    if (fundIndex === -1) {
      return NextResponse.json({ error: "Fund not found" }, { status: 404 });
    }

    // Read savings to calculate total
    const savingsPath = path.join(process.cwd(), "public/data/demoSavings.json");
    if (!fs.existsSync(savingsPath)) {
      return NextResponse.json(
        { error: "Savings file not found" },
        { status: 404 }
      );
    }

    const savingsData = fs.readFileSync(savingsPath, "utf-8");
    const savings = JSON.parse(savingsData) as Array<{ date: string; amount: number }>;

    // Calculate current total savings
    const totalSavings = savings.reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate total allocated to all funds
    const totalAllocated = funds.reduce((sum, f) => sum + f.currentAmount, 0);

    // Check if user has enough unallocated savings
    const unallocatedSavings = totalSavings - totalAllocated;
    if (unallocatedSavings < amount) {
      return NextResponse.json(
        { error: `Insufficient unallocated savings. You have $${unallocatedSavings.toFixed(2)} available.` },
        { status: 400 }
      );
    }

    // Update fund currentAmount (allocated to this fund)
    funds[fundIndex].currentAmount += amount;

    // Write updated funds data only
    fs.writeFileSync(fundPath, JSON.stringify(funds, null, 2));

    return NextResponse.json(
      {
        success: true,
        fund: funds[fundIndex],
        totalSavings: totalSavings,
        totalAllocated: totalAllocated + amount,
        unallocatedSavings: unallocatedSavings - amount,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to contribute to fund", err);
    return NextResponse.json(
      { error: "Failed to contribute to fund" },
      { status: 500 }
    );
  }
}
