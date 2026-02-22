"use client";

import Garden from "./Garden";
import { useSavingsTotal } from "../hooks/useSavingsTotal";

export default function GardenClient() {
  const { total, loading } = useSavingsTotal();
  // demo goal — adjust as needed or pass from parent
  const goal = 500;

  return (
    <div>
      <Garden value={total} goal={goal} />
      {loading ? <p className="text-sm text-slate-500 mt-2">Loading totals…</p> : null}
    </div>
  );
}