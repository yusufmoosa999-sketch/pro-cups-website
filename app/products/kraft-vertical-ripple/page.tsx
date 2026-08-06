import Footer from "@/components/footer";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function KraftVerticalRipple() {
  return (
    <>
      <Navbar />

      <main className="bg-white">

        <section className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-[1.2fr_0.8fr] gap-20">

          <div>

            <Image
              src="/images/products/kraft-ripple.jpg"
              alt="Kraft Vertical Ripple"
              width={900}
              height={900}
              className="rounded-[40px] shadow-2xl w-full"
            />
<div className="grid grid-cols-4 gap-4 mt-6">

  <Image
    src="/images/products/kraft-ripple.jpg"
    alt=""
    width={200}
    height={200}
    className="rounded-2xl border-2 border-green-700 cursor-pointer hover:scale-105 transition"
  />

  <Image
    src="/images/products/kraft-ripple-side.jpg"
    alt=""
    width={200}
    height={200}
    className="rounded-2xl border cursor-pointer hover:scale-105 transition"
  />

  <Image
    src="/images/products/kraft-ripple-top.jpg"
    alt=""
    width={200}
    height={200}
    className="rounded-2xl border cursor-pointer hover:scale-105 transition"
  />

  <Image
    src="/images/products/kraft-ripple-stack.jpg"
    alt=""
    width={200}
    height={200}
    className="rounded-2xl border cursor-pointer hover:scale-105 transition"
  />

</div>
          </div>

          <div>

            <p className="uppercase tracking-[8px] text-green-700 font-bold text-lg">
              Premium Ripple Cup
            </p>

            <h1 className="text-7xl font-black mt-5 leading-tight text-gray-900">
              Kraft Vertical Ripple
            </h1>

            <p className="mt-8 text-2xl text-gray-700 leading-relaxed">
              Premium insulated kraft ripple paper cups manufactured in South
              Africa for cafés, coffee shops, restaurants and premium brands.
            </p>

            <div className="flex gap-5 mt-10">

              <div className="rounded-full border-2 border-green-700 px-8 py-4 text-xl font-bold text-green-700
            ">
                250ml
              </div>

              <div className="rounded-full border-2 border-green-700 px-8 py-4 text-xl font-bold text-green-700">
                350ml
              </div>

            </div>

            <div className="grid grid-cols-2 gap-6 mt-14">

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition">
                <h3 className="text-lg text-gray-500">Material</h3>
                <p className="text-2xl font-black mt-3">Food Grade Paper</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition">
                <h3 className="text-lg text-gray-500">Minimum Order</h3>
                <p className="text-2xl font-black mt-3">1000 Cups</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition">
                <h3 className="text-2xl font-black mt-4 leading-tight text-gray-900">Manufactured</h3>
                <p className="text-2xl font-black mt-5 leading-tight text-gray-900">South Africa</p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8">
                <h3 className="text-lg text-gray-500">Printing</h3>
                <p className="text-2xl font-black mt-3">Custom Available</p>
              </div>

            </div>

            <button className="mt-14 w-full bg-green-700 hover:bg-green-800 text-white py-5 rounded-full text-2xl font-bold transition">
              Request a Quote
            </button>
<section className="mt-20">

  <h2 className="text-4xl font-black text-gray-900 mb-10">
    Product Specifications
  </h2>

  <div className="overflow-hidden rounded-3xl border border-gray-200">

    <table className="w-full text-left">

      <tbody>

        <tr className="border-b">
          <td className="bg-gray-100 p-6 text-xl font-bold">Sizes</td>
          <td className="p-6 text-xl text-green-800">250ml & 350ml</td>
        </tr>

        <tr className="border-b">
          <td className="bg-gray-100 p-6 text-xl font-bold">Material</td>
          <td className="p-6 text-xl text-gray-800">Food Grade Paper + PE Coating</td>
        </tr>

        <tr className="border-b">
          <td className="bg-gray-100 p-6 text-xl font-bold">Cup Type</td>
          <td className="p-6 text-xl text-gray-800">Vertical Ripple</td>
        </tr>

        <tr className="border-b">
          <td className="bg-gray-100 p-6 text-xl font-bold text-green-900">Colour</td>
          <td className="p-6 text-xl text-gray-800">Natural Kraft</td>
        </tr>

       

       

        <tr>
          <td className="bg-gray-100 p-6 text-xl font-bold">Manufactured</td>
          <td className="p-6 text-xl text-gray-800">South Africa</td>
        </tr>

      </tbody>

    </table>

  </div>

</section>
          </div>

        </section>
<section className="mt-24">

  <h2 className="text-5xl font-black text-gray-900 mb-14">
    Why Customers Choose This Cup
  </h2>

  <div className="grid lg:grid-cols-2 gap-8">

    <div className="rounded-[32px] border border-gray-200 p-10 shadow-lg">
      <h3 className="text-3xl font-bold text-green-700 mb-6">
        Superior Heat Insulation
      </h3>

      <p className="text-xl leading-9 text-gray-800">
        The vertical ripple construction provides excellent insulation,
        helping keep beverages hotter for longer while keeping the outside
        comfortable to hold.
      </p>
    </div>

    <div className="rounded-[32px] border border-gray-200 p-10 shadow-lg">
      <h3 className="text-3xl font-bold text-green-700 mb-6">
        Premium Food Grade Materials
      </h3>

      <p className="text-xl leading-9 text-gray-800">
        Manufactured using premium food-grade paper and PE coating for
        strength, durability and excellent beverage performance.
      </p>
    </div>

    <div className="rounded-[32px] border border-gray-200 p-10 shadow-lg">
      <h3 className="text-3xl font-bold text-green-700 mb-6">
        Custom Branding
      </h3>

      <p className="text-xl leading-9 text-gray-800">
        Print your own logo and artwork with vibrant digital printing.
        Perfect for coffee shops, franchises and promotional campaigns.
      </p>
    </div>

    <div className="rounded-[32px] border border-gray-200 p-10 shadow-lg">
      <h3 className="text-3xl font-bold text-green-700 mb-6">
        Manufactured in South Africa
      </h3>

      <p className="text-xl leading-9 text-gray-800">
        Local manufacturing means shorter lead times, reliable supply and
        consistently high quality.
      </p>
    </div>

  </div>

</section>
<Footer />
      </main>
    </>
  );
}