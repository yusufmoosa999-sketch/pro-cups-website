

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

      <section className="grid lg:grid-cols-2 gap-16 items-center px-8 lg:px-28 py-24">

        <div>

          <p className="uppercase tracking-[8px] text-green-700 text-sm mb-5">
            Premium Paper Cup Manufacturer
          </p>

          <h1 className="text-6xl font-black leading-tight">
            Manufactured In
            <span className="text-green-700"> South Africa.</span>
          </h1>

          <p className="mt-8 text-gray-800 text-lg leading-8">
            Pro Cups International manufactures premium Vertical Ripple and Double Wall
            paper cups for coffee shops, restaurants, franchises, wholesalers
            and corporate brands.
          </p>

          <div className="flex gap-5 mt-10">

            <button className="bg-green-700 text-white px-8 py-4 rounded-full hover:bg-green-800 transition">
              Request Quote
            </button>

            <button className="border-2 border-green-700 text-green-700 px-8 py-4 rounded-full">
              View Products
            </button>

          </div>

          <div className="grid grid-cols-3 gap-8 mt-16">

            <div>
              <h2 className="text-4xl font-bold text-green-700">1000+</h2>
              <p className="text-gray-700">Minimum Order</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-green-700">5</h2>
              <p className="text-gray-500">Cup Styles</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-green-700">SA</h2>
              <p className="text-gray-500">Manufactured</p>
            </div>

          </div>

        </div>

        <div>

          <Image
            src="/images/hero.jpg"
            alt="Coffee Cups"
            width={700}
            height={700}
            className="rounded-3xl shadow-2xl"
            priority
          />

        </div>

      </section>

      {/* PRODUCTS */}

      <section className="bg-[#f7f7f5] py-24 px-8 lg:px-24">

        <h2 className="text-5xl font-bold text-center">
          Our Product Range
        </h2>

        <p className="text-center text-gray-800 mt-5 mb-16">
          Premium paper cups built for cafés, restaurants and businesses.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">

          {products.map((product) => (

            <div
              key={product.name}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:-translate-y-3 transition duration-300"
            >

              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-72 object-cover"
              />

              <div className="p-6">

                <h3 className="font-bold text-xl">
                  {product.name}
                </h3>

                <p className="text-gray-700 mt-2">
                  {product.size}
                </p>

                <button className="mt-6 bg-green-700 text-white w-full py-3 rounded-full hover:bg-green-800 transition">
                  View Product
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* WHY US */}

      <section className="py-24 px-8 lg:px-28">

        <div className="text-center mb-20">

          <h2 className="text-5xl font-bold">
            Why Choose Pro Cups?
          </h2>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {[
            "Manufactured in South Africa",
            "MOQ from 1000 Cups",
            "Custom Printed Cups",
            "Premium Food Grade Materials",
          ].map((item) => (

            <div
              key={item}
              className="bg-white rounded-3xl shadow-lg p-10 text-center"
            >

              <div className="text-5xl mb-6">✓</div>

              <h3 className="font-bold text-xl">
                {item}
              </h3>

            </div>

          ))}

        </div>

      </section>
{/* CUSTOM PRINTING */}

<section className="py-28 px-8 lg:px-28 bg-white">

  <div className="grid lg:grid-cols-2 gap-16 items-center">

    <div>

      <Image
        src="/images/custom-printing.jpg"
        alt="Custom Printed Cups"
        width={700}
        height={700}
        className="rounded-3xl shadow-xl object-cover"
      />

    </div>

    <div>

      <p className="uppercase tracking-[6px] text-green-700 text-sm mb-4">
        Custom Branding
      </p>

      <h2 className="text-5xl font-black leading-tight">
        Make Your Brand
        <span className="text-green-700"> Stand Out.</span>
      </h2>

      <p className="text-gray-800 text-lg leading-8 mt-8">
        We manufacture premium custom printed paper cups for coffee shops,
        restaurants, franchises, events and corporate brands. Upload your
        artwork or let our design team create a professional cup design for
        your business.
      </p>

      <div className="grid grid-cols-2 gap-6 mt-10">

        <div className="bg-green-50 rounded-2xl p-6">
          <h3 className="font-bold text-xl">MOQ 1000 Cups</h3>
          <p className="text-gray-800 mt-2">
            Low minimum order quantities.
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-6">
          <h3 className="font-bold text-xl">Fast Turnaround</h3>
          <p className="text-gray-800 mt-2">
            Manufactured in South Africa.
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-6">
          <h3 className="font-bold text-xl">Premium Quality</h3>
          <p className="text-gray-800 mt-2">
            Food-grade paper and inks.
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-6">
          <h3 className="font-bold text-xl">Artwork Assistance</h3>
          <p className="text-gray-800 mt-2">
            We help prepare your print-ready files.
          </p>
        </div>

      </div>

      <button className="mt-10 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-full">
        Start Your Custom Order
      </button>

    </div>

  </div>

</section>
{/* MANUFACTURING PROCESS */}

<section className="py-24 px-8 lg:px-28 bg-white">

  <div className="text-center mb-16">

    <p className="uppercase tracking-[6px] text-green-700 font-semibold">
      Our Process
    </p>

    <h2 className="text-5xl font-black mt-3">
      From Design To Delivery
    </h2>

    <p className="text-gray-700 mt-5 max-w-3xl mx-auto">
      Every Pro Cups order is manufactured with strict quality control,
      premium food-grade materials and modern production equipment.
    </p>

  </div>

  <div className="grid md:grid-cols-4 gap-8">

    <div className="bg-green-50 rounded-3xl p-8 text-center shadow-lg">
      <div className="text-5xl mb-5">1️⃣</div>
      <h3 className="text-2xl font-bold mb-4">Artwork</h3>
      <p className="text-gray-700">
        Send us your logo or design requirements.
      </p>
    </div>

    <div className="bg-green-50 rounded-3xl p-8 text-center shadow-lg">
      <div className="text-5xl mb-5">2️⃣</div>
      <h3 className="text-2xl font-bold mb-4">Proof Approval</h3>
      <p className="text-gray-700">
        Receive a digital proof before production begins.
      </p>
    </div>

    <div className="bg-green-50 rounded-3xl p-8 text-center shadow-lg">
      <div className="text-5xl mb-5">3️⃣</div>
      <h3 className="text-2xl font-bold mb-4">Manufacturing</h3>
      <p className="text-gray-700">
        Your cups are printed and manufactured in South Africa using premium food-grade materials.
      </p>
    </div>

    <div className="bg-green-50 rounded-3xl p-8 text-center shadow-lg">
      <div className="text-5xl mb-5">4️⃣</div>
      <h3 className="text-2xl font-bold mb-4">Delivery</h3>
      <p className="text-gray-700">
        Orders are packed securely and delivered throughout South Africa.
      </p>
    </div>

  </div>

</section>
{/* SOUTH AFRICAN MANUFACTURER */}

<section className="bg-[#0f172a] text-white py-28 px-8 lg:px-28">

  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

    <div>

      <p className="uppercase tracking-[6px] text-green-400 font-semibold mb-5">
        Pro Cups International
      </p>

      <h2 className="text-5xl lg:text-6xl font-black leading-tight">
        Manufactured In South Africa.
        <span className="text-green-400"> Built For Growing Brands.</span>
      </h2>

      <p className="text-gray-300 text-lg leading-8 mt-8">
        We manufacture premium Ripple and Double Wall paper cups for coffee
        shops, restaurants, cafés, franchises, wholesalers and corporate
        businesses throughout South Africa.
      </p>

      <p className="text-gray-300 text-lg leading-8 mt-6">
        Every order is produced using premium food-grade paper, modern
        manufacturing equipment and strict quality control to ensure a
        professional product every time.
      </p>

      <div className="flex flex-wrap gap-5 mt-10">

        <button className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full font-semibold">
          Request a Quote
        </button>

        <button className="border border-white/30 hover:bg-white hover:text-black transition px-8 py-4 rounded-full font-semibold">
          View Products
        </button>

      </div>

    </div>

    <div className="grid grid-cols-2 gap-6">

      <div className="bg-white/10 rounded-3xl p-8">
        <h3 className="text-5xl font-black text-green-400">1000+</h3>
        <p className="text-gray-300 mt-3">
          Minimum Order Quantity
        </p>
      </div>

      <div className="bg-white/10 rounded-3xl p-8">
        <h3 className="text-5xl font-black text-green-400">5</h3>
        <p className="text-gray-300 mt-3">
          Premium Cup Styles
        </p>
      </div>

      <div className="bg-white/10 rounded-3xl p-8">
        <h3 className="text-5xl font-black text-green-400">SA</h3>
        <p className="text-gray-300 mt-3">
          Manufactured Locally
        </p>
      </div>

      <div className="bg-white/10 rounded-3xl p-8">
        <h3 className="text-5xl font-black text-green-400">Custom</h3>
        <p className="text-gray-300 mt-3">
          Printed Branding Available
        </p>
      </div>

    </div>

  </div>

</section>

    </main>
    </>
  );
}