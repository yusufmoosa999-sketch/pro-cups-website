"use client";

import { useState } from "react";

type QuoteDeleteControlsProps = {
  quoteId: string;
  deleteAction: (formData: FormData) => void | Promise<void>;
};

export default function QuoteDeleteControls({
  quoteId,
  deleteAction,
}: QuoteDeleteControlsProps) {
  const [deleting, setDeleting] = useState(false);

  return (
    <form
      action={async (formData) => {
        const confirmed = window.confirm(
          "Are you sure you want to permanently delete this quote request?"
        );

        if (!confirmed) return;

        setDeleting(true);

        try {
          await deleteAction(formData);
        } finally {
          setDeleting(false);
        }
      }}
    >
      <input type="hidden" name="id" value={quoteId} />

      <button
        type="submit"
        disabled={deleting}
        className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
}