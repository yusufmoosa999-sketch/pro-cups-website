import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const { data: quotes, error } = await adminSupabase
      .from("quote_requests")
      .select(
        "id, company_name, contact_name, product, quantity, status"
      )
      .eq("customer_id", id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Quote loading error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Could not load customer quotes.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quotes: quotes || [],
    });
  } catch (error) {
    console.error("Customer quotes API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not load customer quotes.",
      },
      { status: 500 }
    );
  }
}