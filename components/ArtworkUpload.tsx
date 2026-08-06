"use client";


import { useState } from "react";

export default function ArtworkUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [artworkPath, setArtworkPath] = useState("");

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
    const file = e.target.files?.[0];

    
    if (!file) return;

    setFileName(file.name);

    setFile(file);

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }
async function submitQuote() {
  try {
    setLoading(true);
    setSuccess(false);

    let uploadedPath = "";

if (file) {
  const formData = new FormData();
  formData.append("file", file);

  const uploadResponse = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const uploadResult = await uploadResponse.json();
  const artworkUrl = uploadResult.publicUrl;

  if (!uploadResponse.ok) {
    alert(uploadResult.error);
    setLoading(false);
    return;
  }

  uploadedPath = uploadResult.publicUrl;
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
        artwork_url: uploadedPath,
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
    setFileName("");
    setPreview(null);
    setFile(null);

  } catch (err) {
    console.error(err);
    alert("Failed to submit quote.");
  } finally {
    setLoading(false);
  }
}
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="rounded-[40px] bg-[#0f172a] text-white p-14">

        <p className="uppercase tracking-[8px] text-green-400 font-bold">
          REQUEST A QUOTE
        </p>

        <h2 className="text-6xl font-black mt-5">
          Upload Your Artwork
        </h2>

        <p className="text-2xl text-gray-300 mt-6 max-w-3xl">
          Upload your logo or artwork and we'll prepare a print-ready proof for approval.
        </p>

        <div className="grid lg:grid-cols-2 gap-16 mt-16">

          <div>

            <label className="flex h-[420px] cursor-pointer items-center justify-center rounded-[30px] border-2 border-dashed border-green-500 bg-white/5 hover:bg-white/10 transition">

              {preview ? (

                <img
                  src={preview}
                  alt=""
                  className="h-full w-full rounded-[30px] object-cover"
                />

              ) : (

                <div className="text-center">

                  <div className="text-7xl">
                    📁
                  </div>

                  <h3 className="mt-8 text-3xl font-black">
                    Drop your artwork here
                  </h3>

                  <p className="mt-3 text-xl text-gray-300">
                    AI • PDF • EPS • SVG • PNG • JPG
                  </p>

                </div>

              )}

              <input
                type="file"
                className="hidden"
                accept=".ai,.eps,.pdf,.svg,.png,.jpg,.jpeg"
                onChange={handleFile}
              />

            </label>

            {fileName && (

              <p className="mt-6 text-xl text-green-400">

                ✓ {fileName}

              </p>

            )}

          </div>

          <div className="space-y-6">

            <input
  value={companyName}
  onChange={(e) => setCompanyName(e.target.value)}
  placeholder="Company Name"
  className="w-full rounded-2xl p-5 text-xl text-black"
/>

            <input
  value={contactName}
  onChange={(e) => setContactName(e.target.value)}
  placeholder="Your Name"
  className="w-full rounded-2xl p-5 text-xl text-black"
/>

            <input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email Address"
  className="w-full rounded-2xl p-5 text-xl text-black"
/>

            <input
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Phone Number"
  className="w-full rounded-2xl p-5 text-xl text-black"
/>
<select
  value={product}
  onChange={(e) => setProduct(e.target.value)}
  className="w-full rounded-2xl p-5 text-xl text-black"
>

              <option value="">Select Cup</option>

             

              <option>Kraft Double Wall</option>

              <option>White Double Wall</option>

            </select>

            <input
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
  placeholder="Quantity Required"
  className="w-full rounded-2xl p-5 text-xl text-black"
/>
            

            <textarea
  rows={5}
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Tell us about your project..."
  className="w-full rounded-2xl p-5 text-xl text-black"
/>

            <button
  onClick={submitQuote}
  disabled={loading}
  className="w-full rounded-full bg-green-600 py-5 text-2xl font-bold hover:bg-green-700 transition disabled:opacity-50"
>
  {loading ? "Submitting..." : "Submit Quote Request"}
</button>

{success && (
  <p className="mt-6 rounded-xl bg-green-100 p-4 text-center text-lg font-semibold text-green-700">
    ✅ Your quote request has been submitted successfully. We'll be in touch soon.
  </p>
)}
          </div>

        </div>

      </div>

    </section>
  );
}