import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

    const outstandingQuotes = customerQuotes.filter(
        (quote) =>
            !["Completed", "Cancelled"].includes(quote.status)
    );

    const artworkFiles = customerQuotes.filter(
        (quote) =>
            !!quote.artwork_path || !!quote.artwork_url
    );

    const recentQuotes = customerQuotes.slice(0, 2);

    // Quotes that have effectively become orders
    const activeOrders = customerQuotes.filter((quote) =>
        ["Approved", "In Production", "Ready"].includes(quote.status)
    );

    // Completed orders
    const completedOrders = customerQuotes.filter(
        (quote) => quote.status === "Completed"
    );

    // Latest active order
    const currentOrder = activeOrders[0] || null;



    const activityItems = customerQuotes
        .flatMap((quote) => {
            const activities = [];

            // Quote received
            activities.push({
                type: "quote",
                title: "Quote received",
                description: quote.product || "Quote request",
                date: new Date(quote.created_at),
            });

            // Artwork uploaded
            if (quote.artwork_path || quote.artwork_url) {
                activities.push({
                    type: "artwork",
                    title: "Artwork uploaded",
                    description: quote.product || "Artwork",
                    date: new Date(quote.created_at),
                });
            }

            // Print proof approved
            if (
                quote.customer_approval_status === "approved" &&
                quote.customer_approved_at
            ) {
                activities.push({
                    type: "approved",
                    title: "Print proof approved",
                    description: quote.product || "Quote",
                    date: new Date(quote.customer_approved_at),
                });
            }

            return activities;
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 3);

    const currentOrderProgress =
        currentOrder?.status === "Approved"
            ? 25
            : currentOrder?.status === "In Production"
                ? 65
                : currentOrder?.status === "Ready"
                    ? 90
                    : currentOrder?.status === "Completed"
                        ? 100
                        : 0;

    return (
        <div className="space-y-10">

            {/* HEADER */}

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                <div>

                    <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
                        Customer Portal
                    </p>

                    <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                        Welcome back, {contactName}
                    </h1>

                    <p className="mt-3 text-lg text-slate-500">
                        Here's an overview of your quotes, orders and artwork.
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-400">
                        {companyName}
                    </p>

                </div>

                <Link
                    href="/custom-printing"
                    className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
                >
                    + Request a Quote
                </Link>

            </div>


            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                    <p className="text-sm font-bold uppercase tracking-[2px] text-slate-400">
                        Outstanding Quotes
                    </p>

                    <div className="mt-4 flex items-end justify-between">

                        <p className="text-4xl font-black text-slate-900">
                            {outstandingQuotes.length}
                        </p>

                        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                            Awaiting
                        </span>

                    </div>

                </div>


                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                    <p className="text-sm font-bold uppercase tracking-[2px] text-slate-400">
                        Active Orders
                    </p>

                    <div className="mt-4 flex items-end justify-between">

                        <p className="text-4xl font-black text-slate-900">
                            {activeOrders.length}
                        </p>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                            {currentOrder?.status || "None"}
                        </span>

                    </div>

                </div>


                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                    <p className="text-sm font-bold uppercase tracking-[2px] text-slate-400">
                        Completed Orders
                    </p>

                    <div className="mt-4 flex items-end justify-between">

                        <p className="text-4xl font-black text-slate-900">
                            {completedOrders.length}
                        </p>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                            All Time
                        </span>

                    </div>

                </div>


                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                    <p className="text-sm font-bold uppercase tracking-[2px] text-slate-400">
                        Artwork Files
                    </p>

                    <div className="mt-4 flex items-end justify-between">

                        <p className="text-4xl font-black text-slate-900">
                            {artworkFiles.length}
                        </p>

                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                            Saved
                        </span>

                    </div>

                </div>

            </div>


            {/* CURRENT ORDER */}

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm xl:col-span-2">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-[2px] text-green-600">
                                Current Order
                            </p>

                            <h2 className="mt-2 text-2xl font-black text-slate-900">
                                {currentOrder
                                    ? `Order from Quote #${currentOrder.id.slice(0, 8).toUpperCase()}`
                                    : "No Active Order"}
                            </h2>

                        </div>

                        <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                            {currentOrder?.status || "No Active Order"}
                        </span>

                    </div>


                    {/* PROGRESS */}

                    <div className="mt-10">

                        <div className="flex items-center justify-between text-sm font-bold text-slate-500">

                            <span>
                                Production Progress
                            </span>

                            <span className="text-green-600">
                                {currentOrderProgress}%
                            </span>

                        </div>

                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">

                            <div
                                className="h-full rounded-full bg-green-600 transition-all duration-500"
                                style={{ width: `${currentOrderProgress}%` }}
                            />

                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">

                        <div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                                ✓
                            </div>

                            <p className="mt-3 text-sm font-bold text-slate-900">
                                Order Confirmed
                            </p>

                        </div>


                        <div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                                ✓
                            </div>

                            <p className="mt-3 text-sm font-bold text-slate-900">
                                Materials Ready
                            </p>

                        </div>


                        <div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
                                3
                            </div>

                            <p className="mt-3 text-sm font-bold text-slate-900">
                                Production
                            </p>

                        </div>


                        <div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                4
                            </div>

                            <p className="mt-3 text-sm font-bold text-slate-400">
                                Ready
                            </p>

                        </div>

                    </div>


                    <div className="mt-10 border-t border-slate-100 pt-6">

                        <Link
                            href="/portal/orders"
                            className="font-bold text-green-600 transition hover:text-green-700"
                        >
                            View full order tracking →
                        </Link>

                    </div>

                </div>


                {/* RECENT ACTIVITY */}

                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

                    <div className="flex items-center justify-between">

                        <h2 className="text-2xl font-black text-slate-900">
                            Recent Activity
                        </h2>

                    </div>


                    <div className="mt-8 space-y-7">

                        {activityItems.length > 0 ? (
                            activityItems.map((activity, index) => (
                                <div
                                    key={`${activity.title}-${activity.date.getTime()}-${index}`}
                                    className="flex gap-4"
                                >
                                    <div
                                        className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${activity.type === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : activity.type === "artwork"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {activity.type === "approved"
                                            ? "✓"
                                            : activity.type === "artwork"
                                                ? "↑"
                                                : "R"}
                                    </div>

                                    <div>
                                        <p className="font-bold text-slate-900">
                                            {activity.title}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {activity.description}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {activity.date.toLocaleString("en-ZA", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">
                                No recent activity yet.
                            </p>
                        )}

                    </div>

                </div>

            </div>






            {/* QUOTES */}

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                        <p className="text-sm font-bold uppercase tracking-[2px] text-green-600">
                            Latest Quotes
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-slate-900">
                            Your Recent Quotes
                        </h2>

                    </div>

                    <Link
                        href="/portal/quotes"
                        className="font-bold text-green-600 hover:text-green-700"
                    >
                        View all quotes →
                    </Link>

                </div>


                <div className="mt-8 overflow-x-auto">

                    <table className="w-full min-w-[650px] text-left">

                        <thead>

                            <tr className="border-b border-slate-100 text-sm text-slate-400">

                                <th className="pb-4 font-bold">
                                    Quote
                                </th>

                                <th className="pb-4 font-bold">
                                    Product
                                </th>

                                <th className="pb-4 font-bold">
                                    Date
                                </th>

                                <th className="pb-4 font-bold">
                                    Status
                                </th>

                            </tr>

                        </thead>

                        {recentQuotes.map((quote) => (
                            <tr
                                key={quote.id}
                                className="border-b border-slate-100"
                            >
                                <td className="py-5">
                                    <Link
                                        href={`/portal/quotes/${quote.id}`}
                                        className="font-bold text-slate-900 hover:text-green-600"
                                    >
                                        #{quote.id.slice(0, 8).toUpperCase()}
                                    </Link>
                                </td>

                                <td className="py-5 text-slate-600">
                                    {quote.product || "-"}
                                </td>

                                <td className="py-5 text-slate-500">
                                    {new Date(quote.created_at).toLocaleDateString(
                                        "en-ZA",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </td>

                                <td className="py-5">
                                    <span
                                        className={`rounded-full px-3 py-1.5 text-sm font-bold ${quote.status === "Approved"
                                            ? "bg-green-100 text-green-700"
                                            : quote.status === "Completed"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : quote.status === "Cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {quote.status || "New"}
                                    </span>
                                </td>
                            </tr>
                        ))}

                    </table>

                </div>

            </div>

        </div>
    );
}