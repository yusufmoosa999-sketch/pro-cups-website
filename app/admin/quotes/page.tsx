import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function QuotesPage() {
  const { data: quotes, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

    

  if (error) {
    return (
      <main className="p-10">
        <h1 className="text-4xl font-bold text-red-600">
          Failed to load quotes
        </h1>

        <p className="mt-4">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">

      <div className="flex items-center justify-between mb-10">

  <div>

    <h1 className="text-5xl font-black">
      Quote Dashboard
    </h1>

    <p className="text-gray-500 mt-2">
      Manage customer quote requests
    </p>

  </div>

</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

  <div className="bg-white rounded-3xl shadow p-6">
    <p className="text-gray-500 font-medium">
      Total Quotes
    </p>

    <h2 className="text-5xl font-black mt-3">
      {quotes?.length}
    </h2>
  </div>

  <div className="bg-green-50 rounded-3xl shadow p-6">
    <p className="text-green-700 font-medium">
      New
    </p>

    <h2 className="text-5xl font-black mt-3 text-green-700">
      {quotes?.filter(q => q.status === "New").length}
    </h2>
  </div>

  <div className="bg-yellow-50 rounded-3xl shadow p-6">
    <p className="text-yellow-700 font-medium">
      Quoted
    </p>

    <h2 className="text-5xl font-black mt-3 text-yellow-700">
      {quotes?.filter(q => q.status === "Quoted").length}
    </h2>
  </div>

  <div className="bg-blue-50 rounded-3xl shadow p-6">
    <p className="text-blue-700 font-medium">
      Completed
    </p>

    <h2 className="text-5xl font-black mt-3 text-blue-700">
      {quotes?.filter(q => q.status === "Completed").length}
    </h2>
  </div>

</div>
      <div className="overflow-hidden rounded-3xl bg-white shadow text-slate-900">

        

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-5 text-left">Company</th>

              <th className="p-5 text-left">Contact</th>

              <th className="p-5 text-left">Product</th>

              <th className="p-5 text-left">Quantity</th>

              <th className="p-5 text-left">Status</th>
<th className="p-5 text-left">Submitted</th>
<th className="p-5 text-left">Artwork</th>

            </tr>

          </thead>

          <tbody>

            {quotes?.map((quote) => (

 <tr
  key={quote.id}
  className="border-b hover:bg-slate-50"
>
                <td className="p-5 text-slate-900">
  <Link
    href={`/admin/quotes/${quote.id}`}
    className="font-semibold text-blue-600 hover:underline"
  >
    {quote.company_name || "(No company)"}
  </Link>
</td>
                <td className="p-5">
                  {quote.contact_name}
                </td>

                <td className="p-5">
                  {quote.product}
                </td>

                <td className="p-5">
                  {quote.quantity}
                </td>

                <td className="p-5">

  <span
    className={`rounded-full px-4 py-2 font-semibold
      ${
        quote.status === "New"
          ? "bg-blue-100 text-blue-700"
          : quote.status === "Contacted"
          ? "bg-yellow-100 text-yellow-700"
          : quote.status === "Quoted"
          ? "bg-purple-100 text-purple-700"
          : quote.status === "Approved"
          ? "bg-green-100 text-green-700"
          : quote.status === "Completed"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-gray-100 text-gray-700"
      }
    `}
  >
    {quote.status}
  </span>

</td>

<td className="p-5">
  {new Date(quote.created_at).toLocaleDateString()}
</td>

<td className="p-5">

  {quote.artwork_url ? (

    <a
      href={`https://sdfitmipxvulhxihwimz.supabase.co/storage/v1/object/public/artwork/${quote.artwork_url}`}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      View
    </a>

  ) : (

    <span className="text-gray-400">
      None
    </span>

  )}

</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}