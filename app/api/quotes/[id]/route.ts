import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const {
      status,
      unit_price,
      subtotal,
      vat_amount,
      total_amount,
      quotation_notes,
      quotation_created_at,
    } = body;

    // Build the update object only with fields that were provided.
    const updates: Record<string, unknown> = {};

    // STATUS UPDATE
    if (status !== undefined) {
      updates.status = status;
      updates.status_updated_at = new Date().toISOString();
    }

    // QUOTATION UPDATE
    if (unit_price !== undefined) {
      updates.unit_price = Number(unit_price);
    }

    if (subtotal !== undefined) {
      updates.subtotal = Number(subtotal);
    }

    if (vat_amount !== undefined) {
      updates.vat_amount = Number(vat_amount);
    }

    if (total_amount !== undefined) {
      updates.total_amount = Number(total_amount);
    }

    if (quotation_notes !== undefined) {
      updates.quotation_notes = quotation_notes;
    }

    if (quotation_created_at !== undefined) {
      updates.quotation_created_at = quotation_created_at;
    }

    // Make sure something was actually sent.
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid fields were provided.",
        },
        { status: 400 }
      );
    }

    console.log("Updating quote:", id);
    console.log("Update data:", updates);

    const { data, error } = await supabase
      .from("quote_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Quote update error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quote: data,
    });
  } catch (error) {
    console.error("Quote PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Server error while updating quote.",
      },
      { status: 500 }
    );
  }
}