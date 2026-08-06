import QuoteStatus from "@/components/QuoteStatus";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function QuoteDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: quote } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (!quote) {
    return (
      <main className="p-10">
        <h1 className="text-4xl font-bold">
          Quote not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">

      <Link
        href="/admin/quotes"
        className="text-blue-600 font-bold"
      >
        ← Back to Quotes
      </Link>

      <div className="bg-white rounded-3xl shadow mt-8 p-10">

        <h1 className="text-4xl font-black mb-8">
          Quote Details
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <Info title="Company" value={quote.company_name} />
          <Info title="Contact" value={quote.contact_name} />
          <Info title="Email" value={quote.email} />
          <Info title="Phone" value={quote.phone} />
          <Info title="Product" value={quote.product} />
          <Info title="Quantity" value={quote.quantity} />
          <QuoteStatus
  id={quote.id}
  currentStatus={quote.status}
/>

        </div>

        <div className="mt-10">

          <h2 className="font-bold text-xl mb-3">
            Message
          </h2>

          <div className="rounded-xl bg-slate-100 p-5">
            {quote.message || "No message"}
          </div>

        </div>

      </div>

    </main>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div>

      <p className="text-gray-500">
        {title}
      </p>

      <h3 className="text-2xl font-bold">
        {value || "-"}
      </h3>

    </div>
  );
}