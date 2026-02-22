"use client";

import { useEffect, useState } from "react";
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
  showEditButton?: boolean;
  alignAmountWithTitle?: boolean;
}

export default function FundCard({
  fund,
  onContributionSuccess,
  showProgressBar = true,
  showEditButton = true,
  alignAmountWithTitle = false,
}: FundCardProps) {
  const progress = (fund.currentAmount / fund.goalAmount) * 100;
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(fund.name);
  const [isSavingName, setIsSavingName] = useState(false);
  const [renameError, setRenameError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setEditedName(fund.name);
  }, [fund.name]);

  const saveFundName = async () => {
    const trimmed = editedName.trim();
    if (!trimmed) {
      setRenameError("Fund name cannot be empty.");
      return;
    }

    if (trimmed === fund.name) {
      setIsEditingName(false);
      setRenameError(null);
      return;
    }

    setIsSavingName(true);
    setRenameError(null);

    try {
      const response = await fetch("/api/funds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: fund.id, name: trimmed }),
      });
      const data = await response.json();
      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Failed to rename fund");
      }
      setIsEditingName(false);
      onContributionSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to rename fund";
      setRenameError(message);
    } finally {
      setIsSavingName(false);
    }
  };

  const deleteFund = async () => {
    const confirmed = window.confirm(
      `Delete "${fund.name}"? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch("/api/funds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: fund.id }),
      });
      const data = await response.json();
      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Failed to delete fund");
      }
      onContributionSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete fund";
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      {/* Main container for the card content */}
      <div className="flex gap-4 items-start">
        {/* LEFT SIDE: Text and Conditional Progress */}
        <div className="flex-1">
          <div className="mb-1">
            {isEditingName ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm text-[#303234]"
                  maxLength={80}
                  disabled={isSavingName}
                  aria-label={`Edit name for ${fund.name}`}
                />
                <button
                  type="button"
                  onClick={saveFundName}
                  className="text-xs font-semibold px-3 py-1 bg-[#a4c6a2] text-[#1f2a1f] border border-black rounded hover:bg-[#8eb58b] disabled:opacity-60"
                  disabled={isSavingName}
                >
                  {isSavingName ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditedName(fund.name);
                    setRenameError(null);
                    setIsEditingName(false);
                  }}
                  className="text-xs font-semibold px-2 py-1 rounded border border-gray-300 text-gray-700"
                  disabled={isSavingName}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg text-[#303234]">{fund.name}</h3>
                {showEditButton && (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="text-xs font-semibold px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    disabled={isDeleting}
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={deleteFund}
                  className="text-xs font-semibold px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60"
                  disabled={isDeleting || isSavingName}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
            {renameError && <p className="mt-1 text-xs text-red-600">{renameError}</p>}
            {deleteError && <p className="mt-1 text-xs text-red-600">{deleteError}</p>}
          </div>
          
          <div
            className={`mb-2 text-sm text-gray-500 font-medium ${
              alignAmountWithTitle ? "text-left pl-0" : ""
            }`}
          >
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

          <div className="mt-4 flex justify-start">
            <ContributeButton 
              fund={fund} 
              onContributionSuccess={onContributionSuccess || (() => {})} 
            />
          </div>
        </div>

        {/* RIGHT SIDE: The Garden Component (Flower) */}
        <div className="w-40 flex-shrink-0">
          <Garden 
            value={fund.currentAmount} 
            goal={fund.goalAmount} 
            imageWidth={120} 
          />
        </div>
      </div>
    </div>
  );
}
