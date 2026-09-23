"use client";

import { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbxIMNQWwpxRVPY6U-pui0_CbfFRbg8fW6srEBQdVcTP7ExZDpMy491dnTBW1uYURZ1bVg/exec";

const SCANNER_KEY = "it788PCVVUNewTCbyeVF3Rgk";

type Product = {
  barcode: string;
  name: string;
  stock: number;
};

type SummaryItem = {
  date: string;
  product: string;
  barcode: string;
  additions: number;
  dispatches: number;
  net: number;
  closingStock: number;
};

export default function StockAdminPage() {
  const [pin, setPin] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<SummaryItem[]>([]);

  // Separate product selections
  const [openingBarcode, setOpeningBarcode] = useState("");
  const [adjustmentBarcode, setAdjustmentBarcode] =
    useState("");

  const [openingStock, setOpeningStock] = useState("");

  const [adjustment, setAdjustment] = useState("");
  const [adjustmentNote, setAdjustmentNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [settingOpening, setSettingOpening] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================================
  // LOAD LIVE STOCK
  // ============================================================

  function loadData() {
    setLoading(true);
    setError("");

    const callbackName =
      "stockAdminProducts_" + Date.now();

    const script = document.createElement("script");

    (window as any)[callbackName] = (data: any) => {
      if (data.ok) {
        setProducts(data.products || []);
      } else {
        setError(
          data.error || "Could not load stock."
        );
      }

      delete (window as any)[callbackName];

      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }

      loadSummary();
    };

    script.src =
      API_URL +
      "?action=products" +
      "&key=" +
      encodeURIComponent(SCANNER_KEY) +
      "&callback=" +
      callbackName;

    document.body.appendChild(script);
  }

  // ============================================================
  // LOAD MOVEMENT SUMMARY
  // ============================================================

  function loadSummary() {
    const callbackName =
      "stockAdminSummary_" + Date.now();

    const script = document.createElement("script");

    (window as any)[callbackName] = (data: any) => {
      if (data.ok) {
        setSummary(data.summary || []);
      } else {
        setError(
          data.error ||
            "Could not load movement summary."
        );
      }

      delete (window as any)[callbackName];

      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }

      setLoading(false);
    };

    script.src =
      API_URL +
      "?action=summary" +
      "&callback=" +
      callbackName;

    document.body.appendChild(script);
  }

  // ============================================================
  // LOGIN
  // ============================================================

  function login() {
    setError("");
    setMessage("");

    if (pin !== "1104") {
      setError("Incorrect PIN.");
      return;
    }

    setLoggedIn(true);
    loadData();
  }

  // ============================================================
  // OPENING STOCK PRODUCT
  // ============================================================

  const openingProduct = products.find(
    (product) =>
      product.barcode === openingBarcode
  );

  // ============================================================
  // ADJUSTMENT PRODUCT
  // ============================================================

  const adjustmentProduct = products.find(
    (product) =>
      product.barcode === adjustmentBarcode
  );

  // ============================================================
  // SET OPENING STOCK
  // ============================================================

  function setOpening() {
    setError("");
    setMessage("");

    if (!openingBarcode) {
      setError(
        "Select a product for Opening Stock."
      );
      return;
    }

    const value = Number(openingStock);

    if (!Number.isInteger(value) || value < 0) {
      setError(
        "Opening stock must be a whole number of 0 or more."
      );
      return;
    }

    setSettingOpening(true);

    const callbackName =
      "setOpening_" + Date.now();

    const script = document.createElement("script");

    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;

      delete (window as any)[callbackName];

      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }

      setSettingOpening(false);
    };

    (window as any)[callbackName] = (data: any) => {
      if (data.ok) {
        setMessage(
          "Opening stock updated successfully."
        );

        setOpeningStock("");

        loadData();
      } else {
        setError(
          data.error ||
            "Opening stock update failed."
        );
      }

      finish();
    };

    script.onerror = () => {
      setError(
        "Could not connect to the stock server."
      );

      finish();
    };

    script.src =
      API_URL +
      "?action=adminSetOpening" +
      "&barcode=" +
      encodeURIComponent(openingBarcode) +
      "&stock=" +
      encodeURIComponent(String(value)) +
      "&pin=" +
      encodeURIComponent(pin) +
      "&callback=" +
      callbackName;

    document.body.appendChild(script);
  }

  // ============================================================
  // MANUAL STOCK ADJUSTMENT
  // ============================================================

  function adjustStock() {
    setError("");
    setMessage("");

    if (!adjustmentBarcode) {
      setError(
        "Select a product for the adjustment."
      );
      return;
    }

    const value = Number(adjustment);

    if (!Number.isInteger(value) || value === 0) {
      setError(
        "Adjustment must be a whole number other than 0."
      );
      return;
    }

    if (!adjustmentNote.trim()) {
      setError(
        "Please enter a reason for the adjustment."
      );
      return;
    }

    setAdjusting(true);

    const callbackName =
      "adminAdjustment_" + Date.now();

    const script = document.createElement("script");

    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;

      delete (window as any)[callbackName];

      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }

      setAdjusting(false);
    };

    (window as any)[callbackName] = (data: any) => {
      if (data.ok) {
        setMessage(
          `${data.name}: stock adjusted successfully. New stock: ${data.stock} cases.`
        );

        setAdjustment("");
        setAdjustmentNote("");

        loadData();
      } else {
        setError(
          data.error ||
            "Stock adjustment failed."
        );
      }

      finish();
    };

    script.onerror = () => {
      setError(
        "Could not connect to the stock server."
      );

      finish();
    };

    script.src =
      API_URL +
      "?action=adminAdjust" +
      "&barcode=" +
      encodeURIComponent(adjustmentBarcode) +
      "&adjustment=" +
      encodeURIComponent(String(value)) +
      "&note=" +
      encodeURIComponent(
        adjustmentNote.trim()
      ) +
      "&pin=" +
      encodeURIComponent(pin) +
      "&callback=" +
      callbackName;

    document.body.appendChild(script);
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  function logout() {
    setLoggedIn(false);
    setPin("");
    setProducts([]);
    setSummary([]);

    setOpeningBarcode("");
    setAdjustmentBarcode("");

    setOpeningStock("");
    setAdjustment("");
    setAdjustmentNote("");

    setMessage("");
    setError("");
  }

  // ============================================================
  // AUTO REFRESH
  // ============================================================

  useEffect(() => {
    if (!loggedIn) return;

    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, [loggedIn]);

  // ============================================================
  // LOGIN SCREEN
  // ============================================================

  if (!loggedIn) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f3f4f6",
          color: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "#ffffff",
            borderRadius: "18px",
            padding: "30px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Stock Control
          </h1>

          <p
            style={{
              marginTop: "6px",
              marginBottom: "26px",
              color: "#6b7280",
            }}
          >
            Pro Cups International — Stock Admin
          </p>

          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Admin PIN
          </label>

          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
            placeholder="Enter PIN"
            style={{
              width: "100%",
              boxSizing: "border-box",
              border:
                "1px solid #d1d5db",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "18px",
              color: "#111827",
              background: "#ffffff",
            }}
          />

          {error && (
            <div
              style={{
                marginTop: "12px",
                color: "#b91c1c",
                background: "#fee2e2",
                borderRadius: "10px",
                padding: "10px 12px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={login}
            style={{
              width: "100%",
              marginTop: "18px",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              background: "#111827",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        color: "#111827",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "14px",
            marginBottom: "22px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: 800,
              }}
            >
              Stock Control
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "#6b7280",
              }}
            >
              Pro Cups International
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            style={{
              border:
                "1px solid #d1d5db",
              background: "#ffffff",
              color: "#111827",
              borderRadius: "10px",
              padding: "11px 18px",
              fontWeight: 700,
            }}
          >
            Logout
          </button>
        </div>

        {/* SUCCESS */}

        {message && (
          <div
            style={{
              background: "#dcfce7",
              border:
                "1px solid #86efac",
              color: "#166534",
              borderRadius: "12px",
              padding: "12px 14px",
              marginBottom: "18px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              border:
                "1px solid #fca5a5",
              color: "#991b1b",
              borderRadius: "12px",
              padding: "12px 14px",
              marginBottom: "18px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* LIVE STOCK */}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow:
              "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                  fontWeight: 800,
                }}
              >
                Live Stock
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Current stock on the floor
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              style={{
                border:
                  "1px solid #d1d5db",
                background: "#ffffff",
                color: "#111827",
                borderRadius: "10px",
                padding: "10px 15px",
                fontWeight: 700,
              }}
            >
              {loading
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "600px",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom:
                      "2px solid #e5e7eb",
                  }}
                >
                  <th
                    style={{
                      padding:
                        "12px 10px",
                      textAlign: "left",
                    }}
                  >
                    Product
                  </th>

                  <th
                    style={{
                      padding:
                        "12px 10px",
                      textAlign: "left",
                    }}
                  >
                    Barcode
                  </th>

                  <th
                    style={{
                      padding:
                        "12px 10px",
                      textAlign: "right",
                    }}
                  >
                    Live Stock
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(
                  (product) => (
                    <tr
                      key={
                        product.barcode
                      }
                      style={{
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >
                      <td
                        style={{
                          padding:
                            "13px 10px",
                          fontWeight: 600,
                        }}
                      >
                        {product.name}
                      </td>

                      <td
                        style={{
                          padding:
                            "13px 10px",
                          color:
                            "#6b7280",
                          fontFamily:
                            "monospace",
                        }}
                      >
                        {
                          product.barcode
                        }
                      </td>

                      <td
                        style={{
                          padding:
                            "13px 10px",
                          textAlign:
                            "right",
                          fontWeight: 800,
                          fontSize:
                            "18px",
                          color:
                            product.stock ===
                            0
                              ? "#dc2626"
                              : "#111827",
                        }}
                      >
                        {
                          product.stock
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ADMIN ACTIONS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* OPENING STOCK */}

          <section
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "21px",
                fontWeight: 800,
              }}
            >
              Set Opening Stock
            </h2>

            <p
              style={{
                margin:
                  "6px 0 20px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Set or correct the starting stock figure.
            </p>

            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "7px",
              }}
            >
              Product
            </label>

            <select
              value={openingBarcode}
              onChange={(e) =>
                setOpeningBarcode(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #d1d5db",
                borderRadius: "11px",
                padding: "13px",
                fontSize: "15px",
                color: "#111827",
                background:
                  "#ffffff",
                marginBottom:
                  "16px",
              }}
            >
              <option value="">
                Select a product
              </option>

              {products.map(
                (product) => (
                  <option
                    key={
                      product.barcode
                    }
                    value={
                      product.barcode
                    }
                  >
                    {product.name}
                  </option>
                )
              )}
            </select>

            {openingProduct && (
              <div
                style={{
                  background:
                    "#f3f4f6",
                  borderRadius:
                    "11px",
                  padding: "13px",
                  marginBottom:
                    "16px",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "13px",
                    color:
                      "#6b7280",
                  }}
                >
                  Current live stock
                </div>

                <div
                  style={{
                    marginTop:
                      "3px",
                    fontSize:
                      "23px",
                    fontWeight: 800,
                  }}
                >
                  {
                    openingProduct.stock
                  }{" "}
                  cases
                </div>
              </div>
            )}

            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "7px",
              }}
            >
              Opening Stock
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={openingStock}
              onChange={(e) =>
                setOpeningStock(
                  e.target.value
                )
              }
              placeholder="e.g. 250"
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #d1d5db",
                borderRadius: "11px",
                padding: "13px",
                fontSize: "16px",
                color: "#111827",
                background:
                  "#ffffff",
                marginBottom:
                  "16px",
              }}
            />

            <button
              type="button"
              onClick={setOpening}
              disabled={
                settingOpening
              }
              style={{
                width: "100%",
                border: "none",
                borderRadius: "11px",
                padding: "14px",
                background:
                  settingOpening
                    ? "#6b7280"
                    : "#111827",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 800,
              }}
            >
              {settingOpening
                ? "Saving..."
                : "Set Opening Stock"}
            </button>
          </section>

          {/* MANUAL ADJUSTMENT */}

          <section
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "21px",
                fontWeight: 800,
              }}
            >
              Manual Adjustment
            </h2>

            <p
              style={{
                margin:
                  "6px 0 20px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Correct physical stock without recording production or dispatch.
            </p>

            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "7px",
              }}
            >
              Product
            </label>

            <select
              value={adjustmentBarcode}
              onChange={(e) =>
                setAdjustmentBarcode(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #d1d5db",
                borderRadius: "11px",
                padding: "13px",
                fontSize: "15px",
                color: "#111827",
                background:
                  "#ffffff",
                marginBottom:
                  "16px",
              }}
            >
              <option value="">
                Select a product
              </option>

              {products.map(
                (product) => (
                  <option
                    key={
                      product.barcode
                    }
                    value={
                      product.barcode
                    }
                  >
                    {product.name}
                  </option>
                )
              )}
            </select>

            {adjustmentProduct && (
              <div
                style={{
                  background:
                    "#f3f4f6",
                  borderRadius:
                    "11px",
                  padding: "13px",
                  marginBottom:
                    "16px",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "13px",
                    color:
                      "#6b7280",
                  }}
                >
                  Current live stock
                </div>

                <div
                  style={{
                    marginTop:
                      "3px",
                    fontSize:
                      "23px",
                    fontWeight: 800,
                  }}
                >
                  {
                    adjustmentProduct.stock
                  }{" "}
                  cases
                </div>
              </div>
            )}

            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "7px",
              }}
            >
              Adjustment
            </label>

            <input
              type="number"
              step="1"
              value={adjustment}
              onChange={(e) =>
                setAdjustment(
                  e.target.value
                )
              }
              placeholder="e.g. 5 or -40"
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #d1d5db",
                borderRadius: "11px",
                padding: "13px",
                fontSize: "16px",
                color: "#111827",
                background:
                  "#ffffff",
                marginBottom:
                  "16px",
              }}
            />

            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 700,
                marginBottom: "7px",
              }}
            >
              Reason
            </label>

            <input
              type="text"
              value={adjustmentNote}
              onChange={(e) =>
                setAdjustmentNote(
                  e.target.value
                )
              }
              placeholder="e.g. Remove incorrect opening stock"
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #d1d5db",
                borderRadius: "11px",
                padding: "13px",
                fontSize: "16px",
                color: "#111827",
                background:
                  "#ffffff",
                marginBottom:
                  "16px",
              }}
            />

            <button
              type="button"
              onClick={adjustStock}
              disabled={adjusting}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "11px",
                padding: "14px",
                background:
                  adjusting
                    ? "#6b7280"
                    : "#111827",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 800,
                cursor:
                  adjusting
                    ? "default"
                    : "pointer",
              }}
            >
              {adjusting
                ? "Saving Adjustment..."
                : "Apply Adjustment"}
            </button>
          </section>
        </div>

        {/* MOVEMENT SUMMARY */}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow:
              "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "10px",
              marginBottom: "5px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "21px",
                fontWeight: 800,
              }}
            >
              Movement Summary
            </h2>

            <button
              type="button"
              onClick={loadSummary}
              disabled={loading}
              style={{
                border:
                  "1px solid #d1d5db",
                background:
                  "#ffffff",
                color: "#111827",
                borderRadius:
                  "10px",
                padding:
                  "9px 14px",
                fontWeight: 700,
              }}
            >
              Refresh
            </button>
          </div>

          <p
            style={{
              margin:
                "5px 0 18px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            Daily additions, dispatches and closing stock.
          </p>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "750px",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom:
                      "2px solid #e5e7eb",
                  }}
                >
                  <th
                    style={{
                      padding:
                        "11px 9px",
                      textAlign:
                        "left",
                    }}
                  >
                    Date
                  </th>

                  <th
                    style={{
                      padding:
                        "11px 9px",
                      textAlign:
                        "left",
                    }}
                  >
                    Product
                  </th>

                  <th
                    style={{
                      padding:
                        "11px 9px",
                      textAlign:
                        "right",
                    }}
                  >
                    Additions
                  </th>

                  <th
                    style={{
                      padding:
                        "11px 9px",
                      textAlign:
                        "right",
                    }}
                  >
                    Dispatches
                  </th>

                  <th
                    style={{
                      padding:
                        "11px 9px",
                      textAlign:
                        "right",
                    }}
                  >
                    Net
                  </th>

                  <th
                    style={{
                      padding:
                        "11px 9px",
                      textAlign:
                        "right",
                    }}
                  >
                    Closing Stock
                  </th>
                </tr>
              </thead>

              <tbody>
                {summary.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding:
                          "25px 10px",
                        textAlign:
                          "center",
                        color:
                          "#6b7280",
                      }}
                    >
                      No movement history yet.
                    </td>
                  </tr>
                ) : (
                  summary.map(
                    (item, index) => (
                      <tr
                        key={`${item.date}-${item.barcode}-${index}`}
                        style={{
                          borderBottom:
                            "1px solid #e5e7eb",
                        }}
                      >
                        <td
                          style={{
                            padding:
                              "12px 9px",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {item.date}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px 9px",
                            fontWeight: 700,
                          }}
                        >
                          {item.product}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px 9px",
                            textAlign:
                              "right",
                            fontWeight: 700,
                            color:
                              "#15803d",
                          }}
                        >
                          {
                            item.additions
                          }
                        </td>

                        <td
                          style={{
                            padding:
                              "12px 9px",
                            textAlign:
                              "right",
                            fontWeight: 700,
                            color:
                              "#b91c1c",
                          }}
                        >
                          {
                            item.dispatches
                          }
                        </td>

                        <td
                          style={{
                            padding:
                              "12px 9px",
                            textAlign:
                              "right",
                            fontWeight: 800,
                            color:
                              item.net >=
                              0
                                ? "#15803d"
                                : "#b91c1c",
                          }}
                        >
                          {item.net >
                          0
                            ? `+${item.net}`
                            : item.net}
                        </td>

                        <td
                          style={{
                            padding:
                              "12px 9px",
                            textAlign:
                              "right",
                            fontWeight: 800,
                          }}
                        >
                          {
                            item.closingStock
                          }
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div
          style={{
            textAlign: "center",
            color: "#9ca3af",
            fontSize: "12px",
            padding:
              "20px 0 10px",
          }}
        >
          Stock Control System
        </div>
      </div>
    </main>
  );
}