"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

const API =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

type ScannerControls = {
  stop: () => void;
};

type Product = {
  barcode: string;
  name: string;
  stock: number;
  opening: number;
};

export default function DispatchPage() {

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const controlsRef =
    useRef<ScannerControls | null>(null);

  const readerRef =
    useRef<BrowserMultiFormatReader | null>(null);

  const processingRef =
    useRef(false);

  const quantityRef =
    useRef<HTMLInputElement | null>(null);


  const [cameraRunning, setCameraRunning] =
    useState(false);

  const [barcode, setBarcode] =
    useState("");

  const [product, setProduct] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [stock, setStock] =
    useState<number | null>(null);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"normal" | "success" | "error">(
      "normal"
    );

  const [loadingProduct, setLoadingProduct] =
    useState(false);

  const [dispatching, setDispatching] =
    useState(false);


  // ----------------------------------------------------------
  // AUTO-FOCUS QUANTITY FIELD
  // ----------------------------------------------------------

  useEffect(() => {

    if (barcode && product && !dispatching) {

      // Wait for React to render the input,
      // then immediately put the cursor inside it.
      requestAnimationFrame(() => {

        quantityRef.current?.focus();

      });

    }

  }, [barcode, product, dispatching]);


  // ----------------------------------------------------------
  // CLEAN UP CAMERA
  // ----------------------------------------------------------

  useEffect(() => {

    return () => {
      stopScanner();
    };

  }, []);


  function setStatus(
    text: string,
    type: "normal" | "success" | "error" = "normal"
  ) {

    setMessage(text);
    setMessageType(type);

  }


  function stopScanner() {

    try {

      controlsRef.current?.stop();

    } catch (err) {
      // Ignore camera stop errors.
    }

    controlsRef.current = null;

    setCameraRunning(false);

  }


  // ----------------------------------------------------------
  // GET PRODUCTS
  // ----------------------------------------------------------

  async function getProducts(): Promise<Product[]> {

    const response = await fetch(
      `${API}?action=products`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Could not connect to the stock system."
      );
    }

    const data = await response.json();

    if (!data?.ok || !Array.isArray(data.products)) {

      throw new Error(
        data?.error ||
        "Could not load stock."
      );

    }

    return data.products;

  }


  // ----------------------------------------------------------
  // HANDLE BARCODE
  // ----------------------------------------------------------

  async function handleBarcode(
    scannedBarcode: string
  ) {

    if (processingRef.current) {
      return;
    }

    processingRef.current = true;

    setBarcode(scannedBarcode);

    stopScanner();

    setLoadingProduct(true);

    setStatus(
      "Barcode detected..."
    );

    try {

      const products =
        await getProducts();

      const found =
        products.find(
          p => p.barcode === scannedBarcode
        );

      if (!found) {

        throw new Error(
          "Barcode not recognised."
        );

      }

      setProduct(found.name);
      setStock(found.stock);
      setQuantity("");

      setStatus(
        `Enter the number of cases for ${found.name}.`
      );

    } catch (error) {

      setBarcode("");
      setProduct("");
      setStock(null);

      setStatus(
        error instanceof Error
          ? error.message
          : "Could not load product.",
        "error"
      );

    } finally {

      setLoadingProduct(false);

      processingRef.current = false;

    }

  }


  // ----------------------------------------------------------
  // START CAMERA
  // ----------------------------------------------------------

  async function startScanner() {

    if (processingRef.current) {
      return;
    }

    try {

      stopScanner();

      setStatus(
        "Starting camera..."
      );

      const hints = new Map();

      hints.set(
        DecodeHintType.POSSIBLE_FORMATS,
        [BarcodeFormat.CODE_128]
      );

      hints.set(
        DecodeHintType.TRY_HARDER,
        true
      );

      const reader =
        new BrowserMultiFormatReader(
          hints
        );

      readerRef.current = reader;

      setCameraRunning(true);

      const controls =
        await reader.decodeFromConstraints(
          {
            video: {
              facingMode: {
                ideal: "environment"
              },
              width: {
                ideal: 1920
              },
              height: {
                ideal: 1080
              }
            }
          },
          videoRef.current!,
          (result) => {

            if (!result) {
              return;
            }

            if (processingRef.current) {
              return;
            }

            const value =
              result.getText().trim();

            if (!value) {
              return;
            }

            // Immediately lock processing before
            // doing anything else.
            processingRef.current = true;

            stopScanner();

            handleBarcode(value);

          }
        );

      controlsRef.current =
        controls as ScannerControls;

    } catch (error) {

      setCameraRunning(false);

      setStatus(
        error instanceof Error
          ? error.message
          : "Could not start camera.",
        "error"
      );

    }

  }


  // ----------------------------------------------------------
  // JSONP DISPATCH REQUEST
  // ----------------------------------------------------------

  function callStockApi(
    scannedBarcode: string,
    cases: number,
    requestId: string
  ): Promise<any> {

    return new Promise(
      (resolve, reject) => {

        const callbackName =
          "pci_dispatch_" +
          Date.now() +
          "_" +
          Math.floor(
            Math.random() * 100000
          );

        const script =
          document.createElement("script");

        const cleanup = () => {

          delete (window as any)[
            callbackName
          ];

          script.remove();

        };


        (window as any)[callbackName] =
          (data: any) => {

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
          encodeURIComponent(
            scannedBarcode
          ) +
          "&cases=" +
          encodeURIComponent(
            String(cases)
          ) +
          "&requestId=" +
          encodeURIComponent(
            requestId
          ) +
          "&key=" +
          encodeURIComponent(
            SCANNER_KEY
          ) +
          "&callback=" +
          encodeURIComponent(
            callbackName
          );


        script.src = url;

        document.body.appendChild(
          script
        );

      }
    );

  }


  // ----------------------------------------------------------
  // CONFIRM DISPATCH
  // ----------------------------------------------------------

  async function confirmDispatch() {

    if (dispatching) {
      return;
    }

    if (!barcode) {

      setStatus(
        "Scan a barcode first.",
        "error"
      );

      return;

    }


    const cases =
      Number(quantity);


    if (
      !Number.isInteger(cases) ||
      cases <= 0
    ) {

      setStatus(
        "Enter a whole number of cases.",
        "error"
      );

      quantityRef.current?.focus();

      return;

    }


    if (
      stock !== null &&
      cases > stock
    ) {

      setStatus(
        `Only ${stock} case(s) are currently available.`,
        "error"
      );

      quantityRef.current?.focus();

      return;

    }


    // --------------------------------------------------------
    // LOCK IMMEDIATELY
    // --------------------------------------------------------

    processingRef.current = true;

    setDispatching(true);

    setStatus(
      `Dispatching ${cases} case${cases === 1 ? "" : "s"}...`
    );


    // Unique ID for THIS exact dispatch.
    // If the same request reaches Google again,
    // Google will recognise it and not deduct again.
    const requestId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;


    try {

      const result =
        await callStockApi(
          barcode,
          cases,
          requestId
        );


      setStock(result.stock);

      setStatus(
        `✓ ${result.name} — ${cases} case${cases === 1 ? "" : "s"} dispatched`,
        "success"
      );


      // Clear the current dispatch.
      setBarcode("");
      setProduct("");
      setQuantity("");
      setStock(null);


    } catch (error) {

      setStatus(
        error instanceof Error
          ? error.message
          : "Dispatch failed.",
        "error"
      );

    } finally {

      setDispatching(false);

      processingRef.current = false;

    }

  }


  // ----------------------------------------------------------
  // RESET
  // ----------------------------------------------------------

  function dispatchAnother() {

    stopScanner();

    setBarcode("");
    setProduct("");
    setQuantity("");
    setStock(null);

    setMessage("");
    setMessageType("normal");

    processingRef.current = false;

  }


  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "24px",
        fontFamily:
          "Arial, Helvetica, sans-serif"
      }}
    >

      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto"
        }}
      >

        <div
          style={{
            background: "#111827",
            color: "white",
            borderRadius: "16px",
            padding: "22px",
            marginBottom: "18px"
          }}
        >

          <h1
            style={{
              margin: 0,
              fontSize: "28px"
            }}
          >
            Dispatch
          </h1>

          <p
            style={{
              margin:
                "7px 0 0",
              opacity: 0.8
            }}
          >
            Scan a product, enter the number
            of cases, then confirm.
          </p>

        </div>


        {/* CAMERA */}

        {!barcode && (

          <section
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "18px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
              marginBottom: "18px"
            }}
          >

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "12px",
                background: "#000"
              }}
            >

              <video
                ref={videoRef}
                muted
                playsInline
                style={{
                  display: "block",
                  width: "100%",
                  height: "300px",
                  objectFit: "cover"
                }}
              />

              {cameraRunning && (

                <div
                  style={{
                    position: "absolute",
                    left: "12%",
                    right: "12%",
                    top: "38%",
                    height: "24%",
                    border:
                      "3px solid #22c55e",
                    borderRadius: "8px",
                    pointerEvents: "none"
                  }}
                />

              )}

            </div>


            <button
              type="button"
              onClick={startScanner}
              disabled={cameraRunning}
              style={{
                width: "100%",
                marginTop: "14px",
                padding: "15px",
                border: "none",
                borderRadius: "10px",
                background:
                  cameraRunning
                    ? "#9ca3af"
                    : "#111827",
                color: "white",
                fontSize: "17px",
                fontWeight: 700,
                cursor:
                  cameraRunning
                    ? "default"
                    : "pointer"
              }}
            >
              {cameraRunning
                ? "Scanning..."
                : "Start Camera"}
            </button>

          </section>

        )}


        {/* PRODUCT / QUANTITY */}

        {barcode && (

          <section
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >

            {loadingProduct ? (

              <div
                style={{
                  padding: "20px 0",
                  textAlign: "center",
                  fontSize: "18px"
                }}
              >
                Loading product...
              </div>

            ) : (

              <>

                <div
                  style={{
                    marginBottom: "18px"
                  }}
                >

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginBottom: "5px"
                    }}
                  >
                    PRODUCT
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 800,
                      color: "#111827"
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
                    marginBottom: "18px"
                  }}
                >

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280"
                    }}
                  >
                    CURRENT STOCK
                  </div>

                  <div
                    style={{
                      fontSize: "25px",
                      fontWeight: 800,
                      marginTop: "3px",
                      color: "#111827"
                    }}
                  >
                    {stock ?? "..."} cases
                  </div>

                </div>


                <label
                  htmlFor="quantity"
                  style={{
                    display: "block",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#111827",
                    marginBottom: "7px"
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
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                  onKeyDown={(e) => {

                    if (
                      e.key === "Enter" &&
                      !dispatching
                    ) {

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
                    border:
                      "2px solid #d1d5db",
                    borderRadius: "10px",
                    fontSize: "22px",
                    color: "#111827",
                    outline: "none",
                    marginBottom: "12px"
                  }}
                />


                <button
                  type="button"
                  onClick={confirmDispatch}
                  disabled={
                    !quantity ||
                    dispatching
                  }
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: "none",
                    borderRadius: "10px",
                    background:
                      !quantity ||
                      dispatching
                        ? "#9ca3af"
                        : "#16a34a",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: 800,
                    cursor:
                      !quantity ||
                      dispatching
                        ? "default"
                        : "pointer"
                  }}
                >
                  {dispatching
                    ? "Processing..."
                    : "Confirm Dispatch"}
                </button>


                <button
                  type="button"
                  onClick={dispatchAnother}
                  disabled={dispatching}
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginTop: "10px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius: "10px",
                    background: "white",
                    color: "#111827",
                    fontSize: "16px",
                    fontWeight: 700,
                    cursor:
                      dispatching
                        ? "default"
                        : "pointer"
                  }}
                >
                  Dispatch Another Product
                </button>

              </>

            )}

          </section>

        )}


        {/* STATUS */}

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
              textAlign: "center"
            }}
          >
            {message}
          </div>

        )}

      </div>

    </main>

  );

}