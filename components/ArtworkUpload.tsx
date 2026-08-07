"use client";

import { useState } from "react";

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
    try {
      setLoading(true);
      setSuccess(false);

      let artworkUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          alert(uploadResult.error);
          return;
        }

        artworkUrl = uploadResult.publicUrl;
      }

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
          contact_name: contactName,
          email,
          phone,
          product,
          quantity: Number(quantity),
          message,
          artwork_url: artworkUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Something went wrong.");
        return;
      }

      setSuccess(true);

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

      // Reset file input
      const input = document.getElementById(
        "artwork-upload"
      ) as HTMLInputElement | null;

      if (input) input.value = "";
    } catch (err) {
      console.error(err);
      alert("Failed to submit quote.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#0f172a] py-24">

  <div className="mx-auto max-w-[1500px] px-6 lg:px-10">

    <div className="text-center">

      <p className="font-bold uppercase tracking-[8px] text-green-400">
        REQUEST A QUOTE
      </p>

      <h2 className="mt-5 text-4xl font-black text-white md:text-5xl lg:text-6xl">
        Upload Your Artwork
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
        Upload your logo, artwork or print-ready files and our team will
        prepare a professional proof before manufacturing begins.
      </p>

    </div>

    <div className="mt-14 rounded-[40px] border border-slate-700 bg-[#111827] p-8 shadow-2xl lg:p-12">
          <p className="font-bold uppercase tracking-[8px] text-green-700">
            REQUEST A QUOTE
          </p>

          <h2 className="mt-5 text-4xl font-black text-slate-900 md:text-5xl lg:text-6xl">
            Upload Your Artwork
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Upload your logo, artwork or print-ready files and our team will
            prepare a professional proof before manufacturing begins.
          </p>

        </div>

        <div className="mt-14 rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl lg:p-12">

          <label
  htmlFor="artwork-upload"
  className="group flex h-[280px] md:h-[360px] lg:h-[460px] w-full cursor-pointer flex-col items-center justify-center rounded-[36px] border-2 border-dashed border-green-500 bg-slate-800 transition-all duration-300 hover:border-green-400 hover:bg-slate-700"
>
          

            {preview ? (

              <img
                src={preview}
                alt="Artwork Preview"
                className="h-full w-full rounded-[30px] object-cover"
              />

            ) : (

              <>
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-500/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500/25">

                  <span className="text-6xl">
                    📁
                  </span>

                </div>

                <h3 className="mt-8 text-4xl font-black text-white">
                  Drag & Drop Your Artwork
                </h3>

                <p className="mt-5 max-w-2xl text-center text-xl leading-8 text-slate-300">
                  Drag your files here or click anywhere inside this area to browse.
                </p>

                <div className="mt-8 rounded-full bg-green-500/15 px-8 py-3 text-sm font-bold tracking-[3px] text-green-300">
                  AI • PDF • EPS • SVG • PNG • JPG
                </div>

              </>

            )}

            <input
              id="artwork-upload"
              type="file"
              className="hidden"
              accept=".ai,.eps,.pdf,.svg,.png,.jpg,.jpeg"
              onChange={handleFile}
            />

          </label>

          {fileName && (

            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

              <p className="font-bold text-green-700">
                ✓ {fileName}
              </p>

            </div>

          )}

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name *"
              className="h-16 rounded-2xl border border-slate-300 px-6 text-lg outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />

            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact Name *"
              className="h-16 rounded-2xl border border-slate-300 px-6 text-lg outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address *"
              className="h-16 rounded-2xl border border-slate-300 px-6 text-lg outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="h-16 rounded-2xl border border-slate-300 px-6 text-lg outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />

            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="h-16 rounded-2xl border border-slate-300 px-6 text-lg outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
            >
              <option value="">Select Product *</option>
              <option>Kraft Vertical Ripple</option>
              <option>Black Vertical Ripple</option>
              <option>Coffee Bean Vertical Ripple</option>
              <option>Kraft Double Wall</option>
              <option>White Double Wall</option>
            </select>

            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity Required"
              className="h-16 rounded-2xl border border-slate-300 px-6 text-lg outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
            />

            <div className="lg:col-span-2">

              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your project, printing requirements or any special requests..."
                className="w-full rounded-2xl border border-slate-300 p-6 text-lg outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />

            </div>

            <div className="lg:col-span-2 flex justify-center pt-2">

              <button
                onClick={submitQuote}
                disabled={loading}
                className="w-full max-w-lg rounded-2xl bg-green-600 py-5 text-xl font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Quote Request"}
              </button>

            </div>

            {success && (

              <div className="lg:col-span-2 rounded-3xl border border-green-200 bg-green-50 p-8 text-center">

                <h4 className="text-3xl font-black text-green-700">
                  ✓ Quote Submitted Successfully
                </h4>

                <p className="mt-4 text-lg leading-8 text-slate-700">
                  Thank you for contacting Pro Cups International. Your quote
                  request has been received and one of our consultants will
                  contact you shortly.
                </p>

              </div>

            )}
          </div>

        </div>

      </div>

    </section>

  );
}