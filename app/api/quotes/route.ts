import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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

export async function POST(req: Request) {
  try {
    /*
     * ---------------------------------------------------------
     * OPTIONAL LOGIN
     * ---------------------------------------------------------
     *
     * Customers DO NOT need an account to request a quote.
     *
     * If they are logged in, we still save their customer_id.
     * If they are not logged in, customer_id stays null.
     */

    let userId: string | null = null;

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
                    cookieStore.set(name, value, options);
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

      if (user) {
        userId = user.id;
      }
    } catch (authError) {
      /*
       * Authentication is optional for quote requests.
       *
       * If there is no logged-in user, we simply continue
       * as a guest quote request.
       */

      console.log(
        "No authenticated customer. Continuing as guest."
      );
    }

    /*
     * ---------------------------------------------------------
     * READ REQUEST
     * ---------------------------------------------------------
     */

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

      /*
       * Customer's browser timezone.
       *
       * Examples:
       * Africa/Johannesburg
       * Europe/London
       * America/New_York
       */
      customer_timezone,
    } = body;

    /*
     * ---------------------------------------------------------
     * VALIDATION
     * ---------------------------------------------------------
     */

    const cleanCompanyName =
      String(company_name || "").trim();

    const cleanContactName =
      String(contact_name || "").trim();

    const cleanEmail =
      String(email || "").trim();

    const cleanPhone =
      String(phone || "").trim();

    const cleanProduct =
      String(product || "").trim();

    const cleanSize =
      String(size || "").trim();

    const cleanMessage =
      String(message || "").trim();

    /*
     * Email is REQUIRED for quote requests.
     */

    if (!cleanEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email address is required when requesting a quote.",
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
            "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * CUSTOMER TIMEZONE
     * ---------------------------------------------------------
     *
     * We do NOT use IP location.
     *
     * The customer's browser supplies its IANA timezone,
     * for example:
     *
     * Africa/Johannesburg
     * Europe/London
     * America/New_York
     *
     * The timezone is only used when displaying dates/times.
     * The actual timestamp will continue to be stored normally
     * by Supabase.
     */

    const cleanCustomerTimezone =
      typeof customer_timezone === "string" &&
      customer_timezone.trim()
        ? customer_timezone.trim()
        : null;

    /*
     * ---------------------------------------------------------
     * INSERT QUOTE
     * ---------------------------------------------------------
     */

    const quoteInsert = {
      company_name: cleanCompanyName,
      contact_name: cleanContactName,
      email: cleanEmail,
      phone: cleanPhone,
      product: cleanProduct,
      size: cleanSize,
      quantity:
        quantity !== undefined &&
        quantity !== null &&
        quantity !== ""
          ? Number(quantity)
          : null,
      message: cleanMessage,
      artwork_url:
        artwork_url || null,
      artwork_path:
        artwork_path || null,

      /*
       * Logged-in customers retain their customer_id.
       *
       * Guest customers have NULL here.
       */
      customer_id: userId,

      /*
       * Save the timezone of the browser that submitted
       * the quote.
       */
      customer_timezone:
        cleanCustomerTimezone,
    };

    const { data, error } = await supabase
      .from("quote_requests")
      .insert([quoteInsert])
      .select()
      .single();

    if (error) {
      console.error(
        "Quote insert error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log(
      "Quote created successfully:",
      data.id
    );

    /*
     * ---------------------------------------------------------
     * EMAIL NOTIFICATIONS
     * ---------------------------------------------------------
     *
     * We save the quote FIRST.
     *
     * This is important because an email failure must not
     * cause the customer to accidentally submit the quote
     * multiple times.
     */

    const apiKey =
      process.env.RESEND_API_KEY;

    if (apiKey) {
      const resend = new Resend(apiKey);

      /*
       * -------------------------------------------------------
       * EMAIL TO PRO CUPS
       * -------------------------------------------------------
       */

      const adminEmail =
        await resend.emails.send({
          from:
            "Pro Cups International <info@procupsinternational.com>",

          to: [
            "info@procupsinternational.com",
          ],

          replyTo: cleanEmail,

          subject:
            `New Quote Request - ${
              cleanCompanyName ||
              cleanContactName ||
              "Website Customer"
            }`,

          html: `
            <div style="
              margin:0;
              padding:40px 20px;
              background:#f4f6f8;
              font-family:Arial,Helvetica,sans-serif;
              color:#111827;
            ">

              <div style="
                max-width:650px;
                margin:0 auto;
                background:#ffffff;
                border-radius:18px;
                overflow:hidden;
                border:1px solid #e5e7eb;
              ">

                <div style="
                  background:#008c3a;
                  padding:28px 32px;
                  color:#ffffff;
                ">

                  <div style="
                    font-size:13px;
                    font-weight:bold;
                    letter-spacing:2px;
                    text-transform:uppercase;
                    opacity:.9;
                  ">
                    Pro Cups International
                  </div>

                  <h1 style="
                    margin:10px 0 0;
                    font-size:28px;
                    line-height:1.2;
                  ">
                    New Quote Request
                  </h1>

                </div>

                <div style="
                  padding:32px;
                ">

                  <p style="
                    margin:0 0 24px;
                    font-size:16px;
                    line-height:1.6;
                    color:#4b5563;
                  ">
                    A new quote request has been submitted
                    through your website.
                  </p>

                  <div style="
                    border:1px solid #e5e7eb;
                    border-radius:12px;
                    overflow:hidden;
                  ">

                    <div style="
                      padding:16px 20px;
                      border-bottom:1px solid #e5e7eb;
                    ">
                      <strong>Quote ID</strong><br />
                      ${escapeHtml(String(data.id))}
                    </div>

                    <div style="
                      padding:16px 20px;
                      border-bottom:1px solid #e5e7eb;
                    ">
                      <strong>Company</strong><br />
                      ${escapeHtml(
                        cleanCompanyName ||
                          "Not provided"
                      )}
                    </div>

                    <div style="
                      padding:16px 20px;
                      border-bottom:1px solid #e5e7eb;
                    ">
                      <strong>Contact Person</strong><br />
                      ${escapeHtml(
                        cleanContactName ||
                          "Not provided"
                      )}
                    </div>

                    <div style="
                      padding:16px 20px;
                      border-bottom:1px solid #e5e7eb;
                    ">
                      <strong>Email</strong><br />
                      ${escapeHtml(cleanEmail)}
                    </div>

                    <div style="
                      padding:16px 20px;
                      border-bottom:1px solid #e5e7eb;
                    ">
                      <strong>Phone</strong><br />
                      ${escapeHtml(
                        cleanPhone ||
                          "Not provided"
                      )}
                    </div>

                    <div style="
                      padding:16px 20px;
                      border-bottom:1px solid #e5e7eb;
                    ">
                      <strong>Product</strong><br />
                      ${escapeHtml(
                        cleanProduct ||
                          "Not provided"
                      )}
                    </div>

                    <div style="
                      padding:16px 20px;
                      border-bottom:1px solid #e5e7eb;
                    ">
                      <strong>Size</strong><br />
                      ${escapeHtml(
                        cleanSize ||
                          "Not provided"
                      )}
                    </div>

                    <div style="
                      padding:16px 20px;
                      border-bottom:1px solid #e5e7eb;
                    ">
                      <strong>Quantity</strong><br />
                      ${
                        quantity
                          ? escapeHtml(
                              Number(quantity).toLocaleString(
                                "en-ZA"
                              )
                            )
                          : "Not provided"
                      }
                    </div>

                    <div style="
                      padding:16px 20px;
                    ">
                      <strong>Customer Message</strong><br /><br />
                      ${
                        escapeHtml(
                          cleanMessage ||
                            "No message provided."
                        ).replace(
                          /\n/g,
                          "<br />"
                        )
                      }
                    </div>

                  </div>

                  <div style="
                    margin-top:28px;
                    padding:18px 20px;
                    background:#f0fdf4;
                    border:1px solid #bbf7d0;
                    border-radius:12px;
                    color:#166534;
                    font-size:14px;
                    line-height:1.6;
                  ">
                    This customer does not need to have an
                    account to submit a quote request.
                  </div>

                </div>

                <div style="
                  padding:24px 32px;
                  background:#f9fafb;
                  border-top:1px solid #e5e7eb;
                  font-size:13px;
                  line-height:1.6;
                  color:#6b7280;
                ">
                  <strong style="color:#111827;">
                    Pro Cups International
                  </strong>
                  <br />
                  Custom Printed Paper Cups
                  <br />
                  procupsinternational.com
                </div>

              </div>

            </div>
          `,
        });

      if (adminEmail.error) {
        console.error(
          "ADMIN QUOTE EMAIL ERROR:",
          adminEmail.error
        );
      } else {
        console.log(
          "ADMIN QUOTE EMAIL SENT:",
          adminEmail.data
        );
      }

      /*
       * -------------------------------------------------------
       * CONFIRMATION EMAIL TO CUSTOMER
       * -------------------------------------------------------
       */

      const customerEmail =
        await resend.emails.send({
          from:
            "Pro Cups International <info@procupsinternational.com>",

          to: [cleanEmail],

          subject:
            "Quote Request Received - Pro Cups International",

          html: `
            <div style="
              margin:0;
              padding:40px 20px;
              background:#f4f6f8;
              font-family:Arial,Helvetica,sans-serif;
              color:#111827;
            ">

              <div style="
                max-width:650px;
                margin:0 auto;
                background:#ffffff;
                border-radius:18px;
                overflow:hidden;
                border:1px solid #e5e7eb;
              ">

                <div style="
                  padding:30px 32px;
                  border-bottom:1px solid #e5e7eb;
                ">

                  <div style="
                    font-size:26px;
                    font-weight:900;
                    color:#008c3a;
                  ">
                    Pro Cups
                  </div>

                  <div style="
                    margin-top:4px;
                    font-size:12px;
                    font-weight:bold;
                    letter-spacing:2px;
                    color:#6b7280;
                    text-transform:uppercase;
                  ">
                    International
                  </div>

                </div>

                <div style="
                  padding:36px 32px;
                ">

                  <div style="
                    display:inline-block;
                    padding:8px 14px;
                    border-radius:999px;
                    background:#dcfce7;
                    color:#15803d;
                    font-size:12px;
                    font-weight:bold;
                    letter-spacing:1px;
                    text-transform:uppercase;
                  ">
                    Request Received
                  </div>

                  <h1 style="
                    margin:20px 0 12px;
                    font-size:30px;
                    line-height:1.2;
                    color:#111827;
                  ">
                    Your quote request was
                    received successfully.
                  </h1>

                  <p style="
                    margin:0;
                    font-size:16px;
                    line-height:1.7;
                    color:#4b5563;
                  ">
                    Hi ${
                      escapeHtml(
                        cleanContactName ||
                          "there"
                      )
                    },
                  </p>

                  <p style="
                    margin:18px 0 0;
                    font-size:16px;
                    line-height:1.7;
                    color:#4b5563;
                  ">
                    Thank you for contacting
                    Pro Cups International.
                    We have received your quote request
                    and our team will review your
                    requirements.
                  </p>

                  <div style="
                    margin-top:28px;
                    padding:22px;
                    border-radius:14px;
                    background:#f9fafb;
                    border:1px solid #e5e7eb;
                  ">

                    <div style="
                      font-size:12px;
                      font-weight:bold;
                      text-transform:uppercase;
                      letter-spacing:1px;
                      color:#6b7280;
                    ">
                      Request Details
                    </div>

                    <p style="
                      margin:12px 0 0;
                      font-size:15px;
                      line-height:1.7;
                      color:#111827;
                    ">
                      <strong>Product:</strong>
                      ${
                        escapeHtml(
                          cleanProduct ||
                            "Not specified"
                        )
                      }
                      <br />

                      <strong>Quantity:</strong>
                      ${
                        quantity
                          ? escapeHtml(
                              Number(quantity).toLocaleString(
                                "en-ZA"
                              )
                            )
                          : "Not specified"
                      }
                    </p>

                  </div>

                  <p style="
                    margin:28px 0 0;
                    font-size:16px;
                    line-height:1.7;
                    color:#4b5563;
                  ">
                    You don't need to keep checking the
                    website. We'll email you when your
                    quotation or print proof is ready,
                    along with any important updates.
                  </p>

                  <div style="
                    margin-top:30px;
                    padding:18px 20px;
                    background:#f0fdf4;
                    border:1px solid #bbf7d0;
                    border-radius:12px;
                    color:#166534;
                    font-size:14px;
                    line-height:1.6;
                  ">
                    <strong>Quote reference:</strong>
                    ${escapeHtml(String(data.id))}
                  </div>

                </div>

                <div style="
                  padding:26px 32px;
                  background:#f9fafb;
                  border-top:1px solid #e5e7eb;
                  color:#6b7280;
                  font-size:13px;
                  line-height:1.7;
                ">

                  <strong style="color:#111827;">
                    Pro Cups International
                  </strong>

                  <br />

                  Custom Printed Paper Cups

                  <br />

                  <span style="color:#9ca3af;">
                    This email was sent because a quote
                    request was submitted through
                    procupsinternational.com.
                  </span>

                </div>

              </div>

            </div>
          `,
        });

      if (customerEmail.error) {
        console.error(
          "CUSTOMER QUOTE EMAIL ERROR:",
          customerEmail.error
        );
      } else {
        console.log(
          "CUSTOMER QUOTE EMAIL SENT:",
          customerEmail.data
        );
      }
    } else {
      console.error(
        "RESEND_API_KEY is missing. Quote was saved but emails could not be sent."
      );
    }

    /*
     * ---------------------------------------------------------
     * SUCCESS
     * ---------------------------------------------------------
     */

    return NextResponse.json({
      success: true,
      quote: data,
      message:
        "Your quote request has been submitted successfully.",
    });

  } catch (err) {
    console.error(
      "QUOTE API ERROR:",
      err
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Server error while submitting your quote request.",
      },
      { status: 500 }
    );
  }
}