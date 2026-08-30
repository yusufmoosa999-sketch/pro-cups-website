import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

const adminSupabase = createAdminClient(
  supabaseUrl!,
  serviceRoleKey!
);

const resend = new Resend(resendApiKey);

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "pdf",
  "png",
  "jpg",
  "jpeg",
];

const FROM_EMAIL =
  "Pro Cups International <info@procupsinternational.com>";

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

async function sendProofReadyEmail({
  name,
  email,
  companyName,
  product,
  size,
  quantity,
  proofUrl,
}: {
  name: string;
  email: string;
  companyName: string;
  product: string;
  size: string;
  quantity: number;
  proofUrl: string;
}) {
  const customerName = escapeHtml(name || "Customer");

  const safeProofUrl = escapeHtml(proofUrl);

  const result = await resend.emails.send({
    from: FROM_EMAIL,

    to: [email],

    subject:
      "Your Print Proof Is Ready - Pro Cups International",

    html: emailLayout(`
      <p
        style="
          margin:0;
          font-size:28px;
          font-weight:800;
          color:#111827;
        "
      >
        Your Print Proof Is Ready
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
        Your print proof has been uploaded by
        <strong>Pro Cups International</strong> and is now ready
        for you to review.
      </p>

      <!-- ORDER DETAILS -->

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
          Order Details
        </div>

        <table
          style="
            width:100%;
            margin-top:16px;
            border-collapse:collapse;
          "
        >

          <tr>
            <td
              style="
                padding:8px 0;
                color:#64748b;
                font-size:14px;
              "
            >
              Company
            </td>

            <td
              style="
                padding:8px 0;
                text-align:right;
                font-weight:700;
                color:#111827;
                font-size:14px;
              "
            >
              ${escapeHtml(companyName || "Not provided")}
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:8px 0;
                color:#64748b;
                font-size:14px;
              "
            >
              Product
            </td>

            <td
              style="
                padding:8px 0;
                text-align:right;
                font-weight:700;
                color:#111827;
                font-size:14px;
              "
            >
              ${escapeHtml(product || "Not provided")}
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:8px 0;
                color:#64748b;
                font-size:14px;
              "
            >
              Size
            </td>

            <td
              style="
                padding:8px 0;
                text-align:right;
                font-weight:700;
                color:#111827;
                font-size:14px;
              "
            >
              ${escapeHtml(size || "Not provided")}
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:8px 0;
                color:#64748b;
                font-size:14px;
              "
            >
              Quantity
            </td>

            <td
              style="
                padding:8px 0;
                text-align:right;
                font-weight:700;
                color:#111827;
                font-size:14px;
              "
            >
              ${Number(quantity || 0).toLocaleString("en-ZA")}
            </td>
          </tr>

        </table>

      </div>

      <!-- PROOF BUTTON -->

      <div
        style="
          margin-top:28px;
          text-align:center;
        "
      >

        <a
          href="${safeProofUrl}"
          target="_blank"
          style="
            display:inline-block;
            background:#16a34a;
            color:#ffffff;
            text-decoration:none;
            font-size:16px;
            font-weight:700;
            padding:15px 28px;
            border-radius:10px;
          "
        >
          View &amp; Download Print Proof
        </a>

      </div>

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
          Please review the print proof carefully.
          Manufacturing will proceed only after the proof
          has been approved.
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
        If you have any questions or require changes to the
        proof, please contact us at
        info@procupsinternational.com.
      </p>
    `),
  });

  return result;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    /*
     * Get the existing quote first.
     *
     * This gives us the customer's email and order information
     * before uploading the proof.
     */

    const { data: existingQuote, error: quoteError } =
      await adminSupabase
        .from("quote_requests")
        .select(
          `
            id,
            contact_name,
            email,
            company_name,
            product,
            size,
            quantity
          `
        )
        .eq("id", id)
        .single();

    if (quoteError || !existingQuote) {
      console.error(
        "Quote lookup error:",
        quoteError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Quote not found.",
        },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No proof file was provided.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "The selected proof file is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Proof files must be 25MB or smaller.",
        },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid proof type. Please upload PDF, PNG or JPG.",
        },
        { status: 400 }
      );
    }

    const safeFileName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/\s+/g, "_");

    const filePath =
      `proofs/${id}/${Date.now()}-${safeFileName}`;

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    let contentType = "application/octet-stream";

    if (extension === "pdf") {
      contentType = "application/pdf";
    }

    if (extension === "png") {
      contentType = "image/png";
    }

    if (
      extension === "jpg" ||
      extension === "jpeg"
    ) {
      contentType = "image/jpeg";
    }

    /*
     * Upload proof to the existing artwork bucket.
     */

    const { error: uploadError } =
      await adminSupabase.storage
        .from("artwork")
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "Proof upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            `Storage error: ${uploadError.message}`,
        },
        { status: 500 }
      );
    }

    /*
     * Keep the existing public URL functionality.
     */

    const {
      data: { publicUrl },
    } = adminSupabase.storage
      .from("artwork")
      .getPublicUrl(filePath);

    /*
     * Update the quote exactly as before.
     */

    const { error: updateError } =
      await adminSupabase
        .from("quote_requests")
        .update({
          quotation_proof_url: publicUrl,
          quotation_proof_path: filePath,
          status: "Awaiting Approval",
        })
        .eq("id", id);

    if (updateError) {
      console.error(
        "Proof database update error:",
        updateError
      );

      /*
       * If the database update fails, remove the newly
       * uploaded file so we don't leave an orphaned file.
       */

      await adminSupabase.storage
        .from("artwork")
        .remove([filePath]);

      return NextResponse.json(
        {
          success: false,
          error:
            `Proof uploaded but could not be linked to the quote: ${updateError.message}`,
        },
        { status: 500 }
      );
    }

    /*
     * Send the customer the automatic proof-ready email.
     *
     * IMPORTANT:
     * Email failure does NOT undo the successful upload.
     */

    const customerEmail =
      String(existingQuote.email || "").trim();

    let emailSent = false;

    if (customerEmail) {
      try {
        if (!resendApiKey) {
          console.error(
            "RESEND_API_KEY is missing. Proof email was not sent."
          );
        } else {
          const emailResult =
            await sendProofReadyEmail({
              name: String(
                existingQuote.contact_name || ""
              ),

              email: customerEmail,

              companyName: String(
                existingQuote.company_name || ""
              ),

              product: String(
                existingQuote.product || ""
              ),

              size: String(
                existingQuote.size || ""
              ),

              quantity: Number(
                existingQuote.quantity || 0
              ),

              proofUrl: publicUrl,
            });

          if (emailResult.error) {
            console.error(
              "Proof email RESEND error:",
              emailResult.error
            );
          } else {
            emailSent = true;

            console.log(
              "Proof ready email sent:",
              emailResult.data
            );
          }
        }
      } catch (emailError) {
        console.error(
          "Proof ready email failed:",
          emailError
        );
      }
    } else {
      console.warn(
        "Proof uploaded but customer has no email address:",
        id
      );
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      filePath,
      publicUrl,
      emailSent,
    });

  } catch (error) {
    console.error(
      "Proof API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while uploading the proof.",
      },
      { status: 500 }
    );
  }
}