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
  showProgressBar?: boolean;
}

export default function FundCard({ fund, onContributionSuccess, showProgressBar = true }: FundCardProps) {
  const progress = (fund.currentAmount / fund.goalAmount) * 100;
  const isGardenHomepageCard = !showProgressBar;
  console.log(`FundCard "${fund.name}" - showProgressBar:`, showProgressBar);

  return (
    <div className={`border rounded-lg p-4 shadow-sm bg-white ${isGardenHomepageCard ? "max-w-sm mx-auto" : ""}`}>
      {/* Main container for the card content */}
      <div className={isGardenHomepageCard ? "flex flex-col items-center text-center gap-2" : "flex gap-4 items-start"}>
        
        {/* LEFT SIDE: Text and Conditional Progress */}
        <div className={isGardenHomepageCard ? "w-full" : "flex-1"}>
          <h3 className="font-semibold text-lg mb-1 text-[#303234]">{fund.name}</h3>
          
          <div className="mb-2 text-sm text-gray-500 font-medium">
            <p>${fund.currentAmount.toLocaleString()} / ${fund.goalAmount.toLocaleString()}</p>
          </div>

          {/* FIX: We wrap EVERYTHING related to the bar and percentage 
             inside this one check. If showProgressBar is false, 
             the space between the text and the button is empty.
          */}
          {showProgressBar && (
            <div className="mt-3 mb-4">
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-700 ease-in-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 font-semibold">{Math.round(progress)}% to goal</p>
            </div>
          )}

          <div className={`mt-4 flex ${isGardenHomepageCard ? "justify-center" : "justify-start"}`}>
            <ContributeButton 
              fund={fund} 
              onContributionSuccess={onContributionSuccess || (() => {})} 
            />
          </div>
        </div>

        {/* RIGHT SIDE: The Garden Component (Flower) */}
        <div className={isGardenHomepageCard ? "w-full flex justify-center" : "w-40 flex-shrink-0"}>
          <Garden 
            fundId={fund.id} 
            value={fund.currentAmount} 
            goal={fund.goalAmount} 
            imageWidth={isGardenHomepageCard ? 180 : 120}
            title={isGardenHomepageCard ? undefined : fund.name}
          />
        </div>

      </div>
    </div>
  );
}
