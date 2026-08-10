import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
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
        .eq("id", id)
        .eq("customer_id", user.id)
        .single();

    if (invoiceError || !invoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found.",
        },
        { status: 404 }
      );
    }

    if (
      invoice.status?.toLowerCase() ===
      "paid"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "This invoice has already been paid.",
        },
        { status: 400 }
      );
    }

    if (
      !invoice.amount ||
      Number(invoice.amount) < 5
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The invoice amount must be at least R5.00.",
        },
        { status: 400 }
      );
    }

    const merchantId =
      process.env.PAYFAST_MERCHANT_ID;

    const merchantKey =
      process.env.PAYFAST_MERCHANT_KEY;

    const passphrase =
      process.env.PAYFAST_PASSPHRASE;

    if (
      !merchantId ||
      !merchantKey ||
      !passphrase
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payfast is not configured correctly.",
        },
        { status: 500 }
      );
    }

    const sandbox =
      process.env.PAYFAST_SANDBOX === "true";

    const payfastUrl = sandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

    const origin =
      new URL(req.url).origin;

    const data: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,

      return_url:
        `${origin}/portal/invoices?payment=return`,

      cancel_url:
        `${origin}/portal/invoices?payment=cancelled`,

      notify_url:
        `${origin}/api/payfast/notify`,

      email_address: user.email || "",

      m_payment_id: invoice.id,

      amount: Number(invoice.amount).toFixed(2),

      item_name:
        `Invoice ${invoice.invoice_number}`,

      item_description:
        `Pro Cups invoice ${invoice.invoice_number}`,
    };

    const signature = generateSignature(
      data,
      passphrase
    );

    return NextResponse.json({
      success: true,
      paymentUrl: payfastUrl,
      fields: {
        ...data,
        signature,
      },
    });
  } catch (error) {
    console.error(
      "Payfast payment setup error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not start the payment.",
      },
      { status: 500 }
    );
  }
}