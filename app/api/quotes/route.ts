import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Resend } from "resend";

const supabase = createClient(
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

        <div
          style="
            width:100%;
            padding:40px 15px;
            box-sizing:border-box;
          "
        >

          <div
            style="
              max-width:650px;
              margin:0 auto;
              background:#ffffff;
              border-radius:18px;
              overflow:hidden;
              border:1px solid #e5e7eb;
            "
          >

            <!-- HEADER -->

            <div
              style="
                padding:28px 35px;
                background:#0f172a;
              "
            >

              <div
                style="
                  font-size:24px;
                  font-weight:800;
                  color:#ffffff;
                "
              >
                Pro Cups
                <span style="color:#4ade80;">
                  International
                </span>
              </div>

              <div
                style="
                  margin-top:6px;
                  font-size:13px;
                  color:#cbd5e1;
                "
              >
                Premium Paper Cup Manufacturing
              </div>

            </div>

            <!-- CONTENT -->

            <div style="padding:35px;">
              ${content}
            </div>

            <!-- FOOTER -->

            <div
              style="
                padding:25px 35px;
                border-top:1px solid #e5e7eb;
                background:#ffffff;
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
                  line-height:21px;
                  color:#64748b;
                "
              >
                Premium custom printed paper cups<br />
                South Africa
              </div>

              <div
                style="
                  margin-top:12px;
                  font-size:13px;
                "
              >

                <a
                  href="mailto:info@procupsinternational.com"
                  style="
                    color:#15803d;
                    text-decoration:none;
                    font-weight:600;
                  "
                >
                  info@procupsinternational.com
                </a>

                <br />

                <a
                  href="https://procupsinternational.com"
                  style="
                    color:#15803d;
                    text-decoration:none;
                    font-weight:600;
                  "
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

async function sendCustomerConfirmationEmail({
  name,
  email,
  quoteId,
}: {
  name: string;
  email: string;
  quoteId: string;
}) {
  const customerName = escapeHtml(name || "Customer");

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject:
      "Quote Request Received - Pro Cups International",

    html: emailLayout(`
      <p
        style="
          margin:0;
          font-size:28px;
          font-weight:800;
          color:#111827;
        "
      >
        Quote Request Received
      </p>

      <p
        style="
          margin:18px 0 0;
          font-size:16px;
          line-height:27px;
          color:#475569;
        "
      >
        Hi ${customerName},
      </p>

      <p
        style="
          margin:14px 0 0;
          font-size:16px;
          line-height:27px;
          color:#475569;
        "
      >
        Thank you for requesting a quotation from
        <strong>Pro Cups International</strong>.
        We have successfully received your request.
      </p>

      <div
        style="
          margin-top:28px;
          padding:22px;
          border-radius:14px;
          background:#f0fdf4;
          border:1px solid #bbf7d0;
        "
      >

        <div
          style="
            font-size:13px;
            font-weight:700;
            text-transform:uppercase;
            letter-spacing:1px;
            color:#15803d;
          "
        >
          Quote Submitted Successfully
        </div>

        <p
          style="
            margin:12px 0 0;
            font-size:15px;
            line-height:24px;
            color:#166534;
          "
        >
          Your quotation request has been sent successfully.
          Our team will review your requirements and get back
          to you as soon as possible.
        </p>

      </div>

      <div
        style="
          margin-top:24px;
          padding:20px;
          border-radius:14px;
          background:#f8fafc;
          border:1px solid #e2e8f0;
        "
      >

        <div
          style="
            font-size:13px;
            font-weight:700;
            text-transform:uppercase;
            letter-spacing:1px;
            color:#64748b;
          "
        >
          Reference
        </div>

        <p
          style="
            margin:9px 0 0;
            font-size:14px;
            font-weight:700;
            color:#111827;
            word-break:break-all;
          "
        >
          ${escapeHtml(quoteId)}
        </p>

      </div>

      <p
        style="
          margin:25px 0 0;
          font-size:14px;
          line-height:23px;
          color:#64748b;
        "
      >
        You do not need to repeatedly check the website.
        We will email you when there is an update to your
        quotation or print proof.
      </p>

      <p
        style="
          margin:18px 0 0;
          font-size:14px;
          line-height:23px;
          color:#64748b;
        "
      >
        If you have any questions, simply reply to this email
        or contact us at
        info@procupsinternational.com.
      </p>
    `),
  });
}

