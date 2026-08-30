import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  "Pro Cups International <info@procupsinternational.com>";

const COMPANY_EMAIL = "info@procupsinternational.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(value: number | null | undefined) {
  if (value == null || Number.isNaN(Number(value))) {
    return "R0.00";
  }

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(Number(value));
}

function emailLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <div style="width:100%;padding:40px 15px;box-sizing:border-box;">
          <div style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">

            <div style="padding:28px 35px;background:#0f172a;">
              <div style="font-size:24px;font-weight:800;color:#ffffff;">
                Pro Cups <span style="color:#4ade80;">International</span>
              </div>

              <div style="margin-top:6px;font-size:13px;color:#cbd5e1;">
                Premium Paper Cup Manufacturing
              </div>
            </div>

            <div style="padding:35px;">
              ${content}
            </div>

            <div style="padding:25px 35px;border-top:1px solid #e5e7eb;background:#ffffff;">
              <div style="font-size:14px;font-weight:700;color:#111827;">
                Pro Cups International
              </div>

              <div style="margin-top:6px;font-size:13px;line-height:21px;color:#64748b;">
                Premium custom printed paper cups<br />
                South Africa
              </div>

              <div style="margin-top:12px;font-size:13px;">
                <a
                  href="mailto:info@procupsinternational.com"
                  style="color:#15803d;text-decoration:none;font-weight:600;"
                >
                  info@procupsinternational.com
                </a>
                <br />

                <a
                  href="https://procupsinternational.com"
                  style="color:#15803d;text-decoration:none;font-weight:600;"
                >
                  procupsinternational.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;
}

async function sendQuotationReadyEmail({
  name,
  email,
  quoteId,
  companyName,
  product,
  size,
  quantity,
  unitPrice,
  subtotal,
  vatAmount,
  totalAmount,
  notes,
}: {
  name: string;
  email: string;
  quoteId: string;
  companyName: string;
  product: string;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  notes: string;
}) {
  const customerName = escapeHtml(name || "Customer");

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: "Your Quotation Is Ready - Pro Cups International",

    html: emailLayout(`
      <p style="margin:0;font-size:28px;font-weight:800;color:#111827;">
        Your Quotation Is Ready
      </p>

      <p style="margin:18px 0 0;font-size:16px;line-height:27px;color:#475569;">
        Hi ${customerName},
      </p>

      <p style="margin:14px 0 0;font-size:16px;line-height:27px;color:#475569;">
        Your quotation from Pro Cups International has been prepared
        and is now ready for you to review.
      </p>

      <div style="margin-top:28px;padding:22px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0;">

        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#15803d;">
          Quotation
        </div>

        <table style="width:100%;margin-top:16px;border-collapse:collapse;">

          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">
              Company
            </td>

            <td style="padding:8px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${escapeHtml(companyName || "Not provided")}
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">
              Product
            </td>

            <td style="padding:8px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${escapeHtml(product || "Not provided")}
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">
              Size
            </td>

            <td style="padding:8px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${escapeHtml(size || "Not provided")}
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">
              Quantity
            </td>

            <td style="padding:8px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${Number(quantity || 0).toLocaleString("en-ZA")}
            </td>
          </tr>

        </table>
      </div>

      <div style="margin-top:18px;padding:22px;border-radius:14px;background:#ffffff;border:1px solid #e2e8f0;">

        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#15803d;">
          Pricing
        </div>

        <table style="width:100%;margin-top:16px;border-collapse:collapse;">

          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">
              Unit Price
            </td>

            <td style="padding:8px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${formatCurrency(unitPrice)}
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">
              Subtotal
            </td>

            <td style="padding:8px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${formatCurrency(subtotal)}
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">
              VAT (15%)
            </td>

            <td style="padding:8px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${formatCurrency(vatAmount)}
            </td>
          </tr>

          <tr>
            <td style="padding:16px 0 4px;border-top:1px solid #e2e8f0;font-size:18px;font-weight:800;color:#111827;">
              Total
            </td>

            <td style="padding:16px 0 4px;border-top:1px solid #e2e8f0;text-align:right;font-size:20px;font-weight:800;color:#15803d;">
              ${formatCurrency(totalAmount)}
            </td>
          </tr>

        </table>
      </div>

      ${
        notes
          ? `
            <div style="margin-top:18px;padding:20px;border-radius:14px;background:#f0fdf4;border:1px solid #bbf7d0;">
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#15803d;">
                Notes
              </div>

              <p style="margin:10px 0 0;font-size:14px;line-height:23px;color:#166534;">
                ${escapeHtml(notes).replace(/\n/g, "<br />")}
              </p>
            </div>
          `
          : ""
      }

      <div style="margin-top:28px;padding:18px 20px;border-left:4px solid #16a34a;background:#f0fdf4;">
        <p style="margin:0;font-size:14px;line-height:23px;color:#166534;">
          Your print proof will be sent to you separately when it is
          ready for review.
        </p>
      </div>

      <p style="margin:25px 0 0;font-size:14px;line-height:23px;color:#64748b;">
        Please keep this email for your records. You can contact us at
        info@procupsinternational.com if you have any questions.
      </p>
    `),
  });
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

    const { data, error } = await adminSupabase
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
     * Send quotation email only when a complete quotation has
     * actually been saved.
     *
     * This prevents emails being sent for unrelated status updates.
     */
    const quotationWasSaved =
      unit_price !== undefined &&
      subtotal !== undefined &&
      vat_amount !== undefined &&
      total_amount !== undefined;

    if (quotationWasSaved) {
      const customerEmail = String(data.email || "").trim();

      if (customerEmail) {
        try {
          const emailResult = await sendQuotationReadyEmail({
            name: String(data.contact_name || ""),
            email: customerEmail,
            quoteId: String(data.id),
            companyName: String(data.company_name || ""),
            product: String(data.product || ""),
            size: String(data.size || ""),
            quantity: Number(data.quantity || 0),
            unitPrice: Number(data.unit_price || 0),
            subtotal: Number(data.subtotal || 0),
            vatAmount: Number(data.vat_amount || 0),
            totalAmount: Number(data.total_amount || 0),
            notes: String(data.quotation_notes || ""),
          });

          if (emailResult.error) {
            console.error(
              "Quotation email RESEND error:",
              emailResult.error
            );
          } else {
            console.log(
              "Quotation ready email sent:",
              emailResult.data
            );
          }
        } catch (emailError) {
          console.error(
            "Quotation ready email failed:",
            emailError
          );
        }
      } else {
        console.warn(
          "Quotation saved but customer has no email address:",
          id
        );
      }
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