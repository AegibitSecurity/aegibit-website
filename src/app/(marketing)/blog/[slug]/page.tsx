import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { blogPosts } from "@/content/blog-posts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} | AEGIBIT VoiceCore`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.aegibit.com";
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${postUrl}#article`,
        headline: post.title,
        description: post.description,
        url: postUrl,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.title,
        },
        publisher: {
          "@type": "Organization",
          name: "AEGIBIT Security",
          url: SITE_URL,
          logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        keywords: post.tags.join(", "),
        image: `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mono-label text-[#2A2A2A] mb-8">
            <Link href="/" className="hover:text-[#52525B]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#52525B]">Blog</Link>
            <span>/</span>
            <span className="text-[#52525B] truncate">{post.title.slice(0, 40)}…</span>
          </nav>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span key={tag} className="mono-label text-[#FF6A00] border border-[rgba(255,106,0,0.2)] rounded px-2 py-0.5">{tag}</span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-5">{post.title}</h1>

          {/* Meta row */}
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-[rgba(255,255,255,0.06)]">
            <div className="w-9 h-9 rounded-full bg-[rgba(255,106,0,0.15)] border border-[rgba(255,106,0,0.2)] flex items-center justify-center text-[#FF6A00] text-xs font-bold flex-shrink-0">
              {post.author.initials}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{post.author.name}</p>
              <p className="text-[#52525B] text-xs">{post.author.title}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[#52525B] text-xs">{new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
              <p className="text-[#2A2A2A] text-xs">{post.readingTime} min read</p>
            </div>
          </div>

          {/* Body */}
          <article className="space-y-5 mb-14">
            {post.body.map((block, i) => {
              if (block.type === "h2") return <h2 key={i} className="text-2xl font-bold text-white tracking-tight mt-10 mb-3">{block.content as string}</h2>;
              if (block.type === "h3") return <h3 key={i} className="text-lg font-semibold text-white mt-7 mb-2">{block.content as string}</h3>;
              if (block.type === "p")  return <p key={i} className="text-[#A1A1AA] leading-relaxed">{block.content as string}</p>;
              if (block.type === "ul") return (
                <ul key={i} className="space-y-2 ml-1">
                  {(block.content as string[]).map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[#A1A1AA]">
                      <span className="w-1 h-1 rounded-full bg-[#FF6A00] mt-2.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              );
              return null;
            })}
          </article>

          {/* FAQ */}
          <div className="mb-14">
            <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {post.faqs.map((faq, i) => (
                <div key={i} className="border-b border-[rgba(255,255,255,0.06)] pb-5">
                  <h3 className="text-white font-semibold text-sm mb-2">{faq.q}</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Author bio */}
          <div className="p-6 rounded-sm border border-[rgba(255,255,255,0.06)] bg-[#111111] mb-14 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(255,106,0,0.15)] border border-[rgba(255,106,0,0.2)] flex items-center justify-center text-[#FF6A00] font-bold flex-shrink-0">
              {post.author.initials}
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-1">{post.author.name}</p>
              <p className="text-[#52525B] text-xs mb-2">{post.author.title}</p>
              <p className="text-[#A1A1AA] text-xs leading-relaxed">The AEGIBIT Security Research team covers enterprise voice security, Zero Trust architecture, and compliance frameworks for regulated industries across India.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="p-8 rounded-sm border border-[rgba(255,106,0,0.2)] bg-[#111111] mb-14 text-center">
            <p className="mono-label text-[#FF6A00] mb-3">AEGIBIT VOICECORE</p>
            <h3 className="text-xl font-bold text-white mb-2">Ready to secure your voice workflows?</h3>
            <p className="text-[#A1A1AA] text-sm mb-6">Join 50+ enterprise teams. No credit card required.</p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#CC5500] text-white font-semibold px-6 py-3 rounded-md text-sm transition-colors">
              Get Private Access <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Related */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-5">More from the blog</h2>
            <div className="space-y-3">
              {relatedPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="flex items-center justify-between gap-4 p-4 rounded-sm border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] bg-[#0A0A0A] hover:bg-[#111111] transition-all group">
                  <p className="text-[#A1A1AA] group-hover:text-white text-sm transition-colors">{p.title}</p>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2A2A2A] group-hover:text-[#FF6A00] flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
