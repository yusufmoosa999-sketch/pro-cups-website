"use client";

import { useRef, useState } from "react";

type QuoteArtworkUploadProps = {
    quoteId: string;
    existingArtworkUrl?: string | null;
    existingArtworkPath?: string | null;
};

export default function QuoteArtworkUploadTEST({
    quoteId,
    existingArtworkUrl,
    existingArtworkPath,
}: QuoteArtworkUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const hasArtwork = false;


    async function uploadFile(file: File) {
        setError("");
        setSuccess(false);

        const allowedExtensions = [
            "ai",
            "eps",
            "pdf",
            "svg",
            "png",
            "jpg",
            "jpeg",
        ];

        const extension =
            file.name.split(".").pop()?.toLowerCase() || "";

        if (!allowedExtensions.includes(extension)) {
            setError(
                "Please upload an AI, EPS, PDF, SVG, PNG or JPG file."
            );
            return;
        }

        if (file.size > 25 * 1024 * 1024) {
            setError("Your artwork file must be 25MB or smaller.");
            return;
        }

        setUploading(true);
        setFileName(file.name);

        try {
            const formData = new FormData();

            formData.append("file", file);

            const response = await fetch(
                `/api/quotes/${quoteId}/artwork`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();

            if (response.status === 401) {
                window.location.href = `/login?redirect=/portal/quotes/${quoteId}`;
                return;
            }

            if (!response.ok) {
                setError(
                    result.error || "Something went wrong while uploading."
                );
                return;
            }

            setSuccess(true);

            // Refresh the page so the server loads the new artwork.
            window.location.reload();
        } catch (error) {
            console.error(error);

            setError(
                "We couldn't upload your artwork. Please try again."
            );
        } finally {
            setUploading(false);
        }
    }

    function handleFileChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        uploadFile(file);

        // Allows the customer to select the same file again later.
        event.target.value = "";
    }

    function handleDrop(
        event: React.DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();

        setDragging(false);

        const file = event.dataTransfer.files?.[0];

        if (!file) return;

        uploadFile(file);
    }


    return (
        <>
            
  <div style={{ background: "red", color: "white", padding: "30px", fontSize: "30px", fontWeight: "900" }}>
    THIS IS THE QUOTEARTWORKUPLOAD COMPONENT
  </div>

            {hasArtwork ? (





                /* ARTWORK ALREADY UPLOADED */

                <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

                    <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                            ✓
                        </div>

                        <div className="min-w-0">

                            <p className="font-black text-slate-900">
                                Artwork Received
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                                Your artwork has been uploaded and is currently
                                available to our design team.
                            </p>

                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                disabled={uploading}
                                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700 shadow-sm ring-1 ring-green-200 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Replace Artwork"}
                            </button>

                        </div>

                    </div>

                </div>

            ) : (

                /* NO ARTWORK */

                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={[
                        "cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition",
                        dragging
                            ? "border-green-600 bg-green-50"
                            : "border-slate-300 bg-slate-50 hover:border-green-500 hover:bg-green-50/50",
                    ].join(" ")}
                >

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                        📁
                    </div>

                    <h3 className="mt-5 text-lg font-black text-slate-900">
                        Upload Your Artwork
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Upload your logo or print artwork so our design
                        team can prepare your professional print proof.
                    </p>

                    <div className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700">
                        Choose Artwork
                    </div>

                    <p className="mt-4 text-xs font-semibold text-slate-400">
                        AI · EPS · PDF · SVG · PNG · JPG · Maximum 25MB
                    </p>

                    {fileName && (
                        <p className="mt-4 text-sm font-bold text-green-600">
                            {fileName}
                        </p>
                    )}

                </div>

            )}


            {uploading && (
                <div className="mt-4 rounded-xl bg-slate-100 p-4 text-center">

                    <p className="text-sm font-bold text-slate-700">
                        Uploading your artwork...
                    </p>

                    <div className="mx-auto mt-3 h-2 max-w-sm overflow-hidden rounded-full bg-slate-200">

                        <div className="h-full w-2/3 animate-pulse rounded-full bg-green-600" />

                    </div>

                </div>
            )}


            {success && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-bold text-green-700">
                    ✓ Artwork uploaded successfully.
                </div>
            )}


            {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}


            <input
                ref={inputRef}
                type="file"
                accept=".ai,.eps,.pdf,.svg,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
            />

        </>
    );
}