"use client";

import ContributeButton from "./ContributeButton";

type Fund = {
    id: string;     
    name: string;
    goalAmount: number;
    currentAmount: number;      
}


interface FundCardProps {
  fund: Fund;
  onContributionSuccess?: () => void;
}

// Component to display individual fund details and progress
export default function FundCard({ fund, onContributionSuccess }: FundCardProps) {
  const progress = (fund.currentAmount / fund.goalAmount) * 100;

  // Render the fund card with name, amounts, and a progress bar
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-lg mb-2">{fund.name}</h3>
      
      <div className="mb-2 text-sm text-gray-600">
        <p>${fund.currentAmount} / ${fund.goalAmount}</p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
        <ContributeButton 
          fund={fund} 
          onContributionSuccess={onContributionSuccess || (() => {})} 
        />
      </div>
    </div>
  );
}