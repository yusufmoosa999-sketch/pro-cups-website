"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        <Link
          href="/"
          className="text-3xl font-black tracking-tight"
        >
          <span className="text-black">Pro</span>
          <span className="text-green-700"> Cups</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10 font-semibold text-gray-800">

          <Link href="/" className="hover:text-green-700 transition">
            Home
          </Link>

          <Link href="/products" className="hover:text-green-700 transition">
            Products
          </Link>

          <Link href="/custom-printing" className="hover:text-green-700 transition">
            Custom Printing
          </Link>

          <Link href="/gallery" className="hover:text-green-700 transition">
            Gallery
          </Link>

          <Link href="/about" className="hover:text-green-700 transition">
            About
          </Link>

          <Link href="/contact" className="hover:text-green-700 transition">
            Contact
          </Link>

        </nav>

        <div className="flex gap-4">

          <Link
            href="/login"
            className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            Login
          </Link>

          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-green-700 hover:bg-green-800 text-white transition"
          >
            Get Quote
          </Link>

        </div>

      </div>

    </header>
  );
}