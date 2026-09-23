"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

const API =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

export default function ProductionScannerPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const processingRef = useRef(false);

  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanningRef = useRef(false);

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
      stopScanner();

      if (scanTimerRef.current) {
        clearTimeout(scanTimerRef.current);
      }
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
    scanningRef.current = false;

    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    readerRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraRunning(false);
  }

  function callStockApi(barcode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const callbackName =
        "pci_scan_" +
        Date.now() +
        "_" +
        Math.floor(Math.random() * 100000);

      const script = document.createElement("script");

      let finished = false;

      const cleanup = () => {
        delete (window as any)[callbackName];
        script.remove();
      };

      (window as any)[callbackName] = (data: any) => {
        if (finished) {
          return;
        }

        finished = true;
        cleanup();

        if (data?.ok) {
          resolve(data);
        } else {
          reject(
            new Error(
              data?.error || "The stock system rejected the scan."
            )
          );
        }
      };

      script.onerror = () => {
        if (finished) {
          return;
        }

        finished = true;
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
        "&mode=ADD" +
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
        `✓ ${result.name || barcode} — 1 case added`,
        "success"
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The scan could not be completed.",
        "error"
      );
    } finally {
      processingRef.current = false;
    }
  }

  async function scanFrame() {
    if (
      !scanningRef.current ||
      processingRef.current
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const reader = readerRef.current;

    if (
      !video ||
      !canvas ||
      !reader ||
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      scanTimerRef.current = setTimeout(scanFrame, 70);
      return;
    }

    /*
     * The visible green box is:
     *
     * 8% from the left
     * 8% from the right
     * centred vertically
     * 105px high in the displayed 300px camera window
     *
     * The camera frame is cropped to the same proportional area
     * before it is passed to ZXing.
     */

    const cropX = Math.round(video.videoWidth * 0.08);
    const cropWidth = Math.round(video.videoWidth * 0.84);

    const displayedHeight = 300;
    const boxHeightRatio = 105 / displayedHeight;

    const cropHeight = Math.round(
      video.videoHeight * boxHeightRatio
    );

    const cropY = Math.round(
      (video.videoHeight - cropHeight) / 2
    );

    const targetWidth = 1280;
    const targetHeight = Math.max(
      160,
      Math.round(
        cropHeight * (targetWidth / cropWidth)
      )
    );

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) {
      scanTimerRef.current = setTimeout(scanFrame, 70);
      return;
    }

    context.drawImage(
      video,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    try {
      const result = reader.decodeFromCanvas(canvas);

      if (result) {
        const scannedBarcode = result
          .getText()
          .trim();

        if (scannedBarcode) {
          scanningRef.current = false;
          await handleBarcode(scannedBarcode);
          return;
        }
      }
    } catch {
      // No barcode found in this frame.
      // Continue scanning.
    }

    if (scanningRef.current) {
      scanTimerRef.current = setTimeout(
        scanFrame,
        70
      );
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

    if (processingRef.current) {
      return;
    }

    processingRef.current = false;

    stopScanner();

    setLastProduct("");
    setStock(null);
    setCameraRunning(false);

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
      const stream =
        await navigator.mediaDevices.getUserMedia({
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
        });

      streamRef.current = stream;

      const video = videoRef.current;

      video.srcObject = stream;
      video.setAttribute(
        "playsinline",
        "true"
      );
      video.muted = true;

      await video.play();

      scanningRef.current = true;
      setCameraRunning(true);

      setMessage(
        "Camera ready — place the barcode inside the green box."
      );

      scanTimerRef.current = setTimeout(
        scanFrame,
        200
      );
    } catch (error) {
      scanningRef.current = false;
      readerRef.current = null;

      streamRef.current?.getTracks().forEach(
        (track) => track.stop()
      );

      streamRef.current = null;

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
          Production Scanner
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Scan a product barcode to add 1 case to stock.
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
              <div
                className="
                  pointer-events-none
                  absolute
                  left-[8%]
                  right-[8%]
                  top-1/2
                  h-[105px]
                  -translate-y-1/2
                  rounded-2xl
                  border-4
                  border-green-400
                  shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]
                "
              />
            )}

          </div>
        </div>

        <p className="mt-3 text-center text-sm font-medium text-slate-500">
          Place the barcode completely inside the green box.
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

        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5 text-center text-green-800">
          <p className="font-bold">
            PRODUCTION MODE
          </p>

          <p className="mt-1 text-sm">
            Every confirmed scan adds exactly 1 case.
          </p>
        </div>

        {/* Hidden canvas used for the actual green-box scan area. */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />

      </div>
    </main>
  );
}
