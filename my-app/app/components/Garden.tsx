"use client";

import React, { useEffect } from "react";

type GardenProps = {
  progressPercent?: number;
  value?: number;
  goal?: number;
  imageWidth?: number;
  fundId?: string;
};

export default function Garden({
  progressPercent,
  value,
  goal,
  imageWidth = 220,
  fundId,
}: GardenProps) {
  let percent = 0;

  if (typeof progressPercent === "number") {
    percent = Math.max(0, Math.min(100, progressPercent));
  } else if (typeof value === "number" && typeof goal === "number" && goal > 0) {
    percent = Math.max(0, Math.min(100, (value / goal) * 100));
  }

  const stages = 6;

  // Stage 1 at 0%, Stage 6 only at 100%
  // sanitize percent and map to 6 discrete stages (1..6)
  if (!Number.isFinite(percent) || Number.isNaN(percent)) percent = 0;
  const stageIndex =
    percent >= 100
      ? stages - 1
      : Math.min(stages - 2, Math.max(0, Math.floor((percent / 100) * (stages - 1))));

  const stageNumber = stageIndex + 1;
  const imageSrc = `/flower${stageNumber}.png`;

  useEffect(() => {
    // lightweight client-side instrumentation to help debug multiple mounts
    // check browser console for lines like: "Garden mounted: <fundId?> stage: X"
    console.log(`Garden mounted: ${fundId ?? "-"} stage: ${stageNumber} percent: ${percent.toFixed(1)}%`);
  }, [fundId, stageNumber, percent]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">🌱 Your Garden</h2>
      <div className="mt-4 flex items-center gap-4">
        <img
          src={imageSrc}
          alt={`Flower stage ${stageNumber}`}
          data-stage={stageNumber}
          data-fund-id={fundId}
          width={imageWidth}
          height={imageWidth}
          style={{ width: imageWidth, height: imageWidth, objectFit: "contain" }}
          onError={(e) => {
            const t = e.currentTarget as HTMLImageElement;
            if (!t.dataset.fallback) {
              t.dataset.fallback = "1";
              t.src = "/flower1.png";
            }
          }}
        />
        <div>
          <p className="text-slate-700 font-medium">Stage {stageNumber} of {stages}</p>
          <p className="text-slate-600 text-sm mt-1">
            Progress: {percent.toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}