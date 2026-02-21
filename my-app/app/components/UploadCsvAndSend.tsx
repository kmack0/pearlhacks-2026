// components/UploadCsvAndSend.tsx
"use client";

import React from "react";
import Papa from "papaparse";

type RawRow = { [k: string]: any };
type Tx = { date: string; amount: number; };

interface UploadCsvAndSendProps {
  onUploadSuccess?: () => void;
}

export default function UploadCsvAndSend({ onUploadSuccess }: UploadCsvAndSendProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => String(h || "").trim().toLowerCase(),
      worker: false,
      complete: async (results) => {
        const rows = (results.data as RawRow[]).map((r, idx) => ({
          
          date: r.date,
          amount: Number(r.amount || 0),
          
        })) as Tx[];

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactions: rows }),
          });

          const json = await res.json();

          if (!res.ok) throw new Error(json?.error || "Upload failed");

          // Save returned cleaned/inserted transactions locally for demo persistence
          const cleaned = json.transactions || rows;
          // Merge with existing localStorage
          const existing = JSON.parse(localStorage.getItem("fp_transactions") || "[]");
          // naive dedupe by transaction_id
          const map = new Map(existing.map((t: any) => [t.transaction_id, t]));
          for (const t of cleaned) map.set(t.transaction_id, t);
          const merged = Array.from(map.values());
          localStorage.setItem("fp_transactions", JSON.stringify(merged));

          // Refresh parent component
          if (onUploadSuccess) {
            onUploadSuccess();
          }
        } catch (err) {
          console.error(err);
          alert("Upload error: " + (err as Error).message);
        }
      },
      error: (err) => {
        console.error("CSV parse error", err);
        alert("CSV parse error");
      },
    });
  };

  return (
    <div className="p-2">
      <label className="block text-sm font-medium mb-1">
        Upload CSV (columns: date, amount)
      </label>
      <input type="file" accept=".csv,.txt" onChange={handleFile} />
    </div>
  );
}