"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";

const API =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

const SCANNER_KEY =
  "it788PCVVUNewTCbyeVF3Rgk";

type ScannerControls = {
  stop: () => void;
};

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
  PCI350WD: "350ml White Double Wall"
};


export default function DispatchPage() {

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

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

  const [stockLoading, setStockLoading] =
    useState(false);

  const [dispatching, setDispatching] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<
      "normal" |
      "success" |
      "error"
    >("normal");


  // ==========================================================
  // AUTOMATICALLY FOCUS QUANTITY
  // ==========================================================

  useEffect(() => {

    if (
      barcode &&
      product &&
      !dispatching
    ) {

      requestAnimationFrame(() => {

        quantityRef.current?.focus();

      });

    }

  }, [
    barcode,
    product,
    dispatching
  ]);


  // ==========================================================
  // CLEAN UP
  // ==========================================================

  useEffect(() => {

    return () => {

      try {

        controlsRef.current?.stop();

      } catch {
        // Ignore cleanup errors.
      }

    };

  }, []);


  // ==========================================================
  // STATUS
  // ==========================================================

  function setStatus(
    text: string,
    type:
      | "normal"
      | "success"
      | "error" = "normal"
  ) {

    setMessage(text);
    setMessageType(type);

  }


  // ==========================================================
  // STOP CAMERA
  // ==========================================================

  function stopScanner() {

    try {

      controlsRef.current?.stop();

    } catch {
      // Ignore camera stop errors.
    }


    controlsRef.current =
      null;

    setCameraRunning(
      false
    );

  }


  // ==========================================================
  // LOAD ONLY ONE PRODUCT'S STOCK
  // ==========================================================

  async function loadStock(
    scannedBarcode: string
  ) {

    try {

      setStockLoading(
        true
      );


      const response =
        await fetch(
          `${API}?action=productStock&barcode=${encodeURIComponent(
            scannedBarcode
          )}&_=${Date.now()}`,
          {
            cache: "no-store"
          }
        );


      if (!response.ok) {

        throw new Error(
          "Could not connect to the stock system."
        );

      }


      const data =
        await response.json();


      if (!data?.ok) {

        throw new Error(
          data?.error ||
          "Could not load stock."
        );

      }


      setStock(
        Number(data.stock) || 0
      );


    } catch (error) {

      setStatus(
        error instanceof Error
          ? error.message
          : "Could not load stock.",
        "error"
      );


    } finally {

      setStockLoading(
        false
      );

    }

  }


  // ==========================================================
  // BARCODE DETECTED
  // ==========================================================

  function handleBarcode(
    scannedBarcode: string
  ) {

    if (
      processingRef.current
    ) {

      return;

    }


    processingRef.current =
      true;


    // Stop camera immediately.
    stopScanner();


    // Product is known from barcode,
    // so display it immediately.
    const productName =
      PRODUCT_NAMES[
        scannedBarcode
      ];


    if (!productName) {

      processingRef.current =
        false;

      setBarcode("");
      setProduct("");
      setQuantity("");
      setStock(null);


      setStatus(
        "Barcode not recognised.",
        "error"
      );


      return;

    }


    // Show the dispatch screen immediately.
    setBarcode(
      scannedBarcode
    );

    setProduct(
      productName
    );

    setQuantity("");
    setStock(null);


    setStatus(
      `Enter the number of cases for ${productName}.`
    );


    // Release the processing lock now.
    // The camera is already stopped, and
    // the dispatch screen is displayed.
    processingRef.current =
      false;


    // Get stock in the background.
    loadStock(
      scannedBarcode
    );

  }


  // ==========================================================
  // START CAMERA
  // ==========================================================

  async function startScanner() {

    if (
      processingRef.current
    ) {

      return;

    }


    try {

      stopScanner();


      setStatus(
        "Starting camera..."
      );


      const hints =
        new Map();


      hints.set(
        DecodeHintType.POSSIBLE_FORMATS,
        [
          BarcodeFormat.CODE_128
        ]
      );


      hints.set(
        DecodeHintType.TRY_HARDER,
        true
      );


      const reader =
        new BrowserMultiFormatReader(
          hints
        );


      readerRef.current =
        reader;


      setCameraRunning(
        true
      );


      const controls =
        await reader.decodeFromConstraints(
          {
            video: {
              facingMode: {
                ideal:
                  "environment"
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


            if (
              processingRef.current
            ) {

              return;

            }


            const scannedBarcode =
              result
                .getText()
                .trim();


            if (!scannedBarcode) {
              return;
            }


            handleBarcode(
              scannedBarcode
            );

          }
        );


      controlsRef.current =
        controls as ScannerControls;


    } catch (error) {

      setCameraRunning(
        false
      );


      setStatus(
        error instanceof Error
          ? error.message
          : "Could not start camera.",
        "error"
      );

    }

  }


  // ==========================================================
  // DISPATCH REQUEST
  // ==========================================================

  function callStockApi(
    scannedBarcode: string,
    cases: number,
    requestId: string
  ): Promise<any> {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const callbackName =
          "pci_dispatch_" +
          Date.now() +
          "_" +
          Math.floor(
            Math.random() * 100000
          );


        const script =
          document.createElement(
            "script"
          );


        let finished =
          false;


        const cleanup =
          () => {

            delete (
              window as any
            )[callbackName];

            script.remove();

          };


        (
          window as any
        )[callbackName] =
          (data: any) => {

            if (finished) {
              return;
            }


            finished =
              true;


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


        script.onerror =
          () => {

            if (finished) {
              return;
            }


            finished =
              true;


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


        script.src =
          url;


        document.body.appendChild(
          script
        );

      }
    );

  }


  // ==========================================================
  // CONFIRM DISPATCH
  // ==========================================================

  async function confirmDispatch() {

    if (
      dispatching
    ) {

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
      Number(
        quantity
      );


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


    // If the stock display has already loaded,
    // do the quick local check.
    //
    // If it is still loading, we DON'T make
    // the worker wait. The backend will
    // perform the authoritative stock check.
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


    // ========================================================
    // LOCK IMMEDIATELY
    // ========================================================

    processingRef.current =
      true;

    setDispatching(
      true
    );


    setStatus(
      `Dispatching ${cases} case${
        cases === 1
          ? ""
          : "s"
      }...`
    );


    // Unique ID for this exact dispatch.
    const requestId =
      typeof crypto !==
        "undefined" &&
      typeof crypto.randomUUID ===
        "function"

        ? crypto.randomUUID()

        : `${Date.now()}-${Math.random()}`;


    try {

      const result =
        await callStockApi(
          barcode,
          cases,
          requestId
        );


      setStock(
        result.stock
      );


      setStatus(
        `✓ ${result.name} — ${cases} case${
          cases === 1
            ? ""
            : "s"
        } dispatched`,
        "success"
      );


      // Clear completed dispatch.
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

      setDispatching(
        false
      );

      processingRef.current =
        false;

    }

  }


  // ==========================================================
  // DISPATCH ANOTHER
  // ==========================================================

  function dispatchAnother() {

    stopScanner();


    setBarcode("");
    setProduct("");
    setQuantity("");
    setStock(null);
    setStockLoading(false);


    setMessage("");
    setMessageType(
      "normal"
    );


    processingRef.current =
      false;

  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <main
      style={{
        minHeight:
          "100vh",

        background:
          "#f5f7fa",

        padding:
          "24px",

        fontFamily:
          "Arial, Helvetica, sans-serif"
      }}
    >

      <div
        style={{
          maxWidth:
            "650px",

          margin:
            "0 auto"
        }}
      >

        {/* HEADER */}

        <div
          style={{
            background:
              "#111827",

            color:
              "white",

            borderRadius:
              "16px",

            padding:
              "22px",

            marginBottom:
              "18px"
          }}
        >

          <h1
            style={{
              margin:
                0,

              fontSize:
                "28px"
            }}
          >
            Dispatch
          </h1>


          <p
            style={{
              margin:
                "7px 0 0",

              opacity:
                0.8
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
              background:
                "white",

              borderRadius:
                "16px",

              padding:
                "18px",

              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",

              marginBottom:
                "18px"
            }}
          >

            <div
              style={{
                position:
                  "relative",

                overflow:
                  "hidden",

                borderRadius:
                  "12px",

                background:
                  "#000"
              }}
            >

              <video
                ref={
                  videoRef
                }

                muted

                playsInline

                autoPlay

                style={{
                  display:
                    "block",

                  width:
                    "100%",

                  height:
                    "300px",

                  objectFit:
                    "cover"
                }}
              />


              {cameraRunning && (

                <div
                  style={{
                    position:
                      "absolute",

                    left:
                      "12%",

                    right:
                      "12%",

                    top:
                      "38%",

                    height:
                      "24%",

                    border:
                      "3px solid #22c55e",

                    borderRadius:
                      "8px",

                    pointerEvents:
                      "none"
                  }}
                />

              )}

            </div>


            <button
              type="button"
              onClick={
                startScanner
              }
              disabled={
                cameraRunning
              }

              style={{
                width:
                  "100%",

                marginTop:
                  "14px",

                padding:
                  "15px",

                border:
                  "none",

                borderRadius:
                  "10px",

                background:
                  cameraRunning
                    ? "#9ca3af"
                    : "#111827",

                color:
                  "white",

                fontSize:
                  "17px",

                fontWeight:
                  700
              }}
            >
              {cameraRunning
                ? "Scanning..."
                : "Start Camera"}
            </button>

          </section>

        )}


        {/* DISPATCH DETAILS */}

        {barcode && (

          <section
            style={{
              background:
                "white",

              borderRadius:
                "16px",

              padding:
                "20px",

              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >

            {/* PRODUCT */}

            <div
              style={{
                marginBottom:
                  "18px"
              }}
            >

              <div
                style={{
                  fontSize:
                    "13px",

                  color:
                    "#6b7280",

                  marginBottom:
                    "5px"
                }}
              >
                PRODUCT
              </div>


              <div
                style={{
                  fontSize:
                    "24px",

                  fontWeight:
                    800,

                  color:
                    "#111827"
                }}
              >
                {product}
              </div>

            </div>


            {/* STOCK */}

            <div
              style={{
                background:
                  "#f3f4f6",

                borderRadius:
                  "10px",

                padding:
                  "13px",

                marginBottom:
                  "18px"
              }}
            >

              <div
                style={{
                  fontSize:
                    "13px",

                  color:
                    "#6b7280"
                }}
              >
                CURRENT STOCK
              </div>


              <div
                style={{
                  fontSize:
                    "25px",

                  fontWeight:
                    800,

                  marginTop:
                    "3px",

                  color:
                    "#111827"
                }}
              >
                {stockLoading
                  ? "Checking..."
                  : `${stock ?? 0} cases`}
              </div>

            </div>


            {/* QUANTITY */}

            <label
              htmlFor="quantity"
              style={{
                display:
                  "block",

                fontSize:
                  "15px",

                fontWeight:
                  700,

                color:
                  "#111827",

                marginBottom:
                  "7px"
              }}
            >
              Number of cases to dispatch
            </label>


            <input
              ref={
                quantityRef
              }

              id="quantity"

              type="number"

              inputMode="numeric"

              min="1"

              step="1"

              value={
                quantity
              }

              onChange={
                e =>
                  setQuantity(
                    e.target.value
                  )
              }

              onKeyDown={
                e => {

                  if (
                    e.key ===
                      "Enter" &&
                    !dispatching
                  ) {

                    confirmDispatch();

                  }

                }
              }

              placeholder="e.g. 48"

              disabled={
                dispatching
              }

              autoComplete="off"

              style={{
                width:
                  "100%",

                boxSizing:
                  "border-box",

                padding:
                  "17px",

                border:
                  "2px solid #d1d5db",

                borderRadius:
                  "10px",

                fontSize:
                  "22px",

                color:
                  "#111827",

                outline:
                  "none",

                marginBottom:
                  "12px"
              }}
            />


            {/* CONFIRM */}

            <button
              type="button"
              onClick={
                confirmDispatch
              }

              disabled={
                !quantity ||
                dispatching
              }

              style={{
                width:
                  "100%",

                padding:
                  "16px",

                border:
                  "none",

                borderRadius:
                  "10px",

                background:
                  !quantity ||
                  dispatching
                    ? "#9ca3af"
                    : "#16a34a",

                color:
                  "white",

                fontSize:
                  "18px",

                fontWeight:
                  800
              }}
            >
              {dispatching
                ? "Processing..."
                : "Confirm Dispatch"}
            </button>


            {/* ANOTHER */}

            <button
              type="button"
              onClick={
                dispatchAnother
              }

              disabled={
                dispatching
              }

              style={{
                width:
                  "100%",

                padding:
                  "14px",

                marginTop:
                  "10px",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  "10px",

                background:
                  "white",

                color:
                  "#111827",

                fontSize:
                  "16px",

                fontWeight:
                  700
              }}
            >
              Dispatch Another Product
            </button>

          </section>

        )}


        {/* STATUS */}

        {message && (

          <div
            style={{
              marginTop:
                "16px",

              padding:
                "15px",

              borderRadius:
                "10px",

              background:
                messageType ===
                "success"

                  ? "#dcfce7"

                  : messageType ===
                    "error"

                  ? "#fee2e2"

                  : "#e5e7eb",

              color:
                messageType ===
                "success"

                  ? "#166534"

                  : messageType ===
                    "error"

                  ? "#991b1b"

                  : "#111827",

              fontWeight:
                700,

              textAlign:
                "center"
            }}
          >
            {message}
          </div>

        )}

      </div>

    </main>

  );
}