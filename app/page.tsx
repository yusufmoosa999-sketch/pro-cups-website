import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Pro Cups International | Premium Paper Cups South Africa",
  description:
    "Pro Cups International manufactures premium ripple cups, double wall cups and custom printed paper cups in South Africa.",
};

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

const faqs = [
  {
    question: "What is the minimum order quantity?",
    answer:
      "Our minimum order quantity is 1,000 paper cups, making custom printed cups accessible to businesses of different sizes.",
  },
  {
    question: "Do you manufacture paper cups in South Africa?",
    answer:
      "Yes. Pro Cups International manufactures paper cups locally in South Africa, helping us provide reliable production and supply to businesses across the country.",
  },
  {
    question: "Can I print my own logo on the cups?",
    answer:
      "Absolutely. We offer custom printed paper cups for coffee shops, restaurants, franchises, wholesalers and corporate businesses.",
  },
  {
    question: "Which cup sizes are available?",
    answer:
      "We currently manufacture 250ml and 350ml paper cups in a range of styles including ripple, double wall and custom printed options.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-white">

        {/* =========================================================
            HERO
        ========================================================= */}

        <section className="relative isolate bg-slate-950 text-white">

          {/* Background decoration */}

          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-green-600/20 blur-3xl" />
            <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-900/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-28">

            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

              {/* Hero copy */}

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[2px] text-green-300">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  South African Manufacturer
                </div>

                <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                  Cups that make
                  <span className="block text-green-400">
                    your brand stand out.
                  </span>
                </h1>

                <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                  Premium ripple, double wall and custom printed
                  paper cups manufactured in South Africa for
                  cafés, restaurants, franchises, wholesalers and
                  growing brands.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                  <Link
                    href="/custom-printing"
                    className="group inline-flex min-h-14 items-center justify-center rounded-full bg-green-600 px-7 py-4 text-center font-black text-white shadow-xl shadow-green-950/30 transition duration-300 hover:-translate-y-1 hover:bg-green-500"
                  >
                    Request a Quote
                    <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/products"
                    className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-center font-black text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-slate-950"
                  >
                    Explore Products
                  </Link>

                </div>

                {/* Trust points */}

                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">

                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-black text-white">
                      ✓
                    </span>
                    From 1,000 cups
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-black text-white">
                      ✓
                    </span>
                    Local manufacturing
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-black text-white">
                      ✓
                    </span>
                    Custom printing
                  </div>

                </div>

              </div>


              {/* Hero image */}

              <div className="relative">

                <div className="absolute -inset-5 rounded-[40px] bg-green-500/10 blur-2xl" />

                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-2 shadow-2xl">

                  <Image
                    src="/images/hero.jpg"
                    alt="Pro Cups paper cups"
                    width={800}
                    height={800}
                    priority
                    className="h-auto w-full rounded-[26px] object-cover"
                  />

                  {/* Floating card */}

                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-xl backdrop-blur-md sm:left-auto sm:max-w-xs">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600 text-xl">
                        ✓
                      </div>

                      <div>
                        <p className="text-sm font-black text-white">
                          Built for businesses
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          From everyday supply to custom branded
                          packaging.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* Stats */}

            <div className="mt-14 grid grid-cols-3 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur sm:mt-20">

              <div className="border-r border-white/10 px-4 py-6 text-center sm:px-8 sm:py-8">
                <p className="text-2xl font-black text-green-400 sm:text-4xl">
                  1,000+
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 sm:text-sm">
                  Minimum Order
                </p>
              </div>

              <div className="border-r border-white/10 px-4 py-6 text-center sm:px-8 sm:py-8">
                <p className="text-2xl font-black text-green-400 sm:text-4xl">
                  5
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 sm:text-sm">
                  Cup Styles
                </p>
              </div>

              <div className="px-4 py-6 text-center sm:px-8 sm:py-8">
                <p className="text-2xl font-black text-green-400 sm:text-4xl">
                  SA
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400 sm:text-sm">
                  Manufactured
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* =========================================================
            PRODUCT RANGE
        ========================================================= */}

        <section className="bg-slate-50 py-20 sm:py-24 lg:py-32">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

              <div className="max-w-3xl">

                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-black uppercase tracking-[2px] text-green-700">
                  Our Product Range
                </span>

                <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Find the cup that
                  <span className="block text-green-700">
                    fits your brand.
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  Choose from our range of ripple and double wall
                  cups, or speak to us about creating a custom
                  printed cup for your business.
                </p>

              </div>

              <Link
                href="/products"
                className="inline-flex shrink-0 items-center font-black text-green-700 transition hover:text-green-800"
              >
                View the full range
                <span className="ml-2">→</span>
              </Link>

            </div>


            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">

              {products.map((product) => (
                <Link
                  key={product.name}
                  href="/products"
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-2xl"
                >

                  <div className="relative overflow-hidden">

                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="absolute bottom-4 right-4 translate-y-3 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View →
                    </div>

                  </div>

                  <div className="p-5">

                    <h3 className="text-xl font-black text-slate-950">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-slate-500">
                      {product.size}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                      <span className="text-sm font-bold text-green-700">
                        Explore
                      </span>

                      <span className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-green-700">
                        →
                      </span>

                    </div>

                  </div>

                </Link>
              ))}

            </div>

          </div>

        </section>


        {/* =========================================================
            WHY PRO CUPS
        ========================================================= */}

        <section className="bg-white py-20 sm:py-24 lg:py-32">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">

              <div>

                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-black uppercase tracking-[2px] text-green-700">
                  Why Pro Cups
                </span>

                <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  More than just
                  <span className="block text-green-700">
                    a paper cup.
                  </span>
                </h2>

              </div>

              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Your packaging is part of your brand. We combine
                local manufacturing, modern production equipment
                and careful quality control to help businesses
                present their products professionally.
              </p>

            </div>


            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              {[
                {
                  icon: "🏭",
                  title: "Local Manufacturing",
                  text: "Manufactured in South Africa with a focus on reliable supply and consistent quality.",
                },
                {
                  icon: "🖨️",
                  title: "Custom Printing",
                  text: "Turn your branding into professional printed cups that customers see with every order.",
                },
                {
                  icon: "📦",
                  title: "Low MOQ",
                  text: "Order from 1,000 cups, giving growing businesses access to professional packaging.",
                },
                {
                  icon: "⭐",
                  title: "Quality Focus",
                  text: "Premium materials, modern equipment and controlled production processes.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl transition duration-300 group-hover:scale-110 group-hover:bg-green-600">
                    {item.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.text}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </section>


        {/* =========================================================
            CUSTOM PRINTING
        ========================================================= */}

        <section className="bg-slate-950 py-20 text-white sm:py-24 lg:py-32">

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">

            <div className="relative order-2 lg:order-1">

              <div className="absolute -inset-5 rounded-[40px] bg-green-500/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/10">

                <Image
                  src="/images/custom-printing.jpg"
                  alt="Custom printed Pro Cups paper cups"
                  width={700}
                  height={700}
                  className="w-full object-cover transition duration-700 hover:scale-105"
                />

              </div>

            </div>


            <div className="order-1 lg:order-2">

              <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[2px] text-green-300">
                Custom Printing
              </span>

              <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Put your brand
                <span className="block text-green-400">
                  in every hand.
                </span>
              </h2>

              <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Create branded paper cups that make your business
                instantly recognisable. Send us your artwork and
                we'll guide you through the process from design
                to production.
              </p>


              <div className="mt-8 space-y-4">

                {[
                  "High-resolution custom printing",
                  "Professional print proof before production",
                  "Reliable production process",
                  "Minimum orders from 1,000 cups",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >

                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-black text-white">
                      ✓
                    </span>

                    <span className="font-semibold text-slate-200">
                      {item}
                    </span>

                  </div>
                ))}

              </div>


              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/custom-printing"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-green-600 px-7 py-4 font-black text-white transition hover:bg-green-500"
                >
                  Start Your Design
                  <span className="ml-3">→</span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 px-7 py-4 font-black text-white transition hover:bg-white hover:text-slate-950"
                >
                  Talk to Us
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================================
            PROCESS
        ========================================================= */}

        <section className="bg-slate-50 py-20 sm:py-24 lg:py-32">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="mx-auto max-w-3xl text-center">

              <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-black uppercase tracking-[2px] text-green-700">
                How It Works
              </span>

              <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                From idea to
                <span className="block text-green-700">
                  finished cups.
                </span>
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                We make the process straightforward, transparent
                and easy to follow.
              </p>

            </div>


            <div className="relative mt-14">

              <div className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-px bg-green-200 xl:block" />

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {[
                  {
                    number: "01",
                    title: "Request",
                    text: "Tell us what cups you need and submit your requirements.",
                  },
                  {
                    number: "02",
                    title: "Design & Proof",
                    text: "Send your artwork and review your professional print proof.",
                  },
                  {
                    number: "03",
                    title: "Payment",
                    text: "Accept your quotation and securely pay your invoice online.",
                  },
                  {
                    number: "04",
                    title: "Production",
                    text: "Once payment is confirmed, your cups move into production.",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                  >

                    <div className="relative z-10 flex h-18 w-18 items-center justify-center rounded-full bg-green-600 text-lg font-black text-white shadow-lg shadow-green-700/20">
                      {step.number}
                    </div>

                    <h3 className="mt-6 text-2xl font-black text-slate-950">
                      {step.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {step.text}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </section>


        {/* =========================================================
            FAQ
        ========================================================= */}

        <section className="bg-white py-20 sm:py-24 lg:py-32">

          <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-12">

            <div className="text-center">

              <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-black uppercase tracking-[2px] text-green-700">
                Frequently Asked Questions
              </span>

              <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Questions?
                <span className="text-green-700">
                  {" "}We've got answers.
                </span>
              </h2>

            </div>


            <div className="mt-12 space-y-4">

              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-green-200 hover:shadow-md"
                >

                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 font-black text-slate-950 sm:p-7">

                    <span className="text-base sm:text-lg">
                      {faq.question}
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl font-medium text-green-700 transition duration-300 group-open:rotate-45">
                      +
                    </span>

                  </summary>

                  <div className="px-6 pb-6 sm:px-7 sm:pb-7">

                    <p className="max-w-3xl leading-7 text-slate-600">
                      {faq.answer}
                    </p>

                  </div>

                </details>
              ))}

            </div>


            <div className="mt-10 text-center">

              <Link
                href="/contact"
                className="font-black text-green-700 transition hover:text-green-800"
              >
                Still have a question? Contact us →
              </Link>

            </div>

          </div>

        </section>


        {/* =========================================================
            FINAL CTA
        ========================================================= */}

        <section className="relative overflow-hidden bg-green-700 py-20 text-white sm:py-24 lg:py-32">

          <div className="absolute inset-0">

            <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-black/10 blur-3xl" />

          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">

              <div>

                <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[2px] text-green-100">
                  Ready to get started?
                </span>

                <h2 className="mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  Let's put your brand
                  <span className="block text-green-200">
                    on the cup.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-7 text-green-50 sm:text-lg sm:leading-8">
                  Tell us what you need and our team will help
                  you choose the right cup, quantity and printing
                  option for your business.
                </p>

              </div>


              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

                <Link
                  href="/custom-printing"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 py-4 font-black text-green-700 shadow-xl transition hover:-translate-y-1 hover:bg-slate-50"
                >
                  Request a Quote
                  <span className="ml-3">→</span>
                </Link>

                <Link
                  href="/products"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/30 px-8 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white/10"
                >
                  View Products
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* =========================================================
            FOOTER
        ========================================================= */}

        <Footer />

      </main>
    </>
  );
}