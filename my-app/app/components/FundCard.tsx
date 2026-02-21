"use client";

type Fund = {
    id: string;     
    name: string;
    goalAmount: number;
    currentAmount: number;      
}

interface FundCardProps {
  fund: Fund;
}


export default function FundCard({ fund }: FundCardProps) {
  const progress = (fund.currentAmount / fund.goalAmount) * 100;

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-lg mb-2">{fund.name}</h3>
      
      <div className="mb-2 text-sm text-gray-600">
        <p>${fund.currentAmount} / ${fund.goalAmount}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
    </div>
  );
}