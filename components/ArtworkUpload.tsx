"use client";

import { useState } from "react";
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

<section className="bg-[#0b1120] py-24">

  <div className="mx-auto max-w-[1500px] px-6 lg:px-10">

    <div className="text-center">

      <span className="inline-flex rounded-full bg-green-500/10 px-6 py-2 text-sm font-bold uppercase tracking-[4px] text-green-400">
        Request a Quote
      </span>

      <h2 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
        Upload Your Artwork
      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">

        Send us your logo, artwork or print-ready files and our design team
        will prepare a professional digital proof for your approval before
        production begins.

      </p>

    </div>

    <div className="relative mt-20 overflow-hidden rounded-[40px] border border-slate-700 bg-[#111827] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] lg:p-14">

  <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-green-500/10 blur-[120px]" />

  <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-green-600/5 blur-[140px]" />
          <label
  htmlFor="artwork-upload"
  className="group flex h-[320px] md:h-[420px] lg:h-[500px] w-full cursor-pointer flex-col items-center justify-center rounded-[36px] border-2 border-dashed border-green-500 bg-gradient-to-br from-slate-800 to-slate-900 transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]"
>

  {preview ? (

    <img
      src={preview}
      alt="Artwork Preview"
      className="h-full w-full rounded-[34px] object-cover"
    />

  ) : (

    <>

      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500/20">
<UploadCloud
  size={64}
  strokeWidth={1.8}
  className="text-green-400 transition-all duration-300 group-hover:scale-110"
/>

      </div>

      <h3 className="mt-10 text-4xl lg:text-5xl font-black text-white">
        Drag & Drop Your Artwork
      </h3>

      <p className="mt-6 max-w-3xl text-center text-xl leading-9 text-slate-300">
        Drag your files here or click anywhere inside this upload area.
        Our designers will review your artwork and prepare a professional
        print-ready proof for your approval.
      </p>

      <div className="mt-10 rounded-full border border-green-500/30 bg-green-500/10 px-8 py-4 text-sm font-bold tracking-[4px] text-green-300">

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

  <div className="mt-8 rounded-3xl border border-green-500/30 bg-green-500/10 p-6">

    <p className="text-center text-lg font-semibold text-green-300">
      ✓ <span className="font-bold">{fileName}</span> uploaded successfully
    </p>

  </div>

)}
<div className="my-16 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <input
  value={companyName}
  onChange={(e) => setCompanyName(e.target.value)}
  placeholder="Company Name *"
  className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
/>

<input
  value={contactName}
  onChange={(e) => setContactName(e.target.value)}
  placeholder="Contact Person *"
  className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
/>

<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email Address *"
  className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
/>

<input
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Phone Number"
  className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
/>

<select
  value={product}
  onChange={(e) => setProduct(e.target.value)}
  className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
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
  placeholder="Estimated Quantity"
  className="h-[68px] rounded-2xl border border-slate-700 bg-slate-900/70 px-6 text-lg font-medium text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
/>

<div className="lg:col-span-2">

  <textarea
    rows={7}
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Tell us about your project, branding, colours, deadlines or any special requirements..."
    className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 p-6 text-lg leading-8 text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-green-500 focus:bg-slate-900 focus:ring-4 focus:ring-green-500/20"
  />

</div>

<div className="lg:col-span-2 mt-4 flex justify-center">

  <button
    onClick={submitQuote}
    disabled={loading}
    className="w-full max-w-xl rounded-full bg-green-600 px-10 py-5 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-green-500 hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? "Submitting Your Request..." : "Upload Artwork & Request Quote"}
  </button>

</div>

{success && (

  <div className="lg:col-span-2 mt-6 rounded-3xl border border-green-500/30 bg-green-500/10 p-8 text-center">

    <h4 className="text-3xl font-black text-green-400">
      ✓ Artwork Received Successfully
    </h4>

    <p className="mt-4 text-lg leading-8 text-slate-300">
      Thank you for choosing <strong>Pro Cups International</strong>.
      Our team will review your artwork and contact you shortly with a
      professional print proof and quotation.
    </p>

  </div>

)}
          </div>

        </div>

      </div>

    </section>

  );
}