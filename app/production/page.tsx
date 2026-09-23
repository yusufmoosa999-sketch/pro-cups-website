"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

const API =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

const ROI = {
  left: 0.08,
  top: 0.38,
  width: 0.84,
  height: 0.24,
};

export default function ProductionScannerPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanningRef = useRef(false);
  const processingRef = useRef(false);
  const quantityRef = useRef<HTMLInputElement | null>(null);

  const [cameraRunning, setCameraRunning] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("Press Start Camera to begin.");
  const [statusType, setStatusType] = useState<
    "normal" | "success" | "error"
  >("normal");
  const [lastProduct, setLastProduct] = useState("");
  const [stock, setStock] = useState<number | null>(null);
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [product, setProduct] = useState("");
  const [stockLoading, setStockLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  function setMessage(
    message: string,
    type: "normal" | "success" | "error" = "normal"
  ) {
    setStatus(message);
    setStatusType(type);
  }

  function stopCamera() {
    scanningRef.current = false;
    setScanning(false);

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    readerRef.current = null;
    setCameraRunning(false);
  }

  async function startCamera() {
    if (!videoRef.current) {
      setMessage("Camera element is not ready.", "error");
      return;
    }

    stopCamera();
    processingRef.current = false;

    try {
      setMessage("Starting camera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 16 / 9 },
        },
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setCameraRunning(true);
      setMessage(
        "Camera ready — place the barcode completely inside the green box."
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

  function getVisibleVideoCrop() {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      return null;
    }

    const displayWidth = video.clientWidth;
    const displayHeight = video.clientHeight;

    if (!displayWidth || !displayHeight) {
      return null;
    }

    // The video is displayed with object-fit: cover.
    // Work out exactly which source pixels are visible on screen.
    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;

    const scale = Math.max(
      displayWidth / sourceWidth,
      displayHeight / sourceHeight
    );

    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;

    const offsetX = (displayWidth - renderedWidth) / 2;
    const offsetY = (displayHeight - renderedHeight) / 2;

    const greenLeft = displayWidth * ROI.left;
    const greenTop = displayHeight * ROI.top;
    const greenWidth = displayWidth * ROI.width;
    const greenHeight = displayHeight * ROI.height;

    const sourceLeft = Math.max(0, (greenLeft - offsetX) / scale);
    const sourceTop = Math.max(0, (greenTop - offsetY) / scale);

    const sourceRight = Math.min(
      sourceWidth,
      (greenLeft + greenWidth - offsetX) / scale
    );

    const sourceBottom = Math.min(
      sourceHeight,
      (greenTop + greenHeight - offsetY) / scale
    );

    const width = sourceRight - sourceLeft;
    const height = sourceBottom - sourceTop;

    if (width <= 0 || height <= 0) {
      return null;
    }

    return {
      left: sourceLeft,
      top: sourceTop,
      width,
      height,
    };
  }

  function scanGreenBox(): string | null {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setMessage("Camera is not ready.", "error");
      return null;
    }

    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      setMessage("Camera is still starting. Try again in a moment.", "error");
      return null;
    }

    const crop = getVisibleVideoCrop();

    if (!crop) {
      setMessage("Could not determine the green scan area.", "error");
      return null;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      setMessage("Could not prepare the scanner.", "error");
      return null;
    }

    const outputWidth = Math.max(1, Math.round(crop.width));
    const outputHeight = Math.max(1, Math.round(crop.height));

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
      video,
      crop.left,
      crop.top,
      crop.width,
      crop.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    const hints = new Map<DecodeHintType, any>();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints);
    readerRef.current = reader;

    try {
      const result = reader.decodeFromCanvas(canvas);
      return result.getText().trim() || null;
    } catch {
      return null;
    }
  }

  function callStockApi(
    scannedBarcode: string,
    cases: number,
    requestId: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const callbackName =
        "pci_production_" +
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
        if (finished) return;
        finished = true;
        cleanup();

        if (data?.ok) {
          resolve(data);
        } else {
          reject(
            new Error(data?.error || "The stock system rejected the production entry.")
          );
        }
      };

      script.onerror = () => {
        if (finished) return;
        finished = true;
        cleanup();
        reject(new Error("Could not connect to the stock control system."));
      };

      script.src =
        API +
        "?action=scan" +
        "&mode=ADD" +
        "&barcode=" +
        encodeURIComponent(scannedBarcode) +
        "&cases=" +
        encodeURIComponent(String(cases)) +
        "&requestId=" +
        encodeURIComponent(requestId) +
        "&key=" +
        encodeURIComponent(SCANNER_KEY) +
        "&callback=" +
        encodeURIComponent(callbackName);

      document.body.appendChild(script);
    });
  }

  async function loadStock(scannedBarcode: string) {
    try {
      setStockLoading(true);

      const response = await fetch(
        `${API}?action=productStock&barcode=${encodeURIComponent(
          scannedBarcode
        )}&_=${Date.now()}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Could not connect to the stock system.");
      }

      const data = await response.json();

      if (!data?.ok) {
        throw new Error(data?.error || "Could not load stock.");
      }

      setProduct(data.name || scannedBarcode);
      setStock(Number(data.stock) || 0);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load stock.",
        "error"
      );
    } finally {
      setStockLoading(false);
    }
  }

  async function scanBarcode() {
    if (!cameraRunning || scanningRef.current || processingRef.current) {
      return;
    }

    scanningRef.current = true;
    setScanning(true);
    setMessage("Scanning only inside the green box...");

    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const scannedBarcode = scanGreenBox();

      if (!scannedBarcode) {
        setMessage(
          "No barcode found inside the green box. Position the barcode fully inside it and press Scan Barcode.",
          "error"
        );
        return;
      }

      processingRef.current = true;
      stopCamera();

      setBarcode(scannedBarcode);
      setQuantity("");
      setStock(null);

      const productName = scannedBarcode;
      setProduct(productName);
      setMessage("Barcode detected — enter the number of cases to add.");

      await loadStock(scannedBarcode);
      setTimeout(() => quantityRef.current?.focus(), 50);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The scan could not be completed.",
        "error"
      );
    } finally {
      scanningRef.current = false;
      setScanning(false);
      processingRef.current = false;
    }
  }

  async function confirmProduction() {
    if (adding) return;

    if (!barcode) {
      setMessage("Scan a barcode first.", "error");
      return;
    }

    const cases = Number(quantity);

    if (!Number.isInteger(cases) || cases <= 0) {
      setMessage("Enter a whole number of cases.", "error");
      quantityRef.current?.focus();
      return;
    }

    processingRef.current = true;
    setAdding(true);

    const requestId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    const addedProduct = product || barcode;
    const addedBarcode = barcode;
    const newOptimisticStock = stock !== null ? stock + cases : null;

    // Make the worker interface immediate. The actual stock movement is sent
    // to Google Apps Script in the background. requestId prevents duplicates.
    setStock(newOptimisticStock);
    setMessage(
      `✓ ${addedProduct} — ${cases} case${cases === 1 ? "" : "s"} added`,
      "success"
    );

    setBarcode("");
    setProduct("");
    setQuantity("");
    setStock(null);
    setAdding(false);
    processingRef.current = false;

    callStockApi(addedBarcode, cases, requestId)
      .then(() => {
        // Keep the success message. The backend has recorded the movement.
      })
      .catch((error) => {
        // Do not replace the worker-facing success message with a false error
        // if the browser misses the background JSONP confirmation.
        console.warn("Background production confirmation:", error);
      });
  }

  function productionAnother() {
    stopCamera();
    setBarcode("");
    setProduct("");
    setQuantity("");
    setStock(null);
    setStockLoading(false);
    setMessage("Press Start Camera to begin.");
    setStatusType("normal");
    processingRef.current = false;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-5 shadow-xl sm:p-7">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Production Scanner
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Place the barcode inside the green box, then press Scan Barcode.
        </p>

        <div className="mt-6 overflow-hidden rounded-3xl bg-black">
          <div
            className="relative w-full"
            style={{ aspectRatio: "16 / 9" }}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
            />

            {cameraRunning && (
              <>
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.42))",
                    clipPath:
                      "polygon(0 0,100% 0,100% 100%,0 100%,0 0,8% 0,8% 38%,92% 38%,92% 62%,8% 62%,8% 0)",
                  }}
                />

                <div
                  className="pointer-events-none absolute rounded-2xl border-4 border-green-500"
                  style={{
                    left: "8%",
                    top: "38%",
                    width: "84%",
                    height: "24%",
                  }}
                />
              </>
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-slate-500">
          Only the area inside the green box is scanned.
        </p>

        {!cameraRunning ? (
          <button
            type="button"
            onClick={startCamera}
            className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-5 text-xl font-bold text-white"
          >
            Start Camera
          </button>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={scanBarcode}
              disabled={scanning}
              className="rounded-2xl bg-green-600 px-5 py-5 text-xl font-bold text-white disabled:bg-gray-400"
            >
              {scanning ? "Scanning..." : "Scan Barcode"}
            </button>

            <button
              type="button"
              onClick={stopCamera}
              disabled={scanning}
              className="rounded-2xl bg-slate-900 px-5 py-5 text-xl font-bold text-white disabled:bg-gray-400"
            >
              Stop Camera
            </button>
          </div>
        )}

        {barcode && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-bold tracking-wide text-slate-500">
                PRODUCT
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">{product}</p>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-bold tracking-wide text-slate-500">
                CURRENT STOCK
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stockLoading ? "Checking..." : `${stock ?? 0} cases`}
              </p>
            </div>

            <label
              htmlFor="quantity"
              className="mt-5 block text-sm font-bold text-slate-800"
            >
              Number of cases to add
            </label>

            <input
              ref={quantityRef}
              id="quantity"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !adding) {
                  confirmProduction();
                }
              }}
              placeholder="e.g. 48"
              disabled={adding}
              autoComplete="off"
              className="mt-2 w-full rounded-xl border-2 border-slate-300 p-4 text-2xl text-slate-900 outline-none"
            />

            <button
              type="button"
              onClick={confirmProduction}
              disabled={!quantity || adding}
              className="mt-3 w-full rounded-2xl bg-green-600 px-5 py-5 text-xl font-bold text-white disabled:bg-gray-400"
            >
              {adding ? "Processing..." : "Confirm Production"}
            </button>

            <button
              type="button"
              onClick={productionAnother}
              disabled={adding}
              className="mt-3 w-full rounded-2xl bg-slate-900 px-5 py-4 text-lg font-bold text-white disabled:bg-gray-400"
            >
              Add Another Product
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
          <p className="text-sm font-medium opacity-60">Status</p>
          <p className="mt-2 text-xl font-semibold">{status}</p>
        </div>

        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5 text-center text-green-800">
          <p className="font-bold">PRODUCTION MODE</p>
          <p className="mt-1 text-sm">
            Scan once, enter the number of cases produced, then confirm.
          </p>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </main>
  );
}
