"use client";
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Transaction = {
  date: string;
  amount: number;
};

interface Props {
  transactions: Transaction[];
}

export default function SavingsChart({ transactions }: Props) {
  const data = useMemo(() => {
    // parse, sort by date asc, and compute cumulative balance
    const parsed = transactions
      .map((t) => ({
        date: new Date(t.date),
        amount: Number(t.amount || 0),
      }))
      .filter((t) => !Number.isNaN(t.date.getTime()))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    let cum = 0;
    return parsed.map((p) => {
      cum += p.amount;
      const label = p.date.toISOString().slice(0, 10);
      return { date: label, balance: Number(cum.toFixed(2)) };
    });
  }, [transactions]);

  if (!data || data.length === 0) return <p>No data to chart.</p>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="balance" stroke="#2ecc71" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
