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

export default function GardenList({ showProgressBar = true }: { showProgressBar?: boolean }) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const isGardenHomepageGrid = !showProgressBar;
  console.log("GardenList received showProgressBar:", showProgressBar);

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
    <div className={isGardenHomepageGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
      {/* For every fund in the database, React creates a new FundCard */}
      {funds.map((fund) => (
        <FundCard 
          key={fund.id} 
          fund={fund} 
          onContributionSuccess={fetchFunds} 
          showProgressBar={showProgressBar}
          showEditButton={showProgressBar}
          alignAmountWithTitle={!showProgressBar}
        />
      ))}
    </div>
  );
}
