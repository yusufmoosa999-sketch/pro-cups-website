import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getQuoteStage(quote: any) {
    if (quote.status === "Completed") {
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
                "Your project has been paid and is currently being manufactured.",
            color: "blue",
            step: 4,
        };
    }

    if (quote.customer_quote_status === "accepted") {
        return {
            key: "payment",
            label: "Awaiting Payment",
            description:
                "Your quotation has been accepted. Payment is required before production can begin.",
            color: "amber",
            step: 3,
        };
    }

    if (
        quote.customer_approval_status === "approved" &&
        quote.customer_quote_status !== "accepted"
    ) {
        return {
            key: "quotation",
            label: "Quotation Ready",
            description:
                "Your quotation is ready for you to review.",
            color: "purple",
            step: 3,
        };
    }

    if (
        quote.customer_approval_status &&
        quote.customer_approval_status !== "approved"
    ) {
        return {
            key: "approval",
            label: "Awaiting Your Approval",
            description:
                "Please review and approve your print proof to continue.",
            color: "amber",
            step: 2,
        };
    }

    return {
        key: "received",
        label: "Quote Received",
        description:
            "We've received your request and our team is reviewing it.",
        color: "slate",
        step: 1,
    };
}

function getStatusClasses(color: string) {
    switch (color) {
        case "green":
            return {
                badge: "bg-green-50 text-green-700 ring-green-200",
                dot: "bg-green-500",
                text: "text-green-700",
            };

        case "blue":
            return {
                badge: "bg-blue-50 text-blue-700 ring-blue-200",
                dot: "bg-blue-500",
                text: "text-blue-700",
            };

        case "amber":
            return {
                badge: "bg-amber-50 text-amber-700 ring-amber-200",
                dot: "bg-amber-500",
                text: "text-amber-700",
            };

        case "purple":
            return {
                badge: "bg-purple-50 text-purple-700 ring-purple-200",
                dot: "bg-purple-500",
                text: "text-purple-700",
            };

        default:
            return {
                badge: "bg-slate-100 text-slate-700 ring-slate-200",
                dot: "bg-slate-400",
                text: "text-slate-700",
            };
    }
}

