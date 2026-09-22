"use client";

import { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

const MODE = "ADD";

export default function ProductionPage() {
  const scannerRef = useRef(false);
  const busyRef = useRef(false);

  const lastDetectedRef = useRef("");
  const detectionCountRef = useRef(0);

  const [status, setStatus] = useState("Ready to scan");
  const [scanning, setScanning] = useState(false);
  const [lastProduct, setLastProduct] = useState("");
  const [lastStock, setLastStock] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
        reject(new Error("Stock system did not respond."));
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
        reject(new Error("Could not connect to stock system."));
      };

      document.body.appendChild(script);
    });
  };

  const processBarcode = async (barcode: string) => {
    if (busyRef.current) return;

    busyRef.current = true;

    setStatus(`Barcode detected: ${barcode}`);

    try {
      const result = await sendScan(barcode);

      if (!result.ok) {
        setStatus(result.message || "Scan failed.");
        busyRef.current = false;
        return;
      }

      setLastProduct(result.name || barcode);
      setLastStock(result.stock);

      setStatus("✓ Production recorded");

      detectionCountRef.current = 0;
      lastDetectedRef.current = "";

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
  };

  const handleDetected = (result: any) => {
    const code = result?.codeResult?.code;

    if (!code || busyRef.current) {
      return;
    }

    console.log("QUAGGA DETECTED:", code);

    /*
     * Require the same barcode to be detected
     * several times before we accept it.
     */
    if (lastDetectedRef.current === code) {
      detectionCountRef.current += 1;
    } else {
      lastDetectedRef.current = code;
      detectionCountRef.current = 1;
    }

    setStatus(
      `Barcode found — confirming ${detectionCountRef.current}/3`
    );

    if (detectionCountRef.current >= 3) {
      processBarcode(code);
    }
  };

  const startCamera = () => {
    if (scannerRef.current) {
      return;
    }

    setStatus("Starting camera...");

    try {
      Quagga.init(
        {
          inputStream: {
            
            type: "LiveStream",

            target: document.querySelector(
              "#barcode-scanner"
            ) as HTMLElement,

            constraints: {
              facingMode: "environment",

              width: {
                min: 1280,
                ideal: 1920,
                max: 1920,
              },

              height: {
                min: 720,
                ideal: 1080,
                max: 1080,
              },
            },
          },

          locator: {
            patchSize: "x-large",
            halfSample: false,
          },

          locate: true,

          numOfWorkers: 0,

          frequency: 15,

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
              "Could not start camera scanner."
            );

            return;
          }

          Quagga.onDetected(handleDetected);

          Quagga.start();

          scannerRef.current = true;

          setScanning(true);

          setStatus(
            "Place the barcode inside the green box"
          );
        }
      );
    } catch (error) {
      console.error(error);

      setStatus(
        "Could not start barcode scanner."
      );
    }
  };

  const stopCamera = () => {
    try {
      if (scannerRef.current) {
        Quagga.offDetected(handleDetected);
        Quagga.stop();
      }
    } catch {}

    scannerRef.current = false;

    busyRef.current = false;

    lastDetectedRef.current = "";
    detectionCountRef.current = 0;

    setScanning(false);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto max-w-xl">

        <div className="rounded-3xl bg-white p-5 shadow-lg">

          {/* HEADER */}

          <div className="mb-5 text-center">

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
            id="barcode-scanner"
            className="relative h-[260px] w-full overflow-hidden rounded-2xl bg-black"
          >

            {/* SHORT HORIZONTAL SCAN GUIDE */}

            {scanning && (
              <div
                className="
                  pointer-events-none
                  absolute
                  left-[5%]
                  right-[5%]
                  top-1/2
                  z-20
                  h-[115px]
                  -translate-y-1/2
                  rounded-xl
                  border-4
                  border-green-400
                "
              />
            )}

          </div>


          {/* INSTRUCTIONS */}

          {scanning && (
            <p className="mt-3 text-center text-sm font-medium text-slate-500">
              Keep the barcode horizontal and inside the green box
            </p>
          )}


          {/* BUTTON */}

          {!scanning ? (

            <button
              onClick={startCamera}
              className="mt-5 w-full rounded-2xl bg-green-600 px-6 py-4 text-lg font-bold text-white"
            >
              Start Camera
            </button>

          ) : (

            <button
              onClick={stopCamera}
              className="mt-5 w-full rounded-2xl bg-slate-800 px-6 py-4 text-lg font-bold text-white"
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
              Every confirmed scan adds exactly 1 case.
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}