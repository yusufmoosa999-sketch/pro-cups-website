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

        <div className="hidden lg:flex items-center gap-8 font-medium">

          <Link href="/">Home</Link>

          <Link href="/products">Products</Link>

          <Link href="/gallery">Gallery</Link>

          <Link href="/contact">Contact</Link>

          <Link
            href="/login"
            className="rounded-full border border-green-700 px-6 py-3"
          >
            Login
          </Link>

          <Link
            href="/custom-printing"
            className="rounded-full bg-green-700 px-6 py-3 text-white"
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

        <div className="border-t bg-white lg:hidden">

          <div className="flex flex-col px-6 py-5 gap-5">

            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            <Link href="/products" onClick={() => setOpen(false)}>
              Products
            </Link>

            <Link href="/gallery" onClick={() => setOpen(false)}>
              Gallery
            </Link>

            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>

            <Link
              href="/custom-printing"
              onClick={() => setOpen(false)}
              className="rounded-full bg-green-700 py-3 text-center text-white"
            >
              Get Quote
            </Link>

          </div>

        </div>

      )}
    </nav>
  );
}