async function sendNewQuoteNotificationEmail({
  name,
  email,
  phone,
  companyName,
  product,
  size,
  quantity,
  message,
  quoteId,
}: {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  product: string;
  size: string;
  quantity: number;
  message: string;
  quoteId: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,

    to: [COMPANY_EMAIL],

    replyTo: email,

    subject:
      `New Quote Request - ${name || "Customer"}`,

    html: emailLayout(`
      <p
        style="
          margin:0;
          font-size:28px;
          font-weight:800;
          color:#111827;
        "
      >
        New Quote Request
      </p>

      <p
        style="
          margin:12px 0 0;
          font-size:15px;
          line-height:24px;
          color:#64748b;
        "
      >
        A new quotation request has been submitted through
        procupsinternational.com.
      </p>

      <!-- CUSTOMER -->

      <div
        style="
          margin-top:28px;
          padding:22px;
          border-radius:14px;
          background:#f8fafc;
          border:1px solid #e2e8f0;
        "
      >

        <div
          style="
            font-size:13px;
            font-weight:700;
            text-transform:uppercase;
            letter-spacing:1px;
            color:#15803d;
          "
        >
          Customer
        </div>

        <table
          style="
            width:100%;
            margin-top:15px;
            border-collapse:collapse;
          "
        >

          <tr>
            <td style="padding:7px 0;color:#64748b;font-size:14px;">
              Name
            </td>

            <td style="padding:7px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${escapeHtml(name || "Not provided")}
            </td>
          </tr>

          <tr>
            <td style="padding:7px 0;color:#64748b;font-size:14px;">
              Email
            </td>

            <td style="padding:7px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${escapeHtml(email)}
            </td>
          </tr>

          <tr>
            <td style="padding:7px 0;color:#64748b;font-size:14px;">
              Phone
            </td>

            <td style="padding:7px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${escapeHtml(phone || "Not provided")}
            </td>
          </tr>

          <tr>
            <td style="padding:7px 0;color:#64748b;font-size:14px;">
              Company
            </td>

            <td style="padding:7px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${escapeHtml(companyName || "Not provided")}
            </td>
          </tr>

        </table>

      </div>

      <!-- REQUEST -->

      <div
        style="
          margin-top:18px;
          padding:22px;
          border-radius:14px;
          background:#ffffff;
          border:1px solid #e2e8f0;
        "
      >

        <div
          style="
            font-size:13px;
            font-weight:700;
            text-transform:uppercase;
            letter-spacing:1px;
            color:#15803d;
          "
        >
          Quote Requirements
        </div>

        <table
          style="
            width:100%;
            margin-top:15px;
            border-collapse:collapse;
          "
        >

          <tr>
            <td style="padding:7px 0;color:#64748b;font-size:14px;">
              Product
            </td>

            <td style="padding:7px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${escapeHtml(product || "Not provided")}
            </td>
          </tr>

          <tr>
            <td style="padding:7px 0;color:#64748b;font-size:14px;">
              Size
            </td>

            <td style="padding:7px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${escapeHtml(size || "Not provided")}
            </td>
          </tr>

          <tr>
            <td style="padding:7px 0;color:#64748b;font-size:14px;">
              Quantity
            </td>

            <td style="padding:7px 0;text-align:right;font-weight:700;color:#111827;font-size:14px;">
              ${Number(quantity || 0).toLocaleString("en-ZA")}
            </td>
          </tr>

        </table>

      </div>

      ${
        message
          ? `
            <div
              style="
                margin-top:18px;
                padding:22px;
                border-radius:14px;
                background:#ffffff;
                border:1px solid #e2e8f0;
              "
            >

              <div
                style="
                  font-size:13px;
                  font-weight:700;
                  text-transform:uppercase;
                  letter-spacing:1px;
                  color:#15803d;
                "
              >
                Customer Message
              </div>

              <p
                style="
                  margin:12px 0 0;
                  font-size:14px;
                  line-height:24px;
                  color:#475569;
                "
              >
                ${escapeHtml(message).replace(/\n/g, "<br />")}
              </p>

            </div>
          `
          : ""
      }

      <div
        style="
          margin-top:24px;
          padding:18px 20px;
          border-left:4px solid #16a34a;
          background:#f0fdf4;
        "
      >

        <p
          style="
            margin:0;
            font-size:14px;
            line-height:23px;
            color:#166534;
          "
        >
          Quote reference:
          <strong>${escapeHtml(quoteId)}</strong>
        </p>

      </div>

      <p
        style="
          margin:25px 0 0;
          font-size:14px;
          color:#64748b;
        "
      >
        You can reply directly to this email to contact the
        customer.
      </p>
    `),
  });
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const authSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },

          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(
                ({ name, value, options }) => {
                  cookieStore.set(
                    name,
                    value,
                    options
                  );
                }
              );
            } catch {
              // Cookies may be read-only in this context.
            }
          },
        },
      }
    );

    const {
      data: { user },
    } = await authSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be logged in to submit a quote.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    console.log("Inserting quote:", body);

    const {
      company_name,
      contact_name,
      email,
      phone,
      product,
      size,
      quantity,
      message,
      artwork_url,
      artwork_path,
    } = body;

    /*
     * EMAIL IS REQUIRED FOR QUOTE REQUESTS.
     */

    const cleanEmail =
      String(email || "").trim();

    if (!cleanEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An email address is required to request a quote.",
        },
        { status: 400 }
      );
    }

    /*
     * Basic email validation.
     */

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      );

    if (!emailIsValid) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    /*
     * Insert the quote exactly as before.
     */

    const { data, error } = await supabase
      .from("quote_requests")
      .insert([
        {
          company_name,
          contact_name,
          email: cleanEmail,
          phone,
          product,
          size,
          quantity,
          message,
          artwork_url,
          artwork_path,
          customer_id: user.id,
        },
      ])
      .select()
      .single();

    console.log("Insert result:", data);
    console.log("Insert error:", error);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    /*
     * The quote has successfully been saved.
     *
     * Now send TWO emails:
     *
     * 1. Customer confirmation
     * 2. Internal notification to Pro Cups
     *
     * Email failures do NOT delete or invalidate the quote.
     */

    let customerEmailSent = false;
    let internalEmailSent = false;

    if (process.env.RESEND_API_KEY) {
      /*
       * CUSTOMER EMAIL
       */

      try {
        const customerEmailResult =
          await sendCustomerConfirmationEmail({
            name: String(
              contact_name || ""
            ),

            email: cleanEmail,

            quoteId: String(data.id),
          });

        if (customerEmailResult.error) {
          console.error(
            "Customer quote confirmation error:",
            customerEmailResult.error
          );
        } else {
          customerEmailSent = true;

          console.log(
            "Customer quote confirmation sent:",
            customerEmailResult.data
          );
        }
      } catch (emailError) {
        console.error(
          "Customer quote confirmation failed:",
          emailError
        );
      }

      /*
       * INTERNAL PRO CUPS EMAIL
       */

      try {
        const internalEmailResult =
          await sendNewQuoteNotificationEmail({
            name: String(
              contact_name || ""
            ),

            email: cleanEmail,

            phone: String(
              phone || ""
            ),

            companyName: String(
              company_name || ""
            ),

            product: String(
              product || ""
            ),

            size: String(
              size || ""
            ),

            quantity: Number(
              quantity || 0
            ),

            message: String(
              message || ""
            ),

            quoteId: String(data.id),
          });

        if (internalEmailResult.error) {
          console.error(
            "Internal quote notification error:",
            internalEmailResult.error
          );
        } else {
          internalEmailSent = true;

          console.log(
            "Internal quote notification sent:",
            internalEmailResult.data
          );
        }
      } catch (emailError) {
        console.error(
          "Internal quote notification failed:",
          emailError
        );
      }
    } else {
      console.error(
        "RESEND_API_KEY is missing. Quote emails were not sent."
      );
    }

    /*
     * Return success regardless of email delivery.
     *
     * The database insertion succeeded, so the quote itself
     * remains successful.
     */

    return NextResponse.json({
      success: true,

      quote: data,

      customerEmailSent,

      internalEmailSent,

      message:
        "Your quote request has been submitted successfully.",
    });

  } catch (err) {
    console.error(
      "Quote submission error:",
      err
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Server Error",
      },
      { status: 500 }
    );
  }
}