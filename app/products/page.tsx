import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

const products = [
  {
    name: "Kraft Vertical Ripple",
    size: "250ml & 350ml",
    image: "/images/products/kraft-ripple.jpg",
    href: "/products/kraft-vertical-ripple",
  },
  {
    name: "Black Vertical Ripple",
    size: "250ml & 350ml",
    image: "/images/products/black-ripple.jpg",
    href: "/products/black-vertical-ripple",
  },
  {
    name: "Coffee Bean Vertical Ripple",
    size: "250ml & 350ml",
    image: "/images/products/coffee-bean-ripple.jpg",
    href: "/products/coffee-bean-vertical-ripple",
  },
  {
    name: "Kraft Double Wall",
    size: "250ml & 350ml",
    image: "/images/products/kraft-double-wall.jpg",
    href: "/products/kraft-double-wall",
  },
  {
    name: "White Double Wall",
    size: "250ml & 350ml",
    image: "/images/products/white-double-wall.jpg",
    href: "/products/white-double-wall",
  },
];

export default function ProductsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">

        {/* HERO */}

        <section className="bg-slate-900 text-white">

          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-12 lg:py-24">

            <span className="inline-block rounded-full bg-green-600/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
              Premium Paper Cups
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              Our
              <span className="text-green-400"> Product Range</span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
              Manufactured in South Africa using premium food-grade paper
              for cafés, restaurants, wholesalers, franchises and
              corporate brands.
            </p>

          </div>

        </section>

        {/* PRODUCTS */}

        <section className="bg-slate-50 py-16 lg:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">

              {products.map((product) => (

                <Link
                  key={product.name}
                  href={product.href}
                  className="group overflow-hidden rounded-[32px] bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >

                  <div className="overflow-hidden">

                    <Image
                      src={product.image}
                      alt={product.name}
                      width={700}
                      height={700}
                      className="h-60 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-80"
                    />

                  </div>

                  <div className="p-6 sm:p-8">

                    <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                      Manufactured in South Africa
                    </span>

                    <h2 className="mt-6 text-2xl font-black text-black sm:text-3xl">
                      {product.name}
                    </h2>

                    <p className="mt-3 text-slate-600">
                      Available in {product.size}
                    </p>

                    <div className="mt-6 space-y-3">

                      <div className="flex items-center gap-3">

                        <div className="h-2 w-2 rounded-full bg-green-600"></div>

                        <p className="text-slate-700">
                          Premium food-grade paper
                        </p>

                      </div>

                      <div className="flex items-center gap-3">

                        <div className="h-2 w-2 rounded-full bg-green-600"></div>

                        <p className="text-slate-700">
                          Custom branding available
                        </p>

                      </div>

                      <div className="flex items-center gap-3">

                        <div className="h-2 w-2 rounded-full bg-green-600"></div>

                        <p className="text-slate-700">
                          MOQ from 1000 cups
                        </p>

                      </div>

                      <div className="flex items-center gap-3">

                        <div className="h-2 w-2 rounded-full bg-green-600"></div>

                        <p className="text-slate-700">
                          Manufactured locally
                        </p>

                      </div>

                    </div>

                    <div className="mt-8">

                      <span className="block w-full rounded-full bg-green-700 py-4 text-center font-bold text-white transition hover:bg-green-800">
                        View Product →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        </section>

        {/* WHY CHOOSE US */}
       {/* WHY CHOOSE US */}

<section className="bg-white py-20 lg:py-28">

  <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

    <div className="text-center">

      <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
        Why Choose Pro Cups
      </span>

      <h2 className="mt-6 text-3xl font-black text-black sm:text-4xl lg:text-5xl">
        Built For Coffee Brands
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">
        Every cup is manufactured using premium food-grade paper,
        precision machinery and strict quality control for a
        professional finish.
      </p>

    </div>

    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">

      {[
        {
          icon: "🇿🇦",
          title: "Made in South Africa",
          text: "Reliable local manufacturing with faster lead times.",
        },
        {
          icon: "📦",
          title: "MOQ From 1000 Cups",
          text: "Affordable minimum order quantities for growing businesses.",
        },
        {
          icon: "☕",
          title: "Premium Materials",
          text: "Manufactured using high-quality food-grade paper.",
        },
        {
          icon: "🎨",
          title: "Custom Printing",
          text: "Bring your brand to life with vibrant full-colour printing.",
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

{/* CTA */}

<section className="bg-slate-900 py-20 text-white lg:py-28">

  <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

    <div className="grid items-center gap-14 lg:grid-cols-2">

      <div>

        <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
          Ready To Order?
        </span>

        <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
          Let's Build Your
          <span className="text-green-400">
            {" "}Next Cup.
          </span>
        </h2>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
          Whether you're opening a café, expanding your franchise or
          launching a new product, Pro Cups International can help you
          create premium branded paper cups.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">

          <Link
            href="/custom-printing"
            className="rounded-full bg-green-700 px-8 py-4 text-center font-semibold text-white transition hover:bg-green-800"
          >
            Request Quote
          </Link>

          <Link
            href="/contact"
            className="rounded-full border border-white/30 px-8 py-4 text-center font-semibold transition hover:bg-white hover:text-black"
          >
            Contact Us
          </Link>

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
            100%
          </h3>

          <p className="mt-3 text-slate-300">
            Food Grade
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