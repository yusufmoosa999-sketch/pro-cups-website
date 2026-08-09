"use client";

import { useState } from "react";

type CustomerQuoteApprovalProps = {
  quoteId: string;
  currentStatus?: string | null;
};

export default function CustomerQuoteApproval({
  quoteId,
  currentStatus,
}: CustomerQuoteApprovalProps) {
  const [status, setStatus] = useState(currentStatus || "pending");
  const [showChanges, setShowChanges] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submitApproval(
    approvalStatus: "approved" | "changes_requested"
  ) {
    setError("");
    setSaving(true);

    try {
      const response = await fetch(
        `/api/quotes/${quoteId}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approvalStatus,
            note:
              approvalStatus === "changes_requested"
                ? note.trim()
                : null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error || "Something went wrong."
        );
        return;
      }

      setStatus(approvalStatus);
      setShowChanges(false);
    } catch (error) {
      console.error(error);

      setError(
        "We couldn't save your response. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (status === "approved") {
    return (
      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
            ✓
          </div>

          <div>
            <p className="font-black text-green-800">
              Print Proof Approved
            </p>

            <p className="mt-1 text-sm leading-6 text-green-700">
              Thank you. Your print proof has been approved
              and our team can proceed with your quotation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "changes_requested") {
    return (
      <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
        <p className="font-black text-yellow-800">
          Changes Requested
        </p>

        <p className="mt-1 text-sm leading-6 text-yellow-700">
          Your requested changes have been sent to our team.
          We will review them and provide an updated proof.
        </p>

        {note && (
          <div className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-700">
            <p className="font-bold text-slate-900">
              Your request
            </p>

            <p className="mt-1 whitespace-pre-wrap">
              {note}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      <p className="font-black text-slate-900">
        Is your print proof correct?
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        Please review the proof carefully before approving it
        for production.
      </p>

      {!showChanges ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => submitApproval("approved")}
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "✓ Approve Print Proof"}
          </button>

          <button
            type="button"
            onClick={() => setShowChanges(true)}
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Request Changes
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <label className="block text-sm font-bold text-slate-700">
            What would you like changed?
          </label>

          <textarea
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            placeholder="Please describe the changes you would like us to make..."
            rows={5}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                submitApproval("changes_requested")
              }
              disabled={saving || !note.trim()}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Sending..."
                : "Send Change Request"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowChanges(false);
                setNote("");
              }}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}