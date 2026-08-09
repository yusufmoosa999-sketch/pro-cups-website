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
    const { data: quote, error: quoteError } = await adminSupabase
      .from("quote_requests")
      .select("id, customer_id")
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

    const body = await req.json();

    const { approvalStatus, note } = body;

    if (!["approved", "changes_requested"].includes(approvalStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid approval status.",
        },
        { status: 400 }
      );
    }

const now = new Date().toISOString();

const updateData = {
  customer_approval_status: approvalStatus,
  customer_approval_note: note || null,
  customer_approved_at:
    approvalStatus === "approved"
      ? new Date().toISOString()
      : null,
};

// If the customer approves the print proof,
// move the quote to Approved automatically.
if (approvalStatus === "approved") {
  updateData.status = "Approved";
}

    const { error: updateError } = await adminSupabase
      .from("quote_requests")
      .update(updateData)
      .eq("id", id)
      .eq("customer_id", user.id);

    if (updateError) {
      console.error("Approval update error:", updateError);

      return NextResponse.json(
        {
          success: false,
          error: "Could not save your response.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      approvalStatus,
    });
  } catch (error) {
    console.error("Approval API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}