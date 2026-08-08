import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function QuotesPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: quotes, error } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-10">

            {/* PAGE HEADER */}

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                <div>

                    <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
                        Customer Portal
                    </p>

                    <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                        My Quotes
                    </h1>

                    <p className="mt-3 max-w-2xl text-lg text-slate-500">
                        View your quotation requests, artwork status and quotation
                        progress in one place.
                    </p>

                </div>

                <Link
                    href="/custom-printing"
                    className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
                >
                    + Request a Quote
                </Link>

            </div>


            {/* FILTER TABS */}

            <div className="flex flex-wrap gap-3">

                <button
                    type="button"
                    className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
                >
                    All Quotes
                </button>

                <button
                    type="button"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                    Under Review
                </button>

                <button
                    type="button"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                    Awaiting Approval
                </button>

                <button
                    type="button"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                    Approved
                </button>

            </div>


            {/* QUOTE LIST */}

            <div className="space-y-5">
                    {/* REAL QUOTES */}

      {quotes && quotes.length > 0 ? (

        <div className="space-y-5">

          {quotes.map((quote) => {

            const quoteId = String(quote.id);

            const productName =
              quote.product || "Custom Cup Project";

            const quantity =
              quote.quantity
                ? Number(quote.quantity).toLocaleString()
                : "Not specified";

            const submittedDate = quote.created_at
              ? new Date(quote.created_at).toLocaleDateString("en-ZA", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Date unavailable";

            return (

              <div
                key={quote.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md md:p-8"
              >

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-2xl font-black text-slate-900">
                        Quote #{quoteId}
                      </h2>

                      <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
                        Received
                      </span>

                    </div>

                    <p className="mt-3 text-lg font-semibold text-slate-700">
                      {productName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Submitted on {submittedDate}
                    </p>

                  </div>


                  <Link
                    href={`/portal/quotes/${quoteId}`}
                    className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:border-green-600 hover:text-green-600"
                  >
                    View Quote →
                  </Link>

                </div>


                {/* PROGRESS */}

                <div className="mt-8">

                  <div className="mb-4 flex items-center justify-between gap-4">

                    <span className="text-sm font-bold text-slate-500">
                      Quote Progress
                    </span>

                    <span className="text-sm font-bold text-green-600">
                      Quote Received
                    </span>

                  </div>


                  <div className="relative">

                    <div className="absolute left-0 right-0 top-4 h-1 bg-slate-100" />

                    <div className="absolute left-0 top-4 h-1 w-1/4 bg-green-600" />


                    <div className="relative grid grid-cols-4">

                      <div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                          ✓
                        </div>

                        <p className="mt-3 text-xs font-bold text-slate-900 sm:text-sm">
                          Received
                        </p>

                      </div>


                      <div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-400">
                          2
                        </div>

                        <p className="mt-3 text-xs font-bold text-slate-400 sm:text-sm">
                          Artwork Review
                        </p>

                      </div>


                      <div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-400">
                          3
                        </div>

                        <p className="mt-3 text-xs font-bold text-slate-400 sm:text-sm">
                          Approval
                        </p>

                      </div>


                      <div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-400">
                          4
                        </div>

                        <p className="mt-3 text-xs font-bold text-slate-400 sm:text-sm">
                          Quoted
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                {/* DETAILS */}

                <div className="mt-8 grid grid-cols-2 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-4">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[2px] text-slate-400">
                      Product
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {productName}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-bold uppercase tracking-[2px] text-slate-400">
                      Quantity
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {quantity}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-bold uppercase tracking-[2px] text-slate-400">
                      Artwork
                    </p>

                    <p className="mt-2 font-bold text-green-600">
                      {quote.artwork_url ? "Received" : "Not uploaded"}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-bold uppercase tracking-[2px] text-slate-400">
                      Quote
                    </p>

                    <p className="mt-2 font-bold text-amber-600">
                      Pending
                    </p>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      ) : (

        /* NO QUOTES */

        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
            📋
          </div>

          <h3 className="mt-5 text-2xl font-black text-slate-900">
            No quotes yet
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-slate-500">
            You haven't submitted any quotation requests yet.
            Once you submit one, it will appear here and you can
            track its progress from your customer portal.
          </p>

          <Link
            href="/custom-printing"
            className="mt-6 inline-flex rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white transition hover:bg-green-700"
          >
            Request Your First Quote
          </Link>

        </div>

      )}

                {/* EMPTY / FUTURE QUOTES */}

                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

                    <p className="text-sm font-bold uppercase tracking-[2px] text-slate-400">
                        Need another quote?
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-slate-900">
                        Start a new project
                    </h3>

                    <p className="mx-auto mt-3 max-w-xl text-slate-500">
                        Upload your artwork and tell us what you need. Our team will
                        prepare your quotation and print proof.
                    </p>

                    <Link
                        href="/custom-printing"
                        className="mt-6 inline-flex rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white transition hover:bg-green-700"
                    >
                        Request a New Quote
                    </Link>

                </div>


            </div>

        </div>
    );
}