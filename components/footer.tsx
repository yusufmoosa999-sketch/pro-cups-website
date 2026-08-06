import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white mt-32">

      <div className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-4 gap-14">

        <div>
          <h2 className="text-4xl font-black text-green-400">
            PRO CUPS
          </h2>

          <p className="mt-6 text-lg text-gray-300 leading-8">
            Premium paper cup manufacturer based in South Africa.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6">Products</h3>

          <div className="space-y-4 text-lg">

            <Link href="/products">Vertical Ripple</Link><br/>

            <Link href="/products">Double Wall</Link><br/>

            <Link href="/custom-printing">Custom Printing</Link>

          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6">Company</h3>

          <div className="space-y-4 text-lg">

            <Link href="/about">About Us</Link><br/>

            <Link href="/gallery">Gallery</Link><br/>

            <Link href="/contact">Contact</Link>

          </div>
        </div>

        <div>

          <h3 className="text-2xl font-bold mb-6">
            Contact
          </h3>

          <div className="space-y-5 text-lg text-gray-300">

            <p>Durban, South Africa</p>

            <p>sales@procupsinternational.com</p>

            <p>www.procupsinternational.com</p>

          </div>

        </div>

      </div>

      <div className="border-t border-gray-700">

        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between text-gray-400">

          <p>© 2026 Pro Cups International</p>

          <p>Manufactured in South Africa 🇿🇦</p>

        </div>

      </div>

    </footer>
  );
}