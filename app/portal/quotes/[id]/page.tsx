import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuoteArtworkUploader from "@/components/QuoteArtworkUploader";

export default async function QuoteDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?redirect=/portal/quotes/${id}`);
    }

    const { data: quote, error } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("id", id)
        .eq("customer_id", user.id)
        .single();

    if (error || !quote) {
        notFound();
    }

    const quoteStatus = quote.status || "received";

    const statusSteps = [
        {
            key: "received",
            title: "Quote Received",
            description:
                "Your quotation request has been received by Pro Cups International.",
        },
        {
            key: "artwork_review",
            title: "Artwork Under Review",
            description:
                "Our design team is reviewing your artwork and checking that it is suitable for production.",
        },
        {
            key: "proof_ready",
            title: "Print Proof Ready",
            description:
                "Your professional print proof has been prepared and is ready for review.",
        },
        {
            key: "awaiting_approval",
            title: "Awaiting Your Approval",
            description:
                "Please review your print proof and approve the artwork or request changes.",
        },
        {
            key: "approved",
            title: "Artwork Approved",
            description:
                "Your artwork has been approved and your quotation can now be finalised.",
        },
        {
            key: "quoted",
            title: "Quotation Ready",
            description:
                "Your quotation is ready to review.",
        },
    ];

    const currentStatusIndex = Math.max(
        0,
        statusSteps.findIndex((step) => step.key === quoteStatus)
    );

    return (
        <div className="space-y-8">

            {/* BACK */}

            <Link
                href="/portal/quotes"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-green-600"
            >
                ← Back to My Quotes
            </Link>


            {/* HEADER */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">

                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">

                    <div>

                        <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
                            Quote Details
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">

                            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                                Quote #{id}
                            </h1>

                            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
                                Under Review
                            </span>

                        </div>

                        <p className="mt-3 text-lg font-semibold text-slate-700">
                            {quote.product || "Custom Cup Project"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Submitted{" "}
                            {quote.created_at
                                ? new Date(quote.created_at).toLocaleDateString("en-ZA", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })
                                : "Date unavailable"}
                        </p>

                    </div>

                    <div className="rounded-2xl bg-slate-50 px-6 py-4">

                        <p className="text-xs font-bold uppercase tracking-[2px] text-slate-400">
                            Quantity
                        </p>

                        <p className="mt-1 text-2xl font-black text-slate-900">
                            {quote.quantity
                                ? `${Number(quote.quantity).toLocaleString()} cups`
                                : "Quantity not specified"}
                        </p>

                    </div>

                </div>

            </div>


            {/* TIMELINE */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">

                <div>

                    <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
                        Progress
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                        Quote Timeline
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Follow your quotation from artwork submission through to approval.
                    </p>

                </div>


                <div className="mt-10 space-y-0">

                    {statusSteps.map((step, index) => {

                        const isCompleted = index < currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        const isFuture = index > currentStatusIndex;

                        return (

                            <div
                                key={step.key}
                                className="relative flex gap-4 sm:gap-5"
                            >

                                {/* ICON + LINE */}

                                <div className="flex w-11 shrink-0 flex-col items-center">

                                    <div
                                        className={[
                                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold transition",
                                            isCompleted || isCurrent
                                                ? "bg-green-600 text-white"
                                                : "bg-slate-100 text-slate-400",
                                        ].join(" ")}
                                    >
                                        {isCompleted ? "✓" : index + 1}
                                    </div>

                                    {index < statusSteps.length - 1 && (
                                        <div
                                            className={[
                                                "min-h-20 w-1",
                                                isCompleted
                                                    ? "bg-green-600"
                                                    : "bg-slate-200",
                                            ].join(" ")}
                                        />
                                    )}

                                </div>


                                {/* CONTENT */}

                                <div className="min-w-0 pb-10">

                                    <p
                                        className={[
                                            "text-lg font-black",
                                            isFuture
                                                ? "text-slate-400"
                                                : "text-slate-900",
                                        ].join(" ")}
                                    >
                                        {step.title}
                                    </p>

                                    <p
                                        className={[
                                            "mt-1 max-w-2xl text-sm leading-6",
                                            isFuture
                                                ? "text-slate-400"
                                                : "text-slate-500",
                                        ].join(" ")}
                                    >
                                        {step.description}
                                    </p>

                                    {isCurrent && (
                                        <p className="mt-2 text-sm font-bold text-green-600">
                                            Currently in progress
                                        </p>
                                    )}

                                    {isCompleted && (
                                        <p className="mt-2 text-xs font-semibold text-slate-400">
                                            Completed
                                        </p>
                                    )}

                                    {isCurrent && quote.status_updated_at && (
                                        <p className="mt-2 text-xs font-semibold text-slate-400">
                                            Updated{" "}
                                            {new Date(quote.status_updated_at).toLocaleString("en-ZA", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    )}

                                </div>

                            </div>

                        );

                    })}

                </div>

            </div>

            {/* PROJECT DETAILS */}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">

                    <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
                        Project Details
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                        Your Requirements
                    </h2>

                    <div className="mt-7 space-y-5">

                        <div className="flex justify-between gap-6 border-b border-slate-100 pb-4">

                            <span className="text-slate-500">
                                Product
                            </span>

                            <span className="text-right font-bold text-slate-900">
                                {quote.product || "Custom Cup Project"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-6 border-b border-slate-100 pb-4">

                            <span className="text-slate-500">
                                Quantity
                            </span>

                            <span className="font-bold text-slate-900">
                                {quote.quantity
                                    ? Number(quote.quantity).toLocaleString()
                                    : "Not specified"}
                            </span>

                        </div>

                        <div className="flex justify-between gap-6 border-b border-slate-100 pb-4">

                            <span className="text-slate-500">
                                Artwork
                            </span>

                            <span className="font-bold text-green-600">
                                {quote.artwork_url ? "Received" : "Not uploaded"}
                            </span>

                        </div>

                        <div className="flex justify-between gap-6">

                            <span className="text-slate-500">
                                Quote
                            </span>

                            <span className="font-bold text-amber-600">
                                Being Prepared
                            </span>

                        </div>

                    </div>

                </div>


                {/* ARTWORK */}

                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">

                    <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
                        Artwork
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                        Submitted Artwork
                    </h2>

                    <QuoteArtworkUploader
                        quoteId={String(quote.id)}
                        existingArtworkPath={quote.artwork_path}
                    />

                </div>
            </div>




            {/* HELP */}

            <div className="rounded-3xl bg-[#0b1120] p-7 text-white md:p-8">

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div>

                        <p className="text-lg font-black">
                            Need to make a change?
                        </p>

                        <p className="mt-1 text-slate-400">
                            Contact our team if you need to update your quotation requirements.
                        </p>

                    </div>

                    <Link
                        href="/contact"
                        className="inline-flex w-fit rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-500"
                    >
                        Contact Pro Cups
                    </Link>

                </div>

            </div>

        </div>
    );
}