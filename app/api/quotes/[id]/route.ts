import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);
}

function emailLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <body
        style="
          margin:0;
          padding:0;
          background:#f3f4f6;
          font-family:Arial,Helvetica,sans-serif;
          color:#111827;
        "
      >

        <div style="padding:40px 15px;">

          <div
            style="
              max-width:650px;
              margin:0 auto;
              background:#ffffff;
              border:1px solid #e5e7eb;
              border-radius:16px;
              overflow:hidden;
            "
          >

            <div
              style="
                background:#008f3d;
                padding:28px 35px;
                text-align:center;
              "
            >

              <div
                style="
                  display:inline-block;
                  background:#ffffff;
                  color:#008f3d;
                  width:48px;
                  height:48px;
                  line-height:48px;
                  border-radius:12px;
                  font-size:25px;
                  font-weight:900;
                "
              >
                P
              </div>

              <div
                style="
                  margin-top:12px;
                  color:#ffffff;
                  font-size:20px;
                  font-weight:700;
                "
              >
                Pro Cups International
              </div>

            </div>

            <div style="padding:35px;">
              ${content}
            </div>

            <div
              style="
                border-top:1px solid #e5e7eb;
                padding:24px 35px;
                background:#fafafa;
                text-align:center;
              "
            >

              <div
                style="
                  font-size:14px;
                  font-weight:700;
                  color:#111827;
                "
              >
                Pro Cups International
              </div>

              <div
                style="
                  margin-top:6px;
                  font-size:13px;
                  color:#6b7280;
                "
              >
                Premium Paper Cups &amp; Custom Printing
              </div>

              <div
                style="
                  margin-top:10px;
                  font-size:13px;
                  color:#6b7280;
                "
              >
                procupsinternational.com
              </div>

            </div>

          </div>

        </div>

      </body>
    </html>
  `;
}

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

    /*
     * Get the existing quote first.
     *
     * This allows us to determine whether this is the
     * first time a quotation has been prepared.
     */
    const { data: existingQuote, error: existingQuoteError } =
      await supabase
        .from("quote_requests")
        .select(
          "id, company_name, contact_name, email, product, size, quantity, total_amount, quotation_created_at"
        )
        .eq("id", id)
        .single();

    if (existingQuoteError || !existingQuote) {
      return NextResponse.json(
        {
          success: false,
          error: "Quote not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Build update object exactly as before.
     */
    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;
      updates.status_updated_at = new Date().toISOString();
    }

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

    /*
     * Only send the "quotation ready" email when the quotation
     * is being created for the first time.
     *
     * This prevents an email being sent every time you edit
     * the quotation.
     */
    const isFirstQuotation =
      existingQuote.quotation_created_at == null &&
      existingQuote.total_amount == null &&
      quotation_created_at !== undefined &&
      total_amount !== undefined;

    let emailSent = false;

    if (isFirstQuotation) {
      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey) {
        console.error(
          "RESEND_API_KEY is missing. Quotation was saved but email was not sent."
        );
      } else if (!existingQuote.email) {
        console.error(
          "Customer has no email address. Quotation was saved but email was not sent."
        );
      } else {
        const resend = new Resend(apiKey);

        const customerName =
          existingQuote.contact_name || "Customer";

        const customerEmail =
          String(existingQuote.email).trim();

        const quantity = Number(existingQuote.quantity) || 0;

        const total = Number(total_amount) || 0;

        const quotationEmail = emailLayout(`
          <p
            style="
              margin:0;
              font-size:15px;
              color:#6b7280;
            "
          >
            Hello ${escapeHtml(customerName)},
          </p>

          <h1
            style="
              margin:10px 0 0;
              font-size:28px;
              line-height:1.25;
              color:#111827;
            "
          >
            Your Quotation Is Ready
          </h1>

          <p
            style="
              margin:18px 0 0;
              font-size:16px;
              line-height:1.7;
              color:#4b5563;
            "
          >
            Thank you for choosing Pro Cups International.
            We have prepared your quotation based on your
            recent request.
          </p>

          <div
            style="
              margin-top:28px;
              padding:22px;
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:12px;
            "
          >

            <div
              style="
                font-size:13px;
                font-weight:700;
                text-transform:uppercase;
                letter-spacing:1px;
                color:#008f3d;
                margin-bottom:15px;
              "
            >
              Quotation Summary
            </div>

            <p style="margin:0 0 10px;font-size:14px;">
              <strong>Product:</strong>
              ${escapeHtml(String(existingQuote.product || "Not provided"))}
            </p>

            <p style="margin:0 0 10px;font-size:14px;">
              <strong>Size:</strong>
              ${escapeHtml(String(existingQuote.size || "Not provided"))}
            </p>

            <p style="margin:0 0 10px;font-size:14px;">
              <strong>Quantity:</strong>
              ${quantity.toLocaleString("en-ZA")}
            </p>

            <p
              style="
                margin:18px 0 0;
                padding-top:18px;
                border-top:1px solid #e5e7eb;
                font-size:18px;
                font-weight:700;
                color:#008f3d;
              "
            >
              Total: ${formatCurrency(total)}
            </p>

          </div>

          <p
            style="
              margin:25px 0 0;
              font-size:15px;
              line-height:1.7;
              color:#4b5563;
            "
          >
            Your quotation is now available through
            Pro Cups International. Please contact us if
            you have any questions regarding the quotation.
          </p>

          <div
            style="
              margin-top:28px;
              padding:18px 20px;
              border-left:4px solid #008f3d;
              background:#f0fdf4;
            "
          >

            <p
              style="
                margin:0;
                font-size:14px;
                line-height:1.6;
                color:#166534;
              "
            >
              <strong>Your quotation has been prepared successfully.</strong><br />
              Pro Cups International will assist you with the next steps.
            </p>

          </div>
        `);

        const { error: emailError } =
          await resend.emails.send({
            from:
              "Pro Cups International <info@procupsinternational.com>",

            to: [customerEmail],

            replyTo:
              "info@procupsinternational.com",

            subject:
              "Your Quotation Is Ready - Pro Cups International",

            html: quotationEmail,
          });

        if (emailError) {
          console.error(
            "Quotation email error:",
            emailError
          );
        } else {
          emailSent = true;

          console.log(
            "Quotation ready email sent to:",
            customerEmail
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      quote: data,
      emailSent,
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