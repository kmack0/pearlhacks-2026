import React from "react";
import Papa from "papaparse";

/**
 * Component to upload a CSV file, parse it, and send the transactions to the server.
 */
export default function UploadCsvAndSend() {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // normalize and cast fields
        const parsed = (results.data as any[]).map((r) => ({
          date: r.date,
          amount: Number(r.amount) || 0,
        }));

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ transactions: parsed }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.error || "Upload failed");
          alert(`Server processed ${json.count} transactions`);
          // optionally: save to localStorage or update client state
          localStorage.setItem("fp_transactions", JSON.stringify(parsed));
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
    <div>
      <label>Upload CSV (date,merchant,amount,category,recurring)</label>
      <input type="file" accept=".csv,.txt" onChange={handleFile} />
    </div>
  );
}