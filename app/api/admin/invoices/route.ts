import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_FILE_SIZE = 25 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const customerId = formData.get("customerId");
    const quoteId = formData.get("quoteId");
    const invoiceNumber = formData.get("invoiceNumber");
    const amount = formData.get("amount");
    const dueDate = formData.get("dueDate");
    const file = formData.get("file");

    if (
      typeof customerId !== "string" ||
      typeof invoiceNumber !== "string" ||
      typeof amount !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer, invoice number and amount are required.",
        },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please upload an invoice PDF.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice files must be 25MB or smaller.",
        },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "";

    if (extension !== "pdf") {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF invoices can be uploaded.",
        },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid invoice amount.",
        },
        { status: 400 }
      );
    }

    // Make sure the customer exists.
    const { data: customer, error: customerError } =
      await adminSupabase.auth.admin.getUserById(customerId);

    if (customerError || !customer.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer not found.",
        },
        { status: 404 }
      );
    }

    // If a quote was supplied, make sure it belongs to this customer.
    if (quoteId && typeof quoteId === "string") {
      const { data: quote, error: quoteError } =
        await adminSupabase
          .from("quote_requests")
          .select("id, customer_id")
          .eq("id", quoteId)
          .eq("customer_id", customerId)
          .single();

      if (quoteError || !quote) {
        return NextResponse.json(
          {
            success: false,
            error: "The selected quote does not belong to this customer.",
          },
          { status: 400 }
        );
      }
    }

    const safeInvoiceNumber = invoiceNumber
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const filePath =
      `${customerId}/${safeInvoiceNumber}-${Date.now()}.pdf`;

    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } =
      await adminSupabase.storage
        .from("invoices")
        .upload(filePath, fileBuffer, {
          contentType: "application/pdf",
          upsert: false,
        });

    if (uploadError) {
      console.error("Invoice upload error:", uploadError);

      return NextResponse.json(
        {
          success: false,
          error: "Could not upload the invoice.",
        },
        { status: 500 }
      );
    }

    const { data: invoice, error: invoiceError } =
      await adminSupabase
        .from("invoices")
        .insert({
          customer_id: customerId,
          quote_id:
            typeof quoteId === "string" && quoteId.length > 0
              ? quoteId
              : null,
          invoice_number: invoiceNumber.trim(),
          amount: numericAmount,
          due_date:
            typeof dueDate === "string" && dueDate.length > 0
              ? dueDate
              : null,
          invoice_file_path: filePath,
          status: "Payment Pending",
        })
        .select()
        .single();

    if (invoiceError) {
      console.error("Invoice database error:", invoiceError);

      await adminSupabase.storage
        .from("invoices")
        .remove([filePath]);

      return NextResponse.json(
        {
          success: false,
          error: "Invoice was uploaded but could not be saved.",
        },
        { status: 500 }
      );
    }

    // The quotation has now reached the payment stage.
    if (typeof quoteId === "string" && quoteId.length > 0) {
      const { error: quoteUpdateError } =
        await adminSupabase
          .from("quote_requests")
          .update({
            status: "Payment Pending",
            status_updated_at: new Date().toISOString(),
          })
          .eq("id", quoteId)
          .eq("customer_id", customerId);

      if (quoteUpdateError) {
        console.error(
          "Quote status update error:",
          quoteUpdateError
        );
      }
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Admin invoice API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while creating the invoice.",
      },
      { status: 500 }
    );
  }
}