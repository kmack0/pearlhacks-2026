"use client";

import { useState } from "react";

export default function Garden() {
  // You can replace this with your full garden logic (funds, plants, etc.)
  const [progress, setProgress] = useState(20);

  const stage =
    progress < 25 ? "🌱" :
    progress < 50 ? "🌿" :
    progress < 75 ? "🌼" :
    "🌸";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Your Garden</h2>

      <div className="flex items-center gap-4">
        <div className="text-6xl">{stage}</div>
        <div>
          <div className="text-sm text-slate-600">Progress</div>
          <div className="text-lg font-medium">{progress}%</div>
        </div>
      </div>

      <div className="mt-4 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-emerald-600 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-medium hover:bg-emerald-700"
        onClick={() => setProgress((p) => Math.min(p + 10, 100))}
      >
        Deposit ➜ Grow
      </button>
    </div>
  );
}