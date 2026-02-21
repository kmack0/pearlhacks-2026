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

  return (
    <main className="page-container">
      <h1>Savings</h1>
      <UploadCsvAndSend onUploadSuccess={fetchData} />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
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
                    <td style={{ padding: "8px" }}>${tx.amount.toFixed(2)}</td>
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
