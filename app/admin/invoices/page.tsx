"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Customer = {
  id: string;
  email: string;
};

type Quote = {
  id: string;
  company_name: string | null;
  contact_name: string | null;
  product: string | null;
  quantity: number | null;
  status: string | null;
};

export default function AdminInvoicesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load customers
  useEffect(() => {
    async function loadCustomers() {
      try {
        setError("");

        const response = await fetch("/api/admin/customers");
        const result = await response.json();

        if (!response.ok) {
          setError(
            result.error || "Could not load customers."
          );
          return;
        }

        setCustomers(result.customers || []);
      } catch (error) {
        console.error(error);
        setError("Could not load customers.");
      } finally {
        setLoadingCustomers(false);
      }
    }

    loadCustomers();
  }, []);

  // Load quotes when customer changes
  useEffect(() => {
    if (!customerId) {
      setQuotes([]);
      setQuoteId("");
      return;
    }

    async function loadQuotes() {
      setLoadingQuotes(true);
      setQuoteId("");
      setError("");

      try {
        const response = await fetch(
          `/api/admin/customers/${customerId}/quotes`
        );

        const result = await response.json();

        if (!response.ok) {
          setError(
            result.error ||
              "Could not load customer quotes."
          );
          return;
        }

        setQuotes(result.quotes || []);
      } catch (error) {
        console.error(error);
        setError("Could not load customer quotes.");
      } finally {
        setLoadingQuotes(false);
      }
    }

    loadQuotes();
  }, [customerId]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    if (!invoiceNumber.trim()) {
      setError("Please enter an invoice number.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid invoice amount.");
      return;
    }

    if (!file) {
      setError("Please select an invoice PDF.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF invoice.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError(
        "The invoice PDF must be 25MB or smaller."
      );
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("customerId", customerId);

      if (quoteId) {
        formData.append("quoteId", quoteId);
      }

      formData.append(
        "invoiceNumber",
        invoiceNumber.trim()
      );

      formData.append("amount", amount);

      if (dueDate) {
        formData.append("dueDate", dueDate);
      }

      formData.append("file", file);

      const response = await fetch(
        "/api/admin/invoices",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            "Could not upload the invoice."
        );
        return;
      }

      setSuccess(
        `Invoice ${invoiceNumber.trim()} was uploaded successfully.`
      );

      setInvoiceNumber("");
      setAmount("");
      setDueDate("");
      setFile(null);
      setQuoteId("");

      const fileInput =
        document.getElementById(
          "invoice-file"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong while uploading the invoice."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-5 text-slate-900 sm:p-8 lg:p-10">

      <div className="mx-auto max-w-5xl">

        {/* Back */}

        <Link
          href="/admin"
          className="font-bold text-green-700 transition hover:text-green-800"
        >
          ← Back to Admin
        </Link>


        {/* Page Header */}

        <div className="mt-8">

          <p className="text-xs font-black uppercase tracking-[4px] text-green-700">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">
            Upload Invoice
          </h1>

          <p className="mt-3 text-base font-medium text-slate-700">
            Upload an invoice directly to a customer's account.
          </p>

        </div>


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl bg-white p-6 shadow-xl sm:p-10"
        >

          {/* Customer */}

          <div>

            <label
              htmlFor="customer"
              className="block text-sm font-black text-slate-900"
            >
              Customer
            </label>

            <select
              id="customer"
              value={customerId}
              onChange={(event) =>
                setCustomerId(event.target.value)
              }
              disabled={
                loadingCustomers ||
                uploading
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100 disabled:text-slate-500"
            >

              <option
                value=""
                className="bg-white text-slate-900"
              >
                {loadingCustomers
                  ? "Loading customers..."
                  : "Select a customer"}
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                  className="bg-white text-slate-900"
                >
                  {customer.email}
                </option>
              ))}

            </select>

          </div>


          {/* Quote */}

          <div className="mt-6">

            <label
              htmlFor="quote"
              className="block text-sm font-black text-slate-900"
            >
              Quote
            </label>

            <select
              id="quote"
              value={quoteId}
              onChange={(event) =>
                setQuoteId(event.target.value)
              }
              disabled={
                !customerId ||
                loadingQuotes ||
                uploading
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100 disabled:text-slate-500"
            >

              <option
                value=""
                className="bg-white text-slate-900"
              >
                {!customerId
                  ? "Select a customer first"
                  : loadingQuotes
                  ? "Loading quotes..."
                  : quotes.length === 0
                  ? "No quotes found"
                  : "Select a quote"}
              </option>

              {quotes.map((quote) => (
                <option
                  key={quote.id}
                  value={quote.id}
                  className="bg-white text-slate-900"
                >
                  {quote.product || "Quote"} —{" "}
                  {quote.quantity || "-"} —{" "}
                  {quote.status || "Unknown"}
                </option>
              ))}

            </select>

            <p className="mt-2 text-xs font-medium text-slate-600">
              Select the quotation this invoice belongs to.
            </p>

          </div>


          {/* Invoice Number */}

          <div className="mt-6">

            <label
              htmlFor="invoice-number"
              className="block text-sm font-black text-slate-900"
            >
              Invoice Number
            </label>

            <input
              id="invoice-number"
              type="text"
              value={invoiceNumber}
              onChange={(event) =>
                setInvoiceNumber(event.target.value)
              }
              placeholder="e.g. INV-00125"
              disabled={uploading}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
            />

          </div>


          {/* Amount */}

          <div className="mt-6">

            <label
              htmlFor="amount"
              className="block text-sm font-black text-slate-900"
            >
              Invoice Amount
            </label>

            <div className="relative mt-2">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-700">
                R
              </span>

              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="0.00"
                disabled={uploading}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              />

            </div>

            <p className="mt-2 text-xs font-medium text-slate-600">
              Enter the total amount shown on the invoice.
            </p>

          </div>


          {/* Due Date */}

          <div className="mt-6">

            <label
              htmlFor="due-date"
              className="block text-sm font-black text-slate-900"
            >
              Due Date
            </label>

            <input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              disabled={uploading}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
            />

            <p className="mt-2 text-xs font-medium text-slate-600">
              Optional — leave blank if the invoice has no specific due date.
            </p>

          </div>


          {/* Invoice PDF */}

          <div className="mt-6">

            <label
              htmlFor="invoice-file"
              className="block text-sm font-black text-slate-900"
            >
              Invoice PDF
            </label>

            <input
              id="invoice-file"
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) =>
                setFile(
                  event.target.files?.[0] || null
                )
              }
              disabled={uploading}
              className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-medium text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-green-600 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-green-700"
            />

            <p className="mt-2 text-xs font-medium text-slate-600">
              PDF only · Maximum 25MB
            </p>

            {file && (
              <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-bold text-green-800">
                Selected: {file.name}
              </div>
            )}

          </div>


          {/* Error */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}


          {/* Success */}

          {success && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">
              ✓ {success}
            </div>
          )}


          {/* Submit */}

          <button
            type="submit"
            disabled={uploading}
            className="mt-8 w-full rounded-xl bg-green-600 px-6 py-4 text-base font-black text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Uploading Invoice..."
              : "Upload Invoice"}
          </button>

        </form>

      </div>

    </main>
  );
}