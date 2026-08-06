import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-5xl font-black mb-10">
        Pro Cups Admin
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <Link
          href="/admin/quotes"
          className="rounded-3xl bg-white p-8 shadow hover:shadow-xl transition"
        >
          <h2 className="text-3xl font-bold">
            Quote Requests
          </h2>

          <p className="mt-4 text-gray-600">
            View all customer enquiries
          </p>
        </Link>

      </div>
    </main>
  );
}