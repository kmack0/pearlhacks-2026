"use client";

import { useState } from "react";

type Fund = {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  createdDate: string;
};

interface ContributeButtonProps {
  fund: Fund;
  onContributionSuccess: () => void;
}

export default function ContributeButton({
  fund,
  onContributionSuccess,
}: ContributeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContribute = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/funds/contribute", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fundId: fund.id,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to contribute");
        return;
      }

      setAmount("");
      setIsOpen(false);
      onContributionSuccess();
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
      >
        Contribute
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Contribute to {fund.name}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Amount to contribute
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border rounded px-3 py-2"
                disabled={loading}
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError("");
                  setAmount("");
                }}
                className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleContribute}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Contributing..." : "Contribute"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
