import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase.auth.getSession();

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">Supabase Connected ✅</h1>

      <pre className="mt-10">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}