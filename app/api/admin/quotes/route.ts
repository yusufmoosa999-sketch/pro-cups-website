import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const ids = Array.isArray(body.ids)
      ? body.ids.filter(
          (id: unknown): id is string =>
            typeof id === "string" &&
            id.trim().length > 0
        )
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No quote IDs were selected.",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabase
      .from("quote_requests")
      .delete()
      .in("id", ids);

    if (error) {
      console.error(
        "Supabase quote deletion error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "The quote(s) could not be deleted.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: ids.length,
    });

  } catch (error) {
    console.error(
      "Quote deletion API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while deleting the quote(s).",
      },
      {
        status: 500,
      }
    );
  }
}