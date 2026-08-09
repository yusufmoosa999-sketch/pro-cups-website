import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    // Make sure this quote belongs to the logged-in customer
    const { data: quote, error: quoteError } =
      await adminSupabase
        .from("quote_requests")
        .select(
          "id, customer_id, status, total_amount, customer_approval_status"
        )
        .eq("id", id)
        .eq("customer_id", user.id)
        .single();

    if (quoteError || !quote) {
      return NextResponse.json(
        {
          success: false,
          error: "Quote not found.",
        },
        { status: 404 }
      );
    }

    // The customer must have approved the print proof first.
    if (quote.customer_approval_status !== "approved") {
      return NextResponse.json(
        {
          success: false,
          error:
            "The print proof must be approved before accepting the quotation.",
        },
        { status: 400 }
      );
    }

    // A quotation must actually exist.
    if (quote.total_amount == null) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The quotation has not been prepared yet.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (body.action !== "accept") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid quotation action.",
        },
        { status: 400 }
      );
    }

    const { error: updateError } =
      await adminSupabase
        .from("quote_requests")
        .update({
          customer_quote_status: "accepted",
          customer_quote_accepted_at:
            new Date().toISOString(),
          status: "Approved",
          status_updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .eq("customer_id", user.id);

    if (updateError) {
      console.error(
        "Quotation acceptance error:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "We could not accept the quotation.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "Approved",
      quotationStatus: "accepted",
    });
  } catch (error) {
    console.error(
      "Quotation approval API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while accepting the quotation.",
      },
      { status: 500 }
    );
  }
}