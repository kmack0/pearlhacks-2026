// app/components/SavingsSummary.tsx
"use client";
import { useSavingsTotal } from "../hooks/useSavingsTotal";

export function SavingsSummary() {
  const { total, loading } = useSavingsTotal();
  
  return (
    total
  );
}