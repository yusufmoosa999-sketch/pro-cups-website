"use client";

import { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

// Google Apps Script stock backend
const API_URL =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

// Scanner key
const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

// Production mode = add 1 case
const MODE = "ADD";

export default function ProductionPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [status, setStatus] = useState("Ready to scan");
  const [scanning, setScanning] = useState(false);
  const [lastProduct, setLastProduct] = useState("");
  const [lastStock, setLastStock] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  // Stop camera when leaving page
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
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
        reject(new Error("The stock system did not respond."));
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
        reject(new Error("Could not connect to the stock system."));
      };

      document.body.appendChild(script);
    });
  };

  // Successful barcode scan
  const handleScan = async (decodedText: string) => {
    if (busy) return;

    setBusy(true);
    setStatus("Barcode detected — recording production...");

    try {
      const result = await sendScan(decodedText);

      if (!result.ok) {
        setStatus(result.message || "Scan failed");
        setBusy(false);
        return;
      }

      setLastProduct(result.name || decodedText);
      setLastStock(result.stock);
      setStatus("✓ Production recorded");

      // Prevent the same barcode being recorded repeatedly
      setTimeout(() => {
        setBusy(false);
      }, 1500);
    } catch (error: any) {
      console.error(error);

      setStatus(
        error?.message || "Connection error"
      );

      setBusy(false);
    }
  };

  // Start camera
  const startScanner = async () => {
    if (scanning) return;

    try {
      setStatus("Starting camera...");

      /*
       * Code 128 only.
       *
       * IMPORTANT:
       * verbose is required by the installed version
       * of html5-qrcode.
       */
      const scanner = new Html5Qrcode(
        "production-reader",
        {
          verbose: false,

          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
          ],

          useBarCodeDetectorIfSupported: false,
        }
      );

      scannerRef.current = scanner;

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 15,

          // Wide scanning area for horizontal Code 128
          qrbox: {
            width: 350,
            height: 140,
          },

          aspectRatio: 1.777778,
        },

        // Successful scan
        (decodedText) => {
          handleScan(decodedText);
        },

        // Unsuccessful frame
        () => {
          // Ignore frames where no barcode is detected
        }
      );

      setScanning(true);

      setStatus(
        "Point the camera at a Code 128 barcode"
      );
    } catch (error) {
      console.error(error);

      setStatus(
        "Camera could not start. Please allow camera access and try again."
      );
    }
  };

  // Stop camera
  const stopScanner = async () => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch (error) {
      console.error(error);
    }

    scannerRef.current = null;
    setScanning(false);
    setStatus("Scanner stopped");
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
              Scan a product barcode to add 1 case to stock.
            </p>
          </div>

          {/* CAMERA */}

          <div
            id="production-reader"
            className="overflow-hidden rounded-2xl bg-black"
          />

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

          {/* LAST PRODUCT */}

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