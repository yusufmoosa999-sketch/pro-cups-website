import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import ArtworkUpload from "@/components/ArtworkUpload";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Printed Paper Cups",
  description:
    "Custom printed paper cups from only 1000 units. Manufactured in South Africa with premium food-grade materials.",
};

export default function CustomPrinting() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">

        {/* HERO */}

        <section className="bg-slate-900 text-white">

          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-12 lg:py-24">

            <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
              Custom Printing
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              Your Brand.
              <br />
              <span className="text-green-400">
                Your Cup.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Premium custom printed paper cups manufactured in South
              Africa from as little as 1,000 cups.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/contact"
                className="rounded-full bg-green-700 px-8 py-4 text-center font-semibold text-white transition hover:bg-green-800"
              >
                Request Quote
              </Link>

              <Link
                href="/products"
                className="rounded-full border border-white/30 px-8 py-4 text-center font-semibold transition hover:bg-white hover:text-black"
              >
                View Cups
              </Link>

            </div>

          </div>

        </section>

        {/* IMAGE */}

        <section className="py-16 lg:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <Image
              src="/images/custom-printing.jpg"
              alt="Custom Printing"
              width={1400}
              height={800}
              className="w-full rounded-[32px] shadow-2xl"
            />

          </div>

        </section>

        {/* PROCESS */}

        <section className="pb-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="text-center">

              <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
                Process
              </span>

              <h2 className="mt-6 text-3xl font-black text-black sm:text-4xl lg:text-5xl">
                How It Works
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                Our simple process makes it easy to create premium custom
                printed paper cups for your business.
              </p>

            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-5">

              {[
                ["01", "Choose Your Cup"],
                ["02", "Upload Artwork"],
                ["03", "Approve Proof"],
                ["04", "Manufacturing"],
                ["05", "Delivery"],
              ].map(([number, title]) => (

                <div
                  key={number}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="text-5xl font-black text-green-700">
                    {number}
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-black">
                    {title}
                  </h3>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* ARTWORK UPLOAD */}

        <section className="bg-slate-50 py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="grid gap-12 lg:grid-cols-2">

              <div>

                <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
                  Upload Artwork
                </span>

                <h2 className="mt-6 text-3xl font-black text-black sm:text-4xl">
                  Send Us Your Design
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-700">
                  Upload your logo, artwork or design files and our team
                  will prepare a professional print proof before
                  production begins.
                </p>

                <ul className="mt-8 space-y-4 text-slate-700">

                  <li>✓ AI, PDF, EPS or SVG preferred</li>
                  <li>✓ High resolution PNG accepted</li>
                  <li>✓ Free digital proof included</li>
                  <li>✓ Fast turnaround times</li>

                </ul>

              </div>

              <ArtworkUpload />

            </div>

          </div>

        </section>
        {/* WHY PRINT WITH US */}

        <section className="bg-white py-20 lg:py-28">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="text-center">

              <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
                Why Choose Us
              </span>

              <h2 className="mt-6 text-3xl font-black text-black sm:text-4xl lg:text-5xl">
                Why Businesses Choose
                <span className="text-green-700"> Pro Cups</span>
              </h2>

            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">

              {[
                {
                  title: "MOQ From 1,000",
                  text: "Perfect for cafés, restaurants and growing brands.",
                  icon: "📦",
                },
                {
                  title: "Food Grade",
                  text: "Premium paper and high-quality printing.",
                  icon: "☕",
                },
                {
                  title: "Fast Turnaround",
                  text: "Reliable manufacturing with quick delivery.",
                  icon: "⚡",
                },
                {
                  title: "Made In SA",
                  text: "Manufactured locally in South Africa.",
                  icon: "🇿🇦",
                },
              ].map((item) => (

                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="mb-6 text-5xl">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-black text-black">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-700">
                    {item.text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* FAQ */}

        <section className="bg-slate-50 py-20">

          <div className="mx-auto max-w-5xl px-5 sm:px-6">

            <div className="text-center">

              <h2 className="text-3xl font-black text-black sm:text-4xl">
                Frequently Asked Questions
              </h2>

            </div>

            <div className="mt-12 space-y-6">

              <div className="rounded-3xl bg-white p-8 shadow">

                <h3 className="text-xl font-bold text-black">
                  What is the minimum order quantity?
                </h3>

                <p className="mt-4 text-slate-700">
                  Our minimum order quantity starts from 1,000 cups.
                </p>

              </div>

              <div className="rounded-3xl bg-white p-8 shadow">

                <h3 className="text-xl font-bold text-black">
                  Can you help with artwork?
                </h3>

                <p className="mt-4 text-slate-700">
                  Yes. We prepare a professional digital proof before
                  manufacturing begins.
                </p>

              </div>

              <div className="rounded-3xl bg-white p-8 shadow">

                <h3 className="text-xl font-bold text-black">
                  How long does production take?
                </h3>

                <p className="mt-4 text-slate-700">
                  Production times depend on quantity, but we'll advise
                  you once your artwork has been approved.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-slate-900 py-20 text-white">

          <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-12">

            <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
              Ready To Print?
            </span>

            <h2 className="mt-6 text-4xl font-black sm:text-5xl">
              Let's Create Your
              <span className="text-green-400">
                {" "}Custom Cups
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Upload your artwork today and we'll prepare a professional
              print proof for approval before production.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                href="/contact"
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

    </>
  );
}
        
