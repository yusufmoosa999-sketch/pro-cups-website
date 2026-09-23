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
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState<number | null>(null);

  const [status, setStatus] = useState(
    "Press Start Camera to begin."
  );

  const [statusType, setStatusType] = useState<
    "normal" | "success" | "error"
  >("normal");

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

  function callStockApi(
    scannedBarcode: string,
    cases: number
  ): Promise<any> {
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
              data?.error ||
                "The stock system rejected the dispatch."
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
        encodeURIComponent(scannedBarcode) +
        "&cases=" +
        encodeURIComponent(String(cases)) +
        "&key=" +
        encodeURIComponent(SCANNER_KEY) +
        "&callback=" +
        encodeURIComponent(callbackName);

      script.src = url;

      document.body.appendChild(script);
    });
  }

  async function handleBarcode(scannedBarcode: string) {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;

    setBarcode(scannedBarcode);

    // Stop camera immediately after successful detection.
    // This prevents the same barcode being detected repeatedly.
    stopScanner();

    setMessage("Barcode detected. Enter the number of cases.");

    // We know the barcode is valid because the backend will
    // identify the product when the dispatch is confirmed.
    try {
      const response = await fetch(
        `${API}?action=products`
      );

      const data = await response.json();

      if (data?.ok && Array.isArray(data.products)) {
        const found = data.products.find(
          (item: any) =>
            String(item.barcode) === scannedBarcode
        );

        if (found) {
          setProduct(found.name);
          setStock(Number(found.stock));
        } else {
          setProduct("");
          setStock(null);
          setMessage(
            "Barcode is not recognised.",
            "error"
          );
          setBarcode("");
        }
      } else {
        setMessage(
          "Could not retrieve product information.",
          "error"
        );
        setBarcode("");
      }
    } catch {
      setMessage(
        "Could not retrieve product information.",
        "error"
      );
      setBarcode("");
    } finally {
      processingRef.current = false;
    }
  }

  async function confirmDispatch() {
    if (!barcode) {
      setMessage(
        "Scan a product barcode first.",
        "error"
      );
      return;
    }

    const cases = Number(quantity);

    if (!Number.isInteger(cases) || cases <= 0) {
      setMessage(
        "Enter a whole number of cases greater than 0.",
        "error"
      );
      return;
    }

    if (stock !== null && cases > stock) {
      setMessage(
        `Cannot dispatch ${cases} cases. Only ${stock} cases are currently in stock.`,
        "error"
      );
      return;
    }

    processingRef.current = true;

    setMessage(
      `Dispatching ${cases} case${cases === 1 ? "" : "s"}...`
    );

    try {
      const result = await callStockApi(
        barcode,
        cases
      );

      setStock(result.stock);

      setMessage(
        `✓ ${result.name} — ${cases} case${
          cases === 1 ? "" : "s"
        } dispatched`,
        "success"
      );

      // Clear the scan so the worker must scan again
      // for the next pallet/order.
      setBarcode("");
      setProduct("");
      setQuantity("");

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
      setMessage(
        "Camera element is not ready.",
        "error"
      );
      return;
    }

    processingRef.current = false;

    setBarcode("");
    setProduct("");
    setQuantity("");
    setStock(null);

    controlsRef.current?.stop();
    controlsRef.current = null;
    readerRef.current = null;

    setCameraRunning(true);

    setMessage("Starting camera...");

    const hints = new Map<DecodeHintType, any>();

    hints.set(
      DecodeHintType.POSSIBLE_FORMATS,
      [BarcodeFormat.CODE_128]
    );

    hints.set(
      DecodeHintType.TRY_HARDER,
      true
    );

    const reader =
      new BrowserMultiFormatReader(hints);

    readerRef.current = reader;

    try {
      const controls =
        await reader.decodeFromConstraints(
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

            const scannedBarcode =
              result.getText().trim();

            if (!scannedBarcode) {
              return;
            }

            void handleBarcode(
              scannedBarcode
            );
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

  function resetForNextDispatch() {
    setBarcode("");
    setProduct("");
    setQuantity("");
    setStock(null);

    setMessage(
      "Press Start Camera to scan the next product."
    );

    setStatusType("normal");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-5 shadow-xl sm:p-7">

        <h1 className="text-center text-3xl font-bold text-slate-900">
          Dispatch Scanner
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Scan once, then enter the number of cases being
          dispatched.
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

        {!cameraRunning && !barcode && (
          <button
            type="button"
            onClick={startScanner}
            className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-5 text-xl font-bold text-white"
          >
            Start Camera
          </button>
        )}

        {cameraRunning && (
          <button
            type="button"
            onClick={stopScanner}
            className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-5 text-xl font-bold text-white"
          >
            Stop Camera
          </button>
        )}

        {barcode && product && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">

            <p className="text-center text-sm font-medium uppercase tracking-wide text-green-700">
              Product Scanned
            </p>

            <p className="mt-2 text-center text-2xl font-bold text-green-900">
              {product}
            </p>

            <p className="mt-1 text-center text-sm text-green-700">
              Barcode: {barcode}
            </p>

            {stock !== null && (
              <p className="mt-3 text-center text-sm text-green-700">
                Current stock:{" "}
                <strong>{stock} cases</strong>
              </p>
            )}

            <label className="mt-5 block text-sm font-semibold text-slate-800">
              Number of cases to dispatch

              <input
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="e.g. 48"
                className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-center text-3xl font-bold text-slate-900 outline-none focus:border-slate-900"
              />
            </label>

            <button
              type="button"
              onClick={confirmDispatch}
              disabled={!quantity}
              className="mt-4 w-full rounded-2xl bg-slate-900 px-5 py-5 text-xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm Dispatch
            </button>

          </div>
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
        </div>

        {statusType === "success" && (
          <button
            type="button"
            onClick={resetForNextDispatch}
            className="mt-5 w-full rounded-2xl border-2 border-slate-900 bg-white px-5 py-4 text-lg font-bold text-slate-900"
          >
            Dispatch Another Product
          </button>
        )}

        <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center text-orange-800">
          <p className="font-bold">
            DISPATCH MODE
          </p>

          <p className="mt-1 text-sm">
            Scan once and enter the number of cases being
            dispatched.
          </p>
        </div>

      </div>
    </main>
  );
}