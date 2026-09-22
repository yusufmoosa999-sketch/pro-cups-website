"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
} from "@zxing/browser";
import {
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";

// Google Apps Script stock backend
const API_URL =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

// Scanner key
const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

// Production always adds 1 case
const MODE = "ADD";

export default function ProductionPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<any>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const [status, setStatus] = useState("Ready to scan");
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);

  const [lastProduct, setLastProduct] = useState("");
  const [lastStock, setLastStock] = useState<number | null>(null);

  // Clean up camera when leaving the page
  useEffect(() => {
    return () => {
      try {
        controlsRef.current?.stop();
      } catch {}

      const video = videoRef.current;

      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;

        stream.getTracks().forEach((track) => {
          track.stop();
        });

        video.srcObject = null;
      }
    };
  }, []);

  // Send barcode to Google Apps Script
  const sendScan = (barcode: string) => {
    return new Promise<any>((resolve, reject) => {
      const callbackName =
        "stockCallback_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2);

      const script = document.createElement("script");

      const timeout = window.setTimeout(() => {
        cleanup();

        reject(
          new Error(
            "The stock system did not respond."
          )
        );
      }, 10000);

      const cleanup = () => {
        window.clearTimeout(timeout);

        delete (window as any)[callbackName];

        script.remove();
      };

      (window as any)[callbackName] = (result: any) => {
        cleanup();
        resolve(result);
      };

      script.src =
        API_URL +
        "?action=scan" +
        "&mode=" +
        encodeURIComponent(MODE) +
        "&barcode=" +
        encodeURIComponent(barcode) +
        "&key=" +
        encodeURIComponent(SCANNER_KEY) +
        "&callback=" +
        encodeURIComponent(callbackName);

      script.onerror = () => {
        cleanup();

        reject(
          new Error(
            "Could not connect to the stock system."
          )
        );
      };

      document.body.appendChild(script);
    });
  };

  // Barcode was successfully decoded
  const handleBarcode = async (barcode: string) => {
    if (busy) return;

    setBusy(true);

    setStatus(
      `Barcode detected: ${barcode}`
    );

    try {
      const result = await sendScan(barcode);

      if (!result.ok) {
        setStatus(
          result.message || "Scan failed"
        );

        setBusy(false);
        return;
      }

      setLastProduct(
        result.name || barcode
      );

      setLastStock(result.stock);

      setStatus(
        "✓ Production recorded"
      );

      // Prevent duplicate scan
      setTimeout(() => {
        setBusy(false);
      }, 2000);
    } catch (error: any) {
      console.error(error);

      setStatus(
        error?.message ||
          "Could not connect to stock system."
      );

      setBusy(false);
    }
  };

  // Start barcode scanner
  const startScanner = async () => {
    if (scanning) return;

    try {
      setStatus(
        "Starting rear camera..."
      );

      if (!videoRef.current) {
        setStatus(
          "Camera element not found."
        );

        return;
      }

      // Only look for Code 128
      const hints = new Map();

      hints.set(
        DecodeHintType.POSSIBLE_FORMATS,
        [
          BarcodeFormat.CODE_128,
        ]
      );

      const reader =
        new BrowserMultiFormatReader(
          hints,
          {
            delayBetweenScanAttempts: 200,
            delayBetweenScanSuccess: 2000,
          }
        );

      readerRef.current = reader;

      setStatus(
        "Opening rear camera..."
      );

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
          (result, error) => {
            if (result) {
              const text =
                result.getText();

              console.log(
                "BARCODE DETECTED:",
                text
              );

              handleBarcode(text);
            }

            // Ignore normal "not found" frames
            if (error) {
              // Do nothing
            }
          }
        );

      controlsRef.current = controls;

      setScanning(true);

      setStatus(
        "Point the rear camera at the barcode"
      );
    } catch (error: any) {
      console.error(
        "Scanner error:",
        error
      );

      setStatus(
        error?.message ||
          "Could not start the camera."
      );

      setScanning(false);
    }
  };

  // Stop scanner
  const stopScanner = () => {
    try {
      controlsRef.current?.stop();
    } catch {}

    controlsRef.current = null;

    const video = videoRef.current;

    if (video?.srcObject) {
      const stream =
        video.srcObject as MediaStream;

      stream
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      video.srcObject = null;
    }

    setScanning(false);

    setStatus(
      "Scanner stopped"
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto max-w-xl">

        <div className="rounded-3xl bg-white p-6 shadow-lg">

          {/* HEADER */}

          <div className="mb-6 text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
              Pro Cups International
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Production Scanner
            </h1>

            <p className="mt-2 text-slate-500">
              Scan a product barcode to add
              1 case to stock.
            </p>

          </div>


          {/* CAMERA */}

          <div className="relative overflow-hidden rounded-2xl bg-black">

            <video
              ref={videoRef}
              className="block w-full"
              autoPlay
              muted
              playsInline
            />

            {/* SCAN GUIDE */}

            {scanning && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                <div className="h-32 w-[90%] rounded-xl border-4 border-green-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]">

                </div>

              </div>
            )}

            {!scanning && (
              <div className="flex h-64 items-center justify-center text-white">

                <p className="text-center text-sm">
                  Camera preview will appear here
                </p>

              </div>
            )}

          </div>


          {/* CAMERA BUTTON */}

          {!scanning ? (

            <button
              onClick={startScanner}
              className="mt-5 w-full rounded-2xl bg-green-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-green-700"
            >
              Start Camera
            </button>

          ) : (

            <button
              onClick={stopScanner}
              className="mt-5 w-full rounded-2xl bg-slate-800 px-6 py-4 text-lg font-bold text-white transition hover:bg-slate-900"
            >
              Stop Camera
            </button>

          )}


          {/* STATUS */}

          <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-center">

            <p className="text-sm font-medium text-slate-500">
              Status
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {status}
            </p>

          </div>


          {/* LAST SCAN */}

          {lastProduct && (

            <div className="mt-4 rounded-2xl bg-green-50 p-5 text-center">

              <p className="text-sm font-medium text-green-700">
                Last scanned product
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {lastProduct}
              </p>

              {lastStock !== null && (

                <p className="mt-2 text-lg text-slate-700">

                  Current stock:{" "}

                  <span className="font-bold">
                    {lastStock} cases
                  </span>

                </p>

              )}

            </div>

          )}


          {/* MODE */}

          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-center">

            <p className="font-semibold text-green-800">
              PRODUCTION MODE
            </p>

            <p className="mt-1 text-sm text-green-700">
              Every successful scan adds exactly 1 case.
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}