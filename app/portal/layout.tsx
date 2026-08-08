import Link from "next/link";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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


        {/* NAVIGATION */}

        <nav className="flex-1 space-y-2 px-5 py-8">

          <p className="px-4 pb-3 text-xs font-bold uppercase tracking-[3px] text-slate-500">
            Customer Portal
          </p>

          <Link
            href="/portal"
            className="block rounded-xl bg-green-600 px-4 py-3.5 font-semibold text-white transition hover:bg-green-500"
          >
            Dashboard
          </Link>

          <Link
            href="/portal/quotes"
            className="block rounded-xl px-4 py-3.5 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            My Quotes
          </Link>

          <Link
            href="/portal/orders"
            className="block rounded-xl px-4 py-3.5 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            My Orders
          </Link>

          <Link
            href="/portal/artwork"
            className="block rounded-xl px-4 py-3.5 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Artwork
          </Link>

          <Link
            href="/portal/invoices"
            className="block rounded-xl px-4 py-3.5 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Invoices
          </Link>

          <div className="my-6 border-t border-white/10" />

          <Link
            href="/portal/profile"
            className="block rounded-xl px-4 py-3.5 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            My Profile
          </Link>

        </nav>


        {/* BOTTOM */}

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

      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:hidden">

        <Link href="/portal" className="leading-none">

          <div className="text-xl font-black text-slate-900">
            Pro
          </div>

          <div className="text-xl font-black text-green-600">
            Cups
          </div>

        </Link>

        <span className="text-sm font-semibold text-slate-500">
          Customer Portal
        </span>

      </header>


      {/* PAGE CONTENT */}

      <main className="min-h-screen lg:pl-72">

        <div className="mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">

          {children}

        </div>

      </main>

    </div>
  );
}