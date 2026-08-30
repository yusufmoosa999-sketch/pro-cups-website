"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function ArtworkUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);

    if (selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  }

  async function submitQuote() {
    setEmailError("");
    setSuccess(false);

    /*
     * EMAIL IS REQUIRED FOR QUOTE REQUESTS
     */

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setEmailError(
        "Please enter your email address so we can send you your quotation and updates."
      );
      return;
    }

    /*
     * Basic email validation
     */

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

    if (!emailIsValid) {
      setEmailError(
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setLoading(true);

      let artworkUrl = "";

      /*
       * Upload artwork first if one was selected.
       */

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          alert(
            uploadResult.error ||
              "Unable to upload your artwork."
          );
          return;
        }

        artworkUrl = uploadResult.publicUrl;
      }

      /*
       * Submit quote.
       */

      const response = await fetch("/api/quotes", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          company_name: companyName,
          contact_name: contactName,

          // Use the cleaned/validated email.
          email: cleanEmail,

          phone,
          product,
          quantity: Number(quantity),
          message,
          artwork_url: artworkUrl,
        }),
      });

      const result = await response.json();

      /*
       * Customer needs to be logged in.
       */

      if (response.status === 401) {
        window.location.href =
          "/login?redirect=/custom-printing";

        return;
      }

      /*
       * API validation/error.
       */

      if (!response.ok) {
        alert(
          result.error ||
            "Something went wrong."
        );

        return;
      }

      /*
       * Quote submitted successfully.
       */

      setSuccess(true);

      /*
       * Clear form.
       */

      setCompanyName("");
      setContactName("");
      setEmail("");
      setPhone("");
      setProduct("");
      setQuantity("");
      setMessage("");

      setPreview(null);
      setFile(null);
      setFileName("");

      setEmailError("");

      /*
       * Reset file input.
       */

      const input = document.getElementById(
        "artwork-upload"
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }
    } catch (err) {
      console.error(err);

      alert(
        "Failed to submit quote. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#0b1120] py-24">

      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">

        {/* HEADER */}

        <div className="text-center">

          <span className="inline-flex rounded-full bg-green-500/10 px-6 py-2 text-sm font-bold uppercase tracking-[4px] text-green-400">
            Request a Quote
          </span>

          <h2 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
            Upload Your Artwork
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
            Send us your logo, artwork or print-ready files and
            our design team will prepare a professional digital
            proof for your approval before production begins.
          </p>

        </div>

        {/* FORM CARD */}

        <div className="relative mt-20 overflow-hidden rounded-[40px] border border-slate-700 bg-[#111827] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] lg:p-14">

          <div className="pointer-events-none absolute -top-32 h-72 w-72 rounded-full bg-green-500/10 blur-[120px]" />

          <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-green-600/5 blur-[140px]" />

          {/* ARTWORK UPLOAD */}

          <label
            htmlFor="artwork-upload"
            className="group flex h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-[36px] border-2 border-dashed border-green-500 bg-gradient-to-br from-slate-800 to-slate-900 transition-all duration-300 hover:border-green-400 sm:h-[340px] md:h-[400px] lg:h-[480px]"
          >

            {preview ? (

              <img
                src={preview}
                alt="Artwork Preview"
                className="h-full w-full rounded-[34px] object-cover"
              />

            ) : (

              <>

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-500/15 ring-1 ring-green-500/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500/25">

                  <UploadCloud
                    size={62}
                    strokeWidth={1.8}
                    className="text-green-400"
                  />

                </div>

                <h3 className="mt-8 text-center text-3xl font-black text-white md:text-4xl lg:text-5xl">
                  Drag & Drop Artwork
                </h3>

                <p className="mt-4 max-w-xl text-center text-base leading-7 text-slate-300 md:text-lg">
                  Tap anywhere to browse your files or drag and
                  drop your artwork.
                </p>

                <div className="mt-8 rounded-full border border-green-500/30 bg-green-500/10 px-6 py-3 text-xs font-bold tracking-[3px] text-green-300 md:text-sm">
                  AI • PDF • EPS • SVG • PNG • JPG
                </div>

              </>

            )}

            <input
              ref={fileInputRef}
              id="artwork-upload"
              type="file"
              accept=".ai,.eps,.pdf,.svg,.png,.jpg,.jpeg"
              onChange={handleFile}
              className="sr-only"
            />

          </label>

          {/* FILE NAME */}

          {fileName && (

            <div className="mt-8 rounded-3xl border border-green-500/30 bg-green-500/10 p-6">

              <p className="text-center text-lg font-semibold text-green-300">
                ✓{" "}
                <span className="font-bold">
                  {fileName}
                </span>{" "}
                uploaded successfully
              </p>

            </div>

          )}

          <div className="my-16 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          {/* FORM */}

          <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2">

            {/* COMPANY */}

            <input
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
              }
              placeholder="Company Name *"
              className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
            />

            {/* CONTACT */}

            <input
              value={contactName}
              onChange={(e) =>
                setContactName(e.target.value)
              }
              placeholder="Contact Person *"
              className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
            />

            {/* EMAIL */}

            <div className="relative">

              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (emailError) {
                    setEmailError("");
                  }
                }}
                placeholder="Email Address *"
                className={`h-[68px] w-full rounded-2xl border bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:bg-slate-900 focus:ring-4 ${
                  emailError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-700 focus:border-green-500 focus:ring-green-500/20"
                }`}
              />

            </div>

            {/* PHONE */}

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Phone Number"
              className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
            />

            {/* PRODUCT */}

            <select
              value={product}
              onChange={(e) =>
                setProduct(e.target.value)
              }
              className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
            >

              <option value="">
                Select Product *
              </option>

              <option>
                250ml Single Wall
              </option>

              <option>
                250ml Double Wall
              </option>

              <option>
                350ml Single Wall
              </option>

              <option>
                350ml Double Wall
              </option>

            </select>

            {/* QUANTITY */}

            <input
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="Estimated Quantity"
              className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
            />

            {/* MESSAGE */}

            <div className="lg:col-span-2">

              <textarea
                rows={7}
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Tell us about your project, branding, colours, deadlines or any special requirements..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 p-6 text-lg leading-8 text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
              />

            </div>

            {/* EMAIL ERROR */}

            {emailError && (

              <div className="lg:col-span-2">

                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-center text-sm font-semibold text-red-300">
                  {emailError}
                </div>

              </div>

            )}

            {/* SUBMIT */}

            <div className="relative z-50 mt-4 flex justify-center lg:col-span-2">

              <button
                type="button"
                onClick={submitQuote}
                disabled={loading}
                className="w-full max-w-xl rounded-full bg-green-600 px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading
                  ? "Submitting Your Request..."
                  : "Upload Artwork & Request Quote"}

              </button>

            </div>

            {/* SUCCESS */}

            {success && (

              <div className="mt-6 rounded-3xl border border-green-500/30 bg-green-500/10 p-8 text-center lg:col-span-2">

                <h4 className="text-3xl font-black text-green-400">
                  ✓ Quote Request Received Successfully
                </h4>

                <p className="mt-4 text-lg leading-8 text-slate-300">

                  Thank you for choosing{" "}
                  <strong>
                    Pro Cups International
                  </strong>
                  .

                  <br />

                  We have received your quote request and will
                  review your requirements shortly.

                  <br />

                  <span className="text-green-300">
                    We have also sent a confirmation email to{" "}
                    <strong>{email || "your email address"}</strong>.
                  </span>

                  <br />

                  You will receive further email updates when
                  your quotation or print proof is ready.

                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </section>
  );
}