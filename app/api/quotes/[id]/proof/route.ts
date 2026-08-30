import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "pdf",
  "png",
  "jpg",
  "jpeg",
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createQuoteAccessToken(quoteId: string) {
  const crypto = require("crypto");

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
    `${quoteId}.${timestamp}.${signature}`
  ).toString("base64url");
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    /*
     * ---------------------------------------------------------
     * GET QUOTE
     * ---------------------------------------------------------
     */

    const { data: quote, error: quoteError } =
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
            quantity,
            total_amount,
            quotation_proof_url,
            quotation_proof_path
          `
        )
        .eq("id", id)
        .single();

    if (quoteError || !quote) {
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

    /*
     * ---------------------------------------------------------
     * RECEIVE FILE
     * ---------------------------------------------------------
     */

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
          error:
            "Proof files must be 25MB or smaller.",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * VALIDATE EXTENSION
     * ---------------------------------------------------------
     */

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "";

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

    /*
     * ---------------------------------------------------------
     * CREATE SAFE FILE NAME
     * ---------------------------------------------------------
     */

    const safeFileName = file.name
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )
      .replace(/\s+/g, "_");

    const filePath =
      `proofs/${id}/${Date.now()}-${safeFileName}`;

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    /*
     * ---------------------------------------------------------
     * CONTENT TYPE
     * ---------------------------------------------------------
     */

    let contentType =
      "application/octet-stream";

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
     * ---------------------------------------------------------
     * UPLOAD TO SUPABASE STORAGE
     * ---------------------------------------------------------
     */

    const { error: uploadError } =
      await adminSupabase.storage
        .from("artwork")
        .upload(
          filePath,
          fileBuffer,
          {
            contentType,
            upsert: false,
          }
        );

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
     * ---------------------------------------------------------
     * PUBLIC STORAGE URL
     * ---------------------------------------------------------
     */

    const {
      data: { publicUrl },
    } = adminSupabase.storage
      .from("artwork")
      .getPublicUrl(filePath);

    /*
     * ---------------------------------------------------------
     * UPDATE QUOTE
     * ---------------------------------------------------------
     */

    const { error: updateError } =
      await adminSupabase
        .from("quote_requests")
        .update({
          quotation_proof_url:
            publicUrl,

          quotation_proof_path:
            filePath,

          status:
            "Awaiting Approval",
        })
        .eq("id", id);

    if (updateError) {
      console.error(
        "Proof database update error:",
        updateError
      );

      /*
       * If the database update fails,
       * remove the uploaded file so we
       * don't leave an orphaned proof.
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
     * ---------------------------------------------------------
     * SEND CUSTOMER EMAIL
     * ---------------------------------------------------------
     */

    let emailSent = false;

    const customerEmail =
      String(
        quote.email || ""
      ).trim();

    if (customerEmail) {
      const resendApiKey =
        process.env.RESEND_API_KEY;

      if (!resendApiKey) {
        console.error(
          "RESEND_API_KEY is missing. Proof uploaded but customer email was not sent."
        );
      } else {
        try {
          const resend =
            new Resend(
              resendApiKey
            );

          /*
           * Create the same secure
           * public quotation access link
           * used by the quotation email.
           */

          const accessToken =
            createQuoteAccessToken(
              quote.id
            );

          const siteUrl =
            (
              process.env.NEXT_PUBLIC_SITE_URL ||
              "https://www.procupsinternational.com"
            ).replace(/\/$/, "");

          const quoteUrl =
            `${siteUrl}/quote/view?access=${encodeURIComponent(
              accessToken
            )}`;

          const customerName =
            quote.contact_name ||
            "Customer";

          const safeCustomerName =
            escapeHtml(
              customerName
            );

          const safeProduct =
            escapeHtml(
              quote.product ||
                "Custom Paper Cups"
            );

          const safeQuantity =
            quote.quantity != null
              ? Number(
                  quote.quantity
                ).toLocaleString(
                  "en-ZA"
                )
              : "—";

          const safeCompany =
            quote.company_name
              ? escapeHtml(
                  quote.company_name
                )
              : "";

          const { data, error } =
            await resend.emails.send(
              {
                from:
                  "Pro Cups International <info@procupsinternational.com>",

                to: [customerEmail],

                subject:
                  "Your Print Proof Is Ready | Pro Cups International",

                html: `
                  <div
                    style="
                      margin:0;
                      padding:40px 15px;
                      background:#f4f6f8;
                      font-family:Arial,Helvetica,sans-serif;
                      color:#172033;
                    "
                  >

                    <div
                      style="
                        max-width:620px;
                        margin:0 auto;
                        background:#ffffff;
                        border:1px solid #e5e7eb;
                        border-radius:18px;
                        overflow:hidden;
                      "
                    >

                      <!-- HEADER -->

                      <div
                        style="
                          background:#008f3c;
                          padding:30px 25px;
                          text-align:center;
                        "
                      >

                        <div
                          style="
                            display:inline-block;
                            width:58px;
                            height:58px;
                            line-height:58px;
                            border-radius:15px;
                            background:#ffffff;
                            color:#008f3c;
                            font-size:30px;
                            font-weight:900;
                          "
                        >
                          P
                        </div>

                        <div
                          style="
                            margin-top:14px;
                            color:#ffffff;
                            font-size:24px;
                            font-weight:800;
                          "
                        >
                          Pro Cups International
                        </div>

                        <div
                          style="
                            margin-top:6px;
                            color:#dcfce7;
                            font-size:13px;
                          "
                        >
                          Premium Paper Cups & Custom Printing
                        </div>

                      </div>

                      <!-- BODY -->

                      <div
                        style="
                          padding:38px 30px;
                        "
                      >

                        <div
                          style="
                            color:#64748b;
                            font-size:15px;
                            margin-bottom:8px;
                          "
                        >
                          Hello ${safeCustomerName},
                        </div>

                        <h1
                          style="
                            margin:0;
                            color:#111827;
                            font-size:30px;
                            line-height:1.2;
                            font-weight:900;
                          "
                        >
                          Your Print Proof Is Ready
                        </h1>

                        <p
                          style="
                            margin:18px 0 0;
                            color:#64748b;
                            font-size:16px;
                            line-height:1.7;
                          "
                        >
                          Your print proof for your custom paper
                          cups has been prepared and is now ready
                          for you to review.
                        </p>

                        <!-- ORDER SUMMARY -->

                        <div
                          style="
                            margin-top:28px;
                            padding:22px;
                            background:#f8fafc;
                            border:1px solid #e5e7eb;
                            border-radius:14px;
                          "
                        >

                          <div
                            style="
                              color:#008f3c;
                              font-size:12px;
                              font-weight:800;
                              letter-spacing:2px;
                              text-transform:uppercase;
                              margin-bottom:15px;
                            "
                          >
                            Order Summary
                          </div>

                          <div
                            style="
                              padding:8px 0;
                              font-size:14px;
                            "
                          >
                            <strong>Product:</strong>
                            ${safeProduct}
                          </div>

                          ${
                            safeCompany
                              ? `
                                <div
                                  style="
                                    padding:8px 0;
                                    font-size:14px;
                                  "
                                >
                                  <strong>Company:</strong>
                                  ${safeCompany}
                                </div>
                              `
                              : ""
                          }

                          <div
                            style="
                              padding:8px 0;
                              font-size:14px;
                            "
                          >
                            <strong>Quantity:</strong>
                            ${safeQuantity}
                          </div>

                        </div>

                        <!-- ACTION -->

                        <div
                          style="
                            margin-top:30px;
                            padding:25px;
                            background:#ecfdf5;
                            border:1px solid #bbf7d0;
                            border-radius:14px;
                            text-align:center;
                          "
                        >

                          <div
                            style="
                              color:#166534;
                              font-size:18px;
                              font-weight:800;
                            "
                          >
                            Review Your Print Proof
                          </div>

                          <p
                            style="
                              margin:9px 0 20px;
                              color:#166534;
                              font-size:14px;
                              line-height:1.6;
                            "
                          >
                            Click below to view your quotation
                            and access your print proof.
                            No account or login is required.
                          </p>

                          <a
                            href="${quoteUrl}"
                            style="
                              display:inline-block;
                              background:#008f3c;
                              color:#ffffff;
                              text-decoration:none;
                              padding:15px 25px;
                              border-radius:10px;
                              font-size:15px;
                              font-weight:800;
                            "
                          >
                            View Print Proof →
                          </a>

                        </div>

                        <p
                          style="
                            margin:28px 0 0;
                            color:#64748b;
                            font-size:14px;
                            line-height:1.7;
                          "
                        >
                          Please review the proof carefully and
                          let us know if everything looks correct.
                          Once approved, we can proceed with the
                          next stage of your order.
                        </p>

                      </div>

                      <!-- FOOTER -->

                      <div
                        style="
                          border-top:1px solid #e5e7eb;
                          padding:25px 20px;
                          text-align:center;
                          background:#ffffff;
                        "
                      >

                        <div
                          style="
                            color:#111827;
                            font-size:15px;
                            font-weight:800;
                          "
                        >
                          Pro Cups International
                        </div>

                        <div
                          style="
                            margin-top:6px;
                            color:#64748b;
                            font-size:13px;
                          "
                        >
                          Premium Paper Cups & Custom Printing
                        </div>

                        <div
                          style="
                            margin-top:10px;
                            font-size:13px;
                          "
                        >
                          <a
                            href="${siteUrl}"
                            style="
                              color:#008f3c;
                              text-decoration:none;
                            "
                          >
                            procupsinternational.com
                          </a>
                        </div>

                        <div
                          style="
                            margin-top:15px;
                            color:#94a3b8;
                            font-size:11px;
                            line-height:1.5;
                          "
                        >
                          This email was sent regarding your
                          Pro Cups International quotation request.
                        </div>

                      </div>

                    </div>

                  </div>
                `,
              }
            );

          if (error) {
            console.error(
              "PROOF EMAIL ERROR:",
              error
            );
          } else {
            console.log(
              "PROOF EMAIL SENT:",
              data
            );

            emailSent = true;
          }
        } catch (emailError) {
          /*
           * Do NOT fail the proof upload
           * simply because the email failed.
           *
           * The proof has already been
           * successfully uploaded and linked.
           */

          console.error(
            "Proof notification email error:",
            emailError
          );
        }
      }
    } else {
      console.error(
        "Quote has no customer email address. Proof uploaded but no notification could be sent."
      );
    }

    /*
     * ---------------------------------------------------------
     * SUCCESS
     * ---------------------------------------------------------
     */

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