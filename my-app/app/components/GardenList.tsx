"use client";

import { useEffect, useState } from "react";
import FundCard from "./FundCard";

// Assuming you have a way to fetch your funds
interface Fund {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  createdDate: string;
  [key: string]: any;
}

export default function GardenList() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFunds = async () => {
    // Replace this with your actual API call or database hook
    const response = await fetch('/api/funds'); 
    const data = await response.json();
    setFunds(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  if (loading) return <p>Loading your gardens...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {funds.map((fund) => (
        <FundCard 
          key={fund.id} 
          fund={fund} 
          onContributionSuccess={fetchFunds} 
        />
      ))}
    </div>
  );
}