"use client";

import { useMemo, useState } from "react";

type QuoteEditorProps = {
  quoteId: string;
  quantity: number;
  initialUnitPrice?: number | null;
  initialNotes?: string | null;
};

export default function QuoteEditor({
  quoteId,
  quantity,
  initialUnitPrice,
  initialNotes,
}: QuoteEditorProps) {
  const [unitPrice, setUnitPrice] = useState(
    initialUnitPrice?.toString() || ""
  );

  const [notes, setNotes] = useState(initialNotes || "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const calculations = useMemo(() => {
    const price = Number(unitPrice) || 0;

    const subtotal = quantity * price;
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    return {
      subtotal,
      vat,
      total,
    };
  }, [unitPrice, quantity]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(value);
  }

  async function saveQuotation() {
    setError("");
    setSaved(false);

    const price = Number(unitPrice);

    if (!unitPrice || Number.isNaN(price) || price <= 0) {
      setError("Please enter a valid unit price.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_price: price,
          subtotal: calculations.subtotal,
          vat_amount: calculations.vat,
          total_amount: calculations.total,
          quotation_notes: notes,
          quotation_created_at: new Date().toISOString(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || "Failed to save quotation."
        );
      }

      setSaved(true);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save quotation."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      <div>
        <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
          Quotation
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
          Prepare Quotation
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter your selling price and prepare the quotation
          for the customer.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Quantity
          </label>

          <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 font-bold text-slate-900">
            {quantity.toLocaleString("en-ZA")}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Unit Price
          </label>

          <div className="flex min-h-12 overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">

            <span className="flex items-center bg-slate-50 px-4 font-bold text-slate-500">
              R
            </span>

            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={unitPrice}
              onChange={(e) => {
                setUnitPrice(e.target.value);
                setSaved(false);
              }}
              placeholder="0.00"
              className="min-w-0 flex-1 px-4 py-3 text-base font-bold text-slate-900 outline-none"
            />

          </div>
        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-slate-50 p-5 sm:p-6">

        <div className="space-y-4">

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-500">
              Subtotal
            </span>

            <span className="font-bold text-slate-900">
              {formatCurrency(calculations.subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-500">
              VAT (15%)
            </span>

            <span className="font-bold text-slate-900">
              {formatCurrency(calculations.vat)}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-4">

            <div className="flex items-center justify-between gap-4">

              <span className="text-lg font-black text-slate-900">
                Total
              </span>

              <span className="text-xl font-black text-green-700 sm:text-2xl">
                {formatCurrency(calculations.total)}
              </span>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-8">

        <label className="mb-2 block text-sm font-bold text-slate-700">
          Notes for Customer
        </label>

        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setSaved(false);
          }}
          rows={5}
          placeholder="Add any quotation notes, delivery information, payment terms, or other details..."
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />

      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {saved && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
          ✓ Quotation saved successfully. The customer has been notified by email.
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">

        <button
          type="button"
          onClick={saveQuotation}
          disabled={saving}
          className="min-h-12 w-full rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {saving ? "Saving..." : "Save Quotation"}
        </button>

      </div>

    </div>
  );
}