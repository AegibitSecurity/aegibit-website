import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { blogPosts } from "@/content/blog-posts";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Blog", description: "Security insights and enterprise AI research from AEGIBIT." };

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#000] min-h-screen">
        <section className="pt-40 pb-16 px-6 max-w-4xl mx-auto">
          <span className="mono-label text-[#F97316] block mb-6">Blog</span>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-white tracking-tight mb-12">
            Insights &amp; research.
          </h1>

          <div className="divide-y divide-[rgba(255,255,255,0.06)]">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="flex items-start justify-between gap-6 py-8 group hover:bg-[rgba(249,115,22,0.02)] -mx-6 px-6 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {post.tags.slice(0,1).map(t => (
                      <span key={t} className="mono-label text-[#F97316]">{t}</span>
                    ))}
                    <span className="mono-label text-[#3F3F46]">
                      {new Date(post.date).toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"})}
                    </span>
                    <span className="mono-label text-[#3F3F46]">{post.readingTime}m read</span>
                  </div>
                  <h3 className="text-[#A1A1AA] group-hover:text-white font-medium text-base transition-colors leading-snug">
                    {post.title}
                  </h3>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#3F3F46] group-hover:text-[#F97316] flex-shrink-0 mt-1 transition-colors"/>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
