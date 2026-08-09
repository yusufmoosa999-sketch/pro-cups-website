"use client";

import { useState } from "react";

type CustomerQuotationAcceptanceProps = {
  quoteId: string;
  currentStatus?: string | null;
  quotationTotal?: number | null;
};

export default function CustomerQuotationAcceptance({
  quoteId,
  currentStatus,
  quotationTotal,
}: CustomerQuotationAcceptanceProps) {
  const [status, setStatus] = useState(
    currentStatus || "pending"
  );

  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function acceptQuotation() {
    setError("");
    setSaving(true);

    try {
      const response = await fetch(
        `/api/quotes/${quoteId}/quotation-approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "accept",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            "We couldn't accept the quotation."
        );
        return;
      }

      setStatus("accepted");
      setShowConfirmation(false);

      // Refresh the page so the timeline updates.
      window.location.reload();
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (status === "accepted") {
    return (
      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
            ✓
          </div>

          <div>
            <p className="font-black text-green-800">
              Quotation Accepted
            </p>

            <p className="mt-1 text-sm leading-6 text-green-700">
              Thank you. Your quotation has been accepted
              and your order can now proceed to production.
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">

      <p className="text-sm font-bold uppercase tracking-[2px] text-green-600">
        Next Step
      </p>

      <h3 className="mt-2 text-xl font-black text-slate-900">
        Accept Your Quotation
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        By accepting this quotation, you confirm that
        you agree to the quoted price and would like us
        to proceed with your order.
      </p>

      {quotationTotal != null && (
        <div className="mt-5 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quotation Total
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            R{Number(quotationTotal).toFixed(2)}
          </p>
        </div>
      )}

      {!showConfirmation ? (
        <button
          type="button"
          onClick={() => setShowConfirmation(true)}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700 sm:w-auto"
        >
          Accept Quotation
        </button>
      ) : (
        <div className="mt-5 rounded-xl border border-green-200 bg-white p-5">

          <p className="font-bold text-slate-900">
            Confirm quotation acceptance
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please confirm that you want to accept this
            quotation and proceed with your order.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={acceptQuotation}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Accepting..."
                : "Yes, Accept Quotation"}
            </button>

            <button
              type="button"
              onClick={() =>
                setShowConfirmation(false)
              }
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
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