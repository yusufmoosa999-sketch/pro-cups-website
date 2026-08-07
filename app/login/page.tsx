"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">

        <section className="bg-slate-900 py-16 text-white lg:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
              Customer Portal
            </span>

            <h1 className="mt-6 text-4xl font-black sm:text-5xl lg:text-6xl">
              Welcome Back
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Sign in to access your Pro Cups account, manage quote
              requests and track your orders.
            </p>

          </div>

        </section>

        <section className="py-16 lg:py-24">

          <div className="mx-auto max-w-md px-5 sm:px-6">

            <div className="rounded-[32px] bg-white p-8 shadow-xl lg:p-10">

              <h2 className="text-center text-3xl font-black text-black">
                Login
              </h2>

              <p className="mt-3 text-center text-slate-600">
                Enter your email address and password below.
              </p>

              <form
                onSubmit={signIn}
                className="mt-10 space-y-6"
              >

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-green-700"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-green-700"
                  required
                />
                                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-green-700 py-4 text-lg font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

              </form>

              <div className="mt-8 flex flex-col gap-4 text-center">

                <Link
                  href="/forgot-password"
                  className="font-medium text-green-700 transition hover:text-green-800"
                >
                  Forgot your password?
                </Link>

                <div className="text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-bold text-green-700 hover:text-green-800"
                  >
                    Create Account
                  </Link>
                </div>

              </div>

            </div>

            <div className="mt-8 rounded-[28px] bg-white p-6 shadow-lg">

              <h3 className="text-xl font-black text-black">
                Why create an account?
              </h3>

              <ul className="mt-5 space-y-3 text-slate-700">

                <li>✓ View your quote requests</li>

                <li>✓ Track quote progress</li>

                <li>✓ Manage artwork uploads</li>

                <li>✓ Faster future orders</li>

              </ul>

            </div>

          </div>

        </section>

        <Footer />

      </main>

    </>
  );
}