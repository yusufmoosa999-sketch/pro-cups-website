import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
type Quote = Record<string, any>;

type SearchParams = {
  time?: string;
  status?: string;
};

function formatDate(date: string | null) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: unknown) {
  if (amount === null || amount === undefined || amount === "") {
    return null;
  }

  const number = Number(amount);

  if (Number.isNaN(number)) {
    return null;
  }

  return `R ${number.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getQuoteStage(quote: any) {
  /*
   * PAYMENT / PRODUCTION
   */

  if (
    quote.status === "Completed" ||
    quote.status === "Complete"
  ) {
    return {
      key: "completed",
      label: "Completed",
      description: "This project has been completed.",
      color: "green",
      step: 5,
    };
  }

  if (
    quote.status === "In Production" ||
    quote.status === "Production"
  ) {
    return {
      key: "production",
      label: "In Production",
      description:
        "Your order has been paid and is now being manufactured.",
      color: "blue",
      step: 4,
    };
  }

  /*
   * PAYMENT
   *
   * We check common payment fields without requiring
   * the page to have a separate orders table.
   */

  if (
    quote.payment_status === "paid" ||
    quote.payment_status === "Paid" ||
    quote.status === "Paid"
  ) {
    return {
      key: "paid",
      label: "Paid",
      description:
        "Payment has been received. Your project is ready for production.",
      color: "green",
      step: 4,
    };
  }

  /*
   * QUOTATION ACCEPTED
   */

  if (
    quote.customer_quote_status === "accepted"
  ) {
    return {
      key: "payment",
      label: "Awaiting Payment",
      description:
        "Your quotation has been accepted. Payment is required before production can begin.",
      color: "amber",
      step: 3,
    };
  }

  /*
   * PRINT PROOF APPROVED BUT QUOTATION NOT ACCEPTED
   */

  if (
    quote.customer_approval_status === "approved" &&
    quote.total_amount != null
  ) {
    return {
      key: "quotation",
      label: "Quotation Ready",
      description:
        "Your quotation is ready for you to review and accept.",
      color: "purple",
      step: 3,
    };
  }

  /*
   * PRINT PROOF AWAITING CUSTOMER APPROVAL
   */

  if (
    quote.customer_approval_status &&
    quote.customer_approval_status !== "approved"
  ) {
    return {
      key: "approval",
      label: "Awaiting Your Approval",
      description:
        "Please review the print proof and approve it when you're happy.",
      color: "amber",
      step: 2,
    };
  }

  /*
   * ARTWORK / QUOTE UNDER REVIEW
   */

  if (quote.artwork_url) {
    return {
      key: "review",
      label: "Under Review",
      description:
        "We've received your project and our team is reviewing it.",
      color: "blue",
      step: 1,
    };
  }

  /*
   * DEFAULT
   */

  return {
    key: "received",
    label: "Quote Received",
    description:
      "We've received your quotation request and will review it shortly.",
    color: "slate",
    step: 1,
  };
}

function matchesStatus(
  quote: any,
  filter: string
) {
  if (!filter || filter === "all") {
    return true;
  }

  const stage = getQuoteStage(quote);

  if (filter === "action") {
    return [
      "approval",
      "quotation",
      "payment",
    ].includes(stage.key);
  }

  if (filter === "review") {
    return stage.key === "review";
  }

  if (filter === "payment") {
    return stage.key === "payment";
  }

  if (filter === "production") {
    return (
      stage.key === "production" ||
      stage.key === "paid"
    );
  }

  if (filter === "completed") {
    return stage.key === "completed";
  }

  return true;
}

function matchesTime(
  quote: any,
  filter: string
) {
  if (!filter || filter === "all") {
    return true;
  }

  if (!quote.created_at) {
    return false;
  }

  const created = new Date(
    quote.created_at
  );

  const now = new Date();

  if (filter === "30") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(
      now.getDate() - 30
    );

    return created >= thirtyDaysAgo;
  }

  if (filter === "90") {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(
      now.getDate() - 90
    );

    return created >= ninetyDaysAgo;
  }

  if (filter === "year") {
    return (
      created.getFullYear() ===
      now.getFullYear()
    );
  }

  return true;
}

function getColorClasses(color: string) {
  switch (color) {
    case "green":
      return {
        badge:
          "bg-green-50 text-green-700 ring-green-200",
        dot: "bg-green-500",
        text: "text-green-700",
        line: "bg-green-500",
      };

    case "blue":
      return {
        badge:
          "bg-blue-50 text-blue-700 ring-blue-200",
        dot: "bg-blue-500",
        text: "text-blue-700",
        line: "bg-blue-500",
      };

    case "amber":
      return {
        badge:
          "bg-amber-50 text-amber-700 ring-amber-200",
        dot: "bg-amber-500",
        text: "text-amber-700",
        line: "bg-amber-500",
      };

    case "purple":
      return {
        badge:
          "bg-purple-50 text-purple-700 ring-purple-200",
        dot: "bg-purple-500",
        text: "text-purple-700",
        line: "bg-purple-500",
      };

    default:
      return {
        badge:
          "bg-slate-100 text-slate-700 ring-slate-200",
        dot: "bg-slate-400",
        text: "text-slate-700",
        line: "bg-slate-400",
      };
  }
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;

  const timeFilter =
    params.time || "all";

  const statusFilter =
    params.status || "all";

  /*
   * GET REAL CUSTOMER QUOTES
   */

  const {
    data: quotes,
    error,
  } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Customer quotes error:",
      error
    );
  }

  const allQuotes: Quote[] = quotes ?? [];

  /*
   * FILTER
   */

  const filteredQuotes =
    allQuotes.filter((quote) => {
      return (
        matchesTime(
          quote,
          timeFilter
        ) &&
        matchesStatus(
          quote,
          statusFilter
        )
      );
    });

  /*
   * SUMMARY
   */

  const actionCount =
    allQuotes.filter((quote) =>
      matchesStatus(
        quote,
        "action"
      )
    ).length;

  const productionCount =
    allQuotes.filter((quote) =>
      matchesStatus(
        quote,
        "production"
      )
    ).length;

  const completedCount =
    allQuotes.filter((quote) =>
      matchesStatus(
        quote,
        "completed"
      )
    ).length;

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[32px] bg-[#07111f] px-6 py-8 text-white shadow-xl sm:px-8 sm:py-10 lg:px-10">

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
              Customer Portal
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              My Quotes
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Everything you're working on with Pro Cups,
              all in one place.
            </p>

          </div>

          <Link
            href="/custom-printing"
            className="inline-flex w-fit items-center justify-center rounded-2xl bg-green-500 px-6 py-3.5 font-bold text-[#07111f] shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:bg-green-400"
          >
            + Request a Quote
          </Link>

        </div>

      </section>


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <SummaryCard
          label="Total Quotes"
          value={allQuotes.length}
          description="All your quotation requests"
        />

        <SummaryCard
          label="Needs Your Attention"
          value={actionCount}
          description="Quotes waiting for you"
          highlight={actionCount > 0}
        />

        <SummaryCard
          label="In Production"
          value={productionCount}
          description="Projects currently being made"
        />

      </section>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col gap-6">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Filter your quotes
            </p>

            <h2 className="mt-1 text-xl font-black text-slate-900">
              Find what you're looking for
            </h2>

          </div>


          {/* TIME */}

          <div>

            <p className="mb-3 text-sm font-bold text-slate-600">
              Time period
            </p>

            <div className="flex flex-wrap gap-2">

              <FilterLink
                href="/portal/quotes"
                active={
                  timeFilter === "all"
                }
              >
                All time
              </FilterLink>

              <FilterLink
                href={`/portal/quotes?time=30&status=${statusFilter}`}
                active={
                  timeFilter === "30"
                }
              >
                Last 30 days
              </FilterLink>

              <FilterLink
                href={`/portal/quotes?time=90&status=${statusFilter}`}
                active={
                  timeFilter === "90"
                }
              >
                Last 3 months
              </FilterLink>

              <FilterLink
                href={`/portal/quotes?time=year&status=${statusFilter}`}
                active={
                  timeFilter === "year"
                }
              >
                This year
              </FilterLink>

            </div>

          </div>


          {/* STATUS */}

          <div>

            <p className="mb-3 text-sm font-bold text-slate-600">
              Status
            </p>

            <div className="flex flex-wrap gap-2">

              <FilterLink
                href={`/portal/quotes?time=${timeFilter}`}
                active={
                  statusFilter === "all"
                }
              >
                All
              </FilterLink>

              <FilterLink
                href={`/portal/quotes?time=${timeFilter}&status=action`}
                active={
                  statusFilter === "action"
                }
              >
                Needs my attention
              </FilterLink>

              <FilterLink
                href={`/portal/quotes?time=${timeFilter}&status=review`}
                active={
                  statusFilter === "review"
                }
              >
                Under review
              </FilterLink>

              <FilterLink
                href={`/portal/quotes?time=${timeFilter}&status=payment`}
                active={
                  statusFilter === "payment"
                }
              >
                Awaiting payment
              </FilterLink>

              <FilterLink
                href={`/portal/quotes?time=${timeFilter}&status=production`}
                active={
                  statusFilter === "production"
                }
              >
                In production
              </FilterLink>

              <FilterLink
                href={`/portal/quotes?time=${timeFilter}&status=completed`}
                active={
                  statusFilter === "completed"
                }
              >
                Completed
              </FilterLink>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          RESULTS HEADER
      ===================================================== */}

      <div className="flex items-center justify-between gap-4">

        <div>

          <p className="text-sm font-bold text-slate-900">
            {filteredQuotes.length}{" "}
            {filteredQuotes.length === 1
              ? "quote"
              : "quotes"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Showing your selected results
          </p>

        </div>

        {(timeFilter !== "all" ||
          statusFilter !== "all") && (
          <Link
            href="/portal/quotes"
            className="text-sm font-bold text-green-600 transition hover:text-green-700"
          >
            Clear filters
          </Link>
        )}

      </div>


      {/* =====================================================
          QUOTE CARDS
      ===================================================== */}

      {filteredQuotes.length > 0 ? (

        <div className="space-y-5">

          {filteredQuotes.map(
            (quote) => {

              const quoteId =
                String(quote.id);

              const productName =
                quote.product ||
                "Custom Cup Project";

              const quantity =
                quote.quantity
                  ? Number(
                      quote.quantity
                    ).toLocaleString()
                  : "Not specified";

              const stage =
                getQuoteStage(
                  quote
                );

              const colors =
                getColorClasses(
                  stage.color
                );

              const amount =
                formatAmount(
                  quote.total_amount
                );

              return (
                <article
                  key={quote.id}
                  className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >

                  {/* CARD TOP */}

                  <div className="p-5 sm:p-7">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
                            Quote
                          </span>

                          <span className="font-mono text-xs font-bold text-slate-500">
                            #{quoteId}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${colors.badge}`}
                          >
                            <span
                              className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${colors.dot}`}
                            />
                            {stage.label}
                          </span>

                        </div>

                        <h2 className="mt-4 text-xl font-black text-slate-900 sm:text-2xl">
                          {productName}
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                          Submitted{" "}
                          {formatDate(
                            quote.created_at
                          )}
                        </p>

                      </div>


                      <div className="flex items-center justify-between gap-5 lg:flex-col lg:items-end">

                        {amount ? (
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                              Quotation
                            </p>

                            <p className="mt-1 text-xl font-black text-slate-900">
                              {amount}
                            </p>
                          </div>
                        ) : (
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                              Amount
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-400">
                              Not prepared
                            </p>
                          </div>
                        )}

                        <Link
                          href={`/portal/quotes/${quoteId}`}
                          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600"
                        >
                          View Details →
                        </Link>

                      </div>

                    </div>


                    {/* STATUS MESSAGE */}

                    <div
                      className={`mt-6 rounded-2xl border p-4 ${
                        stage.color ===
                        "green"
                          ? "border-green-100 bg-green-50"
                          : stage.color ===
                            "amber"
                          ? "border-amber-100 bg-amber-50"
                          : stage.color ===
                            "purple"
                          ? "border-purple-100 bg-purple-50"
                          : stage.color ===
                            "blue"
                          ? "border-blue-100 bg-blue-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >

                      <div className="flex gap-3">

                        <div
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`}
                        />

                        <div>

                          <p
                            className={`text-sm font-bold ${colors.text}`}
                          >
                            {stage.label}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {stage.description}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* PROGRESS */}

                    <div className="mt-7">

                      <div className="mb-3 flex items-center justify-between">

                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                          Progress
                        </span>

                        <span
                          className={`text-xs font-bold ${colors.text}`}
                        >
                          Step{" "}
                          {stage.step}{" "}
                          of 5
                        </span>

                      </div>


                      <div className="relative">

                        <div className="absolute left-0 right-0 top-3 h-1 rounded-full bg-slate-100" />

                        <div
                          className={`absolute left-0 top-3 h-1 rounded-full ${colors.line}`}
                          style={{
                            width: `${
                              ((stage.step -
                                1) /
                                4) *
                              100
                            }%`,
                          }}
                        />


                        <div className="relative grid grid-cols-5">

                          <ProgressStep
                            number="1"
                            label="Received"
                            active={
                              stage.step >=
                              1
                            }
                            complete={
                              stage.step >
                              1
                            }
                          />

                          <ProgressStep
                            number="2"
                            label="Review"
                            active={
                              stage.step >=
                              2
                            }
                            complete={
                              stage.step >
                              2
                            }
                          />

                          <ProgressStep
                            number="3"
                            label="Quotation"
                            active={
                              stage.step >=
                              3
                            }
                            complete={
                              stage.step >
                              3
                            }
                          />

                          <ProgressStep
                            number="4"
                            label="Payment"
                            active={
                              stage.step >=
                              4
                            }
                            complete={
                              stage.step >
                              4
                            }
                          />

                          <ProgressStep
                            number="5"
                            label="Production"
                            active={
                              stage.step >=
                              5
                            }
                            complete={
                              stage.key ===
                              "completed"
                            }
                          />

                        </div>

                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="mt-7 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4">

                      <Detail
                        label="Product"
                        value={
                          productName
                        }
                      />

                      <Detail
                        label="Quantity"
                        value={
                          quantity
                        }
                      />

                      <Detail
                        label="Artwork"
                        value={
                          quote.artwork_url
                            ? "Received"
                            : "Not uploaded"
                        }
                        positive={
                          !!quote.artwork_url
                        }
                      />

                      <Detail
                        label="Quotation"
                        value={
                          amount
                            ? amount
                            : "Pending"
                        }
                        positive={
                          !!amount
                        }
                      />

                    </div>

                  </div>


                  {/* ACTION BAR */}

                  {(
                    stage.key ===
                      "approval" ||
                    stage.key ===
                      "quotation" ||
                    stage.key ===
                      "payment"
                  ) && (

                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                      <div>

                        <p className="text-sm font-bold text-slate-900">
                          Action required
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Open this quote to continue.
                        </p>

                      </div>

                      <Link
                        href={`/portal/quotes/${quoteId}`}
                        className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                      >
                        Continue →
                      </Link>

                    </div>

                  )}

                </article>
              );
            }
          )}

        </div>

      ) : (

        /* =====================================================
           EMPTY FILTER RESULT
        ===================================================== */

        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
            🔎
          </div>

          <h3 className="mt-5 text-2xl font-black text-slate-900">
            No quotes found
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
            There are no quotes matching the filters
            you've selected. Try a different time period
            or status.
          </p>

          <Link
            href="/portal/quotes"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-600"
          >
            Show All Quotes
          </Link>

        </div>

      )}


      {/* =====================================================
          NEW QUOTE CTA
      ===================================================== */}

      <section className="overflow-hidden rounded-[28px] bg-slate-100 p-7 sm:p-9">

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Need something else?
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Start another project
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Submit another custom cup request and our team
              will prepare a quotation for you.
            </p>

          </div>

          <Link
            href="/custom-printing"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700"
          >
            Request a New Quote →
          </Link>

        </div>

      </section>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| SUMMARY CARD
|--------------------------------------------------------------------------
*/

function SummaryCard({
  label,
  value,
  description,
  highlight = false,
}: {
  label: string;
  value: number;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border bg-white p-5 shadow-sm ${
        highlight
          ? "border-amber-200"
          : "border-slate-200"
      }`}
    >

      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <div className="mt-3 flex items-end justify-between gap-4">

        <p className="text-3xl font-black text-slate-900">
          {value}
        </p>

        {highlight && value > 0 && (
          <span className="mb-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
        )}

      </div>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| FILTER LINK
|--------------------------------------------------------------------------
*/

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm"
          : "rounded-full bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-900"
      }
    >
      {children}
    </Link>
  );
}


/*
|--------------------------------------------------------------------------
| PROGRESS STEP
|--------------------------------------------------------------------------
*/

function ProgressStep({
  number,
  label,
  active,
  complete,
}: {
  number: string;
  label: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <div className="flex flex-col items-center">

      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black ring-4 ring-white ${
          complete
            ? "bg-green-600 text-white"
            : active
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {complete ? "✓" : number}
      </div>

      <p
        className={`mt-2 text-center text-[10px] font-bold sm:text-xs ${
          active
            ? "text-slate-900"
            : "text-slate-400"
        }`}
      >
        {label}
      </p>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| DETAIL
|--------------------------------------------------------------------------
*/

function Detail({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="min-w-0">

      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 truncate text-sm font-bold ${
          positive
            ? "text-green-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>

    </div>
  );
}