"use client";

import { useState } from "react";

const STATUSES = [
  "New",
  "Contacted",
  "Quoted",
  "Awaiting Approval",
  "Approved",
  "In Production",
  "Ready",
  "Completed",
  "Cancelled",
];

export default function QuoteStatus({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus || "New");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = e.target.value;

    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: value,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || "Failed to update quote status."
        );
      }

      setStatus(value);
    } catch (err) {
      console.error("Status update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update quote status."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <p className="mb-2 text-sm font-bold text-slate-500">
        Status
      </p>

      <select
        value={status}
        onChange={updateStatus}
        disabled={saving}
        className="min-h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-bold text-slate-900 shadow-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {saving && (
        <p className="mt-2 text-sm font-semibold text-green-600">
          Saving status...
        </p>
      )}

      {error && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}