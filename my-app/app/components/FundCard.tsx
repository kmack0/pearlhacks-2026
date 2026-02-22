"use client";

import ContributeButton from "./ContributeButton";
import Garden from "./Garden";

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

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
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

        <div className="w-40 flex-shrink-0">
          <Garden fundId={fund.id} value={fund.currentAmount} goal={fund.goalAmount} imageWidth={120} />
        </div>
      </div>
    </div>
  );
}