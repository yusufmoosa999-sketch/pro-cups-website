import Link from "next/link";
import FadeIn from "@/components/FadeIn";

import Image from "next/image";
import Navbar from "@/components/Navbar";
const products = [
  {
    name: "Kraft Vertical Ripple",
    size: "250ml & 350ml",
    image: "/images/products/kraft-ripple.jpg",
  },
  {
    name: "Black Vertical Ripple",
    size: "250ml & 350ml",
    image: "/images/products/black-ripple.jpg",
  },
  {
    name: "Coffee Bean Vertical Ripple",
    size: "250ml & 350ml",
    image: "/images/products/coffee-bean-ripple.jpg",
  },
  {
    name: "Kraft Double Wall",
    size: "250ml & 350ml",
    image: "/images/products/kraft-double-wall.jpg",
  },
  {
    name: "White Double Wall",
    size: "250ml & 350ml",
    image: "/images/products/white-double-wall.jpg",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">

    {/* HERO */}

<section className="bg-white">
  <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">

    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

      {/* LEFT */}

      <div>

        <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
          Premium Paper Cup Manufacturer
        </span>

        <h1 className="mt-6 text-4xl font-black leading-tight text-black sm:text-5xl lg:text-7xl">
          Manufactured In
          <span className="block text-green-700">
            South Africa.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-700">
          Pro Cups International manufactures premium Ripple,
          Double Wall and Custom Printed paper cups for cafés,
          restaurants, franchises, wholesalers and corporate brands
          across South Africa.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">

          <Link
            href="/quote"
            className="rounded-full bg-green-700 px-8 py-4 text-center font-semibold text-white transition hover:bg-green-800"
          >
            Request Quote
          </Link>

          <Link
            href="/products"
            className="rounded-full border-2 border-green-700 px-8 py-4 text-center font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
          >
            View Products
          </Link>

        </div>

        <div className="mt-14 grid grid-cols-3 gap-6">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="text-3xl font-black text-green-700">
              1000+
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-700">
              Minimum Order
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="text-3xl font-black text-green-700">
              5
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-700">
              Cup Styles
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="text-3xl font-black text-green-700">
              SA
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-700">
              Manufactured
            </p>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div className="relative">

        <div className="absolute -left-6 -top-6 hidden h-40 w-40 rounded-full bg-green-100 blur-3xl lg:block" />

        <div className="absolute -bottom-6 -right-6 hidden h-40 w-40 rounded-full bg-green-50 blur-3xl lg:block" />

        <Image
          src="/images/hero.jpg"
          alt="Pro Cups"
          width={800}
          height={800}
          priority
          className="w-full rounded-[32px] shadow-2xl"
        />

      </div>

    </div>

  </div>
</section>

   {/* PRODUCTS */}

<section className="bg-slate-50 py-20 lg:py-28">

  <div className="mx-auto max-w-7xl px-6 lg:px-12">

    <div className="text-center">

      <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
        Product Range
      </span>

      <h2 className="mt-6 text-4xl font-black text-black sm:text-5xl">
        Premium Paper Cups
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">
        Manufactured in South Africa using premium food-grade paper for
        cafés, restaurants, wholesalers, franchises and corporate brands.
      </p>

    </div>

    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-5">

      {products.map((product) => (

        <div
          key={product.name}
          className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >

          <div className="overflow-hidden">

            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
            />

          </div>

          <div className="p-6">

            <h3 className="text-2xl font-black text-black">
              {product.name}
            </h3>

            <p className="mt-3 text-slate-600">
              {product.size}
            </p>

            <div className="mt-6">

              <Link
                href="/products"
                className="block rounded-full bg-green-700 py-3 text-center font-semibold text-white transition hover:bg-green-800"
              >
                View Product
              </Link>

            </div>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

    {/* WHY US */}

<section className="bg-white py-20 lg:py-28">

  <div className="mx-auto max-w-7xl px-6 lg:px-12">

    <div className="text-center">

      <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
        Why Pro Cups
      </span>

      <h2 className="mt-6 text-4xl font-black text-black sm:text-5xl">
        Why Businesses Choose Us
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">
        We manufacture premium paper cups using high-quality food-grade
        materials, modern production equipment and strict quality control
        processes to ensure every cup meets professional standards.
      </p>

    </div>

    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          🏭
        </div>

        <h3 className="text-2xl font-bold text-black">
          South African Manufacturer
        </h3>

        <p className="mt-4 leading-7 text-slate-700">
          Manufactured locally with reliable lead times and consistent
          quality.
        </p>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          🖨️
        </div>

        <h3 className="text-2xl font-bold text-black">
          Custom Printing
        </h3>

        <p className="mt-4 leading-7 text-slate-700">
          Full-colour branded paper cups printed with vibrant food-safe
          inks.
        </p>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          📦
        </div>

        <h3 className="text-2xl font-bold text-black">
          Low MOQ
        </h3>

        <p className="mt-4 leading-7 text-slate-700">
          Order from only 1,000 cups, making branded packaging affordable
          for businesses of every size.
        </p>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ⭐
        </div>

        <h3 className="text-2xl font-bold text-black">
          Premium Quality
        </h3>

        <p className="mt-4 leading-7 text-slate-700">
          Manufactured using premium paper and strict quality control to
          deliver a professional finish every time.
        </p>

      </div>

    </div>

  </div>

</section>
{/* CUSTOM PRINTING */}

<section className="bg-slate-50 py-20 lg:py-28">

  <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-12">

    {/* IMAGE */}

    <div className="relative">

      <div className="absolute -left-6 -top-6 hidden h-44 w-44 rounded-full bg-green-100 blur-3xl lg:block"></div>

      <Image
        src="/images/custom-printing.jpg"
        alt="Custom Printed Paper Cups"
        width={700}
        height={700}
        className="w-full rounded-[32px] shadow-2xl"
      />

    </div>

    {/* CONTENT */}

    <div>

      <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
        Custom Printing
      </span>

      <h2 className="mt-6 text-4xl font-black text-black sm:text-5xl">
        Showcase Your Brand On Every Cup
      </h2>

      <p className="mt-8 text-lg leading-8 text-slate-700">
        We produce vibrant full-colour printed paper cups that help
        cafés, restaurants, franchises and corporate businesses build
        their brand with every coffee served.
      </p>

      <div className="mt-10 space-y-5">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
            ✓
          </div>

          <div>

            <h3 className="font-bold text-black">
              High Resolution Printing
            </h3>

            <p className="text-slate-600">
              Sharp colours with excellent print quality.
            </p>

          </div>

        </div>

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
            ✓
          </div>

          <div>

            <h3 className="font-bold text-black">
              Fast Production
            </h3>

            <p className="text-slate-600">
              Reliable turnaround for businesses of all sizes.
            </p>

          </div>

        </div>

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
            ✓
          </div>

          <div>

            <h3 className="font-bold text-black">
              Food Grade Materials
            </h3>

            <p className="text-slate-600">
              Manufactured using premium food-safe paper and inks.
            </p>

          </div>

        </div>

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
            ✓
          </div>

          <div>

            <h3 className="font-bold text-black">
              MOQ From 1,000 Cups
            </h3>

            <p className="text-slate-600">
              Perfect for both small businesses and national brands.
            </p>

          </div>

        </div>

      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">

        <Link
          href="/custom-printing"
          className="rounded-full bg-green-700 px-8 py-4 text-center font-semibold text-white transition hover:bg-green-800"
        >
          Start Your Design
        </Link>

        <Link
          href="/contact"
          className="rounded-full border-2 border-green-700 px-8 py-4 text-center font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
        >
          Contact Us
        </Link>

      </div>

    </div>

  </div>

</section>
{/* MANUFACTURING PROCESS */}

<section className="bg-white py-20 lg:py-28">

  <div className="mx-auto max-w-7xl px-6 lg:px-12">

    <div className="text-center">

      <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-700">
        Manufacturing Process
      </span>

      <h2 className="mt-6 text-4xl font-black text-black sm:text-5xl">
        From Artwork To Delivery
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">
        Every order is professionally managed from your initial artwork
        through manufacturing, quality control and final delivery.
      </p>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-2xl font-black text-white">
          1
        </div>

        <h3 className="text-2xl font-bold text-black">
          Design
        </h3>

        <p className="mt-4 leading-7 text-slate-700">
          Send us your logo or artwork and our team will prepare your
          print-ready cup design.
        </p>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-2xl font-black text-white">
          2
        </div>

        <h3 className="text-2xl font-bold text-black">
          Approval
        </h3>

        <p className="mt-4 leading-7 text-slate-700">
          You'll receive a digital proof for approval before any cups go
          into production.
        </p>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-2xl font-black text-white">
          3
        </div>

        <h3 className="text-2xl font-bold text-black">
          Production
        </h3>

        <p className="mt-4 leading-7 text-slate-700">
          Your cups are manufactured using premium food-grade materials
          and modern production equipment.
        </p>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-2xl font-black text-white">
          4
        </div>

        <h3 className="text-2xl font-bold text-black">
          Delivery
        </h3>

        <p className="mt-4 leading-7 text-slate-700">
          Orders are securely packed and delivered throughout South
          Africa.
        </p>

      </div>

    </div>

  </div>

</section>

{/* FINAL CTA */}

<section className="relative overflow-hidden bg-slate-900 py-24 text-white">

  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-green-900 opacity-90"></div>

  <div className="relative mx-auto max-w-7xl px-6 lg:px-12">

    <div className="grid items-center gap-16 lg:grid-cols-2">

      <div>

        <span className="inline-block rounded-full bg-green-600/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
          Pro Cups International
        </span>

        <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
          Premium Paper Cups
          <br />
          Manufactured
          <span className="text-green-400">
            {" "}In South Africa
          </span>
        </h2>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
          We manufacture premium ripple cups, double wall cups and custom
          printed paper cups for coffee shops, restaurants, franchises,
          wholesalers and corporate businesses throughout South Africa.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">

          <Link
            href="/quote"
            className="rounded-full bg-green-600 px-8 py-4 text-center font-semibold text-white transition hover:bg-green-700"
          >
            Request Quote
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-white/30 px-8 py-4 text-center font-semibold text-white transition hover:bg-white hover:text-black"
          >
            Browse Products
          </Link>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <h3 className="text-5xl font-black text-green-400">
            1000+
          </h3>

          <p className="mt-3 text-slate-300">
            Minimum Order Quantity
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <h3 className="text-5xl font-black text-green-400">
            5
          </h3>

          <p className="mt-3 text-slate-300">
            Premium Cup Styles
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <h3 className="text-5xl font-black text-green-400">
            SA
          </h3>

          <p className="mt-3 text-slate-300">
            Manufactured Locally
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">

          <h3 className="text-5xl font-black text-green-400">
            100%
          </h3>

          <p className="mt-3 text-slate-300">
            Food Grade Materials
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

{/* FOOTER */}

<footer className="bg-black text-white">

  <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 lg:px-12">

    <div>

      <h3 className="text-3xl font-black">
        <span className="text-white">
          Pro
        </span>
        <span className="text-green-500">
          Cups
        </span>
      </h3>

      <p className="mt-6 leading-7 text-slate-400">
        Premium paper cup manufacturer supplying businesses throughout
        South Africa.
      </p>

    </div>

    <div>

      <h4 className="mb-5 text-xl font-bold">
        Products
      </h4>

      <ul className="space-y-3 text-slate-400">

        <li>
          <Link href="/products">
            Ripple Cups
          </Link>
        </li>

        <li>
          <Link href="/products">
            Double Wall Cups
          </Link>
        </li>

        <li>
          <Link href="/custom-printing">
            Custom Printing
          </Link>
        </li>

      </ul>

    </div>

    <div>

      <h4 className="mb-5 text-xl font-bold">
        Company
      </h4>

      <ul className="space-y-3 text-slate-400">

        <li>
          <Link href="/">
            Home
          </Link>
        </li>

        <li>
          <Link href="/gallery">
            Gallery
          </Link>
        </li>

        <li>
          <Link href="/contact">
            Contact
          </Link>
        </li>

      </ul>

    </div>

    <div>

      <h4 className="mb-5 text-xl font-bold">
        Contact
      </h4>

      <p className="text-slate-400">
        Durban
        <br />
        South Africa
      </p>

      <p className="mt-5 text-slate-400">
        sales@procupsinternational.com
      </p>

    </div>

  </div>

  <div className="border-t border-white/10 py-6 text-center text-slate-500">

    © {new Date().getFullYear()} Pro Cups International.
    All Rights Reserved.

  </div>

</footer>

</main>

    
    </>
  );
}