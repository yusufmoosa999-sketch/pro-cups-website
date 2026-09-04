"use client";

import { useMemo, useState } from "react";

type QuoteItem = {
  product: string;
  quantity: number;
  unit_price?: number | null;
};

type QuoteEditorProps = {
  quoteId: string;
  quantity: number;
  initialProduct?: string | null;
  initialUnitPrice?: number | null;
  initialNotes?: string | null;
  initialQuoteItems?: QuoteItem[] | null;
};

const PRODUCTS = [
  "250ml Single Wall",
  "250ml Double Wall",
  "350ml Single Wall",
  "350ml Double Wall",
];

function normaliseItems(
  items: QuoteItem[] | null | undefined,
  initialProduct: string | null | undefined,
  quantity: number,
  initialUnitPrice: number | null | undefined
): QuoteItem[] {
  if (Array.isArray(items) && items.length > 0) {
    return items.map((item) => ({
      product: String(item.product || ""),
      quantity: Number(item.quantity) || 0,
      unit_price:
        item.unit_price == null ? null : Number(item.unit_price),
    }));
  }

  return [
    {
      product: initialProduct || "",
      quantity: Number(quantity) || 0,
      unit_price:
        initialUnitPrice == null ? null : Number(initialUnitPrice),
    },
  ];
}

export default function QuoteEditor({
  quoteId,
  quantity,
  initialProduct,
  initialUnitPrice,
  initialNotes,
  initialQuoteItems,
}: QuoteEditorProps) {
  const [items, setItems] = useState<QuoteItem[]>(() =>
    normaliseItems(
      initialQuoteItems,
      initialProduct,
      quantity,
      initialUnitPrice
    )
  );

  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const calculations = useMemo(() => {
    const lineItems = items.map((item) => {
      const itemQuantity = Number(item.quantity) || 0;
      const price = Number(item.unit_price) || 0;
      const lineTotal = itemQuantity * price;

      return {
        ...item,
        quantity: itemQuantity,
        unit_price: item.unit_price == null ? null : price,
        lineTotal,
      };
    });

    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    return { lineItems, subtotal, vat, total };
  }, [items]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(value);
  }

  function updateItem(index: number, patch: Partial<QuoteItem>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
    setSaved(false);
  }

  function addProduct() {
    setItems((current) => [
      ...current,
      {
        product: "",
        quantity: 0,
        unit_price: null,
      },
    ]);
    setSaved(false);
  }

  function removeProduct(index: number) {
    if (items.length === 1) return;

    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setSaved(false);
  }

  async function saveQuotation() {
    setError("");
    setSaved(false);

    const invalidItem = items.find(
      (item) =>
        !item.product ||
        Number(item.quantity) <= 0 ||
        !item.unit_price ||
        Number(item.unit_price) <= 0
    );

    if (invalidItem) {
      setError(
        "Please select a product, enter a quantity and enter a unit price for every product."
      );
      return;
    }

    setSaving(true);

    try {
      const quoteItems = calculations.lineItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
      }));

      const firstItem = quoteItems[0];

      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Keep the original columns populated for compatibility with
          // the existing quote system and older quotations.
          unit_price: firstItem.unit_price,
          subtotal: calculations.subtotal,
          vat_amount: calculations.vat,
          total_amount: calculations.total,
          quotation_notes: notes,
          quotation_created_at: new Date().toISOString(),
          quote_items: quoteItems,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to save quotation.");
      }

      setSaved(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to save quotation."
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
          Add one or more cup products, set the quantity and enter a separate
          selling price for each product.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {calculations.lineItems.map((item, index) => (
          <div
            key={`${index}-${item.product}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-black uppercase tracking-[2px] text-slate-500">
                Product {index + 1}
              </p>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="text-sm font-bold text-red-600 transition hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Product
                </label>
                <select
                  value={item.product}
                  onChange={(e) =>
                    updateItem(index, { product: e.target.value })
                  }
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-bold text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select Product</option>
                  {PRODUCTS.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={item.quantity || ""}
                  onChange={(e) =>
                    updateItem(index, {
                      quantity: Number(e.target.value) || 0,
                    })
                  }
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-bold text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Unit Price
                </label>
                <div className="flex min-h-12 overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
                  <span className="flex items-center bg-slate-100 px-4 font-bold text-slate-500">
                    R
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={item.unit_price ?? ""}
                    onChange={(e) =>
                      updateItem(index, {
                        unit_price:
                          e.target.value === ""
                            ? null
                            : Number(e.target.value),
                      })
                    }
                    placeholder="0.00"
                    className="min-w-0 flex-1 px-4 py-3 text-base font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-sm font-semibold text-slate-500">
                Line Total
              </span>
              <span className="font-black text-slate-900">
                {formatCurrency(item.lineTotal)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addProduct}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-green-600 bg-green-50 px-5 py-3 text-sm font-black text-green-700 transition hover:bg-green-100"
      >
        + Add Product
      </button>

      <div className="mt-8 rounded-2xl bg-slate-50 p-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-500">Subtotal</span>
            <span className="font-bold text-slate-900">
              {formatCurrency(calculations.subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-500">VAT (15%)</span>
            <span className="font-bold text-slate-900">
              {formatCurrency(calculations.vat)}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-black text-slate-900">Total</span>
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
          ✓ Quotation saved successfully.
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
