

"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to send your enquiry. Please try again."
        );
      }

      setSuccess(
        "Your enquiry has been sent successfully. We will get back to you as soon as possible."
      );

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send your enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">

        {/* HERO */}

        <section className="bg-slate-900 text-white">

          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-12 lg:py-24">

            <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
              Contact Us
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              Let's
              <span className="text-green-400">
                {" "}Talk.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              We'd love to hear from you. Whether you need a quotation,
              custom printed cups or have a question about our products,
              our team is here to help.
            </p>

          </div>

        </section>


        {/* CONTACT CARDS */}

        <section className="py-16 lg:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

              {/* CALL US */}

              <div className="rounded-[30px] bg-white p-8 shadow-lg">

                <div className="text-5xl">
                  📞
                </div>

                <h2 className="mt-6 text-2xl font-black text-black">
                  Call Us
                </h2>

                <p className="mt-4 text-slate-700">
                  Speak directly to our sales team.
                </p>

                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                  <a
                    href="tel:+27762538968"
                    className="block border-b border-slate-200 p-4 transition hover:bg-green-50"
                  >
                    <div className="font-bold text-slate-900">
                      Yusuf
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      +27 76 253 8968
                    </div>

                    <div className="mt-2 text-sm font-bold text-green-700">
                      Call Yusuf →
                    </div>
                  </a>

                  <a
                    href="tel:+27716772314"
                    className="block p-4 transition hover:bg-green-50"
                  >
                    <div className="font-bold text-slate-900">
                      Muhummad
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      +27 71 677 2314
                    </div>

                    <div className="mt-2 text-sm font-bold text-green-700">
                      Call Muhummad →
                    </div>
                  </a>

                </div>

              </div>


              {/* WHATSAPP */}

              <div className="rounded-[30px] bg-white p-8 shadow-lg">

                <div className="text-5xl">
                  💬
                </div>

                <h2 className="mt-6 text-2xl font-black text-black">
                  WhatsApp
                </h2>

                <p className="mt-4 text-slate-700">
                  Chat with our sales team instantly.
                </p>

                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                  <a
                    href="https://wa.me/27762538968"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-b border-slate-200 p-4 transition hover:bg-green-50"
                  >
                    <div className="font-bold text-slate-900">
                      Yusuf
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      +27 76 253 8968
                    </div>

                    <div className="mt-2 text-sm font-bold text-green-700">
                      WhatsApp Yusuf →
                    </div>
                  </a>

                  <a
                    href="https://wa.me/27716772314"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 transition hover:bg-green-50"
                  >
                    <div className="font-bold text-slate-900">
                      Muhummad
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      +27 71 677 2314
                    </div>

                    <div className="mt-2 text-sm font-bold text-green-700">
                      WhatsApp Muhummad →
                    </div>
                  </a>

                </div>

              </div>


              {/* EMAIL */}

              <div className="rounded-[30px] bg-white p-8 shadow-lg">

                <div className="text-5xl">
                  ✉️
                </div>

                <h2 className="mt-6 text-2xl font-black text-black">
                  Email
                </h2>

                <p className="mt-4 text-slate-700">
                  Send us your enquiry anytime.
                </p>

                <Link
                  href="mailto:info@procupsinternational.com"
                  className="mt-8 block rounded-full bg-green-700 py-4 text-center font-bold text-white transition hover:bg-green-800"
                >
                  Send Email
                </Link>

              </div>


              {/* LOCATION */}

              <div className="rounded-[30px] bg-white p-8 shadow-lg">

                <div className="text-5xl">
                  📍
                </div>

                <h2 className="mt-6 text-2xl font-black text-black">
                  Location
                </h2>

                <p className="mt-4 text-slate-700">
                  Durban,
                  <br />
                  South Africa
                </p>

                <button className="mt-8 w-full rounded-full border-2 border-green-700 py-4 font-bold text-green-700 transition hover:bg-green-700 hover:text-white">
                  View Map
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* CONTACT FORM */}

        <section className="bg-slate-50 py-16 lg:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="grid gap-12 lg:grid-cols-2">

              {/* FORM */}

              <div className="rounded-[32px] bg-white p-8 shadow-xl lg:p-10">

                <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
                  Send an Enquiry
                </span>

                <h2 className="mt-6 text-3xl font-black text-black">
                  Request a Quote
                </h2>

                <p className="mt-4 text-slate-700">
                  Complete the form below and one of our team members
                  will get back to you as soon as possible.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-10 space-y-6"
                >

                  {/* FULL NAME */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                      required
                    />
                  </div>


                  {/* EMAIL */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                      required
                    />
                  </div>


                  {/* PHONE */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">
                      Phone Number
                    </label>

                    <PhoneInput
                      country="za"
                      preferredCountries={["za"]}
                      excludeCountries={["il"]}
                      enableSearch={true}
                      searchPlaceholder="Search country or calling code..."
                      searchNotFound="Country not found"
                      disableSearchIcon={false}
                      countryCodeEditable={false}
                      value={phone}
                      onChange={(value) => {
                        setPhone(value ? `+${value}` : "");
                      }}
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoComplete: "tel",
                      }}
                      containerClass="pro-phone-container"
                      inputClass="pro-phone-input"
                      buttonClass="pro-phone-button"
                      dropdownClass="pro-phone-dropdown"
                    />
                  </div>


                  {/* MESSAGE */}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-900">
                      Your Enquiry
                    </label>

                    <textarea
                      rows={6}
                      placeholder="Tell us what you need..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
                      required
                    />
                  </div>


                  {/* SUCCESS */}

                  {success && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                      {success}
                    </div>
                  )}


                  {/* ERROR */}

                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                      {error}
                    </div>
                  )}


                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-green-700 py-4 text-lg font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send Enquiry"}
                  </button>

                </form>

              </div>


              {/* MAP */}

              <div className="overflow-hidden rounded-[32px] shadow-xl">

                <iframe
                  src="https://www.google.com/maps?q=Durban,South%20Africa&output=embed"
                  className="h-[500px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

              </div>

            </div>

          </div>

        </section>


        {/* CTA */}

        <section className="bg-slate-900 py-20 text-white">

          <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-12">

            <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
              Pro Cups International
            </span>

            <h2 className="mt-6 text-4xl font-black sm:text-5xl">
              Ready To Order Premium
              <span className="text-green-400">
                {" "}Paper Cups?
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              We manufacture premium paper cups for coffee shops,
              restaurants, franchises and wholesalers throughout South
              Africa.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                href="/custom-printing"
                className="rounded-full bg-green-700 px-8 py-4 font-bold text-white transition hover:bg-green-800"
              >
                Request Quote
              </Link>

              <Link
                href="/products"
                className="rounded-full border border-white/20 px-8 py-4 font-bold transition hover:bg-white hover:text-black"
              >
                View Products
              </Link>

            </div>

          </div>

        </section>


        <Footer />

      </main>


      {/* PHONE INPUT STYLING */}

      <style jsx global>{`

      /* PHONE NUMBER TEXT */
.pro-phone-input {
  color: #0f172a !important;
  font-weight: 500 !important;
  opacity: 1 !important;
  -webkit-text-fill-color: #0f172a !important;
}

.pro-phone-input::placeholder {
  color: #64748b !important;
  opacity: 1 !important;
  -webkit-text-fill-color: #64748b !important;
}
  /* PHONE DROPDOWN ITSELF */
  .pro-phone-dropdown {
    width: 330px !important;
    max-width: calc(100vw - 40px) !important;

    background: #ffffff !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 16px !important;

    box-shadow:
      0 20px 45px rgba(15, 23, 42, 0.18),
      0 4px 12px rgba(15, 23, 42, 0.08) !important;

    /* THIS IS THE IMPORTANT PART */
    height: 360px !important;
    max-height: 360px !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;

    scrollbar-width: auto !important;
    scrollbar-color: #64748b #e2e8f0 !important;

    z-index: 9999 !important;
  }

  /* CHROME / EDGE SCROLLBAR */
  .pro-phone-dropdown::-webkit-scrollbar {
    width: 10px !important;
  }

  .pro-phone-dropdown::-webkit-scrollbar-track {
    background: #e2e8f0 !important;
    border-radius: 10px !important;
  }

  .pro-phone-dropdown::-webkit-scrollbar-thumb {
    background: #64748b !important;
    border-radius: 10px !important;
  }

  .pro-phone-dropdown::-webkit-scrollbar-thumb:hover {
    background: #475569 !important;
  }

  /* SEARCH BOX STAYS AT TOP */
  .pro-phone-dropdown .search {
    position: sticky !important;
    top: 0 !important;
    z-index: 20 !important;

    background: #ffffff !important;

    padding: 12px !important;
    margin: 0 !important;

    border-bottom: 1px solid #e2e8f0 !important;
  }

  .pro-phone-dropdown .search-box {
    width: 100% !important;
    height: 44px !important;

    box-sizing: border-box !important;

    border: 1px solid #94a3b8 !important;
    border-radius: 10px !important;

    background: #ffffff !important;
    color: #0f172a !important;

    padding: 0 12px !important;

    font-size: 14px !important;
    outline: none !important;
  }

  .pro-phone-dropdown .search-box::placeholder {
    color: #64748b !important;
    opacity: 1 !important;
  }

  .pro-phone-dropdown .search-box:focus {
    border-color: #15803d !important;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15) !important;
  }

  /* COUNTRY ROWS */
  .pro-phone-dropdown .country {
    min-height: 44px !important;
    box-sizing: border-box !important;

    padding: 10px 14px !important;

    background: #ffffff !important;
    color: #0f172a !important;

    font-size: 14px !important;
    font-weight: 500 !important;

    border-bottom: 1px solid #f1f5f9 !important;

    cursor: pointer !important;
  }

  .pro-phone-dropdown .country:hover {
    background: #f0fdf4 !important;
    color: #166534 !important;
  }

  /* SELECTED / HIGHLIGHTED */
  .pro-phone-dropdown .country.highlight {
    background: #dcfce7 !important;
    color: #14532d !important;
    font-weight: 700 !important;
  }

  .pro-phone-dropdown .country-name {
    color: #0f172a !important;
  }

  .pro-phone-dropdown .dial-code {
    color: #475569 !important;
    font-weight: 600 !important;
  }

  /* MAKE SURE MOUSE/TOUCH SCROLLING WORKS */
  .pro-phone-dropdown {
    pointer-events: auto !important;
    touch-action: pan-y !important;
  }

  @media (max-width: 640px) {
    .pro-phone-dropdown {
      width: 300px !important;
      max-width: calc(100vw - 32px) !important;
      height: 320px !important;
      max-height: 320px !important;
    }
  }
`}</style>
    </>
  );
}