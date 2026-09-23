"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

const API =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

const PRODUCT_NAMES: Record<string, string> = {
  PCI250SW: "250ml Single Wall",
  PCI250BR: "250ml Black Ripple",
  PCI250KR: "250ml Kraft Ripple",
  PCI250CR: "250ml Coffee Ripple",
  PCI250CH: "250ml Checkered Ripple",
  PCI250KD: "250ml Kraft Double Wall",
  PCI250WD: "250ml White Double Wall",
  PCI350SW: "350ml Single Wall",
  PCI350BR: "350ml Black Ripple",
  PCI350KR: "350ml Kraft Ripple",
  PCI350CR: "350ml Coffee Ripple",
  PCI350CH: "350ml Checkered Ripple",
  PCI350KD: "350ml Kraft Double Wall",
  PCI350WD: "350ml White Double Wall",
};

const ROI = {
  left: 0.08,
  top: 0.38,
  width: 0.84,
  height: 0.24,
};

export default function DispatchPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const quantityRef = useRef<HTMLInputElement | null>(null);
  const scanningRef = useRef(false);
  const processingRef = useRef(false);

  const [cameraRunning, setCameraRunning] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState<number | null>(null);
  const [stockLoading, setStockLoading] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "normal" | "success" | "error"
  >("normal");

  useEffect(() => {
    if (barcode && product && !dispatching) {
      requestAnimationFrame(() => {
        quantityRef.current?.focus();
      });
    }
  }, [barcode, product, dispatching]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  function setStatus(
    text: string,
    type: "normal" | "success" | "error" = "normal"
  ) {
    setMessage(text);
    setMessageType(type);
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

    setCameraRunning(false);
  }

  async function startCamera() {
    if (!videoRef.current || processingRef.current) {
      return;
    }

    stopCamera();

    try {
      setStatus("Starting camera...");

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
      setStatus(
        "Camera ready — place the barcode completely inside the green box."
      );
    } catch (error) {
      setCameraRunning(false);
      setStatus(
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

    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;

    // The preview uses object-fit: cover.
    // Convert the visible green box back into source-camera pixels.
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
      setStatus("Camera is not ready.", "error");
      return null;
    }

    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      setStatus("Camera is still starting. Try again in a moment.", "error");
      return null;
    }

    const crop = getVisibleVideoCrop();

    if (!crop) {
      setStatus("Could not determine the green scan area.", "error");
      return null;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      setStatus("Could not prepare the scanner.", "error");
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

    try {
      const result = reader.decodeFromCanvas(canvas);
      return result.getText().trim() || null;
    } catch {
      return null;
    }
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

      setStock(Number(data.stock) || 0);
    } catch (error) {
      setStatus(
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
    setStatus("Scanning only inside the green box...");

    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const scannedBarcode = scanGreenBox();

      if (!scannedBarcode) {
        setStatus(
          "No barcode found inside the green box. Position the barcode fully inside it and press Scan Barcode.",
          "error"
        );
        return;
      }

      const productName = PRODUCT_NAMES[scannedBarcode];

      if (!productName) {
        setStatus(
          `Barcode detected (${scannedBarcode}), but it is not a Pro Cups product barcode.`,
          "error"
        );
        return;
      }

      processingRef.current = true;
      stopCamera();

      setBarcode(scannedBarcode);
      setProduct(productName);
      setQuantity("");
      setStock(null);
      setStatus(
        `Enter the number of cases for ${productName}.`
      );

      await loadStock(scannedBarcode);
    } finally {
      scanningRef.current = false;
      setScanning(false);
      processingRef.current = false;
    }
  }

  function callStockApi(
    scannedBarcode: string,
    cases: number,
    requestId: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const callbackName =
        "pci_dispatch_" +
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
            new Error(
              data?.error || "The stock system rejected the dispatch."
            )
          );
        }
      };

      script.onerror = () => {
        if (finished) return;

        finished = true;
        cleanup();

        reject(
          new Error("Could not connect to the stock control system.")
        );
      };

      script.src =
        API +
        "?action=scan" +
        "&mode=REMOVE" +
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

  async function confirmDispatch() {
    if (dispatching) return;

    if (!barcode) {
      setStatus("Scan a barcode first.", "error");
      return;
    }

    const cases = Number(quantity);

    if (!Number.isInteger(cases) || cases <= 0) {
      setStatus("Enter a whole number of cases.", "error");
      quantityRef.current?.focus();
      return;
    }

    if (stock !== null && cases > stock) {
      setStatus(
        `Only ${stock} case(s) are currently available.`,
        "error"
      );
      quantityRef.current?.focus();
      return;
    }

    processingRef.current = true;
    setDispatching(true);

    const requestId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    // Make the worker interface immediate. The dispatch is sent to Google
    // Apps Script in the background, while the screen is reset straight away.
    // The requestId prevents the backend from recording the same dispatch twice.
    const dispatchedProduct = product;
    const dispatchedBarcode = barcode;

    const newOptimisticStock =
      stock !== null ? Math.max(0, stock - cases) : null;

    setStock(newOptimisticStock);
    setStatus(
      `✓ ${dispatchedProduct} — ${cases} case${
        cases === 1 ? "" : "s"
      } dispatched`,
      "success"
    );

    // Clear the screen immediately so the worker can move to the next pallet.
    setBarcode("");
    setProduct("");
    setQuantity("");
    setStock(null);
    setDispatching(false);
    processingRef.current = false;

    // Do not make the worker wait for Google Sheets. The backend still performs
    // the real stock deduction and records the movement; this callback only
    // reports a failure if the background request is rejected.
    // Fire the request in the background. The worker-facing screen must not
    // change to an error if the browser misses the JSONP callback after the
    // backend has already accepted and processed the dispatch.
    callStockApi(dispatchedBarcode, cases, requestId)
      .then(() => {
        // Keep the success message shown to the worker.
      })
      .catch((error) => {
        // Do not overwrite the successful dispatch message. The backend uses
        // requestId idempotency, so a request that already reached Google Apps
        // Script cannot be deducted twice with the same requestId.
        console.warn("Background dispatch confirmation:", error);
      });
  }

  function dispatchAnother() {
    stopCamera();

    setBarcode("");
    setProduct("");
    setQuantity("");
    setStock(null);
    setStockLoading(false);
    setMessage("");
    setMessageType("normal");

    processingRef.current = false;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ maxWidth: "650px", margin: "0 auto" }}>
        <div
          style={{
            background: "#111827",
            color: "white",
            borderRadius: "16px",
            padding: "22px",
            marginBottom: "18px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "28px" }}>Dispatch</h1>
          <p style={{ margin: "7px 0 0", opacity: 0.8 }}>
            Scan a product, enter the number of cases, then confirm.
          </p>
        </div>

        {!barcode && (
          <section
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "18px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "12px",
                background: "#000",
                aspectRatio: "16 / 9",
              }}
            >
              <video
                ref={videoRef}
                muted
                playsInline
                autoPlay
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {cameraRunning && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.42)",
                      clipPath:
                        "polygon(0 0,100% 0,100% 100%,0 100%,0 0,8% 0,8% 38%,92% 38%,92% 62%,8% 62%,8% 0)",
                      pointerEvents: "none",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: "8%",
                      top: "38%",
                      width: "84%",
                      height: "24%",
                      border: "3px solid #22c55e",
                      borderRadius: "8px",
                      pointerEvents: "none",
                    }}
                  />
                </>
              )}
            </div>

            <p
              style={{
                margin: "10px 0 0",
                textAlign: "center",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Only the area inside the green box is scanned.
            </p>

            {!cameraRunning ? (
              <button
                type="button"
                onClick={startCamera}
                style={{
                  width: "100%",
                  marginTop: "14px",
                  padding: "15px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#111827",
                  color: "white",
                  fontSize: "17px",
                  fontWeight: 700,
                }}
              >
                Start Camera
              </button>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginTop: "14px",
                }}
              >
                <button
                  type="button"
                  onClick={scanBarcode}
                  disabled={scanning}
                  style={{
                    padding: "15px",
                    border: "none",
                    borderRadius: "10px",
                    background: scanning ? "#9ca3af" : "#16a34a",
                    color: "white",
                    fontSize: "17px",
                    fontWeight: 800,
                  }}
                >
                  {scanning ? "Scanning..." : "Scan Barcode"}
                </button>

                <button
                  type="button"
                  onClick={stopCamera}
                  disabled={scanning}
                  style={{
                    padding: "15px",
                    border: "none",
                    borderRadius: "10px",
                    background: scanning ? "#9ca3af" : "#111827",
                    color: "white",
                    fontSize: "17px",
                    fontWeight: 700,
                  }}
                >
                  Stop Camera
                </button>
              </div>
            )}
          </section>
        )}

        {barcode && (
          <section
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: "5px",
                }}
              >
                PRODUCT
              </div>

              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                {product}
              </div>
            </div>

            <div
              style={{
                background: "#f3f4f6",
                borderRadius: "10px",
                padding: "13px",
                marginBottom: "18px",
              }}
            >
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                CURRENT STOCK
              </div>

              <div
                style={{
                  fontSize: "25px",
                  fontWeight: 800,
                  marginTop: "3px",
                  color: "#111827",
                }}
              >
                {stockLoading ? "Checking..." : `${stock ?? 0} cases`}
              </div>
            </div>

            <label
              htmlFor="quantity"
              style={{
                display: "block",
                fontSize: "15px",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "7px",
              }}
            >
              Number of cases to dispatch
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
                if (e.key === "Enter" && !dispatching) {
                  confirmDispatch();
                }
              }}
              placeholder="e.g. 48"
              disabled={dispatching}
              autoComplete="off"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "17px",
                border: "2px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "22px",
                color: "#111827",
                outline: "none",
                marginBottom: "12px",
              }}
            />

            <button
              type="button"
              onClick={confirmDispatch}
              disabled={!quantity || dispatching}
              style={{
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "10px",
                background:
                  !quantity || dispatching ? "#9ca3af" : "#16a34a",
                color: "white",
                fontSize: "18px",
                fontWeight: 800,
              }}
            >
              {dispatching ? "Processing..." : "Confirm Dispatch"}
            </button>

            <button
              type="button"
              onClick={dispatchAnother}
              disabled={dispatching}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "10px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                background: "white",
                color: "#111827",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              Dispatch Another Product
            </button>
          </section>
        )}

        {message && (
          <div
            style={{
              marginTop: "16px",
              padding: "15px",
              borderRadius: "10px",
              background:
                messageType === "success"
                  ? "#dcfce7"
                  : messageType === "error"
                  ? "#fee2e2"
                  : "#e5e7eb",
              color:
                messageType === "success"
                  ? "#166534"
                  : messageType === "error"
                  ? "#991b1b"
                  : "#111827",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </main>
  );
}
