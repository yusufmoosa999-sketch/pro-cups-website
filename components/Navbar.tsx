"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setLoggedIn(!!user);
        setLoading(false);
      }
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setLoggedIn(!!session?.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();

    setOpen(false);
    setLoggedIn(false);

    window.location.href = "/";
  }

  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex min-h-[88px] max-w-[1500px] items-center justify-between px-5 sm:px-6 lg:px-10">

        {/* LOGO */}

        <Link
          href="/"
          className="text-3xl font-black leading-none"
        >
          <span className="text-black">Pro</span>
          <br />
          <span className="text-green-700">Cups</span>
        </Link>


        {/* DESKTOP MENU */}

        <div className="hidden items-center gap-8 font-semibold lg:flex">

          <Link
            href="/"
            className="text-slate-800 transition hover:text-green-700"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="text-slate-800 transition hover:text-green-700"
          >
            Products
          </Link>

          <Link
            href="/gallery"
            className="text-slate-800 transition hover:text-green-700"
          >
            Gallery
          </Link>

          <Link
            href="/contact"
            className="text-slate-800 transition hover:text-green-700"
          >
            Contact
          </Link>


          {!loading && loggedIn && (
            <Link
              href="/portal"
              className="rounded-full border-2 border-green-700 px-5 py-2.5 text-green-700 transition hover:bg-green-700 hover:text-white"
            >
              My Account
            </Link>
          )}


          {!loading && !loggedIn && (
            <Link
              href="/login"
              className="rounded-full border-2 border-slate-800 px-5 py-2.5 text-slate-800 transition hover:border-green-700 hover:bg-green-700 hover:text-white"
            >
              Login
            </Link>
          )}


          <Link
            href="/custom-printing"
            className="rounded-full bg-green-700 px-6 py-3 text-white transition hover:bg-green-800"
          >
            Get Quote
          </Link>


          {!loading && loggedIn && (
            <button
              type="button"
              onClick={signOut}
              className="text-sm font-semibold text-slate-500 transition hover:text-red-600"
            >
              Logout
            </button>
          )}

        </div>


        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-xl p-2 text-slate-800 transition hover:bg-slate-100 lg:hidden"
        >
          {open ? (
            <X size={34} />
          ) : (
            <Menu size={34} />
          )}
        </button>

      </div>


      {/* MOBILE MENU */}

      {open && (
        <div className="border-t border-slate-100 bg-white shadow-lg lg:hidden">

          <div className="flex flex-col gap-2 px-5 py-6">

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

              {!loading && loggedIn ? (
                <>
                  <Link
                    href="/portal"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-green-700 py-4 text-center text-lg font-bold text-white transition hover:bg-green-800"
                  >
                    My Account
                  </Link>

                  <button
                    type="button"
                    onClick={signOut}
                    className="rounded-full border-2 border-slate-800 py-4 text-center text-lg font-semibold text-slate-800 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border-2 border-slate-800 py-4 text-center text-lg font-semibold text-slate-800 transition hover:border-green-700 hover:bg-green-700 hover:text-white"
                >
                  Login
                </Link>
              )}


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

    </header>
  );
}