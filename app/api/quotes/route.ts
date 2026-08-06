import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
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

    const { data, error } = await supabase
      .from("quote_requests")
      .insert([
        {
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
        },
      ])
      .select();

    console.log("Insert result:", data);
    console.log("Insert error:", error);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quote: data,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}