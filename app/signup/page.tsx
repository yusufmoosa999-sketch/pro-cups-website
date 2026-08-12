"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signUp(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName,
          contact_name: contactName,
          role: "customer",
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    alert("Account created successfully! Please check your email.");

    router.push("/login");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">

        {/* HERO */}

        <section className="relative overflow-hidden bg-slate-950 text-white">

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-green-600/20 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-12 lg:py-24">

            <span className="inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-green-300">
              Customer Registration
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Create Your Account
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Create your Pro Cups account to request quotes, upload
              artwork and manage your orders online.
            </p>

          </div>
        </section>

        {/* SIGNUP */}

        <section className="relative py-16 lg:py-24">

          <div className="mx-auto max-w-lg px-5 sm:px-6">

            {/* MAIN CARD */}

            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:p-10">

              <div className="text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-700 text-2xl font-black text-white shadow-lg shadow-green-700/20">
                  P
                </div>

                <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950">
                  Create Account
                </h2>

                <p className="mt-3 text-base leading-6 text-slate-600">
                  Fill in your details below to get started.
                </p>

              </div>

              <form
                onSubmit={signUp}
                className="mt-10 space-y-6"
              >

                {/* COMPANY */}

                <div>

                  <label
                    htmlFor="companyName"
                    className="mb-2 block text-sm font-bold text-slate-900"
                  >
                    Company Name
                  </label>

                  <input
                    id="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-medium text-slate-950 placeholder:text-slate-500 outline-none transition duration-200 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                    required
                  />

                </div>

                {/* CONTACT */}

                <div>

                  <label
                    htmlFor="contactName"
                    className="mb-2 block text-sm font-bold text-slate-900"
                  >
                    Contact Name
                  </label>

                  <input
                    id="contactName"
                    type="text"
                    placeholder="Enter your full name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-medium text-slate-950 placeholder:text-slate-500 outline-none transition duration-200 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                    required
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-900"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-medium text-slate-950 placeholder:text-slate-500 outline-none transition duration-200 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                    required
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-900"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base font-medium text-slate-950 placeholder:text-slate-500 outline-none transition duration-200 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                    required
                  />

                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Choose a password you will remember for your account.
                  </p>

                </div>

                {/* ERROR */}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
                    {error}
                  </div>
                )}

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-green-700 py-4 text-base font-bold text-white shadow-lg shadow-green-700/20 transition duration-200 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

              </form>

              {/* LOGIN LINK */}

              <div className="mt-8 border-t border-slate-200 pt-6 text-center">

                <p className="text-sm text-slate-600">
                  Already have an account?
                </p>

                <Link
                  href="/login"
                  className="mt-2 inline-block font-bold text-green-700 transition hover:text-green-800 hover:underline"
                >
                  Sign In
                </Link>

              </div>

            </div>

            {/* BENEFITS */}

            <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-7 shadow-lg">

              <h3 className="text-xl font-black text-slate-950">
                Your Account Includes
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Manage your Pro Cups projects from one convenient place.
              </p>

              <ul className="mt-6 space-y-4">

                <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    ✓
                  </span>
                  Submit quote requests online
                </li>

                <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    ✓
                  </span>
                  Upload artwork files
                </li>

                <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    ✓
                  </span>
                  Track your quote progress
                </li>

                <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    ✓
                  </span>
                  View previous enquiries
                </li>

                <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    ✓
                  </span>
                  Faster repeat orders
                </li>

              </ul>

            </div>

          </div>

        </section>

        <Footer />

      </main>
    </>
  );
}