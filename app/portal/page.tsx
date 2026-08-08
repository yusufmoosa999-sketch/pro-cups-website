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
                            2
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
                            1
                        </p>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                            In Production
                        </span>

                    </div>

                </div>


                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                    <p className="text-sm font-bold uppercase tracking-[2px] text-slate-400">
                        Completed Orders
                    </p>

                    <div className="mt-4 flex items-end justify-between">

                        <p className="text-4xl font-black text-slate-900">
                            8
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
                            12
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
                                Order #PC-1028
                            </h2>

                        </div>

                        <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                            In Production
                        </span>

                    </div>


                    {/* PROGRESS */}

                    <div className="mt-10">

                        <div className="flex items-center justify-between text-sm font-bold text-slate-500">

                            <span>
                                Production Progress
                            </span>

                            <span className="text-green-600">
                                65%
                            </span>

                        </div>

                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">

                            <div className="h-full w-[65%] rounded-full bg-green-600" />

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

                        <div className="flex gap-4">

                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                ✓
                            </div>

                            <div>

                                <p className="font-bold text-slate-900">
                                    Artwork approved
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Order #PC-1028
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Today, 09:42
                                </p>

                            </div>

                        </div>


                        <div className="flex gap-4">

                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                ↑
                            </div>

                            <div>

                                <p className="font-bold text-slate-900">
                                    Artwork uploaded
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Coffee Cup Branding
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Yesterday, 14:20
                                </p>

                            </div>

                        </div>


                        <div className="flex gap-4">

                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                                R
                            </div>

                            <div>

                                <p className="font-bold text-slate-900">
                                    Quote received
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Quote #Q-2041
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    2 days ago
                                </p>

                            </div>

                        </div>

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

                        <tbody>

                            <tr className="border-b border-slate-100">

                                <td className="py-5 font-bold text-slate-900">
                                    #Q-2041
                                </td>

                                <td className="py-5 text-slate-600">
                                    Black Vertical Ripple
                                </td>

                                <td className="py-5 text-slate-500">
                                    07 Aug 2026
                                </td>

                                <td className="py-5">

                                    <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700">
                                        Under Review
                                    </span>

                                </td>

                            </tr>


                            <tr>

                                <td className="py-5 font-bold text-slate-900">
                                    #Q-2038
                                </td>

                                <td className="py-5 text-slate-600">
                                    Kraft Double Wall
                                </td>

                                <td className="py-5 text-slate-500">
                                    02 Aug 2026
                                </td>

                                <td className="py-5">

                                    <span className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-bold text-green-700">
                                        Approved
                                    </span>

                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}