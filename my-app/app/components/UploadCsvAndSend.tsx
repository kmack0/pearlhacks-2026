// components/UploadCsvAndSend.tsx
"use client";

import React from "react";
import Papa from "papaparse";

type RawRow = { [k: string]: any };
type Tx = { date: string; amount: number; };

interface UploadCsvAndSendProps {
  onUploadSuccess?: () => void;
}

// Handle CSV file upload, parse it, and send the data to the backend API
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
    <div style={{ 
      marginBottom: "30px", 
      padding: "24px", 
      backgroundColor: "#f9f9f9", 
      borderRadius: "8px",
      border: "2px solid #e0e0e0"
    }}>
      <h2 style={{ marginTop: 0, marginBottom: "16px", color: "#333" }}>
        Import Savings Data
      </h2>
      <p style={{ color: "#666", marginBottom: "16px", fontSize: "14px" }}>
        Upload a CSV file with columns: <code style={{ backgroundColor: "#f0f0f0", padding: "2px 6px" }}>date</code> and <code style={{ backgroundColor: "#f0f0f0", padding: "2px 6px" }}>amount</code>
      </p>
      
      <label style={{
        display: "inline-block",
        padding: "12px 24px",
        backgroundColor: "#889672",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "500",
        transition: "background-color 0.3s ease",
        fontSize: "16px"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6C7859")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#889672")}
      >
        📤 Choose CSV File
        <input 
          type="file" 
          accept=".csv,.txt" 
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
}