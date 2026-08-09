"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    function closeMenu() {
        setOpen(false);
    }

    function navClass(href: string) {
        const active =
            href === "/portal"
                ? pathname === "/portal"
                : pathname.startsWith(href);

        return active
            ? "block rounded-xl bg-green-600 px-4 py-3.5 font-semibold text-white transition hover:bg-green-500"
            : "block rounded-xl px-4 py-3.5 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white";
    }

    function mobileNavClass(href: string) {
        const active =
            href === "/portal"
                ? pathname === "/portal"
                : pathname.startsWith(href);

        return active
            ? "rounded-xl bg-green-600 px-4 py-4 text-base font-semibold text-white transition"
            : "rounded-xl px-4 py-4 text-base font-semibold text-slate-800 transition hover:bg-green-50 hover:text-green-700";
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* DESKTOP SIDEBAR */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-[#0b1120] text-white lg:flex">

                <div className="flex h-24 items-center border-b border-white/10 px-8">

                    <Link href="/portal" className="leading-none">
                        <div className="text-2xl font-black text-white">
                            Pro
                        </div>

                        <div className="text-2xl font-black text-green-500">
                            Cups
                        </div>
                    </Link>

                </div>

                <nav className="flex-1 space-y-2 px-5 py-8">

                    <p className="px-4 pb-3 text-xs font-bold uppercase tracking-[3px] text-slate-500">
                        Customer Portal
                    </p>

                    <Link
                        href="/portal"
                        className={navClass("/portal")}
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/portal/quotes"
                        className={navClass("/portal/quotes")}
                    >
                        My Quotes
                    </Link>

                    <Link
                        href="/portal/orders"
                        className={navClass("/portal/orders")}
                    >
                        My Orders
                    </Link>

                    <Link
                        href="/portal/artwork"
                        className={navClass("/portal/artwork")}
                    >
                        Artwork
                    </Link>

                    <Link
                        href="/portal/invoices"
                        className={navClass("/portal/invoices")}
                    >
                        Invoices
                    </Link>

                    <div className="my-6 border-t border-white/10" />

                    <Link
                        href="/portal/profile"
                        className={navClass("/portal/profile")}
                    >
                        My Profile
                    </Link>

                </nav>

                <div className="border-t border-white/10 p-5">

                    <Link
                        href="/"
                        className="block rounded-xl px-4 py-3 font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                        ← Back to Website
                    </Link>

                </div>

            </aside>


            {/* MOBILE HEADER */}
            <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden">

                <Link
                    href="/portal"
                    onClick={closeMenu}
                    className="leading-none"
                >
                    <div className="text-xl font-black text-slate-900">
                        Pro
                    </div>

                    <div className="text-xl font-black text-green-600">
                        Cups
                    </div>
                </Link>

                <div className="flex items-center gap-4">

                    <span className="text-sm font-semibold text-slate-500">
                        Customer Portal
                    </span>

                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900 transition hover:bg-slate-200"
                        aria-label="Open portal menu"
                    >
                        {open ? <X size={26} /> : <Menu size={26} />}
                    </button>

                </div>

            </header>


            {/* MOBILE MENU */}
            {open && (
                <div className="fixed inset-x-0 top-20 z-40 border-b border-slate-200 bg-white shadow-xl lg:hidden">

                    <nav className="flex flex-col p-4">

                        <Link
                            href="/portal"
                            onClick={closeMenu}
                            className={mobileNavClass("/portal")}
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/portal/quotes"
                            onClick={closeMenu}
                            className={mobileNavClass("/portal/quotes")}
                        >
                            My Quotes
                        </Link>

                        <Link
                            href="/portal/orders"
                            onClick={closeMenu}
                            className={mobileNavClass("/portal/orders")}
                        >
                            My Orders
                        </Link>

                        <Link
                            href="/portal/artwork"
                            onClick={closeMenu}
                            className={mobileNavClass("/portal/artwork")}
                        >
                            Artwork
                        </Link>

                        <Link
                            href="/portal/invoices"
                            onClick={closeMenu}
                            className={mobileNavClass("/portal/invoices")}
                        >
                            Invoices
                        </Link>

                        <div className="my-2 border-t border-slate-200" />
                        <Link
                            href="/portal/profile"
                            onClick={closeMenu}
                            className={mobileNavClass("/portal/profile")}
                        >
                            My Profile
                        </Link>
                        <Link
                            href="/"
                            onClick={closeMenu}
                            className="mt-2 rounded-xl bg-slate-900 px-4 py-4 text-center text-base font-bold text-white transition hover:bg-slate-800"
                        >
                            ← Back to Website
                        </Link>

                    </nav>

                </div>
            )}


            {/* PAGE CONTENT */}
            <main className="min-h-screen lg:pl-72">

                <div className="mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">

                    {children}

                </div>

            </main>

        </div>
    );
}