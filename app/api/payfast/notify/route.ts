import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import crypto from "crypto";

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function payfastEncode(value: string) {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/%[a-f0-9]{2}/gi, (match) =>
      match.toUpperCase()
    );
}

function generateSignature(
  data: Record<string, string>,
  passphrase: string
) {
  const parameterString = Object.entries(data)
    .filter(([, value]) => value !== "")
    .map(
      ([key, value]) =>
        `${key}=${payfastEncode(value.trim())}`
    )
    .join("&");

  const stringToHash =
    `${parameterString}&passphrase=${payfastEncode(
      passphrase.trim()
    )}`;

  return crypto
    .createHash("md5")
    .update(stringToHash)
    .digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const params = new URLSearchParams(body);

    const data: Record<string, string> = {};

    params.forEach((value, key) => {
      data[key] = value;
    });

    if (!data.m_payment_id) {
      return new NextResponse(
        "Invalid payment",
        { status: 400 }
      );
    }

    const merchantId =
      process.env.PAYFAST_MERCHANT_ID;

    const passphrase =
      process.env.PAYFAST_PASSPHRASE;

    if (!merchantId || !passphrase) {
      return new NextResponse(
        "Payfast not configured",
        { status: 500 }
      );
    }

    /*
     * Verify merchant
     */

    if (
      data.merchant_id !== merchantId
    ) {
      return new NextResponse(
        "Invalid merchant",
        { status: 400 }
      );
    }

    /*
     * Verify signature
     */

    const receivedSignature =
      data.signature || "";

    const signatureData = {
      ...data,
    };

    delete signatureData.signature;

    const calculatedSignature =
      generateSignature(
        signatureData,
        passphrase
      );

    if (
      receivedSignature.toLowerCase() !==
      calculatedSignature.toLowerCase()
    ) {
      console.error(
        "Payfast signature mismatch"
      );

      return new NextResponse(
        "Invalid signature",
        { status: 400 }
      );
    }

    /*
     * Find the invoice
     */

    const { data: invoice, error: invoiceError } =
      await adminSupabase
        .from("invoices")
        .select(
          `
            id,
            customer_id,
            quote_id,
            invoice_number,
            amount,
            status
          `
        )
        .eq(
          "id",
          data.m_payment_id
        )
        .single();

    if (invoiceError || !invoice) {
      return new NextResponse(
        "Invoice not found",
        { status: 404 }
      );
    }

    /*
     * Verify amount
     */

    const expectedAmount =
      Number(invoice.amount).toFixed(2);

    const receivedAmount =
      Number(
        data.amount_gross || 0
      ).toFixed(2);

    if (
      expectedAmount !==
      receivedAmount
    ) {
      console.error(
        "Payfast amount mismatch",
        {
          expectedAmount,
          receivedAmount,
        }
      );

      return new NextResponse(
        "Invalid amount",
        { status: 400 }
      );
    }

    /*
     * Validate the ITN with Payfast
     */

    const sandbox =
      process.env.PAYFAST_SANDBOX === "true";

    const validationUrl = sandbox
      ? "https://sandbox.payfast.co.za/eng/query/validate"
      : "https://www.payfast.co.za/eng/query/validate";

    const validationResponse =
      await fetch(validationUrl, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body,
      });

    const validationResult =
      await validationResponse.text();

    if (
      validationResult.trim() !==
      "VALID"
    ) {
      console.error(
        "Payfast validation failed:",
        validationResult
      );

      return new NextResponse(
        "Payment validation failed",
        { status: 400 }
      );
    }

    /*
     * Only COMPLETE payments
     * can trigger production.
     */

    if (
      data.payment_status !==
      "COMPLETE"
    ) {
      return new NextResponse(
        "OK",
        { status: 200 }
      );
    }

    const paidAt =
      new Date().toISOString();

    /*
     * Mark invoice as PAID
     */

    const { error: invoiceUpdateError } =
      await adminSupabase
        .from("invoices")
        .update({
          status: "Paid",
          payment_reference:
            data.pf_payment_id || null,
          paid_at: paidAt,
          updated_at: paidAt,
        })
        .eq("id", invoice.id);

    if (invoiceUpdateError) {
      console.error(
        "Invoice payment update error:",
        invoiceUpdateError
      );

      return new NextResponse(
        "Could not update invoice",
        { status: 500 }
      );
    }

    /*
     * Payment confirmed.
     * Production can now begin.
     */

    if (invoice.quote_id) {
      const { error: quoteUpdateError } =
        await adminSupabase
          .from("quote_requests")
          .update({
            status: "In Production",
            status_updated_at: paidAt,
          })
          .eq(
            "id",
            invoice.quote_id
          );

      if (quoteUpdateError) {
        console.error(
          "Quote production status error:",
          quoteUpdateError
        );
      }
    }

    return new NextResponse(
      "OK",
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Payfast notification error:",
      error
    );

    return new NextResponse(
      "Something went wrong",
      { status: 500 }
    );
  }
}