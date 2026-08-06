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

      <main className="bg-white min-h-screen">

        <section className="bg-[#0f172a] text-white py-28">

          <div className="max-w-7xl mx-auto px-8">

            <p className="uppercase tracking-[8px] text-green-400 font-bold text-lg">
              OUR PRODUCTS
            </p>

            <h1 className="mt-6 text-8xl font-black leading-none tracking-tight">
              Paper Cups
            </h1>

            <p className="mt-8 max-w-4xl text-3xl leading-relaxed text-gray-300">
              Manufactured in South Africa using premium food-grade paper for
              cafés, restaurants, wholesalers and corporate brands.
            </p>

          </div>

        </section>

        <section className="max-w-7xl mx-auto px-8 py-24">

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">

            {products.map((product) => (

             <Link
  key={product.name}
  href={product.href}
  className="group overflow-hidden rounded-[34px] bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
>

  <div className="overflow-hidden">

    <Image
      src={product.image}
      alt={product.name}
      width={700}
      height={700}
      className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-110"
    />

  </div>

  <div className="p-8">

    <span className="inline-block bg-green-100 text-green-700 font-bold text-sm px-4 py-2 rounded-full">
      Manufactured in SA
    </span>

    <h2 className="mt-6 text-3xl font-black text-gray-900 leading-tight">
      {product.name}
    </h2>

    <p className="mt-3 text-lg text-gray-600">
      Available in {product.size}
    </p>

    <ul className="mt-6 space-y-3 text-lg text-gray-700">

      <li>✓ Premium food-grade paper</li>

      <li>✓ Custom branding available</li>

      <li>✓ MOQ from 1000 cups</li>

      <li>✓ Manufactured locally</li>

    </ul>

    <button className="mt-8 w-full rounded-full bg-green-700 py-4 text-xl font-bold text-white transition hover:bg-green-800">
      View Product →
    </button>

  </div>

</Link>

            ))}

          </div>

        </section>
<section className="bg-[#0b1220] text-white py-28">

  <div className="max-w-7xl mx-auto px-8">

    <div className="text-center mb-20">

      <p className="uppercase tracking-[8px] text-green-400 font-bold text-lg">
        WHY CHOOSE US
      </p>

      <h2 className="text-6xl font-black mt-5">
        Built For Coffee Brands That
        <span className="text-green-400"> Expect More.</span>
      </h2>

      <p className="text-2xl text-gray-300 mt-8 max-w-4xl mx-auto leading-relaxed">
        We manufacture premium paper cups in South Africa using food-grade
        materials, precision manufacturing and vibrant digital printing for
        businesses that care about quality.
      </p>

    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

      {[
        {
          title: "Manufactured in South Africa",
          text: "Fast lead times and dependable local supply.",
          icon: "🇿🇦",
        },
        {
          title: "MOQ from 1000 Cups",
          text: "Ideal for cafés, franchises and growing brands.",
          icon: "📦",
        },
        {
          title: "Premium Food Grade Paper",
          text: "High-quality materials with excellent insulation.",
          icon: "☕",
        },
        {
          title: "Custom Printed Cups",
          text: "Bring your brand to life with vibrant printing.",
          icon: "🎨",
        },
      ].map((item) => (

        <div
          key={item.title}
          className="rounded-[30px] bg-white/10 backdrop-blur-md p-10 border border-white/10 hover:border-green-500 transition"
        >

          <div className="text-6xl mb-8">
            {item.icon}
          </div>

          <h3 className="text-3xl font-black">
            {item.title}
          </h3>

          <p className="mt-5 text-xl text-gray-300 leading-relaxed">
            {item.text}
          </p>

        </div>

      ))}

    </div>

  </div>

</section>
<Footer />
      </main>
    </>
  );
}