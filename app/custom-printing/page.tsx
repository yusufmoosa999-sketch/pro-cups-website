import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import ArtworkUpload from "@/components/ArtworkUpload";

export default function CustomPrinting() {
  return (
    <>
      <Navbar />

      <main className="bg-white">

        {/* HERO */}

        <section className="bg-[#0f172a] text-white py-28">

          <div className="max-w-7xl mx-auto px-8">

            <p className="uppercase tracking-[8px] text-green-400 font-bold text-lg">
              CUSTOM PRINTING
            </p>

            <h1 className="text-7xl font-black mt-6 leading-tight">
              Your Brand.
              <br />
              Your Cup.
            </h1>

            <p className="mt-8 text-3xl text-gray-300 max-w-4xl leading-relaxed">
              Custom printed paper cups manufactured in South Africa from as little as 1,000 cups.
            </p>

          </div>

        </section>

        {/* IMAGE */}

        <section className="max-w-7xl mx-auto px-8 py-24">

          <Image
            src="/images/custom-printing.jpg"
            alt="Custom Printing"
            width={1400}
            height={800}
            className="rounded-[40px] w-full shadow-2xl"
          />

        </section>

        {/* STEPS */}

        <section className="max-w-7xl mx-auto px-8 pb-24">

          <h2 className="text-6xl font-black text-center text-gray-900 mb-20">
            How It Works
          </h2>

          <div className="grid lg:grid-cols-5 gap-8">

            {[
              ["01", "Choose your cup"],
              ["02", "Upload your logo"],
              ["03", "Approve artwork"],
              ["04", "Manufacturing"],
              ["05", "Delivery"],
            ].map(([number, title]) => (

              <div
                key={number}
                className="rounded-[30px] border border-gray-200 p-10 hover:shadow-xl transition"
              >

                <div className="text-6xl font-black text-green-700">
                  {number}
                </div>

                <h3 className="mt-8 text-3xl font-black text-gray-900">
                  {title}
                </h3>

              </div>

            ))}

          </div>

        </section>

      </main>
<ArtworkUpload />
      <Footer />

    </>
  );
}