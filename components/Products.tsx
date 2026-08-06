"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const products = [
  {
    title: "Kraft Vertical Ripple",
    size: "250ml & 350ml",
    image: "/images/products/kraft-ripple.jpg",
  },
  {
    title: "Black Vertical Ripple",
    size: "250ml & 350ml",
    image: "/images/products/black-ripple.jpg",
  },
  {
    title: "Coffee Bean Vertical Ripple",
    size: "250ml & 350ml",
    image: "/images/products/coffee-bean-ripple.jpg",
  },
  {
    title: "Kraft Double Wall",
    size: "250ml & 350ml",
    image: "/images/products/kraft-double-wall.jpg",
  },
  {
    title: "White Double Wall",
    size: "250ml & 350ml",
    image: "/images/products/white-double-wall.jpg",
  },
];

export default function Products() {
  return (
    <section className="py-28 bg-[#f8f8f8]">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <p className="uppercase tracking-[0.3em] text-green-700 font-semibold text-sm">
            Our Product Range
          </p>

          <h2 className="text-5xl font-black mt-4">
            Premium Paper Cups
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto text-lg">
            Manufactured in South Africa using premium food-grade materials for cafés,
            restaurants, franchises and corporate brands.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

          {products.map((product, index) => (

            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >

              <div className="relative h-80">

                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-8">

                <h3 className="text-2xl font-bold">
                  {product.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  {product.size}
                </p>

                <button className="mt-8 bg-green-700 hover:bg-green-800 text-white rounded-full px-6 py-3 transition">
                  View Product
                </button>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}