"use client";

import { useState } from "react";

type Props = {
  mode: "single" | "bulk";
  quoteId?: string;
};

export default function QuoteDeleteControls({
  mode,
  quoteId,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  async function deleteQuotes(ids: string[]) {
    if (ids.length === 0) {
      alert("Please select at least one quote.");
      return;
    }

    const message =
      ids.length === 1
        ? "Are you sure you want to permanently delete this quote?"
        : `Are you sure you want to permanently delete ${ids.length} selected quotes?`;

    const confirmed = window.confirm(message);

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch("/api/admin/quotes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to delete quote(s)."
        );
      }

      window.location.reload();
    } catch (error) {
      console.error("Delete quotes error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete quote(s)."
      );

      setDeleting(false);
    }
  }

  /*
   * INDIVIDUAL DELETE
   */

  if (mode === "single") {
    return (
      <button
        type="button"
        disabled={deleting}
        onClick={() => {
          if (quoteId) {
            deleteQuotes([quoteId]);
          }
        }}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    );
  }

  /*
   * BULK DELETE
   */

  return (
    <button
      type="button"
      disabled={deleting}
      onClick={() => {
        const checkboxes = Array.from(
          document.querySelectorAll<HTMLInputElement>(
            '[data-quote-checkbox="true"]'
          )
        );

        const selectedIds = checkboxes
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value);

        deleteQuotes(selectedIds);
      }}
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete Selected"}
    </button>
  );
}