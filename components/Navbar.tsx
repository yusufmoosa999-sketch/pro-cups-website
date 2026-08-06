"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}

        <Link href="/" className="text-3xl font-black leading-none">
          <span className="text-black">Pro</span>
          <br />
          <span className="text-green-700">Cups</span>
        </Link>

        {/* Desktop Menu */}

        <div className="hidden lg:flex items-center gap-8 font-semibold">

  <Link
    href="/"
    className="text-black transition hover:text-green-700"
  >
    Home
  </Link>

  <Link
    href="/products"
    className="text-black transition hover:text-green-700"
  >
    Products
  </Link>

  <Link
    href="/gallery"
    className="text-black transition hover:text-green-700"
  >
    Gallery
  </Link>

  <Link
    href="/contact"
    className="text-black transition hover:text-green-700"
  >
    Contact
  </Link>

  <Link
    href="/login"
    className="rounded-full border-2 border-slate-800 px-6 py-3 font-semibold text-slate-800 transition hover:bg-green-700 hover:border-green-700 hover:text-white"
  >
    Login
  </Link>

  <Link
    href="/custom-printing"
    className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
  >
    Get Quote
  </Link>


        </div>

        {/* Mobile Button */}

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden"
        >
          {open ? <X size={34} /> : <Menu size={34} />}
        </button>

      </div>

      {open && (

  <div className="border-t border-slate-200 bg-white shadow-lg lg:hidden">

    <div className="flex flex-col gap-2 px-6 py-6">

      <Link
        href="/"
        onClick={() => setOpen(false)}
        className="rounded-xl px-4 py-4 text-lg font-semibold text-black transition hover:bg-green-50 hover:text-green-700"
      >
        Home
      </Link>

      <Link
        href="/products"
        onClick={() => setOpen(false)}
        className="rounded-xl px-4 py-4 text-lg font-semibold text-black transition hover:bg-green-50 hover:text-green-700"
      >
        Products
      </Link>

      <Link
        href="/gallery"
        onClick={() => setOpen(false)}
        className="rounded-xl px-4 py-4 text-lg font-semibold text-black transition hover:bg-green-50 hover:text-green-700"
      >
        Gallery
      </Link>

      <Link
        href="/contact"
        onClick={() => setOpen(false)}
        className="rounded-xl px-4 py-4 text-lg font-semibold text-black transition hover:bg-green-50 hover:text-green-700"
      >
        Contact
      </Link>

      <div className="mt-4 flex flex-col gap-3">

        <Link
          href="/login"
          onClick={() => setOpen(false)}
          className="rounded-full border-2 border-slate-800 py-4 text-center text-lg font-semibold text-slate-800 transition hover:bg-green-700 hover:border-green-700 hover:text-white"
        >
          Login
        </Link>

        <Link
          href="/custom-printing"
          onClick={() => setOpen(false)}
          className="rounded-full bg-green-700 py-4 text-center text-lg font-semibold text-white transition hover:bg-green-800"
        >
          Get Quote
        </Link>

      </div>

    </div>

  </div>

)}
    </nav>
  );
}