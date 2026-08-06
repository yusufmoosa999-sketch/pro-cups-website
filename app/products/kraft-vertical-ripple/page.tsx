import Footer from "@/components/footer";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function KraftVerticalRipple() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">

        {/* HERO */}

        <section className="bg-slate-900 text-white">

          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-12 lg:py-24">

            <div className="grid items-center gap-14 lg:grid-cols-2">

              <div>

                <Image
                  src="/images/products/kraft-ripple.jpg"
                  alt="Kraft Vertical Ripple"
                  width={900}
                  height={900}
                  className="w-full rounded-[32px] shadow-2xl"
                />

              </div>

              <div>

                <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
                  Premium Ripple Cup
                </span>

                <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  Kraft Vertical
                  <span className="text-green-400">
                    {" "}Ripple Cup
                  </span>
                </h1>

                <p className="mt-8 text-lg leading-8 text-slate-300">
                  Premium insulated kraft ripple paper cups manufactured
                  in South Africa for cafés, coffee shops, restaurants,
                  wholesalers and premium brands.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">

                  <div className="rounded-full bg-green-700 px-6 py-3 font-bold text-white">
                    250ml
                  </div>

                  <div className="rounded-full border-2 border-green-400 px-6 py-3 font-bold text-green-300">
                    350ml
                  </div>

                </div>

                <div className="mt-12 grid grid-cols-2 gap-5">

                  <div className="rounded-3xl bg-white p-6 text-black shadow-lg">

                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Material
                    </p>

                    <h3 className="mt-3 text-xl font-black">
                      Food Grade Paper
                    </h3>

                  </div>

                  <div className="rounded-3xl bg-white p-6 text-black shadow-lg">

                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      MOQ
                    </p>

                    <h3 className="mt-3 text-xl font-black">
                      1000 Cups
                    </h3>

                  </div>

                  <div className="rounded-3xl bg-white p-6 text-black shadow-lg">

                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Made In
                    </p>

                    <h3 className="mt-3 text-xl font-black">
                      South Africa
                    </h3>

                  </div>

                  <div className="rounded-3xl bg-white p-6 text-black shadow-lg">

                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Printing
                    </p>

                    <h3 className="mt-3 text-xl font-black">
                      Custom Available
                    </h3>

                  </div>

                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                  <Link
                    href="/custom-printing"
                    className="rounded-full bg-green-700 px-8 py-4 text-center font-bold text-white transition hover:bg-green-800"
                  >
                    Request Quote
                  </Link>

                  <Link
                    href="/contact"
                    className="rounded-full border border-white/30 px-8 py-4 text-center font-bold transition hover:bg-white hover:text-black"
                  >
                    Contact Us
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-12"></section>
    Product Specifications
          {/* SPECIFICATIONS */}

        <section className="py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="rounded-[32px] overflow-hidden border border-slate-200 shadow-lg">

              <table className="w-full">

                <tbody>

                  {[
                    ["Sizes", "250ml & 350ml"],
                    ["Material", "Premium Food Grade Paper + PE Coating"],
                    ["Cup Type", "Vertical Ripple"],
                    ["Colour", "Natural Kraft"],
                    ["Printing", "Custom Branding Available"],
                    ["Manufactured", "South Africa"],
                  ].map(([title, value]) => (

                    <tr key={title} className="border-b last:border-0">

                      <td className="bg-slate-100 px-6 py-5 font-bold text-black lg:w-1/3">
                        {title}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {value}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="bg-slate-50 py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="text-center">

              <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
                Features
              </span>

              <h2 className="mt-6 text-3xl font-black text-black sm:text-4xl lg:text-5xl">
                Why Choose Our Kraft Ripple Cups
              </h2>

            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2">

              {[
                {
                  title: "Superior Heat Insulation",
                  text: "The ripple wall keeps beverages hotter while remaining comfortable to hold.",
                  icon: "☕",
                },
                {
                  title: "Premium Food Grade Paper",
                  text: "Manufactured using premium paper with PE coating for durability.",
                  icon: "🥤",
                },
                {
                  title: "Custom Branding",
                  text: "Full-colour printing to showcase your brand professionally.",
                  icon: "🎨",
                },
                {
                  title: "Manufactured in South Africa",
                  text: "Reliable local production with faster turnaround times.",
                  icon: "🇿🇦",
                },
              ].map((item) => (

                <div
                  key={item.title}
                  className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="mb-6 text-5xl">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-black text-black">
                    {item.title}
                  </h3>

                  <p className="mt-5 leading-8 text-slate-700">
                    {item.text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* APPLICATIONS */}

        <section className="py-20">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="rounded-[36px] bg-slate-900 p-10 text-white lg:p-14">

              <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
                Perfect For
              </span>

              <h2 className="mt-6 text-4xl font-black">
                Ideal Applications
              </h2>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {[
                  "Coffee Shops",
                  "Restaurants",
                  "Franchises",
                  "Corporate Events",
                ].map((item) => (

                  <div
                    key={item}
                    className="rounded-2xl bg-white/10 p-6 text-center text-lg font-semibold backdrop-blur"
                  >
                    {item}
                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="bg-green-700 py-20 text-white">

          <div className="mx-auto max-w-4xl px-5 text-center">

            <h2 className="text-4xl font-black sm:text-5xl">
              Ready To Order?
            </h2>

            <p className="mt-6 text-lg leading-8 text-green-100">
              Contact our team today for pricing, custom printing and
              expert advice on choosing the right paper cups.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

              <Link
                href="/custom-printing"
                className="rounded-full bg-white px-8 py-4 font-bold text-green-700 transition hover:bg-slate-100"
              >
                Request Quote
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white px-8 py-4 font-bold transition hover:bg-white hover:text-green-700"
              >
                Contact Us
              </Link>

            </div>

          </div>

        </section>

        <Footer />

      </main>

    </>
  );
}