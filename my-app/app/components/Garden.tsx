"use client";

import React from "react";

type GardenProps = {
  value?: number;
  goal?: number;
  imageWidth?: number;
  title?: string;
};

export default function Garden({
  value = 0,
  goal = 1,
  imageWidth = 120,
  title,
}: GardenProps) {
  const percent = Math.max(0, Math.min(100, (value / goal) * 100));
  const stages = 6;
  
  // Calculate flower stage
  const stageIndex = percent >= 100 
    ? stages - 1 
    : Math.min(stages - 2, Math.max(0, Math.floor((percent / 100) * (stages - 1))));
  
  const stageNumber = stageIndex + 1;

  return (
    /* REMOVED: bg-white, border, shadow, and p-6 */
    <div className="flex flex-col items-center justify-center p-0 bg-transparent">
      {title && (
        <h2 className="text-sm font-bold text-[#004700] mb-2 flex items-center gap-1">
          🌱 {title}
        </h2>
      )}
      
      <img
        src={`/flower${stageNumber}.png`}
        alt="Flower"
        width={imageWidth}
        height={imageWidth}
        className="object-contain"
      />

      {/* REMOVED: All <p> tags and <div> tags that showed "Stage X" or "Progress %" */}
    </div>
  );
}