"use client";
import { useEffect, useState } from "react";

import UploadCsvAndSend from "../components/UploadCsvAndSend";

type Transaction = {
  date: string;
  amount: number;
};

export default function Page1() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        const data = await res.json();
        // Handle error responses from API
        if (Array.isArray(data)) {
          setTransactions(data);
        } else if (data.error) {
          console.error("API error:", data.error);
          setTransactions([]);
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
    fetchData();
  }, []);

  return (
    <main className="page-container">
      <h1>Savings</h1>
      <UploadCsvAndSend />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Your Savings ({transactions.length})</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i}>
                  <td>{tx.date}</td>
                  <td>${tx.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}