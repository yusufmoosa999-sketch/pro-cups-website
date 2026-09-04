import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "About Us | Pro Cups International",
  description:
    "Learn about Pro Cups International, a South African paper cup manufacturer supplying customised and standard cups to businesses locally and internationally.",
};

const range = [
  { size: "250ml", types: ["Single Wall", "Double Wall", "Ripple"] },
  { size: "350ml", types: ["Single Wall", "Double Wall", "Ripple"] },
];

const services = [
  ["01", "Artwork", "You bring the brand. We help get the artwork ready."],
  ["02", "Printing", "Custom printing produced locally for your business."],
  ["03", "Manufacturing", "Paper cups manufactured locally in South Africa."],
  ["04", "Supply", "Competitive sourcing and local production keep the process practical."],
];

function PhotoSlot({
  label,
  className = "",
  dark = false,
  accent = false,
}: {
  label: string;
  className?: string;
  dark?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative isolate flex min-h-[300px] items-center justify-center overflow-hidden rounded-[32px] ${
        dark
          ? "bg-[#111]"
          : accent
            ? "bg-[#087f3f]"
            : "bg-[#e7e2d8]"
      } ${className}`}
    >
      {!dark && !accent && (
        <>
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/40" />
          <div className="absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-black/[0.035]" />
        </>
      )}

      {accent && (
        <>
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border border-white/10" />
        </>
      )}

      <div className="relative z-10 text-center">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border ${
            dark || accent ? "border-white/20 text-white/60" : "border-black/10 text-black/35"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-[0.25em] ${
          dark || accent ? "text-white/55" : "text-black/40"
        }`}>
          {label}
        </p>
        <p className={`mt-2 text-[11px] ${dark || accent ? "text-white/30" : "text-black/30"}`}>
          Photography to be added
        </p>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-[#f7f5f0] text-[#151515]">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#f7f5f0]">
          <div className="absolute -right-40 -top-48 h-[620px] w-[620px] rounded-full bg-[#087f3f]" />
          <div className="absolute right-[10%] top-[18%] h-24 w-24 rounded-full border-[14px] border-white/20" />

          <div className="relative mx-auto max-w-[1600px] px-5 pb-10 pt-8 sm:px-8 lg:px-12">
            <div className="grid min-h-[calc(100vh-88px)] items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
              <div className="relative z-10 py-16 lg:py-24">
                <div className="mb-8 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#087f3f]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-black/45">
                    About Pro Cups International
                  </span>
                </div>

                <h1 className="max-w-5xl text-[clamp(4rem,8vw,9rem)] font-medium leading-[0.82] tracking-[-0.075em]">
                  We started
                  <br />
                  with the cups.
                  <br />
                  <span className="text-[#087f3f]">Then built</span>
                  <br />
                  the brand.
                </h1>

                <p className="mt-9 max-w-xl text-lg leading-8 text-black/55 sm:text-xl">
                  We were already manufacturing paper cups. Pro Cups
                  International was created to take that capability and put
                  customised cups in the hands of more businesses.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/custom-printing"
                    className="inline-flex items-center gap-3 rounded-full bg-[#087f3f] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#066d35] hover:scale-[1.02]"
                  >
                    Get a quote
                    <Arrow />
                  </Link>
                  <a
                    href="#story"
                    className="inline-flex items-center gap-3 rounded-full border border-black/15 px-7 py-4 text-sm font-semibold transition hover:border-black/30 hover:bg-white"
                  >
                    Our story
                  </a>
                </div>
              </div>

              <div className="relative z-10 lg:pt-12">
                <PhotoSlot
                  label="Hero cup photography"
                  accent
                  className="min-h-[520px] shadow-2xl shadow-black/10 lg:min-h-[680px]"
                />

                <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-black/10 sm:-left-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/35">
                    Manufactured locally
                  </p>
                  <p className="mt-1 text-sm font-semibold">South Africa</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-t border-black/10 pt-6 sm:grid-cols-3">
              {["250ml + 350ml", "Single · Double · Ripple", "Custom printing"].map((item) => (
                <span
                  key={item}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-black/35"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* STORY */}
        <section id="story" className="bg-white">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <div className="lg:sticky lg:top-8 lg:self-start">
                <span className="inline-flex rounded-full bg-[#e8f3ed] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#087f3f]">
                  01 / Where it started
                </span>
                <p className="mt-7 max-w-sm text-3xl font-medium leading-tight tracking-[-0.04em]">
                  There was already a business behind the idea.
                </p>
              </div>

              <div>
                <h2 className="max-w-5xl text-[clamp(3rem,6vw,7rem)] font-medium leading-[0.86] tracking-[-0.07em]">
                  We didn&apos;t start Pro Cups because we wanted another
                  company.
                  <span className="text-[#087f3f]"> We saw an opportunity.</span>
                </h2>

                <div className="mt-14 grid gap-10 border-t border-black/10 pt-10 md:grid-cols-2">
                  <p className="text-lg leading-8 text-black/60">
                    Before Pro Cups International, we were already
                    manufacturing paper cups. We saw that customised cups were
                    not being offered by many businesses, and we already had
                    the capabilities to make them.
                  </p>

                  <p className="text-lg leading-8 text-black/60">
                    So we created Pro Cups as a dedicated brand to take
                    customised cups to the businesses that could use them —
                    from smaller coffee shops and events to larger coffee shops,
                    restaurants and other drinks businesses.
                  </p>
                </div>

                <PhotoSlot
                  label="Cup photography / story"
                  className="mt-14 min-h-[560px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* WHY CUSTOM */}
        <section className="bg-[#087f3f] text-white">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="grid gap-16 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                  02 / Why customised cups
                </span>
                <h2 className="mt-7 max-w-xl text-[clamp(3.4rem,6vw,7rem)] font-medium leading-[0.84] tracking-[-0.07em]">
                  The cup is part of the brand.
                </h2>
              </div>

              <div className="max-w-3xl lg:justify-self-end">
                <p className="text-2xl leading-9 tracking-[-0.025em] text-white/85 sm:text-3xl">
                  Coffee and drinks are brand-driven businesses. Your customer
                  already has the cup in their hand — why not make it part of
                  the experience?
                </p>
                <p className="mt-7 max-w-2xl text-base leading-7 text-white/60">
                  That is the simple idea behind Pro Cups. We wanted
                  businesses of different sizes to have access to customised
                  cups without making the process unnecessarily complicated.
                </p>
              </div>
            </div>

            <div className="mt-16 grid gap-4 md:grid-cols-[1.25fr_.75fr]">
              <PhotoSlot
                label="Printed cup collection"
                dark
                className="min-h-[500px] border border-white/10"
              />
              <div className="grid gap-4">
                <PhotoSlot
                  label="Brand detail"
                  dark
                  className="min-h-[240px]"
                />
                <div className="rounded-[32px] bg-white p-8 text-black sm:p-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/35">
                    The idea
                  </p>
                  <p className="mt-6 text-3xl font-medium leading-tight tracking-[-0.045em] sm:text-4xl">
                    Put your brand where your customers already look.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RANGE */}
        <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-14 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <span className="inline-flex rounded-full bg-[#e8f3ed] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#087f3f]">
                03 / Our range
              </span>
              <h2 className="mt-7 max-w-md text-[clamp(3.4rem,5.5vw,6.5rem)] font-medium leading-[0.84] tracking-[-0.07em]">
                The cups we make.
              </h2>
            </div>

            <div>
              <p className="max-w-2xl text-lg leading-8 text-black/55">
                We manufacture locally in South Africa, with 250ml and 350ml
                options across single wall, double wall and ripple. Ripple
                cups are available without custom printing.
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {range.map((item, index) => (
                  <div
                    key={item.size}
                    className={`rounded-[32px] p-8 sm:p-10 ${
                      index === 0 ? "bg-[#111] text-white" : "bg-[#e9e5dc]"
                    }`}
                  >
                    <div className="flex items-end justify-between">
                      <span className="text-7xl font-medium tracking-[-0.075em]">
                        {item.size}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                        index === 0 ? "text-white/35" : "text-black/35"
                      }`}>
                        Cup range
                      </span>
                    </div>

                    <div className={`mt-10 border-t pt-5 ${
                      index === 0 ? "border-white/10" : "border-black/10"
                    }`}>
                      {item.types.map((type) => (
                        <div
                          key={type}
                          className={`flex items-center justify-between border-b py-4 last:border-0 ${
                            index === 0 ? "border-white/10" : "border-black/10"
                          }`}
                        >
                          <span className="font-medium">{type}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                            index === 0 ? "text-white/30" : "text-black/30"
                          }`}>
                            Available
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE */}
        <section className="bg-[#111] text-white">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="grid gap-16 lg:grid-cols-[.65fr_1.35fr]">
              <div>
                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                  04 / What we provide
                </span>
                <h2 className="mt-7 max-w-xl text-[clamp(3.4rem,5.5vw,6.5rem)] font-medium leading-[0.84] tracking-[-0.07em]">
                  Everything in one place.
                </h2>
                <p className="mt-8 max-w-md text-base leading-7 text-white/45">
                  We combine manufacturing, printing and supply so you do not
                  have to piece the process together yourself.
                </p>
              </div>

              <div className="border-t border-white/10">
                {services.map(([number, title, text]) => (
                  <div
                    key={number}
                    className="grid gap-5 border-b border-white/10 py-8 sm:grid-cols-[55px_190px_1fr] sm:items-start"
                  >
                    <span className="text-xs font-semibold tracking-[0.2em] text-white/25">
                      {number}
                    </span>
                    <h3 className="text-xl font-medium">{title}</h3>
                    <p className="max-w-xl text-base leading-7 text-white/45">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE WORK WITH */}
        <section className="bg-[#f7f5f0]">
          <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
              <PhotoSlot label="Customer / cup photography" className="min-h-[600px]" />

              <div className="lg:pl-10">
                <span className="inline-flex rounded-full bg-[#e8f3ed] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#087f3f]">
                  05 / Who we work with
                </span>

                <h2 className="mt-7 text-[clamp(3.4rem,5.5vw,6.5rem)] font-medium leading-[0.84] tracking-[-0.07em]">
                  From the
                  <br />
                  small shop
                  <br />
                  to the big one.
                </h2>

                <p className="mt-8 max-w-xl text-lg leading-8 text-black/55">
                  We work with coffee shops, restaurants, takeaways, events,
                  caterers, corporate businesses, distributors and wholesalers.
                  Different businesses need different things, but the aim is
                  always the same: make getting the right cup simple.
                </p>

                <div className="mt-8 flex max-w-xl flex-wrap gap-2">
                  {[
                    "Coffee shops",
                    "Restaurants",
                    "Takeaways",
                    "Events",
                    "Caterers",
                    "Corporates",
                    "Distributors",
                    "Wholesalers",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOOKING AHEAD — no map/graphic */}
        <section className="relative overflow-hidden bg-[#087f3f] text-white">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-48 -left-24 h-[500px] w-[500px] rounded-full border border-white/10" />

          <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="grid gap-14 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
              <div>
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                  06 / Looking ahead
                </span>

                <h2 className="mt-7 max-w-6xl text-[clamp(4rem,8vw,9rem)] font-medium leading-[0.8] tracking-[-0.075em]">
                  Built in
                  <br />
                  South Africa.
                  <br />
                  <span className="text-white/40">Ready for what&apos;s next.</span>
                </h2>
              </div>

              <div className="max-w-xl lg:pb-2 lg:pl-8">
                <p className="text-xl leading-9 text-white/80 sm:text-2xl">
                  Pro Cups International was built with a bigger vision in
                  mind. We are continuing to grow our range, our capabilities
                  and our reach, with the goal of taking customised cups into
                  markets beyond South Africa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="relative overflow-hidden rounded-[38px] bg-[#f0ede5] px-7 py-16 sm:px-12 lg:px-20 lg:py-24">
              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#087f3f]/10" />
              <div className="absolute right-24 top-16 h-24 w-24 rounded-full bg-[#087f3f]/10" />

              <div className="relative z-10 max-w-5xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#087f3f]">
                  Start with your brand
                </span>

                <h2 className="mt-7 text-[clamp(3.5rem,7vw,8rem)] font-medium leading-[0.82] tracking-[-0.075em]">
                  Put your brand
                  <br />
                  <span className="text-[#087f3f]">on the cup.</span>
                </h2>

                <p className="mt-8 max-w-xl text-lg leading-8 text-black/50">
                  Tell us what you need and let&apos;s create a cup that works
                  for your business.
                </p>

                <Link
                  href="/custom-printing"
                  className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#087f3f] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#066d35] hover:scale-[1.02]"
                >
                  Get a quote
                  <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
