"use client";

import { useState } from "react";

export default function ArtworkUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
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
              placeholder="Company Name"
              className="w-full rounded-2xl p-5 text-xl text-black"
            />

            <input
              placeholder="Your Name"
              className="w-full rounded-2xl p-5 text-xl text-black"
            />

            <input
              placeholder="Email Address"
              className="w-full rounded-2xl p-5 text-xl text-black"
            />

            <input
              placeholder="Phone Number"
              className="w-full rounded-2xl p-5 text-xl text-black"
            />

            <select className="w-full rounded-2xl p-5 text-xl text-black">

              <option>Select Cup</option>

              <option>Kraft Vertical Ripple</option>

              <option>Black Vertical Ripple</option>

              <option>Coffee Bean Vertical Ripple</option>

              <option>Kraft Double Wall</option>

              <option>White Double Wall</option>

            </select>

            <input
              placeholder="Quantity Required"
              className="w-full rounded-2xl p-5 text-xl text-black"
            />

            <textarea
              rows={5}
              placeholder="Tell us about your project..."
              className="w-full rounded-2xl p-5 text-xl text-black"
            />

            <button className="w-full rounded-full bg-green-600 py-5 text-2xl font-bold hover:bg-green-700 transition">
              Submit Quote Request
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}