import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const phone = body?.phone?.trim();
    const message = body?.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Pro Cups International <onboarding@resend.dev>",
      to: ["yusuf@smartpacktrading.co.za"],
      replyTo: email,
      subject: `New Website Enquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 30px;">

          <h1 style="color: #111827; margin-bottom: 10px;">
            New Website Enquiry
          </h1>

          <p style="color: #6b7280; margin-bottom: 30px;">
            Someone has submitted an enquiry through the Pro Cups International website.
          </p>

          <div style="background: #f8fafc; border-radius: 16px; padding: 24px;">

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
              <strong>Message:</strong><br />
              ${escapeHtml(message).replace(/\n/g, "<br />")}
            </p>

          </div>

          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            You can reply directly to this email to respond to the customer.
          </p>

        </div>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to send your enquiry. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry sent successfully.",
      id: data?.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
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