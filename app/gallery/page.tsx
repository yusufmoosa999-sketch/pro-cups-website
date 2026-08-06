import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">

        <section className="max-w-7xl mx-auto px-8 py-24">

          <p className="uppercase tracking-[6px] text-green-700 font-semibold">
            Gallery
          </p>

          <h1 className="text-6xl font-black mt-4">
            Our Work
          </h1>

        </section>
<Footer />
      </main>
    </>
  );
}