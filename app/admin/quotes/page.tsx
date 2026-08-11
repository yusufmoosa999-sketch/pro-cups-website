export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default async function QuotesPage() {
  /*
   * Always fetch fresh data.
   *
   * This page is intentionally dynamic because new customer
   * quote requests need to appear in the admin dashboard.
   */

  const { data: quotes, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Admin quotes loading error:",
      error
    );

    return (
      <main className="min-h-screen bg-slate-100 p-5 sm:p-8 lg:p-12">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">

            <p className="text-sm font-bold uppercase tracking-[3px] text-red-600">
              Pro Cups International
            </p>

            <h1 className="mt-2 text-2xl font-black text-red-900">
              Failed to load quotes
            </h1>

            <p className="mt-3 text-red-700">
              {error.message}
            </p>

            <div className="mt-6">

              <Link
                href="/admin/quotes"
                className="inline-flex rounded-xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-800"
              >
                Try Again
              </Link>

            </div>

          </div>

        </div>
      </main>
    );
  }

  const allQuotes = quotes || [];

  /*
   * Current quote statuses used throughout the system.
   */

  const totalQuotes = allQuotes.length;

  const newQuotes = allQuotes.filter(
    (quote) =>
      quote.status === "New"
  ).length;

  const quotedQuotes = allQuotes.filter(
    (quote) =>
      quote.status === "Quoted"
  ).length;

  const awaitingPayment = allQuotes.filter(
    (quote) =>
      quote.status === "Payment Pending"
  ).length;

  const inProduction = allQuotes.filter(
    (quote) =>
      quote.status === "In Production"
  ).length;

  const completedQuotes = allQuotes.filter(
    (quote) =>
      quote.status === "Completed"
  ).length;

  function statusStyle(
    status: string | null
  ) {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";

      case "Contacted":
        return "bg-yellow-100 text-yellow-700";

      case "Quoted":
        return "bg-purple-100 text-purple-700";

      case "Approved":
        return "bg-green-100 text-green-700";

      case "Payment Pending":
        return "bg-orange-100 text-orange-700";

      case "Paid":
        return "bg-emerald-100 text-emerald-700";

      case "In Production":
        return "bg-indigo-100 text-indigo-700";

      case "Ready":
        return "bg-cyan-100 text-cyan-700";

      case "Completed":
        return "bg-green-100 text-green-800";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function formatDate(
    date: string | null
  ) {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function formatQuantity(
    quantity: unknown
  ) {
    if (
      typeof quantity === "number"
    ) {
      return quantity.toLocaleString(
        "en-ZA"
      );
    }

    if (
      typeof quantity === "string" &&
      quantity.trim()
    ) {
      const number =
        Number(quantity);

      if (!Number.isNaN(number)) {
        return number.toLocaleString(
          "en-ZA"
        );
      }

      return quantity;
    }

    return "—";
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-10">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">

          <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
            Pro Cups International
          </p>

          <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h1 className="text-3xl font-black text-slate-950 sm:text-4xl lg:text-5xl">
                Quote Dashboard
              </h1>

              <p className="mt-2 text-slate-500">
                Manage customer quote requests,
                artwork and quotation progress.
              </p>

            </div>

            <Link
              href="/admin/quotes"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-green-500 hover:text-green-700"
            >
              ↻ Refresh Quotes
            </Link>

          </div>

        </div>


        {/* =====================================================
            STAT CARDS
        ===================================================== */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">

          {/* Total */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total
            </p>

            <p className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              {totalQuotes}
            </p>

          </div>


          {/* New */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              New
            </p>

            <p className="mt-3 text-3xl font-black text-blue-600 sm:text-4xl">
              {newQuotes}
            </p>

          </div>


          {/* Quoted */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quoted
            </p>

            <p className="mt-3 text-3xl font-black text-purple-600 sm:text-4xl">
              {quotedQuotes}
            </p>

          </div>


          {/* Payment Pending */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Awaiting Payment
            </p>

            <p className="mt-3 text-3xl font-black text-orange-600 sm:text-4xl">
              {awaitingPayment}
            </p>

          </div>


          {/* Production */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Production
            </p>

            <p className="mt-3 text-3xl font-black text-indigo-600 sm:text-4xl">
              {inProduction}
            </p>

          </div>


          {/* Completed */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completed
            </p>

            <p className="mt-3 text-3xl font-black text-emerald-600 sm:text-4xl">
              {completedQuotes}
            </p>

          </div>

        </div>


        {/* =====================================================
            QUOTES
        ===================================================== */}

        <div className="mt-8">

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <h2 className="text-2xl font-black text-slate-950">
              Customer Quotes
            </h2>

            <p className="text-sm text-slate-500">
              Showing {totalQuotes} request
              {totalQuotes === 1
                ? ""
                : "s"}
            </p>

          </div>


          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead className="bg-slate-950 text-white">

                  <tr>

                    <th className="px-6 py-5 text-left text-sm font-bold">
                      Company
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-bold">
                      Contact
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-bold">
                      Product
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-bold">
                      Quantity
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-bold">
                      Artwork
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-bold">
                      Status
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-bold">
                      Date
                    </th>

                    <th className="px-6 py-5 text-right text-sm font-bold">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {allQuotes.map(
                    (quote) => (

                      <tr
                        key={quote.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* Company */}

                        <td className="px-6 py-5">

                          <p className="font-bold text-slate-900">
                            {quote.company_name ||
                              "—"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {quote.email ||
                              "No email"}
                          </p>

                        </td>


                        {/* Contact */}

                        <td className="px-6 py-5 text-slate-700">
                          {quote.contact_name ||
                            "—"}
                        </td>


                        {/* Product */}

                        <td className="px-6 py-5">

                          <p className="font-semibold text-slate-900">
                            {quote.product ||
                              "—"}
                          </p>

                          {quote.size && (
                            <p className="mt-1 text-xs text-slate-400">
                              {quote.size}
                            </p>
                          )}

                        </td>


                        {/* Quantity */}

                        <td className="px-6 py-5 font-bold text-slate-900">
                          {formatQuantity(
                            quote.quantity
                          )}
                        </td>


                        {/* Artwork */}

                        <td className="px-6 py-5">

                          {quote.artwork_url ? (
                            <a
                              href={
                                quote.artwork_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-sm font-semibold text-slate-400">
                              None
                            </span>
                          )}

                        </td>


                        {/* Status */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(
                              quote.status
                            )}`}
                          >
                            {quote.status ||
                              "Unknown"}
                          </span>

                        </td>


                        {/* Date */}

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {formatDate(
                            quote.created_at
                          )}
                        </td>


                        {/* Action */}

                        <td className="px-6 py-5 text-right">

                          <Link
                            href={`/admin/quotes/${quote.id}`}
                            className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
                          >
                            View Quote →
                          </Link>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          <div className="space-y-4 md:hidden">

            {allQuotes.map(
              (quote) => (

                <div
                  key={quote.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <p className="truncate text-lg font-black text-slate-950">
                        {quote.company_name ||
                          "No Company"}
                      </p>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {quote.contact_name ||
                          "—"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {quote.email ||
                          "No email"}
                      </p>

                    </div>


                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(
                        quote.status
                      )}`}
                    >
                      {quote.status ||
                        "Unknown"}
                    </span>

                  </div>


                  <div className="mt-5 grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Product
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {quote.product ||
                          "—"}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Quantity
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {formatQuantity(
                          quote.quantity
                        )}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Date
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {formatDate(
                          quote.created_at
                        )}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Artwork
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {quote.artwork_url
                          ? "Received"
                          : "Not uploaded"}
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                    <Link
                      href={`/admin/quotes/${quote.id}`}
                      className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-600"
                    >
                      View Quote
                    </Link>


                    {quote.artwork_url && (
                      <a
                        href={
                          quote.artwork_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-green-500 hover:text-green-700"
                      >
                        View Artwork
                      </a>
                    )}

                  </div>

                </div>

              )
            )}

          </div>


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {allQuotes.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <div className="text-4xl">
                📋
              </div>

              <h3 className="mt-4 text-xl font-black text-slate-900">
                No quote requests yet
              </h3>

              <p className="mt-2 text-slate-500">
                New customer quote requests
                will appear here.
              </p>

              <Link
                href="/admin/quotes"
                className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600"
              >
                Refresh
              </Link>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}