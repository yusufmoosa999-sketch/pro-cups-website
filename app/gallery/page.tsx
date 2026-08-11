import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery | Pro Cups International",
  description:
    "Explore custom printed paper cups manufactured by Pro Cups International for cafés, restaurants, brands, events and businesses.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden bg-white">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#07111f] text-white">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-green-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-6 lg:px-12 lg:pb-28 lg:pt-36">
            <div className="max-w-4xl">
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-green-300">
                <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                Our Work
              </div>

              <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
                Your brand.
                <br />
                <span className="text-green-400">Our cups.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                A look at some of the custom printed cups we have produced for
                businesses, cafés, restaurants, events and brands.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                <a
                  href="#gallery"
                  className="group inline-flex items-center gap-3 rounded-full bg-green-500 px-7 py-4 font-bold text-[#07111f] shadow-lg shadow-green-500/20 transition duration-300 hover:-translate-y-1 hover:bg-green-400"
                >
                  Explore our work
                  <span className="transition-transform duration-300 group-hover:translate-y-1">
                    ↓
                  </span>
                </a>

                <a
                  href="/custom-printing"
                  className="inline-flex items-center gap-2 font-semibold text-white transition hover:text-green-400"
                >
                  Create your own cups
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Hero bottom detail */}
            <div className="mt-20 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-7 text-sm text-slate-400">
              <div>
                <span className="font-bold text-white">Custom</span>{" "}
                printing
              </div>

              <div>
                <span className="font-bold text-white">Low</span> MOQ
              </div>

              <div>
                <span className="font-bold text-white">South African</span>{" "}
                manufacturing
              </div>

              <div>
                <span className="font-bold text-white">Multiple</span> cup
                styles
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="bg-[#f7f8f6] py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">
            <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-green-600">
                  Selected work
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-tight text-[#07111f] sm:text-5xl lg:text-6xl">
                  Printed to stand out.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-right">
                Every cup is an opportunity to put your brand directly into
                your customer's hands.
              </p>
            </div>

            <GalleryClient />
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#07111f] text-white">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-12 lg:py-32">
            <div className="max-w-4xl">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
                Make an impression
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
                Imagine your brand
                <br />
                <span className="text-green-400">right here.</span>
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Whether you need branded coffee cups, takeaway cups,
                promotional cups or a completely custom design, we can help
                bring your idea to life.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/custom-printing"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-green-500 px-8 py-4 font-bold text-[#07111f] transition duration-300 hover:-translate-y-1 hover:bg-green-400"
                >
                  Request a Quote
                  <span>→</span>
                </a>

                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 font-bold text-white transition duration-300 hover:border-white/40 hover:bg-white hover:text-[#07111f]"
                >
                  Talk to us
                </a>
              </div>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4">
              <div>
                <p className="text-3xl font-black text-green-400">1000+</p>
                <p className="mt-2 text-sm text-slate-400">
                  Minimum order
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-green-400">5+</p>
                <p className="mt-2 text-sm text-slate-400">
                  Cup styles
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-green-400">CMYK</p>
                <p className="mt-2 text-sm text-slate-400">
                  Full colour printing
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-green-400">SA</p>
                <p className="mt-2 text-sm text-slate-400">
                  Manufactured locally
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}