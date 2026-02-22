"use client";

import { useEffect, useState } from "react";

export function useSavingsTotal() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch total savings from transaction data on component mount
  // Sums up the amounts from all transactions to calculate the total savings
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch("/api/data");
        const transactions = await res.json();
        if (Array.isArray(transactions)) {
          const sum = transactions.reduce((acc, tx) => acc + tx.amount, 0);
          setTotal(sum);
        }
      } 
      catch (err) {
        console.error("Failed to fetch total", err);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchTotal();
  }, []);

  return { total, loading };
}