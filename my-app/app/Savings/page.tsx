"use client";
import { useEffect, useState } from "react";
import UploadCsvAndSend from "../components/UploadCsvAndSend";

type Transaction = {
  date: string;
  amount: number;
};

export default function Savings() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearData = async () => {
    try {
      // Call a clear endpoint (you'll need to create this)
      await fetch("/api/data", { method: "DELETE" });
      setTransactions([]);
      alert("Data cleared!");
    } catch (err) {
      console.error("Failed to clear data", err);
      alert("Error clearing data");
    }
  };

  // Calculate totals
  const totalSavings = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <main className="page-container">
      <UploadCsvAndSend onUploadSuccess={fetchData} />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* Total Savings Summary */}
          <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <h2>Total Savings: <span style={{ color: totalSavings >= 0 ? "#2ecc71" : "#e74c3c", fontSize: "1.5em" }}>
              ${totalSavings.toFixed(2)}
            </span></h2>
            
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h2>Your Transactions ({transactions.length})</h2>
            <button onClick={clearData} style={{ padding: "8px 16px", marginBottom: "10px" }}>
              Clear All Data
            </button>
          </div>
          {transactions.length > 0 ? (
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ccc" }}>
                  <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{tx.date}</td>
                    <td style={{ 
                      padding: "8px",
                      color: tx.amount > 0 ? "#2ecc71" : tx.amount < 0 ? "#e74c3c" : "#333"
                    }}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)} {tx.amount > 0 ? "(deposit)" : tx.amount < 0 ? "(withdrawal)" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions yet. Upload a CSV to get started!</p>
          )}
        </div>
      )}
    </main>
  );
}
