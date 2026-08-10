import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
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

    const { data: invoices, error } =
      await adminSupabase
        .from("invoices")
        .select(
          `
            id,
            customer_id,
            quote_id,
            invoice_number,
            amount,
            due_date,
            invoice_file_path,
            status,
            created_at
          `
        )
        .eq("customer_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Customer invoices error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Could not load your invoices.",
        },
        { status: 500 }
      );
    }

    const invoicesWithUrls = await Promise.all(
      (invoices || []).map(async (invoice) => {
        let fileUrl: string | null = null;

        if (invoice.invoice_file_path) {
          const { data: signedUrlData } =
            await adminSupabase.storage
              .from("invoices")
              .createSignedUrl(
                invoice.invoice_file_path,
                60 * 60
              );

          fileUrl =
            signedUrlData?.signedUrl || null;
        }

        return {
          ...invoice,
          file_url: fileUrl,
        };
      })
    );

    return NextResponse.json({
      success: true,
      invoices: invoicesWithUrls,
    });
  } catch (error) {
    console.error(
      "Customer invoice API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}