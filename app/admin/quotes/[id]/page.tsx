import QuoteStatus from "@/components/QuoteStatus";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import QuoteEditor from "@/components/QuoteEditor";
import QuoteProofUpload from "@/components/QuoteProofUpload";

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

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-6xl">

          <Link
            href="/admin/quotes"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-green-700"
          >
            ← Back to Quotes
          </Link>

          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8">
            <p className="text-sm font-bold uppercase tracking-[3px] text-red-600">
              Pro Cups International
            </p>

            <h1 className="mt-2 text-3xl font-black text-red-900">
              Quote Not Found
            </h1>

            <p className="mt-3 text-red-700">
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
      timeZone: "Africa/Johannesburg",
    });
  }

  function formatMoney(value: unknown) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not set";
    }

    const amount = Number(value);

    if (Number.isNaN(amount)) {
      return String(value);
    }

    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  function formatQuantity(value: unknown) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return String(value);
    }

    return number.toLocaleString("en-ZA");
  }

  function getStatusStyle(status: string | null) {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "Contacted":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "Quoted":
        return "bg-purple-100 text-purple-700 border-purple-200";

      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";

      case "Payment Pending":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "Paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "In Production":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";

      case "Ready":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";

      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";

      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  const hasArtwork = Boolean(
    quote.artwork_url || quote.artwork_path
  );

  const proofUploaded = Boolean(
    quote.quotation_proof_url
  );

  const proofApproved =
    quote.customer_approval_status === "approved";

  const changesRequested =
    quote.customer_approval_status ===
    "changes_requested";

  const quotationAccepted =
    quote.customer_quote_status === "accepted";

  /*
   * Production must NEVER be considered ready simply because
   * the customer accepted the quotation.
   *
   * Payment must be confirmed first.
   */
  const paymentConfirmed =
    quote.status === "Paid" ||
    quote.status === "In Production" ||
    quote.status === "Ready" ||
    quote.status === "Completed";

  const productionStarted =
    quote.status === "In Production" ||
    quote.status === "Ready" ||
    quote.status === "Completed";

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-10">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            TOP NAVIGATION
        ===================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <Link
            href="/admin/quotes"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-green-700"
          >
            ← Back to Quotes
          </Link>

          <p className="text-xs font-bold uppercase tracking-[3px] text-slate-400">
            Admin / Quote Details
          </p>

        </div>


        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="mt-5 overflow-hidden rounded-[32px] bg-slate-950 text-white shadow-xl">

          <div className="p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-3">

                  <span className="rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-green-400">
                    Quote Request
                  </span>

                  <span className="text-sm text-slate-400">
                    #{quote.id}
                  </span>

                </div>

                <h1 className="mt-4 break-words text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {quote.company_name ||
                    "Customer Quote"}
                </h1>

                <p className="mt-3 text-slate-400">
                  Submitted{" "}
                  {formatDate(quote.created_at)}
                </p>

              </div>


              <div className="shrink-0">

                <span
                  className={`inline-flex rounded-full border px-5 py-2.5 text-sm font-black ${getStatusStyle(
                    quote.status
                  )}`}
                >
                  {quote.status || "New"}
                </span>

              </div>

            </div>


            {/* Quick summary */}

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <SummaryCard
                label="Products"
                value={
                  Array.isArray(quote.quote_items) &&
                  quote.quote_items.length > 0
                    ? quote.quote_items
                        .map((item: { product?: string }) => item.product)
                        .filter(Boolean)
                        .join(" • ")
                    : quote.product || "Not specified"
                }
              />

              <SummaryCard
                label="Size"
                value={quote.size || "Not specified"}
              />

              <SummaryCard
                label="Quantities"
                value={
                  Array.isArray(quote.quote_items) &&
                  quote.quote_items.length > 0
                    ? quote.quote_items
                        .map(
                          (item: {
                            product?: string;
                            quantity?: number | string;
                          }) =>
                            `${item.product || "Product"}: ${formatQuantity(
                              item.quantity
                            )}`
                        )
                        .join(" • ")
                    : formatQuantity(quote.quantity)
                }
              />

              <SummaryCard
                label="Quotation"
                value={formatMoney(
                  quote.total_amount
                )}
              />

            </div>

          </div>

        </section>


        {/* =====================================================
            WORKFLOW OVERVIEW
        ===================================================== */}

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-2">

            <p className="text-xs font-black uppercase tracking-[3px] text-green-600">
              Order Workflow
            </p>

            <h2 className="text-2xl font-black text-slate-950">
              Where this quote is now
            </h2>

            <p className="text-sm leading-6 text-slate-500">
              Follow the customer from quote request through
              proof approval, payment and production.
            </p>

          </div>


          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

            <WorkflowStep
              number="01"
              title="Quote"
              active
              complete
              description="Request received"
            />


            <WorkflowStep
              number="03"
              title="Quotation"
              active={quotationAccepted}
              complete={quotationAccepted}
              description={
                quotationAccepted
                  ? "Accepted"
                  : "Awaiting customer"
              }
            />

            <WorkflowStep
              number="04"
              title="Payment"
              active={paymentConfirmed}
              complete={paymentConfirmed}
              description={
                paymentConfirmed
                  ? "Payment confirmed"
                  : "Awaiting payment"
              }
            />

            <WorkflowStep
              number="05"
              title="Production"
              active={productionStarted}
              complete={
                quote.status ===
                "Completed"
              }
              description={
                quote.status ===
                  "Completed"
                  ? "Completed"
                  : productionStarted
                    ? "In progress"
                    : "Locked until paid"
              }
            />

          </div>


          {/* Important production rule */}

          {!paymentConfirmed && quotationAccepted && (
            <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 font-black text-white">
                  !
                </div>

                <div>

                  <p className="font-black text-orange-900">
                    Payment required before production
                  </p>

                  <p className="mt-1 text-sm leading-6 text-orange-800">
                    The customer has accepted the quotation,
                    but production must remain locked until
                    the invoice has been paid and payment has
                    been confirmed.
                  </p>

                </div>

              </div>

            </div>
          )}

        </section>


        {/* =====================================================
            CUSTOMER + REQUIREMENTS
        ===================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Customer */}

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

            <SectionHeading
              eyebrow="Customer"
              title="Customer Details"
            />

            <div className="mt-7 space-y-6">

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


          {/* Requirements */}

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7 lg:col-span-2">

            <SectionHeading
              eyebrow="Requirements"
              title="Quote Requirements"
            />

            <div className="mt-7 grid gap-6 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Products & Quantities
                </p>

                <div className="mt-3 space-y-2">
                  {Array.isArray(quote.quote_items) &&
                  quote.quote_items.length > 0 ? (
                    quote.quote_items.map(
                      (
                        item: {
                          product?: string;
                          quantity?: number | string;
                        },
                        index: number
                      ) => (
                        <div
                          key={`${item.product || "product"}-${index}`}
                          className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="font-bold text-slate-900">
                            {item.product || "Product"}
                          </span>
                          <span className="text-sm font-black text-slate-600">
                            Qty: {formatQuantity(item.quantity)}
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <span className="font-bold text-slate-900">
                        {quote.product || "Not specified"}
                      </span>
                      <span className="ml-2 text-sm font-black text-slate-600">
                        Qty: {formatQuantity(quote.quantity)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Info
                title="Size"
                value={quote.size}
              />

              <Info
                title="Submitted"
                value={formatDate(
                  quote.created_at
                )}
              />

            </div>


            <div className="mt-7">

              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Customer Message
              </p>

              <div className="mt-2 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                {quote.message ||
                  "No additional message was provided."}
              </div>

            </div>

          </section>

        </div>


        {/* =====================================================
            STATUS CONTROL
        ===================================================== */}

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <SectionHeading
              eyebrow="Workflow Control"
              title="Quote Status"
              description="Use this control to update the customer's overall quote progress."
            />

            <div className="w-full lg:max-w-sm">

              <QuoteStatus
                id={quote.id}
                currentStatus={quote.status}
              />

            </div>

          </div>

        </section>


        {/* =====================================================
            ARTWORK + QUOTATION EDITOR
        ===================================================== */}

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            <SectionHeading
              eyebrow="Artwork & Pricing"
              title="Prepare Customer Quote"
              description="Review artwork, set pricing, add quotation notes and upload the print proof."
            />

            {hasArtwork ? (
              <a
                href={
                  quote.artwork_url ||
                  "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-black text-white transition hover:bg-green-700"
              >
                View / Download Artwork
              </a>
            ) : (
              <span className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-400">
                Artwork Not Uploaded
              </span>
            )}

          </div>


          {hasArtwork ? (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

              <p className="font-black text-green-800">
                Artwork Received
              </p>

              <p className="mt-1 text-sm leading-6 text-green-700">
                Customer artwork is available for
                review.
              </p>

              {quote.artwork_path && (
                <p className="mt-3 break-all text-xs text-green-700">
                  Storage path:{" "}
                  {quote.artwork_path}
                </p>
              )}

            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <p className="font-black text-slate-700">
                No Artwork Yet
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                The customer has not uploaded artwork
                for this quote.
              </p>

            </div>
          )}


          <div className="mt-8 border-t border-slate-100 pt-8">

            <QuoteEditor
              quoteId={quote.id}
              quantity={quote.quantity}
              initialProduct={quote.product}
              initialUnitPrice={quote.unit_price}
              initialNotes={quote.quotation_notes}
              initialQuoteItems={quote.quote_items}
            />

          </div>


          <div className="mt-8 border-t border-slate-100 pt-8">

            <div className="mb-5">

              <p className="text-xs font-black uppercase tracking-[3px] text-green-600">
                Print Proof
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950">
                Upload Customer Proof
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                The customer must approve the print proof
                before the quotation can be accepted.
              </p>

            </div>

            <QuoteProofUpload
              quoteId={quote.id}
              existingProofUrl={
                quote.quotation_proof_url
              }
            />

          </div>

        </section>


        {/* =====================================================
            CUSTOMER PROOF RESPONSE
        ===================================================== */}

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <SectionHeading
            eyebrow="Customer Response"
            title="Print Proof Approval"
            description="See whether the customer has approved the proof or requested changes."
          />


          {proofApproved ? (

            <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-black text-white">
                  ✓
                </div>

                <div>

                  <p className="font-black text-green-800">
                    Print Proof Approved
                  </p>

                  <p className="mt-1 text-sm leading-6 text-green-700">
                    The customer has approved the
                    print proof.
                  </p>

                  {quote.customer_approved_at && (
                    <p className="mt-3 text-xs font-bold text-green-600">
                      Approved{" "}
                      {new Date(
                        quote.customer_approved_at
                      ).toLocaleString(
                        "en-ZA",
                        { timeZone: "Africa/Johannesburg" }
                      )}
                    </p>
                  )}

                </div>

              </div>

            </div>

          ) : changesRequested ? (

            <div className="mt-7 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xl font-black text-white">
                  !
                </div>

                <div className="min-w-0">

                  <p className="font-black text-yellow-900">
                    Changes Requested
                  </p>

                  <p className="mt-1 text-sm leading-6 text-yellow-800">
                    The customer has requested changes
                    to the print proof.
                  </p>

                  {quote.customer_approval_note && (
                    <div className="mt-4 rounded-xl bg-white p-4">

                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Customer's Request
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {
                          quote.customer_approval_note
                        }
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </div>

          ) : (

            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-300 text-lg font-black text-slate-700">
                  ?
                </div>

                <div>

                  <p className="font-black text-slate-800">
                    Awaiting Customer Response
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    The customer has not yet approved the
                    print proof or requested changes.
                  </p>

                </div>

              </div>

            </div>

          )}

        </section>


        {/* =====================================================
            QUOTATION ACCEPTANCE
        ===================================================== */}

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <SectionHeading
            eyebrow="Customer Quotation"
            title="Quotation Acceptance"
            description="The customer must accept the quotation before payment can be made."
          />


          {quotationAccepted ? (

            <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-black text-white">
                  ✓
                </div>

                <div>

                  <p className="font-black text-green-800">
                    Quotation Accepted
                  </p>

                  <p className="mt-1 text-sm leading-6 text-green-700">
                    The customer has accepted the
                    quotation.
                  </p>

                  {quote.customer_quote_accepted_at && (
                    <p className="mt-3 text-xs font-bold text-green-600">
                      Accepted{" "}
                      {new Date(
                        quote.customer_quote_accepted_at
                      ).toLocaleString(
                        "en-ZA",
                        { timeZone: "Africa/Johannesburg" }
                      )}
                    </p>
                  )}

                </div>

              </div>


              {/* Important distinction */}

              {!paymentConfirmed && (
                <div className="mt-5 rounded-xl border border-orange-200 bg-orange-100 p-4">

                  <p className="font-black text-orange-900">
                    Next step: payment
                  </p>

                  <p className="mt-1 text-sm leading-6 text-orange-800">
                    The quotation has been accepted,
                    but this order must NOT enter production
                    until the invoice has been paid.
                  </p>

                </div>
              )}

            </div>

          ) : (

            <div className="mt-7 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xl font-black text-white">
                  !
                </div>

                <div>

                  <p className="font-black text-yellow-900">
                    Awaiting Customer Acceptance
                  </p>

                  <p className="mt-1 text-sm leading-6 text-yellow-800">
                    The customer has not yet accepted the
                    quotation.
                  </p>

                </div>

              </div>

            </div>

          )}

        </section>


        {/* =====================================================
            PAYMENT
        ===================================================== */}

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <SectionHeading
              eyebrow="Payment"
              title="Invoice & Payment"
              description="Production is locked until payment has been confirmed."
            />

            <div
              className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-black ${paymentConfirmed
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-orange-200 bg-orange-50 text-orange-700"
                }`}
            >
              {paymentConfirmed
                ? "✓ Payment Confirmed"
                : "Payment Pending"}
            </div>

          </div>


          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            <PaymentCard
              label="Quotation"
              value={
                quotationAccepted
                  ? "Accepted"
                  : "Not accepted"
              }
              success={quotationAccepted}
            />

            <PaymentCard
              label="Invoice Amount"
              value={formatMoney(
                quote.total_amount
              )}
              success={
                quote.total_amount != null
              }
            />

            <PaymentCard
              label="Payment"
              value={
                paymentConfirmed
                  ? "Paid"
                  : "Awaiting Payment"
              }
              success={paymentConfirmed}
            />

          </div>


          {!quotationAccepted && (
            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

              <p className="font-black text-yellow-900">
                Customer must accept the quotation first
              </p>

              <p className="mt-1 text-sm leading-6 text-yellow-800">
                Payment should not proceed until the
                customer has accepted the quotation.
              </p>

            </div>
          )}

          {quotationAccepted &&
            !paymentConfirmed && (
              <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">

                <p className="font-black text-orange-900">
                  Awaiting payment
                </p>

                <p className="mt-1 text-sm leading-6 text-orange-800">
                  The quotation has been accepted.
                  Once the customer pays the invoice and
                  Payfast confirms the payment, production
                  can begin.
                </p>

              </div>
            )}

          {paymentConfirmed && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

              <p className="font-black text-green-900">
                Payment confirmed
              </p>

              <p className="mt-1 text-sm leading-6 text-green-800">
                Payment has been confirmed. Production may
                now proceed according to your normal
                production workflow.
              </p>

            </div>
          )}

        </section>


        {/* =====================================================
            PRODUCTION
        ===================================================== */}

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <SectionHeading
              eyebrow="Production"
              title="Production Control"
              description="Production becomes available only after payment has been confirmed."
            />

            <span
              className={`inline-flex w-fit rounded-full border px-4 py-2 text-sm font-black ${productionStarted
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-slate-100 text-slate-500"
                }`}
            >
              {quote.status ===
                "Completed"
                ? "Completed"
                : quote.status ===
                  "Ready"
                  ? "Ready"
                  : quote.status ===
                    "In Production"
                    ? "In Production"
                    : "Locked"}
            </span>

          </div>


          {!paymentConfirmed ? (

            <div className="mt-7 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-7 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-2xl">
                🔒
              </div>

              <h3 className="mt-4 text-xl font-black text-slate-800">
                Production Locked
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Production cannot begin yet. The quotation
                must be paid and the payment confirmed first.
              </p>

            </div>

          ) : (

            <div className="mt-7 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-black text-white">
                  ✓
                </div>

                <div>

                  <p className="font-black text-indigo-900">
                    Production Unlocked
                  </p>

                  <p className="mt-1 text-sm leading-6 text-indigo-800">
                    Payment has been confirmed. The order
                    can now move through your production
                    workflow.
                  </p>

                </div>

              </div>

            </div>

          )}

        </section>


        {/* =====================================================
            ADMIN CHECKLIST
        ===================================================== */}

        <section className="mt-6 rounded-[32px] bg-slate-950 p-6 text-white shadow-xl sm:p-8">

          <p className="text-xs font-black uppercase tracking-[3px] text-green-400">
            Admin Checklist
          </p>

          <h2 className="mt-2 text-2xl font-black">
            What needs attention?
          </h2>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <ChecklistItem
              title="Artwork"
              complete={hasArtwork}
              detail={
                hasArtwork
                  ? "Received"
                  : "Awaiting customer"
              }
            />

            <ChecklistItem
              title="Print Proof"
              complete={proofApproved}
              detail={
                proofApproved
                  ? "Approved"
                  : proofUploaded
                    ? "Awaiting approval"
                    : "Not uploaded"
              }
            />

            <ChecklistItem
              title="Quotation"
              complete={quotationAccepted}
              detail={
                quotationAccepted
                  ? "Accepted"
                  : "Awaiting acceptance"
              }
            />

            <ChecklistItem
              title="Payment"
              complete={paymentConfirmed}
              detail={
                paymentConfirmed
                  ? "Paid"
                  : "Awaiting payment"
              }
            />

          </div>

        </section>


        {/* =====================================================
            FOOTER ACTION
        ===================================================== */}

        <div className="mt-8 flex justify-start pb-8">

          <Link
            href="/admin/quotes"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-green-500 hover:text-green-700"
          >
            ← Back to All Quotes
          </Link>

        </div>

      </div>

    </main>
  );
}


/* =============================================================
   COMPONENTS
============================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[3px] text-green-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
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

      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-1 break-words text-base font-bold text-slate-900">
        {value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
          ? String(value)
          : "—"}
      </p>

    </div>
  );
}


function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-black text-white">
        {value}
      </p>

    </div>
  );
}


function WorkflowStep({
  number,
  title,
  description,
  active,
  complete,
}: {
  number: string;
  title: string;
  description: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${complete
          ? "border-green-200 bg-green-50"
          : active
            ? "border-blue-200 bg-blue-50"
            : "border-slate-200 bg-slate-50"
        }`}
    >

      <div className="flex items-center gap-3">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${complete
              ? "bg-green-600 text-white"
              : active
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-500"
            }`}
        >
          {complete ? "✓" : number}
        </div>

        <div className="min-w-0">

          <p className="font-black text-slate-900">
            {title}
          </p>

          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}


function PaymentCard({
  label,
  value,
  success,
}: {
  label: string;
  value: string;
  success: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${success
          ? "border-green-200 bg-green-50"
          : "border-slate-200 bg-slate-50"
        }`}
    >

      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-lg font-black ${success
            ? "text-green-800"
            : "text-slate-700"
          }`}
      >
        {value}
      </p>

    </div>
  );
}


function ChecklistItem({
  title,
  detail,
  complete,
}: {
  title: string;
  detail: string;
  complete: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">

      <div className="flex items-start gap-3">

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${complete
              ? "bg-green-600 text-white"
              : "bg-white/10 text-slate-400"
            }`}
        >
          {complete ? "✓" : "!"}
        </div>

        <div>

          <p className="font-black text-white">
            {title}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-400">
            {detail}
          </p>

        </div>

      </div>

    </div>
  );
}