function formatDate(date: string | null) {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default async function PortalDashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const contactName =
        user.user_metadata?.contact_name ||
        user.email?.split("@")[0] ||
        "Customer";

    const companyName =
        user.user_metadata?.company_name ||
        "Your Company";

    const { data: quotes } = await supabase
        .from("quote_requests")
        .select(`
            id,
            created_at,
            product,
            quantity,
            status,
            artwork_path,
            artwork_url,
            customer_approval_status,
            customer_approved_at,
            customer_quote_status,
            customer_quote_accepted_at
        `)
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

    const customerQuotes = quotes || [];

    /*
    |--------------------------------------------------------------------------
    | SUMMARY
    |--------------------------------------------------------------------------
    */

    const activeQuotes = customerQuotes.filter(
        (quote) =>
            !["Completed", "Cancelled"].includes(
                quote.status
            )
    );

    const needsAttention = customerQuotes.filter(
        (quote) => {
            const stage = getQuoteStage(quote);

            return [
                "approval",
                "quotation",
                "payment",
            ].includes(stage.key);
        }
    );

    const productionQuotes = customerQuotes.filter(
        (quote) =>
            quote.status === "In Production" ||
            quote.status === "Production"
    );

    const completedQuotes = customerQuotes.filter(
        (quote) => quote.status === "Completed"
    );

    const artworkFiles = customerQuotes.filter(
        (quote) =>
            !!quote.artwork_path ||
            !!quote.artwork_url
    );

    const currentProject =
        activeQuotes[0] || null;

    const currentStage = currentProject
        ? getQuoteStage(currentProject)
        : null;

    const currentColors = currentStage
        ? getStatusClasses(
              currentStage.color
          )
        : null;

    /*
    |--------------------------------------------------------------------------
    | RECENT ACTIVITY
    |--------------------------------------------------------------------------
    */

    const activityItems = customerQuotes
        .flatMap((quote) => {
            const activities: {
                type: string;
                title: string;
                description: string;
                date: Date;
            }[] = [];

            activities.push({
                type: "quote",
                title: "Quote received",
                description:
                    quote.product ||
                    "Quote request",
                date: new Date(
                    quote.created_at
                ),
            });

            if (
                quote.artwork_path ||
                quote.artwork_url
            ) {
                activities.push({
                    type: "artwork",
                    title: "Artwork uploaded",
                    description:
                        quote.product ||
                        "Artwork",
                    date: new Date(
                        quote.created_at
                    ),
                });
            }

            if (
                quote.customer_approval_status ===
                    "approved" &&
                quote.customer_approved_at
            ) {
                activities.push({
                    type: "approved",
                    title: "Print proof approved",
                    description:
                        quote.product ||
                        "Quote",
                    date: new Date(
                        quote.customer_approved_at
                    ),
                });
            }

            if (
                quote.customer_quote_status ===
                    "accepted" &&
                quote.customer_quote_accepted_at
            ) {
                activities.push({
                    type: "accepted",
                    title: "Quotation accepted",
                    description:
                        quote.product ||
                        "Quote",
                    date: new Date(
                        quote.customer_quote_accepted_at
                    ),
                });
            }

            return activities;
        })
        .sort(
            (a, b) =>
                b.date.getTime() -
                a.date.getTime()
        )
        .slice(0, 4);

    /*
    |--------------------------------------------------------------------------
    | PRODUCTION PROGRESS
    |--------------------------------------------------------------------------
    */

    let progress = 0;

    if (currentProject) {
        if (
            currentProject.status ===
            "Completed"
        ) {
            progress = 100;
        } else if (
            currentProject.status ===
            "Ready"
        ) {
            progress = 90;
        } else if (
            currentProject.status ===
            "In Production"
        ) {
            progress = 65;
        } else if (
            currentProject.status ===
            "Approved"
        ) {
            progress = 25;
        }
    }

    return (
        <div className="space-y-8">

            {/* =====================================================
                WELCOME
            ===================================================== */}

            <section className="relative overflow-hidden rounded-[32px] bg-[#07111f] px-6 py-8 text-white shadow-xl sm:px-8 sm:py-10 lg:px-10">

                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-green-600/10 blur-3xl" />

                <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

                    <div className="max-w-2xl">

                        <span className="inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                            Customer Portal
                        </span>

                        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                            Welcome back,{" "}
                            {contactName}
                        </h1>

                        <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
                            Here's what's happening
                            with your Pro Cups
                            projects.
                        </p>

                        <p className="mt-2 text-sm font-semibold text-slate-500">
                            {companyName}
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
                ACTION REQUIRED
            ===================================================== */}

            {needsAttention.length > 0 && (
                <section className="overflow-hidden rounded-[28px] border border-amber-200 bg-amber-50">

                    <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                                !
                            </div>

                            <div>

                                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
                                    Action required
                                </p>

                                <h2 className="mt-1 text-lg font-black text-slate-900">
                                    You have{" "}
                                    {
                                        needsAttention.length
                                    }{" "}
                                    {needsAttention.length ===
                                    1
                                        ? "quote"
                                        : "quotes"}{" "}
                                    waiting for you
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Review your quotes
                                    and complete any
                                    outstanding steps.
                                </p>

                            </div>

                        </div>

                        <Link
                            href="/portal/quotes?status=action"
                            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-3 font-bold text-white transition hover:bg-amber-600"
                        >
                            Review Now →
                        </Link>

                    </div>

                </section>
            )}


            {/* =====================================================
                SUMMARY CARDS
            ===================================================== */}

            <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">

                <SummaryCard
                    label="Active Quotes"
                    value={activeQuotes.length}
                    description="Projects in progress"
                    href="/portal/quotes"
                    icon="Q"
                />

                <SummaryCard
                    label="Needs Attention"
                    value={needsAttention.length}
                    description="Waiting for you"
                    href="/portal/quotes?status=action"
                    icon="!"
                    highlight={
                        needsAttention.length >
                        0
                    }
                />

                <SummaryCard
                    label="In Production"
                    value={productionQuotes.length}
                    description="Currently being made"
                    href="/portal/orders"
                    icon="P"
                />

                <SummaryCard
                    label="Completed"
                    value={completedQuotes.length}
                    description="Finished projects"
                    href="/portal/orders"
                    icon="✓"
                />

            </section>


            {/* =====================================================
                CURRENT PROJECT
            ===================================================== */}

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm xl:col-span-2">

                    <div className="border-b border-slate-100 p-6 sm:p-8">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                                <p className="text-xs font-black uppercase tracking-[0.18em] text-green-600">
                                    Current Project
                                </p>

                                <h2 className="mt-2 text-2xl font-black text-slate-900">
                                    {currentProject
                                        ? currentProject.product ||
                                          "Custom Cup Project"
                                        : "No active project"}
                                </h2>

                                {currentProject && (
                                    <p className="mt-2 text-sm text-slate-500">
                                        Quote #
                                        {currentProject.id
                                            .slice(
                                                0,
                                                8
                                            )
                                            .toUpperCase()}
                                        {" • "}
                                        {formatDate(
                                            currentProject.created_at
                                        )}
                                    </p>
                                )}

                            </div>

                            {currentStage &&
                                currentColors && (
                                    <span
                                        className={`w-fit rounded-full px-4 py-2 text-sm font-bold ring-1 ${currentColors.badge}`}
                                    >
                                        <span
                                            className={`mr-2 inline-block h-2 w-2 rounded-full ${currentColors.dot}`}
                                        />
                                        {
                                            currentStage.label
                                        }
                                    </span>
                                )}

                        </div>

                    </div>


                    {currentProject &&
                    currentStage ? (
                        <div className="p-6 sm:p-8">

                            <div
                                className={`rounded-2xl border p-5 ${
                                    currentStage.color ===
                                    "amber"
                                        ? "border-amber-100 bg-amber-50"
                                        : currentStage.color ===
                                          "green"
                                        ? "border-green-100 bg-green-50"
                                        : currentStage.color ===
                                          "blue"
                                        ? "border-blue-100 bg-blue-50"
                                        : "border-slate-200 bg-slate-50"
                                }`}
                            >

                                <p
                                    className={`font-bold ${currentColors?.text}`}
                                >
                                    {
                                        currentStage.label
                                    }
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {
                                        currentStage.description
                                    }
                                </p>

                            </div>


                            {/* PROGRESS */}

                            <div className="mt-8">

                                <div className="flex items-center justify-between">

                                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                                        Project Progress
                                    </p>

                                    <p className="text-sm font-black text-green-600">
                                        {progress}%
                                    </p>

                                </div>

                                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className="h-full rounded-full bg-green-500 transition-all duration-700"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />

                                </div>


                                <div className="mt-5 grid grid-cols-4 gap-2">

                                    <ProgressItem
                                        label="Quote"
                                        active
                                        complete={
                                            currentStage.step >
                                            1
                                        }
                                    />

                                    <ProgressItem
                                        label="Review"
                                        active={
                                            currentStage.step >=
                                            2
                                        }
                                        complete={
                                            currentStage.step >
                                            2
                                        }
                                    />

                                    <ProgressItem
                                        label="Payment"
                                        active={
                                            currentStage.step >=
                                            3
                                        }
                                        complete={
                                            currentStage.step >
                                            3
                                        }
                                    />

                                    <ProgressItem
                                        label="Production"
                                        active={
                                            currentStage.step >=
                                            4
                                        }
                                        complete={
                                            currentStage.step >
                                            4
                                        }
                                    />

                                </div>

                            </div>


                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                                <Link
                                    href={`/portal/quotes/${currentProject.id}`}
                                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-600"
                                >
                                    View Project →
                                </Link>

                                <Link
                                    href="/portal/quotes"
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                >
                                    All Quotes
                                </Link>

                            </div>

                        </div>
                    ) : (
                        <div className="p-8 text-center sm:p-12">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                                +
                            </div>

                            <h3 className="mt-5 text-xl font-black text-slate-900">
                                Ready to start a project?
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Request a quotation and
                                we'll help you get your
                                custom cups underway.
                            </p>

                            <Link
                                href="/custom-printing"
                                className="mt-6 inline-flex rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white transition hover:bg-green-700"
                            >
                                Request a Quote
                            </Link>

                        </div>
                    )}

                </div>


                {/* QUICK ACTIONS */}

                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                    <p className="text-xs font-black uppercase tracking-[0.18em] text-green-600">
                        Quick Actions
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                        What would you like to do?
                    </h2>

                    <div className="mt-6 space-y-3">

                        <QuickAction
                            href="/custom-printing"
                            icon="+"
                            title="Request a Quote"
                            description="Start a new project"
                        />

                        <QuickAction
                            href="/portal/quotes"
                            icon="Q"
                            title="View My Quotes"
                            description={`${activeQuotes.length} active ${
                                activeQuotes.length ===
                                1
                                    ? "quote"
                                    : "quotes"
                            }`}
                        />

                        <QuickAction
                            href="/portal/artwork"
                            icon="↑"
                            title="Artwork"
                            description={`${artworkFiles.length} ${
                                artworkFiles.length ===
                                1
                                    ? "file"
                                    : "files"
                            } uploaded`}
                        />

                        <QuickAction
                            href="/portal/invoices"
                            icon="R"
                            title="Invoices"
                            description="View your invoices"
                        />

                    </div>

                </div>

            </section>


            {/* =====================================================
                RECENT ACTIVITY
            ===================================================== */}

            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

                    <div>

                        <p className="text-xs font-black uppercase tracking-[0.18em] text-green-600">
                            Activity
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-slate-900">
                            Recent Activity
                        </h2>

                    </div>

                    <Link
                        href="/portal/quotes"
                        className="text-sm font-bold text-green-600 hover:text-green-700"
                    >
                        View all quotes →
                    </Link>

                </div>


                {activityItems.length > 0 ? (
                    <div className="mt-8 grid gap-4 md:grid-cols-2">

                        {activityItems.map(
                            (
                                activity,
                                index
                            ) => (
                                <div
                                    key={`${activity.title}-${activity.date.getTime()}-${index}`}
                                    className="flex gap-4 rounded-2xl bg-slate-50 p-4"
                                >

                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                                            activity.type ===
                                            "approved"
                                                ? "bg-green-100 text-green-700"
                                                : activity.type ===
                                                  "artwork"
                                                ? "bg-blue-100 text-blue-700"
                                                : activity.type ===
                                                  "accepted"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {activity.type ===
                                        "approved"
                                            ? "✓"
                                            : activity.type ===
                                              "artwork"
                                            ? "↑"
                                            : activity.type ===
                                              "accepted"
                                            ? "✓"
                                            : "Q"}
                                    </div>

                                    <div className="min-w-0">

                                        <p className="font-bold text-slate-900">
                                            {
                                                activity.title
                                            }
                                        </p>

                                        <p className="mt-1 truncate text-sm text-slate-500">
                                            {
                                                activity.description
                                            }
                                        </p>

                                        <p className="mt-2 text-xs font-semibold text-slate-400">
                                            {activity.date.toLocaleString(
                                                "en-ZA",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </p>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                ) : (
                    <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">

                        <p className="text-sm font-semibold text-slate-500">
                            No recent activity yet.
                        </p>

                    </div>
                )}

            </section>


            {/* =====================================================
                RECENT QUOTES
            ===================================================== */}

            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                    <div>

                        <p className="text-xs font-black uppercase tracking-[0.18em] text-green-600">
                            Your Projects
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-slate-900">
                            Recent Quotes
                        </h2>

                    </div>

                    <Link
                        href="/portal/quotes"
                        className="text-sm font-bold text-green-600 hover:text-green-700"
                    >
                        View all quotes →
                    </Link>

                </div>


                <div className="mt-7 grid gap-4 lg:grid-cols-2">

                    {customerQuotes
                        .slice(0, 4)
                        .map((quote) => {

                            const stage =
                                getQuoteStage(
                                    quote
                                );

                            const colors =
                                getStatusClasses(
                                    stage.color
                                );

                            return (
                                <Link
                                    key={quote.id}
                                    href={`/portal/quotes/${quote.id}`}
                                    className="group rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div className="min-w-0">

                                            <p className="font-mono text-xs font-bold text-slate-400">
                                                #
                                                {quote.id
                                                    .slice(
                                                        0,
                                                        8
                                                    )
                                                    .toUpperCase()}
                                            </p>

                                            <h3 className="mt-2 truncate font-black text-slate-900 group-hover:text-green-600">
                                                {quote.product ||
                                                    "Custom Cup Project"}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {formatDate(
                                                    quote.created_at
                                                )}
                                            </p>

                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${colors.badge}`}
                                        >
                                            {
                                                stage.label
                                            }
                                        </span>

                                    </div>

                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                                        <span className="text-sm font-semibold text-slate-500">
                                            {quote.quantity
                                                ? `${Number(
                                                      quote.quantity
                                                  ).toLocaleString()} cups`
                                                : "Quantity not specified"}
                                        </span>

                                        <span className="text-sm font-bold text-slate-900 transition group-hover:text-green-600">
                                            View →
                                        </span>

                                    </div>

                                </Link>
                            );
                        })}

                </div>


                {customerQuotes.length ===
                    0 && (
                    <div className="mt-6 rounded-2xl bg-slate-50 p-10 text-center">

                        <h3 className="text-lg font-black text-slate-900">
                            No quotes yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Your quotation requests will
                            appear here.
                        </p>

                        <Link
                            href="/custom-printing"
                            className="mt-5 inline-flex rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
                        >
                            Request Your First Quote
                        </Link>

                    </div>
                )}

            </section>


            {/* =====================================================
                BOTTOM CTA
            ===================================================== */}

            <section className="rounded-[30px] bg-slate-100 p-7 sm:p-9">

                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                    <div>

                        <p className="text-xs font-black uppercase tracking-[0.18em] text-green-600">
                            Need more cups?
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-slate-900">
                            Start another project
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Get a quotation for your next
                            custom printed cup project.
                        </p>

                    </div>

                    <Link
                        href="/custom-printing"
                        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white transition hover:bg-green-700"
                    >
                        Request a Quote →
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
    href,
    icon,
    highlight = false,
}: {
    label: string;
    value: number;
    description: string;
    href: string;
    icon: string;
    highlight?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`group rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${
                highlight
                    ? "border-amber-200"
                    : "border-slate-200"
            }`}
        >

            <div className="flex items-start justify-between gap-3">

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black ${
                        highlight
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                    }`}
                >
                    {icon}
                </div>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-green-500">
                    →
                </span>

            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {description}
            </p>

        </Link>
    );
}


/*
|--------------------------------------------------------------------------
| QUICK ACTION
|--------------------------------------------------------------------------
*/

function QuickAction({
    href,
    icon,
    title,
    description,
}: {
    href: string;
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-green-200 hover:bg-green-50/50"
        >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-700 transition group-hover:bg-green-100 group-hover:text-green-700">
                {icon}
            </div>

            <div className="min-w-0 flex-1">

                <p className="font-bold text-slate-900">
                    {title}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                    {description}
                </p>

            </div>

            <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-green-600">
                →
            </span>

        </Link>
    );
}


/*
|--------------------------------------------------------------------------
| PROGRESS ITEM
|--------------------------------------------------------------------------
*/

function ProgressItem({
    label,
    active,
    complete,
}: {
    label: string;
    active: boolean;
    complete: boolean;
}) {
    return (
        <div className="text-center">

            <div
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                    complete
                        ? "bg-green-600 text-white"
                        : active
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-400"
                }`}
            >
                {complete
                    ? "✓"
                    : active
                    ? "•"
                    : ""}
            </div>

            <p
                className={`mt-2 text-[10px] font-bold sm:text-xs ${
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