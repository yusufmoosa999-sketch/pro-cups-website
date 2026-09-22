"use client";

import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";

// Google Apps Script stock backend
const API_URL =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

// Scanner key
const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

// Production mode = add 1 case
const MODE = "ADD";

export default function ProductionPage() {
  const scannerContainerRef = useRef<HTMLDivElement | null>(null);
  const scannerRunningRef = useRef(false);
  const busyRef = useRef(false);

  const [status, setStatus] = useState("Ready to scan");
  const [scanning, setScanning] = useState(false);
  const [lastProduct, setLastProduct] = useState("");
  const [lastStock, setLastStock] = useState<number | null>(null);

  // Clean up scanner when leaving page
  useEffect(() => {
    return () => {
      try {
        if (scannerRunningRef.current) {
          Quagga.stop();
          Quagga.offDetected(handleDetected);
        }
      } catch {}

      scannerRunningRef.current = false;
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

  // Barcode detected by Quagga
  async function handleDetected(result: any) {
    if (busyRef.current) return;

    const code = result?.codeResult?.code;

    if (!code) return;

    console.log("BARCODE DETECTED:", code);

    busyRef.current = true;

    setStatus(`Barcode detected: ${code}`);

    try {
      const response = await sendScan(code);

      if (!response.ok) {
        setStatus(response.message || "Scan failed");
        busyRef.current = false;
        return;
      }

      setLastProduct(response.name || code);
      setLastStock(response.stock);

      setStatus("✓ Production recorded");

      // Prevent duplicate scans
      setTimeout(() => {
        busyRef.current = false;
      }, 2000);
    } catch (error: any) {
      console.error(error);

      setStatus(
        error?.message || "Could not connect to stock system."
      );

      busyRef.current = false;
    }
  }

  // Start camera and barcode scanner
  const startScanner = async () => {
    if (scannerRunningRef.current) return;

    if (!scannerContainerRef.current) {
      setStatus("Scanner area could not be found.");
      return;
    }

    try {
      setStatus("Starting camera...");

      // Make sure old scanner is stopped
      try {
        Quagga.stop();
        Quagga.offDetected(handleDetected);
      } catch {}

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",

            target: scannerContainerRef.current,

            constraints: {
              facingMode: "environment",
              width: {
                min: 640,
                ideal: 1280,
                max: 1920,
              },
              height: {
                min: 480,
                ideal: 720,
                max: 1080,
              },
            },

            area: {
              top: "20%",
              right: "5%",
              left: "5%",
              bottom: "20%",
            },
          },

          locator: {
            patchSize: "medium",
            halfSample: false,
          },

          locate: true,

          numOfWorkers: 2,

          frequency: 10,

          decoder: {
            readers: [
              "code_128_reader",
            ],

            multiple: false,
          },

          

          debug: false,
        },

        (error) => {
          if (error) {
            console.error(
              "Quagga initialization error:",
              error
            );

            setStatus(
              "Could not start the barcode scanner."
            );

            scannerRunningRef.current = false;
            setScanning(false);

            return;
          }

          Quagga.start();

          scannerRunningRef.current = true;
          setScanning(true);

          setStatus(
            "Point the camera at a Code 128 barcode"
          );
        }
      );

      Quagga.onDetected(handleDetected);
    } catch (error) {
      console.error(error);

      setStatus(
        "Could not start the camera scanner."
      );

      scannerRunningRef.current = false;
      setScanning(false);
    }
  };

  // Stop scanner
  const stopScanner = () => {
    try {
      if (scannerRunningRef.current) {
        Quagga.stop();
        Quagga.offDetected(handleDetected);
      }
    } catch {}

    scannerRunningRef.current = false;
    setScanning(false);
    setStatus("Scanner stopped");
    busyRef.current = false;
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
            ref={scannerContainerRef}
            className="relative min-h-[320px] overflow-hidden rounded-2xl bg-black"
          >

            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <p className="text-center text-sm">
                  Camera preview will appear here
                </p>
              </div>
            )}

            {scanning && (
              <div className="pointer-events-none absolute inset-x-[5%] top-[20%] bottom-[20%] z-10 rounded-xl border-4 border-green-400" />
            )}

          </div>

          {/* START / STOP */}

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