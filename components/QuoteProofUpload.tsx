"use client";

import { useRef, useState } from "react";

type QuoteProofUploadProps = {
  quoteId: string;
  existingProofUrl?: string | null;
};

export default function QuoteProofUpload({
  quoteId,
  existingProofUrl,
}: QuoteProofUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function uploadProof(file: File) {
    setError("");
    setSuccess(false);

    const allowedExtensions = [
      "pdf",
      "png",
      "jpg",
      "jpeg",
    ];

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedExtensions.includes(extension)) {
      setError(
        "Please upload a PDF, PNG or JPG proof."
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("The proof must be 25MB or smaller.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/quotes/${quoteId}/proof`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Something went wrong while uploading the proof."
        );
      }

      setSuccess(true);

      // Refresh so the admin page displays the new proof.
      window.location.reload();
    } catch (err) {
      console.error("Proof upload error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "We couldn't upload the proof."
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

    uploadProof(file);

    event.target.value = "";
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      <div>
        <p className="text-sm font-bold uppercase tracking-[3px] text-green-600">
          Print Proof
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
          Customer Proof
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Upload the print proof that the customer will review
          before the order goes into production.
        </p>
      </div>

      {existingProofUrl ? (
        <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-black text-green-800">
                Proof Uploaded
              </p>

              <p className="mt-1 text-sm text-green-700">
                A print proof is currently attached to this quote.
              </p>
            </div>

            <a
              href={existingProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
            >
              View Proof
            </a>

          </div>

        </div>
      ) : (
        <div className="mt-7">

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-green-500 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <span className="text-3xl">
              📄
            </span>

            <span className="mt-3 font-black text-slate-900">
              {uploading
                ? "Uploading Proof..."
                : "Upload Print Proof"}
            </span>

            <span className="mt-1 text-sm text-slate-500">
              PDF, PNG or JPG · Maximum 25MB
            </span>

          </button>

        </div>
      )}

      {existingProofUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-4 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-green-500 hover:text-green-700 disabled:opacity-50 sm:w-auto"
        >
          {uploading ? "Uploading..." : "Replace Proof"}
        </button>
      )}

      {success && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
          ✓ Proof uploaded successfully.
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        className="hidden"
      />

    </div>
  );
}