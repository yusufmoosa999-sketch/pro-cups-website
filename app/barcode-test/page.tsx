"use client";

import { useState } from "react";
import Quagga from "@ericblade/quagga2";

export default function BarcodeTestPage() {
  const [status, setStatus] = useState(
    "Take a close-up photo of ONE printed barcode."
  );
  const [result, setResult] = useState<string | null>(null);

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setResult(null);
    setStatus("Reading barcode...");

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;

      if (typeof image !== "string") {
        setStatus("Could not read the image.");
        return;
      }

      Quagga.decodeSingle(
        {
          src: image,

          numOfWorkers: 0,

          locate: true,

          inputStream: {
            size: 0,
          },

          decoder: {
            readers: ["code_128_reader"],
          },
        },
        (scanResult) => {
          if (scanResult && scanResult.codeResult) {
            const code = scanResult.codeResult.code;

            setResult(code);
            setStatus("Barcode detected successfully.");
          } else {
            setStatus(
              "No barcode detected. Take a closer, clearer photo of one barcode and try again."
            );
          }
        }
      );
    };

    reader.readAsDataURL(file);
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
            Step 1
          </p>

          <p className="mt-2 text-slate-600">
            Take a close-up photo of ONE printed barcode only.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Make sure the entire barcode and the white space around it are
            visible.
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
          <p className="font-semibold">What we are testing</p>

          <p className="mt-2">
            If this returns <strong>PCI350BR</strong>, the physical barcode
            works and we know the problem is specifically with the live
            camera scanner.
          </p>

          <p className="mt-2">
            If it cannot detect it, we will fix the barcode itself.
          </p>
        </div>
      </div>
    </main>
  );
}