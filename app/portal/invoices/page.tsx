"use client";

import { useEffect, useState } from "react";

type Invoice = {
    id: string;
    customer_id: string;
    quote_id: string | null;
    invoice_number: string;
    amount: number;
    due_date: string | null;
    invoice_file_path: string | null;
    file_url: string | null;
    status: string | null;
    created_at: string;
};

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [payingInvoiceId, setPayingInvoiceId] =
        useState<string | null>(null);

    useEffect(() => {
        async function loadInvoices() {
            try {
                const response = await fetch(
                    "/api/invoices"
                );

                const result = await response.json();

                if (response.status === 401) {
                    window.location.href =
                        "/login?redirect=/portal/invoices";
                    return;
                }

                if (!response.ok) {
                    setError(
                        result.error ||
                        "Could not load your invoices."
                    );
                    return;
                }

                setInvoices(result.invoices || []);
            } catch (error) {
                console.error(error);

                setError(
                    "Could not load your invoices."
                );
            } finally {
                setLoading(false);
            }
        }

        loadInvoices();
    }, []);

    function formatDate(
        date: string | null
    ) {
        if (!date) {
            return "Not specified";
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

    function formatAmount(amount: number) {
        return new Intl.NumberFormat(
            "en-ZA",
            {
                style: "currency",
                currency: "ZAR",
            }
        ).format(amount);
    }

    function getStatusClasses(
        status: string | null
    ) {
        switch (
        status?.toLowerCase()
        ) {
            case "paid":
                return "bg-green-100 text-green-800";

            case "payment pending":
                return "bg-yellow-100 text-yellow-800";

            case "overdue":
                return "bg-red-100 text-red-800";

            default:
                return "bg-slate-100 text-slate-700";
        }
    }
    async function payInvoice(invoiceId: string) {
        setError("");
        setPayingInvoiceId(invoiceId);

        try {
            const response = await fetch(
                `/api/invoices/${invoiceId}/pay`,
                {
                    method: "POST",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error ||
                    "Could not start the payment."
                );
                return;
            }

            const form =
                document.createElement("form");

            form.method = "POST";
            form.action = result.paymentUrl;

            Object.entries(result.fields).forEach(
                ([name, value]) => {
                    const input =
                        document.createElement("input");

                    input.type = "hidden";
                    input.name = name;
                    input.value = String(value);

                    form.appendChild(input);
                }
            );

            document.body.appendChild(form);

            form.submit();
        } catch (error) {
            console.error(error);

            setError(
                "We couldn't start the payment. Please try again."
            );
        } finally {
            setPayingInvoiceId(null);
        }
    }
    return (
        <div>

            {/* Header */}

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-xs font-black uppercase tracking-[4px] text-green-700">
                        Customer Portal
                    </p>

                    <h1 className="mt-3 text-4xl font-black text-slate-950">
                        Invoices
                    </h1>

                    <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
                        View your invoices, download invoice documents
                        and make payments online.
                    </p>

                </div>

            </div>


            {/* Loading */}

            {loading && (
                <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-green-600" />

                    <p className="mt-5 font-bold text-slate-700">
                        Loading your invoices...
                    </p>

                </div>
            )}


            {/* Error */}

            {!loading && error && (
                <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-700">
                    {error}
                </div>
            )}


            {/* No invoices */}

            {!loading &&
                !error &&
                invoices.length === 0 && (
                    <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
                            📄
                        </div>

                        <h2 className="mt-5 text-2xl font-black text-slate-950">
                            No invoices yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
                            Once an invoice has been issued for your
                            account, it will appear here.
                        </p>

                    </div>
                )}


            {/* Invoice List */}

            {!loading &&
                !error &&
                invoices.length > 0 && (
                    <div className="mt-10 space-y-5">

                        {invoices.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
                            >

                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                    {/* Invoice information */}

                                    <div className="min-w-0">

                                        <div className="flex flex-wrap items-center gap-3">

                                            <h2 className="text-2xl font-black text-slate-950">
                                                {invoice.invoice_number}
                                            </h2>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClasses(
                                                    invoice.status
                                                )}`}
                                            >
                                                {invoice.status ||
                                                    "Pending"}
                                            </span>

                                        </div>


                                        <div className="mt-5 grid gap-4 sm:grid-cols-3">

                                            <div>

                                                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                                                    Amount
                                                </p>

                                                <p className="mt-1 text-lg font-black text-slate-950">
                                                    {formatAmount(
                                                        invoice.amount
                                                    )}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                                                    Due Date
                                                </p>

                                                <p className="mt-1 font-bold text-slate-900">
                                                    {formatDate(
                                                        invoice.due_date
                                                    )}
                                                </p>

                                            </div>


                                            <div>

                                                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                                                    Issued
                                                </p>

                                                <p className="mt-1 font-bold text-slate-900">
                                                    {formatDate(
                                                        invoice.created_at
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Actions */}

                                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

                                        {invoice.file_url && (
                                            <a
                                                href={
                                                    invoice.file_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-50"
                                            >
                                                View Invoice
                                            </a>
                                        )}


                                        {invoice.status?.toLowerCase() !==
                                            "paid" && (
                                                <button
                                                    type="button"
                                                    onClick={() => payInvoice(invoice.id)}
                                                    disabled={payingInvoiceId === invoice.id}
                                                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {payingInvoiceId === invoice.id
                                                        ? "Opening Payment..."
                                                        : "Pay Online"}
                                                </button>
                                            )}

                                    </div>

                                </div>


                                {/* Payment information */}

                                {invoice.status?.toLowerCase() !==
                                    "paid" && (
                                        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

                                            <p className="font-black text-green-900">
                                                Payment required
                                            </p>

                                            <p className="mt-1 text-sm leading-6 text-green-800">
                                                Your invoice is ready for payment.
                                                Once payment is successfully confirmed,
                                                your order will move into production.
                                            </p>

                                        </div>
                                    )}

                            </div>
                        ))}

                    </div>
                )}

        </div>
    );
}