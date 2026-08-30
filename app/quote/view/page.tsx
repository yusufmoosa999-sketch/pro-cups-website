import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyQuoteAccessToken(token: string) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");

    const parts = decoded.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const [quoteId, timestamp, signature] = parts;

    if (!quoteId || !timestamp || !signature) {
      return null;
    }

    const payload = `${quoteId}.${timestamp}`;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      .update(payload)
      .digest("hex");

    if (signature.length !== expectedSignature.length) {
      return null;
    }

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return null;
    }

    /*
     * Access links are valid for 90 days.
     * This gives customers plenty of time to access
     * their quotation and proof.
     */
    const createdAt = Number(timestamp);

    if (!Number.isFinite(createdAt)) {
      return null;
    }

    const ninetyDays =
      90 * 24 * 60 * 60 * 1000;

    if (Date.now() - createdAt > ninetyDays) {
      return null;
    }

    return quoteId;
  } catch {
    return null;
  }
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) {
    return "—";
  }

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(Number(value));
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function statusStyles(status: string | null | undefined) {
  switch (status) {
    case "Approved":
      return {
        background: "#dcfce7",
        text: "#166534",
      };

    case "Awaiting Approval":
      return {
        background: "#fef3c7",
        text: "#92400e",
      };

    case "Completed":
      return {
        background: "#dcfce7",
        text: "#166534",
      };

    case "Rejected":
      return {
        background: "#fee2e2",
        text: "#991b1b",
      };

    default:
      return {
        background: "#f1f5f9",
        text: "#475569",
      };
  }
}

