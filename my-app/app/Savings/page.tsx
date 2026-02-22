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

// Page fetches transaction data from the backend, 
// displays summary of total savings
// lists all transactions
export default function Savings() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      } 
      else {
        setTransactions([]);
      }
    } 
    catch (err) {
      console.error("Failed to fetch transactions", err);
      setTransactions([]);
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Clear data function
  const clearData = async () => {
    try {
      // Call a clear endpoint (you'll need to create this)
      await fetch("/api/data", { method: "DELETE" });
      setTransactions([]);
      alert("Data cleared!");
    } 
    catch (err) {
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
  .reduce((acc: Array<Transaction & { totalToDate: number; formattedDate: string }>, tx) => {
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


  // Render the page
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
                  <Tooltip formatter={(value) => `$${typeof value === 'number' ? value.toFixed(2) : parseFloat(String(value)).toFixed(2)}`} />
                  
                  {/* 2. Cumulative Savings Area*/}
                  <Area 
                    type="monotone" 
                    dataKey="totalToDate" 
                    //name="Cumulative Savings" 
                    stroke="#3498db" 
                    strokeWidth={3} 
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />


                  {/* 3. Transaction Area  */}
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    name="Transaction" 
                    stroke="#2ecc71" 
                    strokeDasharray="5 5" 
                    fillOpacity={1}
                    fill="url(#colorTx)" 
                  />

                  {/* 3. Transaction Dots */}
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

          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>Your Transactions ({transactions.length})</h2>
            <button 
              onClick={clearData} 
              style={{ 
                padding: "8px 16px", 
                backgroundColor: "#e74c3c", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Clear All Data
            </button>
          </div>

          {transactions.length > 0 ? (
            <div style={{ overflowX: "auto", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", backgroundColor: "white" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ecf0f1", backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", color: "#7f8c8d", fontWeight: "600" }}>Date</th>
                    <th style={{ padding: "12px 16px", textAlign: "right", color: "#7f8c8d", fontWeight: "600" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #ecf0f1" }}>
                      <td style={{ padding: "12px 16px", color: "#2c3e50" }}>{tx.date}</td>
                      <td style={{ 
                        padding: "12px 16px",
                        textAlign: "right",
                        fontWeight: "500",
                        color: tx.amount > 0 ? "#27ae60" : tx.amount < 0 ? "#c0392b" : "#333"
                      }}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No transactions yet. Upload a CSV to get started!</p>
          )}
        </div>
      )}
    </main>
  );
}
