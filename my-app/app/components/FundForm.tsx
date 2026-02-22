// app/components/FundForm.tsx
"use client";

import { useState } from "react";

interface FundFormProps {
  onFundCreated?: () => void;
}

// Form component to create a new fund with name and goal amount
export default function FundForm({ onFundCreated }: FundFormProps) {
  const [name, setName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
    // Call the API to create a new fund 
      const res = await fetch("/api/funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          goalAmount: Number(goalAmount),
        }),
      });

      // Handle API response and update UI accordingly
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to create fund");
      } else {
        setName("");
        setGoalAmount("");
        if (onFundCreated) onFundCreated();
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Render the form with input fields for fund name and goal amount, and a submit button
  return (
    <form onSubmit={handleSubmit} className="mb-4 max-w-xs">
      <input
        type="text"
        placeholder="Fund Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Goal Amount"
        value={goalAmount}
        onChange={e => setGoalAmount(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        min={1}
        required
      />
      <button
        type="submit"
        className="cursor-pointer w-full bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Fund"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}