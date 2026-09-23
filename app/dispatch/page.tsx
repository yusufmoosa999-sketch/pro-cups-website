"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

const API =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

export default function DispatchScannerPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const processingRef = useRef(false);

  const [cameraRunning, setCameraRunning] = useState(false);
  const [status, setStatus] = useState(
    "Press Start Camera to begin."
  );
  const [statusType, setStatusType] = useState<
    "normal" | "success" | "error"
  >("normal");
  const [lastProduct, setLastProduct] = useState("");
  const [stock, setStock] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
      readerRef.current = null;
    };
  }, []);

  function setMessage(
    message: string,
    type: "normal" | "success" | "error" = "normal"
  ) {
    setStatus(message);
    setStatusType(type);
  }

  function stopScanner() {
    controlsRef.current?.stop();
    controlsRef.current = null;

    readerRef.current = null;
    setCameraRunning(false);
  }

  function callStockApi(barcode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const callbackName =
        "pci_dispatch_" +
        Date.now() +
        "_" +
        Math.floor(Math.random() * 100000);

      const script = document.createElement("script");

      const cleanup = () => {
        delete (window as any)[callbackName];
        script.remove();
      };

      (window as any)[callbackName] = (data: any) => {
        cleanup();

        if (data?.ok) {
          resolve(data);
        } else {
          reject(
            new Error(
              data?.error || "The stock system rejected the dispatch."
            )
          );
        }
      };

      script.onerror = () => {
        cleanup();

        reject(
          new Error(
            "Could not connect to the stock control system."
          )
        );
      };

      const url =
        API +
        "?action=scan" +
        "&mode=REMOVE" +
        "&barcode=" +
        encodeURIComponent(barcode) +
        "&key=" +
        encodeURIComponent(SCANNER_KEY) +
        "&callback=" +
        encodeURIComponent(callbackName);

      script.src = url;

      document.body.appendChild(script);
    });
  }

  async function handleBarcode(barcode: string) {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;

    setMessage("Barcode detected — updating stock...");

    try {
      const result = await callStockApi(barcode);

      stopScanner();

      setLastProduct(result.name || barcode);

      if (typeof result.stock === "number") {
        setStock(result.stock);
      }

      setMessage(
        `✓ ${result.name || barcode} — 1 case dispatched`,
        "success"
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The dispatch could not be completed.",
        "error"
      );
    } finally {
      processingRef.current = false;
    }
  }

  async function startScanner() {
    if (!videoRef.current) {
      setMessage("Camera element is not ready.", "error");
      return;
    }

    processingRef.current = false;

    controlsRef.current?.stop();
    controlsRef.current = null;
    readerRef.current = null;

    setLastProduct("");
    setStock(null);
    setCameraRunning(true);

    setMessage("Starting camera...");

    const hints = new Map<DecodeHintType, any>();

    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_128,
    ]);

    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints);

    readerRef.current = reader;

    try {
      const controls = await reader.decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: {
              ideal: "environment",
            },
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
          },
        },
        videoRef.current,
        (result) => {
          if (!result) {
            return;
          }

          const barcode = result.getText().trim();

          if (!barcode) {
            return;
          }

          void handleBarcode(barcode);
        }
      );

      controlsRef.current = controls;

      setMessage(
        "Camera ready — point it at a product barcode."
      );
    } catch (error) {
      setCameraRunning(false);

      setMessage(
        error instanceof Error
          ? `Camera error: ${error.message}`
          : "Could not start the camera.",
        "error"
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-5 shadow-xl sm:p-7">

        <h1 className="text-center text-3xl font-bold text-slate-900">
          Dispatch Scanner
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Scan a product barcode to dispatch 1 case from stock.
        </p>

        <div className="mt-6 overflow-hidden rounded-3xl bg-black">
          <div className="relative h-[300px] w-full">

            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
            />

            {cameraRunning && (
              <div className="pointer-events-none absolute left-[8%] right-[8%] top-1/2 h-[105px] -translate-y-1/2 rounded-2xl border-4 border-green-400" />
            )}

          </div>
        </div>

        <p className="mt-3 text-center text-sm text-slate-500">
          Keep the barcode horizontal and inside the green box.
        </p>

        {!cameraRunning ? (
          <button
            type="button"
            onClick={startScanner}
            className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-5 text-xl font-bold text-white"
          >
            Start Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={stopScanner}
            className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-5 text-xl font-bold text-white"
          >
            Stop Camera
          </button>
        )}

        <div
          className={`mt-5 rounded-2xl p-6 text-center ${
            statusType === "success"
              ? "bg-green-50 text-green-800"
              : statusType === "error"
              ? "bg-red-50 text-red-800"
              : "bg-slate-50 text-slate-900"
          }`}
        >
          <p className="text-sm font-medium opacity-60">
            Status
          </p>

          <p className="mt-2 text-xl font-semibold">
            {status}
          </p>

          {lastProduct && (
            <p className="mt-4 text-lg font-bold">
              {lastProduct}
            </p>
          )}

          {stock !== null && (
            <div className="mt-4">
              <p className="text-5xl font-bold">
                {stock}
              </p>

              <p className="text-sm opacity-60">
                cases in stock
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center text-orange-800">
          <p className="font-bold">
            DISPATCH MODE
          </p>

          <p className="mt-1 text-sm">
            Every confirmed scan removes exactly 1 case.
          </p>
        </div>

      </div>
    </main>
  );
}