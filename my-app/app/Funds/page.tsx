"use client";

import { useEffect, useState } from 'react';
import FundCard from '@/app/components/FundCard';
import FundForm from "../components/FundForm";


type Fund = {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
}
// Main page to display all funds and their progress
export default function Funds() {
  // State to hold the list of funds and loading status
  const [funds, setFunds] = useState<Fund[]>([]);
  const [unallocatedSavings, setUnallocatedSavings] = useState(0);

  const [loading, setLoading] = useState(true);

  // Fetch funds from the API when the component mounts
  const fetchFunds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/funds");
      const data = await res.json();
      setFunds(Array.isArray(data) ? data : []);
    } catch {
      setFunds([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnallocatedSavings = async () => {
    try {
      const savingsRes = await fetch("/api/total");
      const savingsData = await savingsRes.json();
      const totalSavings = savingsData.total || 0;
      
      // Calculate allocated amount from current funds
      const allocatedAmount = funds.reduce((sum, fund) => sum + fund.currentAmount, 0);
      setUnallocatedSavings(totalSavings - allocatedAmount);
    } catch {
      setUnallocatedSavings(0);
    }
  };

   useEffect(() => {
    fetchFunds();
  }, []);

  useEffect(() => {
    if (funds.length > 0) {
      fetchUnallocatedSavings();
    }
  }, [funds]);

  return (
    <main className="page-container">
      <h1 className="mb-4">Funds</h1>
      <FundForm onFundCreated={fetchFunds} />
      {loading ? (
        <p>Loading funds...</p>
      ) : (
        <div className="grid gap-4">
          {funds.map(fund => (
            <FundCard key={fund.id} fund={fund} onContributionSuccess={fetchFunds} />
          ))}
        </div>
      )}
    </main>
  );
}
