import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "View examples of our premium paper cups and custom printed paper cup projects.",
};

const gallery = [
  "/images/gallery/gallery1.jpg",
  "/images/gallery/gallery2.jpg",
  "/images/gallery/gallery3.jpg",
  "/images/gallery/gallery4.jpg",
  "/images/gallery/gallery5.jpg",
  "/images/gallery/gallery6.jpg",
  "/images/gallery/gallery7.jpg",
  "/images/gallery/gallery8.jpg",
];

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">

        {/* HERO */}

        <section className="bg-slate-900 text-white">

          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-12 lg:py-24">

            <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
              Gallery
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              See Our
              <span className="text-green-400">
                {" "}Work
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Browse a selection of premium paper cups manufactured for
              cafés, restaurants, wholesalers and brands throughout
              South Africa.
            </p>

          </div>

        </section>

        {/* GALLERY */}

        <section className="py-16 lg:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {gallery.map((image, index) => (

                <div
                  key={index}
                  className="group overflow-hidden rounded-[30px] bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >

                  <Image
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    width={700}
                    height={700}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-slate-900 py-20 text-white lg:py-28">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="grid items-center gap-14 lg:grid-cols-2">

              <div>

                <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
                  Pro Cups International
                </span>

                <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
                  Ready To Brand
                  <span className="text-green-400">
                    {" "}Your Cups?
                  </span>
                </h2>

                <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                  Whether you're opening a coffee shop, expanding your
                  franchise or launching a new product, we'll manufacture
                  premium paper cups that showcase your brand.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                  <a
                    href="/custom-printing"
                    className="rounded-full bg-green-700 px-8 py-4 text-center font-semibold text-white transition hover:bg-green-800"
                  >
                    Request Quote
                  </a>

                  <a
                    href="/contact"
                    className="rounded-full border border-white/30 px-8 py-4 text-center font-semibold transition hover:bg-white hover:text-black"
                  >
                    Contact Us
                  </a>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-5">

                <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

                  <h3 className="text-4xl font-black text-green-400">
                    1000+
                  </h3>

                  <p className="mt-3 text-slate-300">
                    Minimum Order
                  </p>

                </div>

                <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

                  <h3 className="text-4xl font-black text-green-400">
                    5
                  </h3>

                  <p className="mt-3 text-slate-300">
                    Cup Styles
                  </p>

                </div>

                <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

                  <h3 className="text-4xl font-black text-green-400">
                    SA
                  </h3>

                  <p className="mt-3 text-slate-300">
                    Manufactured
                  </p>

                </div>

                <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

                  <h3 className="text-4xl font-black text-green-400">
                    Custom
                  </h3>

                  <p className="mt-3 text-slate-300">
                    Printed Cups
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        <Footer />

      </main>

    </>
  );
}