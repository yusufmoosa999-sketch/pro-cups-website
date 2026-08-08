import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase server environment variables.");
}

const adminSupabase = createAdminClient(
  supabaseUrl!,
  serviceRoleKey!
);

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "ai",
  "eps",
  "pdf",
  "svg",
  "png",
  "jpg",
  "jpeg",
];

function getContentType(extension: string, browserType: string) {
  if (browserType) {
    return browserType;
  }

  switch (extension) {
    case "pdf":
      return "application/pdf";

    case "ai":
    case "eps":
      return "application/postscript";

    case "svg":
      return "image/svg+xml";

    case "png":
      return "image/png";

    case "jpg":
    case "jpeg":
      return "image/jpeg";

    default:
      return "application/octet-stream";
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=================================");
    console.log("ARTWORK UPLOAD STARTED");
    console.log("Quote ID:", id);
    console.log("=================================");

    // --------------------------------------------------
    // CHECK SERVER ENVIRONMENT
    // --------------------------------------------------

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration error. Supabase server credentials are missing.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // CHECK CUSTOMER LOGIN
    // --------------------------------------------------

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to upload artwork.",
        },
        { status: 401 }
      );
    }

    console.log("Logged-in user:", user.id);

    // --------------------------------------------------
    // CHECK QUOTE OWNERSHIP
    // --------------------------------------------------

    const { data: quote, error: quoteError } =
      await adminSupabase
        .from("quote_requests")
        .select("id, customer_id")
        .eq("id", id)
        .eq("customer_id", user.id)
        .single();

    if (quoteError) {
      console.error("Quote lookup error:", quoteError);
    }

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          error: "Quote not found or does not belong to this account.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // GET FILE
    // --------------------------------------------------

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No artwork file was provided.",
        },
        { status: 400 }
      );
    }

    console.log("File name:", file.name);
    console.log("File size:", file.size);
    console.log("File type:", file.type);

    // --------------------------------------------------
    // CHECK FILE SIZE
    // --------------------------------------------------

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "The selected file is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Artwork files must be 25MB or smaller.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // CHECK EXTENSION
    // --------------------------------------------------

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file type. Please upload AI, EPS, PDF, SVG, PNG or JPG artwork.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // SAFE FILE NAME
    // --------------------------------------------------

    const safeFileName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/\s+/g, "_");

    const filePath =
      `${user.id}/${id}/${Date.now()}-${safeFileName}`;

    console.log("Storage bucket: artwork");
    console.log("Storage path:", filePath);

    // --------------------------------------------------
    // CONVERT FILE
    // --------------------------------------------------

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    const contentType = getContentType(
      extension,
      file.type
    );

    console.log("Content type:", contentType);
    console.log("Buffer size:", fileBuffer.length);

    // --------------------------------------------------
    // UPLOAD TO SUPABASE STORAGE
    // --------------------------------------------------

    const { data: uploadData, error: uploadError } =
      await adminSupabase.storage
        .from("artwork")
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: false,
        });

    if (uploadError) {
      console.error("==============================");
      console.error("SUPABASE STORAGE ERROR");
      console.error("Message:", uploadError.message);
      console.error("Name:", uploadError.name);
      console.error("Cause:", uploadError.cause);
      console.error("==============================");

      return NextResponse.json(
        {
          success: false,
          error:
            `Supabase Storage error: ${uploadError.message}`,
        },
        { status: 500 }
      );
    }

    console.log("Upload successful:", uploadData);

    // --------------------------------------------------
    // GET PUBLIC URL
    // --------------------------------------------------

    const {
      data: { publicUrl },
    } = adminSupabase.storage
      .from("artwork")
      .getPublicUrl(filePath);

    console.log("Public URL:", publicUrl);

    // --------------------------------------------------
    // SAVE ARTWORK AGAINST QUOTE
    // --------------------------------------------------

    const { error: updateError } =
      await adminSupabase
        .from("quote_requests")
        .update({
          artwork_path: filePath,
          artwork_url: publicUrl,
        })
        .eq("id", id)
        .eq("customer_id", user.id);

    if (updateError) {
      console.error("Quote update error:", updateError);

      // Delete uploaded file if database update fails
      await adminSupabase.storage
        .from("artwork")
        .remove([filePath]);

      return NextResponse.json(
        {
          success: false,
          error:
            `Artwork uploaded but database update failed: ${updateError.message}`,
        },
        { status: 500 }
      );
    }

    console.log("Quote updated successfully.");

    return NextResponse.json({
      success: true,
      fileName: file.name,
      filePath,
      publicUrl,
    });
  } catch (error) {
    console.error("==============================");
    console.error("ARTWORK API ERROR");
    console.error(error);
    console.error("==============================");

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while uploading your artwork.",
      },
      { status: 500 }
    );
  }
}