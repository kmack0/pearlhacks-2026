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
// Page to display  funds and their progress
export default function Funds() {
  // State to hold the list of funds and loading status
  const [funds, setFunds] = useState<Fund[]>([]);
  const [unallocatedSavings, setUnallocatedSavings] = useState(0);

  const [loading, setLoading] = useState(true);

  // Fetch funds from the API when  component mounts
  const fetchFunds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/funds");
      const data = await res.json();
      setFunds(Array.isArray(data) ? data : []);
    } 
    catch {
      setFunds([]);
    } 
    finally {
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
    } 
    catch {
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

  // Render page w a form to create new funds and list of existing funds with progress
  return (
    <main className="page-container">
      {/* Parent Container - Adds padding and better spacing */}
    <div className="flex flex-col md:flex-row gap-12 mb-20 items-stretch">
      
      {/* Left: Create Fund Form */}
      <div className="w-full md:w-[350px] bg-white p-6 rounded-xl border border-black">
        <h3 className="font-bold text-lg mb-4">Create New Fund</h3>
        <FundForm onFundCreated={fetchFunds} />
      </div>

      {/* Right: Available Savings - Made narrower and more informative */}
      <div className="flex-1 max-w-sm bg-white p-6 rounded-xl border border-black">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Available Savings</p>
        <h2 className="text-5xl font-black my-2 text-[#303234]">
            ${unallocatedSavings.toFixed(2)}
        </h2>
        
        {/* Unallocated savings label */}
        <p className="text-sm text-gray-500 mb-4">Money ready to be assigned to your goals.</p>
      </div>

    </div>
      {loading ? (
        <p>Loading funds...</p>
      ) : (
        <div className="grid gap-4 mt-8">
          {funds.map(fund => (
            <FundCard key={fund.id} fund={fund} onContributionSuccess={fetchFunds} showProgressBar={true} />
          ))}
        </div>
        )}
    </main>
  );
}