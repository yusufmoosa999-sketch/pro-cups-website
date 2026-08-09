import QuoteStatus from "@/components/QuoteStatus";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import QuoteEditor from "@/components/QuoteEditor";
import QuoteProofUpload from "@/components/QuoteProofUpload";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function QuoteDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: quote, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !quote) {
    return (
      <main className="min-h-screen bg-slate-100 p-5 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/admin/quotes"
            className="font-bold text-green-700 hover:text-green-800"
          >
            ← Back to Quotes
          </Link>

          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8">
            <h1 className="text-2xl font-black text-red-800">
              Quote Not Found
            </h1>

            <p className="mt-2 text-red-700">
              We couldn't find this quote request.
            </p>
          </div>
        </div>
      </main>
    );
  }

  function formatDate(date: string | null) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-ZA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const hasArtwork = Boolean(
    quote.artwork_url || quote.artwork_path
  );

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">

        {/* BACK */}

        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-green-700"
        >
          ← Back to Quotes
        </Link>


        {/* HEADER */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
                Quote Request
              </p>

              <h1 className="mt-2 break-words text-3xl font-black text-slate-950 sm:text-4xl">
                {quote.company_name || "Customer Quote"}
              </h1>

              <p className="mt-2 text-slate-500">
                Submitted {formatDate(quote.created_at)}
              </p>

            </div>


            <div className="shrink-0">

              <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                {quote.status || "New"}
              </span>

            </div>

          </div>

        </div>


        {/* MAIN GRID */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* CUSTOMER */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 lg:col-span-1">

            <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
              Customer
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Customer Details
            </h2>


            <div className="mt-6 space-y-5">

              <Info
                title="Company"
                value={quote.company_name}
              />

              <Info
                title="Contact"
                value={quote.contact_name}
              />

              <Info
                title="Email"
                value={quote.email}
              />

              <Info
                title="Phone"
                value={quote.phone}
              />

            </div>

          </section>


          {/* REQUIREMENTS */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 lg:col-span-2">

            <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
              Requirements
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Quote Requirements
            </h2>


            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <Info
                title="Product"
                value={quote.product}
              />

              <Info
                title="Size"
                value={quote.size}
              />

              <Info
                title="Quantity"
                value={
                  quote.quantity != null
                    ? Number(quote.quantity).toLocaleString("en-ZA")
                    : null
                }
              />

              <Info
                title="Submitted"
                value={formatDate(quote.created_at)}
              />

            </div>


            <div className="mt-7">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Customer Message
              </p>

              <div className="mt-2 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                {quote.message || "No additional message was provided."}
              </div>

            </div>

          </section>

        </div>


        {/* STATUS */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
                Workflow
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Quote Status
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Update the customer's quote progress from here.
              </p>

            </div>


            <div className="w-full lg:max-w-xs">

              <QuoteStatus
                id={quote.id}
                currentStatus={quote.status}
              />

            </div>

          </div>

        </section>


        {/* ARTWORK */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
                Artwork
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Customer Artwork
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Review the artwork submitted by the customer.
              </p>

            </div>

            <div className="mt-8">
              <QuoteEditor
                quoteId={quote.id}
                quantity={quote.quantity}
                initialUnitPrice={quote.unit_price}
                initialNotes={quote.quotation_notes}
              />
              <div className="mt-8">
                <QuoteProofUpload
                  quoteId={quote.id}
                  existingProofUrl={quote.quotation_proof_url}
                />
              </div>
            </div>


            {hasArtwork ? (

              <a
                href={quote.artwork_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700"
              >
                View / Download Artwork
              </a>

            ) : (

              <span className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-400">
                Artwork Not Uploaded
              </span>

            )}

          </div>


          <div
            className={`mt-6 rounded-2xl border p-5 ${hasArtwork
              ? "border-green-200 bg-green-50"
              : "border-slate-200 bg-slate-50"
              }`}
          >

            {hasArtwork ? (

              <div>

                <p className="font-black text-green-800">
                  Artwork Received
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Customer artwork is available for your design team.
                </p>

                {quote.artwork_path && (
                  <p className="mt-3 break-all text-xs text-green-700">
                    Storage path: {quote.artwork_path}
                  </p>
                )}

              </div>

            ) : (

              <div>

                <p className="font-black text-slate-700">
                  No Artwork Yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  The customer has not uploaded artwork for this quote.
                </p>

              </div>

            )}

          </div>

        </section>
{/* CUSTOMER RESPONSE */}

<div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">

  <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
    Customer Response
  </p>

  <h2 className="mt-2 text-2xl font-black text-slate-900">
    Print Proof Approval
  </h2>

  {quote.customer_approval_status === "approved" ? (

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
            The customer has approved the print proof.
            The quotation can now proceed.
          </p>

          {quote.customer_approved_at && (
            <p className="mt-3 text-xs font-semibold text-green-600">
              Approved{" "}
              {new Date(
                quote.customer_approved_at
              ).toLocaleString()}
            </p>
          )}

        </div>

      </div>

    </div>

  ) : quote.customer_approval_status === "changes_requested" ? (

    <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-white">
          !
        </div>

        <div className="min-w-0">

          <p className="font-black text-yellow-800">
            Changes Requested
          </p>

          <p className="mt-1 text-sm leading-6 text-yellow-700">
            The customer has requested changes to the print proof.
          </p>

          {quote.customer_approval_note && (
            <div className="mt-4 rounded-xl bg-white p-4">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Customer's Request
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {quote.customer_approval_note}
              </p>

            </div>
          )}

        </div>

      </div>

    </div>

  ) : (

    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <p className="font-bold text-slate-700">
        Awaiting Customer Response
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        The customer has not yet approved the print proof or requested changes.
      </p>

    </div>

  )}

</div>
{/* CUSTOMER QUOTATION RESPONSE */}

<div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">

  <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
    Customer Quotation
  </p>

  <h2 className="mt-2 text-2xl font-black text-slate-900">
    Quotation Acceptance
  </h2>

  {quote.customer_quote_status === "accepted" ? (

    <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
          ✓
        </div>

        <div className="min-w-0">

          <p className="font-black text-green-800">
            Quotation Accepted
          </p>

          <p className="mt-1 text-sm leading-6 text-green-700">
            The customer has accepted the quotation.
            The order can now proceed to production.
          </p>

          {quote.customer_quote_accepted_at && (
            <p className="mt-3 text-xs font-semibold text-green-600">
              Accepted{" "}
              {new Date(
                quote.customer_quote_accepted_at
              ).toLocaleString()}
            </p>
          )}

        </div>

      </div>

    </div>

  ) : (

    <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xl font-bold text-white">
          !
        </div>

        <div>

          <p className="font-black text-yellow-800">
            Awaiting Customer Acceptance
          </p>

          <p className="mt-1 text-sm leading-6 text-yellow-700">
            The customer has not yet accepted the quotation.
          </p>

        </div>

      </div>

    </div>

  )}

</div>

        {/* NEXT WORKFLOW */}

        <section className="mt-6 rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">

          <p className="text-sm font-bold uppercase tracking-[3px] text-green-400">
            Next Steps
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Quote Processing
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Once the artwork has been reviewed, you will be able to
            upload a print proof, enter pricing and send the quotation
            to the customer for approval.
          </p>


          <div className="mt-6 grid gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step 1
              </p>

              <p className="mt-2 font-bold">
                Review Artwork
              </p>
            </div>


            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step 2
              </p>

              <p className="mt-2 font-bold">
                Prepare Proof
              </p>
            </div>


            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step 3
              </p>

              <p className="mt-2 font-bold">
                Send Quotation
              </p>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}


function Info({
  title,
  value,
}: {
  title: string;
  value: unknown;
}) {
  return (
    <div className="min-w-0">

      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-1 break-words text-base font-bold text-slate-900">
        {value != null && String(value).trim() !== ""
          ? String(value)
          : "—"}
      </p>

    </div>
  );
}