export default async function PublicQuoteView({
  searchParams,
}: {
  searchParams: Promise<{
    access?: string;
  }>;
}) {
  const params = await searchParams;

  const accessToken = params.access;

  /*
   * No access token.
   */
  if (!accessToken) {
    return (
      <ErrorPage
        title="Quotation Link Missing"
        message="This quotation link is incomplete. Please use the link provided in your Pro Cups email."
      />
    );
  }

  /*
   * Verify the signed access token.
   */
  const quoteId = verifyQuoteAccessToken(accessToken);

  if (!quoteId) {
    return (
      <ErrorPage
        title="Quotation Link Invalid"
        message="This quotation link is invalid or has expired. Please contact Pro Cups International if you need a new quotation link."
      />
    );
  }

  /*
   * Retrieve the quote using the server-side
   * service-role client.
   *
   * The service-role key NEVER reaches the browser.
   */
  const { data: quote, error } = await supabase
    .from("quote_requests")
    .select(
      `
        id,
        company_name,
        contact_name,
        email,
        phone,
        product,
        size,
        quantity,
        message,
        status,
        unit_price,
        subtotal,
        vat_amount,
        total_amount,
        quotation_notes,
        quotation_created_at,
        quotation_proof_url,
        quotation_proof_path,
        customer_approval_status,
        customer_quote_status,
        customer_quote_accepted_at,
        created_at
      `
    )
    .eq("id", quoteId)
    .single();

  if (error || !quote) {
    console.error("Public quote lookup error:", error);

    return (
      <ErrorPage
        title="Quotation Not Found"
        message="We couldn't find this quotation. Please contact Pro Cups International if you believe this is an error."
      />
    );
  }

  const styles = statusStyles(quote.status);

  const customerName =
    quote.contact_name || "Customer";

  const hasQuotation =
    quote.total_amount !== null &&
    quote.total_amount !== undefined;

  const hasProof =
    Boolean(quote.quotation_proof_url);

  const quoteAccepted =
    quote.customer_quote_status === "accepted";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#111827",
        padding: "30px 16px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            background: "#008f3c",
            borderRadius: "20px 20px 0 0",
            padding: "35px 25px",
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              lineHeight: "58px",
              margin: "0 auto",
              borderRadius: "15px",
              background: "#ffffff",
              color: "#008f3c",
              fontSize: "30px",
              fontWeight: 900,
            }}
          >
            P
          </div>

          <h1
            style={{
              margin: "16px 0 0",
              fontSize: "26px",
              fontWeight: 800,
            }}
          >
            Pro Cups International
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            Custom Paper Cups & Printing
          </p>
        </div>

        {/* MAIN CARD */}

        <div
          style={{
            background: "#ffffff",
            padding: "35px 25px",
            borderRadius: "0 0 20px 20px",
            border:
              "1px solid #e5e7eb",
            borderTop: "none",
          }}
        >

          {/* CUSTOMER */}

          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              Hello {customerName},
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                fontSize: "30px",
                lineHeight: 1.2,
                fontWeight: 900,
                color: "#111827",
              }}
            >
              Your Quotation
            </h2>

            <p
              style={{
                margin:
                  "12px 0 0",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#64748b",
              }}
            >
              Thank you for choosing
              Pro Cups International.
              Below you can view the
              quotation prepared for
              your request.
            </p>
          </div>

          {/* STATUS */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "28px",
              padding: "15px 18px",
              background: "#f8fafc",
              border:
                "1px solid #e5e7eb",
              borderRadius: "12px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#64748b",
              }}
            >
              Quote Status
            </span>

            <span
              style={{
                display: "inline-block",
                padding:
                  "7px 12px",
                borderRadius: "999px",
                background:
                  styles.background,
                color: styles.text,
                fontSize: "13px",
                fontWeight: 800,
              }}
            >
              {quote.status ||
                "Quotation Prepared"}
            </span>
          </div>

          {/* QUOTE DETAILS */}

          <div
            style={{
              border:
                "1px solid #e5e7eb",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >

            <div
              style={{
                padding:
                  "18px 20px",
                background: "#f8fafc",
                borderBottom:
                  "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#008f3c",
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing:
                    "2px",
                  textTransform:
                    "uppercase",
                }}
              >
                Order Details
              </p>
            </div>

            <div
              style={{
                padding: "20px",
              }}
            >

              <DetailRow
                label="Product"
                value={
                  quote.product ||
                  "Paper Cups"
                }
              />

              <DetailRow
                label="Size"
                value={
                  quote.size ||
                  "—"
                }
              />

              <DetailRow
                label="Quantity"
                value={
                  quote.quantity != null
                    ? Number(
                        quote.quantity
                      ).toLocaleString(
                        "en-ZA"
                      )
                    : "—"
                }
              />

              <DetailRow
                label="Unit Price"
                value={formatCurrency(
                  quote.unit_price
                )}
              />

              <DetailRow
                label="Quotation Date"
                value={formatDate(
                  quote.quotation_created_at
                )}
              />

            </div>
          </div>

          {/* PRICING */}

          {hasQuotation && (
            <div
              style={{
                marginTop: "22px",
                padding: "24px",
                background:
                  "#f8fafc",
                border:
                  "1px solid #e5e7eb",
                borderRadius: "16px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "20px",
                  marginBottom:
                    "14px",
                }}
              >
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "15px",
                  }}
                >
                  Subtotal
                </span>

                <strong>
                  {formatCurrency(
                    quote.subtotal
                  )}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "20px",
                  marginBottom:
                    "18px",
                }}
              >
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "15px",
                  }}
                >
                  VAT (15%)
                </span>

                <strong>
                  {formatCurrency(
                    quote.vat_amount
                  )}
                </strong>
              </div>

              <div
                style={{
                  borderTop:
                    "1px solid #dbe1e7",
                  paddingTop:
                    "18px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: "20px",
                }}
              >
                <span
                  style={{
                    fontSize: "19px",
                    fontWeight: 900,
                  }}
                >
                  Total
                </span>

                <span
                  style={{
                    fontSize: "25px",
                    fontWeight: 900,
                    color:
                      "#008f3c",
                  }}
                >
                  {formatCurrency(
                    quote.total_amount
                  )}
                </span>
              </div>

            </div>
          )}

          {/* NOTES */}

          {quote.quotation_notes && (
            <div
              style={{
                marginTop: "22px",
                padding: "20px",
                background:
                  "#ffffff",
                border:
                  "1px solid #e5e7eb",
                borderLeft:
                  "4px solid #008f3c",
                borderRadius:
                  "10px",
              }}
            >

              <h3
                style={{
                  margin:
                    "0 0 9px",
                  fontSize: "15px",
                  fontWeight: 800,
                }}
              >
                Notes from Pro Cups
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {quote.quotation_notes}
              </p>

            </div>
          )}

          {/* PRINT PROOF */}

          {hasProof && (
            <div
              style={{
                marginTop: "28px",
                padding: "24px",
                background:
                  "#ecfdf5",
                border:
                  "1px solid #bbf7d0",
                borderRadius:
                  "16px",
              }}
            >

              <h3
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 900,
                  color:
                    "#166534",
                }}
              >
                Your Print Proof Is Ready
              </h3>

              <p
                style={{
                  margin:
                    "9px 0 18px",
                  color:
                    "#166534",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                Your print proof is
                available to view and
                download.
              </p>

              <a
                href={
                  quote.quotation_proof_url
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:
                    "inline-block",
                  background:
                    "#008f3c",
                  color: "#ffffff",
                  textDecoration:
                    "none",
                  padding:
                    "13px 20px",
                  borderRadius:
                    "10px",
                  fontSize: "14px",
                  fontWeight: 800,
                }}
              >
                View & Download Proof →
              </a>

            </div>
          )}

          {/* ACCEPTED MESSAGE */}

          {quoteAccepted && (
            <div
              style={{
                marginTop: "24px",
                padding: "18px",
                background:
                  "#ecfdf5",
                border:
                  "1px solid #bbf7d0",
                borderRadius:
                  "12px",
                color:
                  "#166534",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              ✓ This quotation has been
              accepted.
            </div>
          )}

          {/* FOOTER */}

          <div
            style={{
              marginTop: "40px",
              paddingTop: "25px",
              borderTop:
                "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Pro Cups International
            </p>

            <p
              style={{
                margin:
                  "6px 0 0",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              Premium Paper Cups
              &amp; Custom Printing
            </p>

            <p
              style={{
                margin:
                  "10px 0 0",
                fontSize: "13px",
              }}
            >
              <a
                href="https://www.procupsinternational.com"
                style={{
                  color:
                    "#008f3c",
                  textDecoration:
                    "none",
                }}
              >
                procupsinternational.com
              </a>
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        gap: "20px",
        padding:
          "12px 0",
        borderBottom:
          "1px solid #f1f5f9",
      }}
    >
      <span
        style={{
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#111827",
          fontSize: "14px",
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function ErrorPage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        padding: "30px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "#ffffff",
          border:
            "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "40px 30px",
          textAlign: "center",
        }}
      >

        <div
          style={{
            width: "60px",
            height: "60px",
            lineHeight: "60px",
            margin: "0 auto",
            borderRadius: "16px",
            background:
              "#dcfce7",
            color: "#008f3c",
            fontSize: "30px",
            fontWeight: 900,
          }}
        >
          P
        </div>

        <h1
          style={{
            margin:
              "22px 0 10px",
            fontSize: "28px",
            fontWeight: 900,
            color: "#111827",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "15px",
            lineHeight: 1.7,
          }}
        >
          {message}
        </p>

        <a
          href="https://www.procupsinternational.com"
          style={{
            display:
              "inline-block",
            marginTop: "25px",
            background:
              "#008f3c",
            color: "#ffffff",
            textDecoration:
              "none",
            padding:
              "13px 22px",
            borderRadius:
              "10px",
            fontSize: "14px",
            fontWeight: 800,
          }}
        >
          Visit Pro Cups
        </a>

      </div>
    </main>
  );
}