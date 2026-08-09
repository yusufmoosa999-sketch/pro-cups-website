import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminSupabase = createAdminClient(
    supabaseUrl!,
    serviceRoleKey!
);

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
    "pdf",
    "png",
    "jpg",
    "jpeg",
];

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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

        if (extension === "jpg" || extension === "jpeg") {
            contentType = "image/jpeg";
        }

        const { error: uploadError } =
            await adminSupabase.storage
                .from("artwork")
                .upload(filePath, fileBuffer, {
                    contentType,
                    upsert: false,
                });

        if (uploadError) {
            console.error("Proof upload error:", uploadError);

            return NextResponse.json(
                {
                    success: false,
                    error:
                        `Storage error: ${uploadError.message}`,
                },
                { status: 500 }
            );
        }

        const {
            data: { publicUrl },
        } = adminSupabase.storage
            .from("artwork")
            .getPublicUrl(filePath);

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

        return NextResponse.json({
            success: true,
            fileName: file.name,
            filePath,
            publicUrl,
        });
    } catch (error) {
        console.error("Proof API error:", error);

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