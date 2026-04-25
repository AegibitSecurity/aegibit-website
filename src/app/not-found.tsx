import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-[#000] min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="mono-label text-[#F97316] mb-4">404</p>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Page not found.</h1>
        <p className="text-[#52525B] mb-8 max-w-xs">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="text-sm font-semibold text-white bg-[#F97316] hover:opacity-90 px-6 py-3 rounded-xl transition-all">
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
