import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

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

    const { data, error } = await resend.emails.send({
      from: "Pro Cups International <onboarding@resend.dev>",
      to: ["yusuf@smartpacktrading.co.za"],
      replyTo: email,
      subject: `New Website Enquiry - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto;">
          
          <h2 style="color: #111827;">
            New Website Enquiry
          </h2>

          <p style="color: #374151;">
            Someone has submitted an enquiry through the Pro Cups International website.
          </p>

          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

          <p>
            <strong>Name:</strong><br />
            ${escapeHtml(name)}
          </p>

          <p>
            <strong>Email:</strong><br />
            ${escapeHtml(email)}
          </p>

          <p>
            <strong>Phone:</strong><br />
            ${escapeHtml(phone || "Not provided")}
          </p>

          <p>
            <strong>Enquiry:</strong><br />
            ${escapeHtml(message).replace(/\n/g, "<br />")}
          </p>

          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

          <p style="color: #6b7280; font-size: 13px;">
            Submitted through procupsinternational.com
          </p>

        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message || "Resend failed to send the email.",
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
        error: "Unable to send your enquiry.",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}