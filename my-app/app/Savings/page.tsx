"use client";
import { useEffect, useState } from "react";
import UploadCsvAndSend from "../components/UploadCsvAndSend";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";

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

  // sorts data by date and formats it for the chart
 const chartData = [...transactions]
  .filter(tx => tx.date && !isNaN(new Date(tx.date).getTime()))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .reduce((acc, tx) => {
    const lastTotal = acc.length > 0 ? acc[acc.length - 1].totalToDate : 0;
    acc.push({
      ...tx,
      totalToDate: lastTotal + tx.amount,
      formattedDate: new Date(tx.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    });
    return acc;
  }, []);


  return (
    <main className="page-container">
      <h1>Savings</h1>
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

          {transactions.length > 0 && (
            <div style={{ width: '100%', height: 350, marginBottom: '40px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                   <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3498db" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3498db" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="formattedDate" />
                  <YAxis tickFormatter={(val) => `$${val}`} />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  
                  {/* 2. Cumulative Savings Area (The Blue Fill) */}
                  <Area 
                    type="monotone" 
                    dataKey="totalToDate" 
                    //name="Cumulative Savings" 
                    stroke="#3498db" 
                    strokeWidth={3} 
                    fillOpacity={1}
                    fill="url(#colorTotal)" // Links to the gradient above
                  />


                  {/* 3. Transaction Area (The Green Overlay) */}
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    name="Transaction" 
                    stroke="#2ecc71" 
                    strokeDasharray="5 5" 
                    fillOpacity={1}
                    fill="url(#colorTx)" // Links to the gradient above
                  />

                  {/* 3. Transaction Dots (Placed last to be on top) */}
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="none" 
                    dot={{ r: 4, fill: '#2ecc71' }} 
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

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
