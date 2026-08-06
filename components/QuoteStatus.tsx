"use client";

import { useState } from "react";

export default function QuoteStatus({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function updateStatus(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const value = e.target.value;

    setStatus(value);
    setSaving(true);

    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: value,
      }),
    });

    setSaving(false);
  }

  return (
    <div className="mt-10">

      <p className="font-bold mb-2">
        Status
      </p>

      <select
        value={status}
        onChange={updateStatus}
        className="rounded-xl border p-3"
      >
        <option>New</option>
        <option>Contacted</option>
        <option>Quoted</option>
        <option>Awaiting Approval</option>
        <option>Approved</option>
        <option>In Production</option>
        <option>Ready</option>
        <option>Completed</option>
        <option>Cancelled</option>
      </select>

      {saving && (
        <p className="mt-2 text-green-600">
          Saving...
        </p>
      )}

    </div>
  );
}