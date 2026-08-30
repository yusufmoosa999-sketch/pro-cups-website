import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Creates a secure, signed link that allows a customer
 * to access their quotation without creating an account.
 */
function createQuoteAccessToken(quoteId: string) {
  const timestamp = Date.now().toString();

  const payload = `${quoteId}.${timestamp}`;

  const signature = crypto
    .createHmac(
      "sha256",
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    .update(payload)
    .digest("hex");

  return Buffer.from(
    `${payload}.${signature}`
  ).toString("base64url");
}

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

    /**
     * Only send the quotation-ready email when a quotation
     * is actually being prepared/saved.
     *
     * Status-only changes will NOT send this email.
     */
    if (
      unit_price !== undefined &&
      subtotal !== undefined &&
      vat_amount !== undefined &&
      total_amount !== undefined
    ) {
      const customerEmail = String(data.email || "").trim();
      const customerName = String(
        data.contact_name || "Customer"
      ).trim();

      if (customerEmail) {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
          console.error(
            "RESEND_API_KEY is missing. Quotation was saved, but email could not be sent."
          );
        } else {
          try {
            const resend = new Resend(apiKey);

            const accessToken = createQuoteAccessToken(id);

            const quotationUrl =
              `https://www.procupsinternational.com/quote/view?access=${encodeURIComponent(
                accessToken
              )}`;

            const product = String(
              data.product || "Paper Cups"
            );

            const size = String(
              data.size || "Not provided"
            );

            const quantity = Number(
              data.quantity || 0
            );

            const notes = String(
              data.quotation_notes || ""
            ).trim();

            const { error: emailError } =
              await resend.emails.send({
                from:
                  "Pro Cups International <info@procupsinternational.com>",

                to: [customerEmail],

                subject:
                  "Your Quotation Is Ready - Pro Cups International",

                html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Your Quotation Is Ready</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
    color: #111827;
  "
>

  <div
    style="
      width: 100%;
      padding: 40px 15px;
      box-sizing: border-box;
    "
  >

    <div
      style="
        max-width: 650px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        overflow: hidden;
      "
    >

      <!-- HEADER -->

      <div
        style="
          background-color: #008f3c;
          padding: 35px 30px;
          text-align: center;
        "
      >

        <div
          style="
            display: inline-block;
            width: 54px;
            height: 54px;
            line-height: 54px;
            border-radius: 14px;
            background-color: #ffffff;
            color: #008f3c;
            font-size: 30px;
            font-weight: 900;
          "
        >
          P
        </div>

        <h1
          style="
            margin: 16px 0 0;
            color: #ffffff;
            font-size: 25px;
            line-height: 1.3;
          "
        >
          Pro Cups International
        </h1>

      </div>

      <!-- CONTENT -->

      <div style="padding: 35px 30px;">

        <p
          style="
            margin: 0 0 10px;
            color: #6b7280;
            font-size: 16px;
          "
        >
          Hello ${escapeHtml(customerName)},
        </p>

        <h2
          style="
            margin: 0 0 18px;
            color: #111827;
            font-size: 30px;
            line-height: 1.2;
          "
        >
          Your Quotation Is Ready
        </h2>

        <p
          style="
            margin: 0;
            color: #4b5563;
            font-size: 16px;
            line-height: 1.7;
          "
        >
          Thank you for choosing Pro Cups International.
          We have prepared your quotation based on your
          recent request.
        </p>

        <!-- SUMMARY -->

        <div
          style="
            margin-top: 28px;
            padding: 24px;
            background-color: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
          "
        >

          <p
            style="
              margin: 0 0 18px;
              color: #008f3c;
              font-size: 14px;
              font-weight: 700;
              letter-spacing: 2px;
              text-transform: uppercase;
            "
          >
            Quotation Summary
          </p>

          <p
            style="
              margin: 0 0 10px;
              color: #374151;
              font-size: 15px;
            "
          >
            <strong>Product:</strong>
            ${escapeHtml(product)}
          </p>

          <p
            style="
              margin: 0 0 10px;
              color: #374151;
              font-size: 15px;
            "
          >
            <strong>Size:</strong>
            ${escapeHtml(size)}
          </p>

          <p
            style="
              margin: 0;
              color: #374151;
              font-size: 15px;
            "
          >
            <strong>Quantity:</strong>
            ${quantity.toLocaleString("en-ZA")}
          </p>

          <div
            style="
              margin-top: 20px;
              padding-top: 18px;
              border-top: 1px solid #e5e7eb;
            "
          >

            <p
              style="
                margin: 0;
                color: #008f3c;
                font-size: 24px;
                font-weight: 800;
              "
            >
              Total: ${formatCurrency(Number(data.total_amount))}
            </p>

          </div>

        </div>

        ${
          notes
            ? `
        <div
          style="
            margin-top: 24px;
            padding: 20px;
            background-color: #f9fafb;
            border-left: 4px solid #008f3c;
          "
        >

          <p
            style="
              margin: 0 0 8px;
              font-size: 14px;
              font-weight: 700;
              color: #374151;
            "
          >
            Notes from Pro Cups International
          </p>

          <p
            style="
              margin: 0;
              font-size: 15px;
              line-height: 1.6;
              color: #4b5563;
            "
          >
            ${escapeHtml(notes).replace(/\n/g, "<br />")}
          </p>

        </div>
        `
            : ""
        }

        <!-- BUTTON -->

        <div
          style="
            margin-top: 32px;
            text-align: center;
          "
        >

          <a
            href="${quotationUrl}"
            style="
              display: inline-block;
              background-color: #008f3c;
              color: #ffffff;
              text-decoration: none;
              padding: 16px 30px;
              border-radius: 10px;
              font-size: 16px;
              font-weight: 700;
            "
          >
            View Your Quotation →
          </a>

        </div>

        <p
          style="
            margin: 28px 0 0;
            color: #6b7280;
            font-size: 14px;
            line-height: 1.7;
            text-align: center;
          "
        >
          You do not need to create an account to view
          your quotation.
        </p>

      </div>

      <!-- FOOTER -->

      <div
        style="
          padding: 25px 30px;
          background-color: #f8fafc;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        "
      >

        <p
          style="
            margin: 0;
            color: #111827;
            font-size: 15px;
            font-weight: 700;
          "
        >
          Pro Cups International
        </p>

        <p
          style="
            margin: 7px 0 0;
            color: #6b7280;
            font-size: 13px;
          "
        >
          Premium Paper Cups &amp; Custom Printing
        </p>

        <p
          style="
            margin: 10px 0 0;
            font-size: 13px;
          "
        >
          <a
            href="https://www.procupsinternational.com"
            style="
              color: #008f3c;
              text-decoration: none;
            "
          >
            procupsinternational.com
          </a>
        </p>

      </div>

    </div>

    <p
      style="
        max-width: 650px;
        margin: 18px auto 0;
        text-align: center;
        color: #9ca3af;
        font-size: 11px;
        line-height: 1.5;
      "
    >
      This email was sent because you requested a quotation
      from Pro Cups International.
    </p>

  </div>

</body>
</html>
                `,
              });

            if (emailError) {
              console.error(
                "Quotation email error:",
                emailError
              );

              // The quotation itself was successfully saved.
              // Do not fail the quotation save because of email.
            } else {
              console.log(
                "QUOTATION EMAIL SENT:",
                customerEmail
              );
            }
          } catch (emailException) {
            console.error(
              "Quotation email exception:",
              emailException
            );

            // Again, quotation saving remains successful.
          }
        }
      } else {
        console.error(
          "Quote has no customer email address. Quotation saved but email was not sent."
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