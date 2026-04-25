import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog" };

const POSTS = [
  { title: "Why Zero Trust Voice Is the Next Security Frontier", date: "Apr 18, 2026", tag: "Security", mins: 6 },
  { title: "Voice Biometrics vs. PIN Authentication: A BFSI Comparison", date: "Apr 10, 2026", tag: "Research", mins: 8 },
  { title: "India's DPDP Act 2023: What It Means for AI Voice Data", date: "Apr 2, 2026", tag: "Compliance", mins: 5 },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <SectionHeader label="BLOG" title="Security insights & updates" />
        <div className="mt-12 space-y-5">
          {POSTS.map((post) => (
            <div key={post.title} className="p-6 rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a] hover:border-[rgba(37,99,235,0.3)] transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <span className="mono-label badge-enforced rounded px-2 py-0.5">{post.tag}</span>
                <span className="text-[#374151] text-xs">{post.date}</span>
                <span className="text-[#374151] text-xs">{post.mins} min read</span>
              </div>
              <h3 className="font-semibold text-[#D1D5DB] group-hover:text-[#F9FAFB] transition-colors">{post.title}</h3>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
