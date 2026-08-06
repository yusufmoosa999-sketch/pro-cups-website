"use client";

import { motion } from "framer-motion";
import { ArrowRight, Upload } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-stone-50 to-amber-50">

      {/* Background Glow */}
      <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-green-100 blur-3xl opacity-50" />
      <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-amber-100 blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto px-6 pt-32 grid lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <span className="uppercase tracking-[0.3em] text-green-700 font-semibold text-sm">
            Premium Paper Cup Manufacturer
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-black leading-tight text-gray-900">
            Premium Paper Cups
            <br />
            Built For
            <span className="text-green-700"> Your Brand.</span>
          </h1>

          <p className="mt-8 text-xl text-gray-600 leading-8 max-w-xl">
            Pro Cups International manufactures premium Ripple and
            Double Wall paper cups in South Africa for cafés, restaurants,
            franchises and corporate brands.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <button className="bg-green-700 hover:bg-green-800 text-white rounded-full px-8 py-4 flex items-center gap-2 transition shadow-lg">
              Request a Quote
              <ArrowRight size={20} />
            </button>

            <button className="border border-gray-300 rounded-full px-8 py-4 flex items-center gap-2 hover:bg-white transition">
              Upload Your Design
              <Upload size={20} />
            </button>

          </div>

          <div className="mt-16 grid grid-cols-3 gap-8">

            <div>
              <h2 className="text-4xl font-black">1000+</h2>
              <p className="text-gray-500 mt-2">Minimum Order</p>
            </div>

            <div>
              <h2 className="text-4xl font-black">5</h2>
              <p className="text-gray-500 mt-2">Cup Styles</p>
            </div>

            <div>
              <h2 className="text-4xl font-black">SA</h2>
              <p className="text-gray-500 mt-2">Manufactured</p>
            </div>

          </div>

        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative flex justify-center"
        >

          <div className="relative w-[420px] h-[520px] rounded-[40px] bg-white shadow-2xl border border-gray-100 overflow-hidden">

            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop"
              alt="Coffee Cup"
              className="w-full h-full object-cover"
            />

          </div>

        </motion.div>

      </div>

    </section>
  );
}