"use client";

import { useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

export default function BarcodeTestPage() {
  const [status, setStatus] = useState(
    "Take a close-up photo of ONE barcode."
  );
  const [result, setResult] = useState<string | null>(null);

  const handleImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setResult(null);
    setStatus("Reading barcode...");

    const imageUrl = URL.createObjectURL(file);

    try {
      const hints = new Map();

      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.CODE_128,
      ]);

      hints.set(DecodeHintType.TRY_HARDER, true);

      const reader = new BrowserMultiFormatReader(hints);

      const decoded = await reader.decodeFromImageUrl(imageUrl);

      const code = decoded.getText();

      setResult(code);
      setStatus("Barcode detected successfully.");
    } catch (error) {
      console.error(error);

      setStatus(
        "No barcode detected. The decoder could not read this image."
      );
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-6 shadow-lg">

        <h1 className="text-3xl font-bold text-slate-900">
          Barcode Test
        </h1>

        <p className="mt-3 text-slate-600">
          This test does NOT change your stock or Google Sheets.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <p className="font-semibold text-slate-800">
            Take a photo of ONE barcode
          </p>

          <p className="mt-2 text-slate-600">
            Make the barcode large in the camera view.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Keep the barcode horizontal and include some white space
            around it.
          </p>
        </div>

        <label className="mt-6 block cursor-pointer rounded-2xl bg-slate-900 px-5 py-4 text-center font-semibold text-white">
          Take / Choose Barcode Photo

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImage}
            className="hidden"
          />
        </label>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-center">
          <p className="text-sm font-medium text-slate-500">
            Status
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {status}
          </p>
        </div>

        {result && (
          <div className="mt-6 rounded-2xl border-2 border-green-500 bg-green-50 p-6 text-center">
            <p className="text-sm font-medium text-green-700">
              BARCODE DETECTED
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {result}
            </p>
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-blue-50 p-5 text-sm text-blue-900">
          <p className="font-semibold">
            What this test tells us
          </p>

          <p className="mt-2">
            Expected result:
            <strong> PCI350BR</strong>
          </p>

          <p className="mt-2">
            This test uses a different barcode engine from the
            production scanner.
          </p>
        </div>

      </div>
    </main>
  );
}