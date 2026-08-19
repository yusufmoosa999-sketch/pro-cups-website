import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const message = String(body?.message || "").trim();

    // Check required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    // Check Resend API key
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          error: "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Send enquiry email
    const { data, error } = await resend.emails.send({
      from: "Pro Cups International <info@procupsinternational.com>",

      to: ["yusuf@smartpacktrading.co.za"],

      replyTo: email,

      subject: `New Website Enquiry - ${name}`,

      html: `
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            max-width: 650px;
            margin: 0 auto;
            padding: 30px;
            color: #111827;
          "
        >

          <h1
            style="
              margin: 0 0 10px;
              font-size: 26px;
              font-weight: 700;
            "
          >
            New Website Enquiry
          </h1>

          <p
            style="
              margin: 0 0 30px;
              color: #6b7280;
              font-size: 15px;
            "
          >
            A new enquiry has been submitted through
            procupsinternational.com.
          </p>

          <div
            style="
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 24px;
              background: #f9fafb;
            "
          >

            <p style="margin: 0 0 20px;">
              <strong>Name</strong><br />
              ${escapeHtml(name)}
            </p>

            <p style="margin: 0 0 20px;">
              <strong>Email</strong><br />
              ${escapeHtml(email)}
            </p>

            <p style="margin: 0 0 20px;">
              <strong>Phone</strong><br />
              ${escapeHtml(phone || "Not provided")}
            </p>

            <p style="margin: 0;">
              <strong>Enquiry</strong><br /><br />
              ${escapeHtml(message).replace(/\n/g, "<br />")}
            </p>

          </div>

          <div
            style="
              margin-top: 25px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #9ca3af;
              font-size: 13px;
            "
          >
            Pro Cups International<br />
            procupsinternational.com
          </div>

        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message || "Unable to send email.",
        },
        { status: 500 }
      );
    }

    console.log("CONTACT EMAIL SENT:", data);

    return NextResponse.json({
      success: true,
      message: "Your enquiry has been sent successfully.",
    });
  } catch (error) {
    console.error("CONTACT API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to send your enquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}