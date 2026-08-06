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

        <section className="bg-slate-900 py-16 text-white lg:py-24">

          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12">

            <span className="inline-block rounded-full bg-green-700/20 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-green-300">
              Customer Registration
            </span>

            <h1 className="mt-6 text-4xl font-black sm:text-5xl lg:text-6xl">
              Create Your Account
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Create your Pro Cups account to request quotes, upload
              artwork and manage your orders online.
            </p>

          </div>

        </section>

        <section className="py-16 lg:py-24">

          <div className="mx-auto max-w-lg px-5 sm:px-6">

            <div className="rounded-[32px] bg-white p-8 shadow-xl lg:p-10">

              <h2 className="text-center text-3xl font-black text-black">
                Create Account
              </h2>

              <p className="mt-3 text-center text-slate-600">
                Fill in your details below to get started.
              </p>

              <form
                onSubmit={signUp}
                className="mt-10 space-y-6"
              >

                <input
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-green-700"
                  required
                />

                <input
                  placeholder="Contact Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-green-700"
                  required
                />

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
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

              </form>

              <div className="mt-8 text-center">

                <p className="text-slate-600">
                  Already have an account?
                </p>

                <Link
                  href="/login"
                  className="mt-3 inline-block font-bold text-green-700 transition hover:text-green-800"
                >
                  Sign In
                </Link>

              </div>

            </div>

            <div className="mt-8 rounded-[28px] bg-white p-6 shadow-lg">

              <h3 className="text-xl font-black text-black">
                Your Account Includes
              </h3>

              <ul className="mt-5 space-y-3 text-slate-700">

                <li>✓ Submit quote requests online</li>

                <li>✓ Upload artwork files</li>

                <li>✓ Track your quote progress</li>

                <li>✓ View previous enquiries</li>

                <li>✓ Faster repeat orders</li>

              </ul>

            </div>

          </div>

        </section>

        <Footer />

      </main>

    </>
  );
}