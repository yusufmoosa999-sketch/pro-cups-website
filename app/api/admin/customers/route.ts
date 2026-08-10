import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const {
      data: { users },
      error,
    } = await adminSupabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      console.error("Customer loading error:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Could not load customers.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      customers: users.map((user) => ({
        id: user.id,
        email: user.email || "",
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not load customers.",
      },
      { status: 500 }
    );
  }
}