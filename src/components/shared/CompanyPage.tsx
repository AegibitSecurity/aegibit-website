import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { PRODUCT_CATALOG } from "@/content/product-catalog";

export function CompanyPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <><Navbar /><main id="main-content" className="bg-black text-white px-6 pt-36 pb-24"><div className="max-w-6xl mx-auto">
    <header className="max-w-3xl mb-16"><p className="text-orange-400 text-sm uppercase tracking-widest mb-5">{eyebrow}</p><h1 className="text-4xl md:text-6xl font-light leading-tight mb-6">{title}</h1><p className="text-lg leading-relaxed text-zinc-300">{intro}</p></header>
    <div className="space-y-16 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:mb-5 [&_p]:leading-relaxed [&_p]:text-zinc-300 [&_a]:underline-offset-4">{children}</div>
    <section className="mt-20 border-t border-white/10 pt-10"><h2 className="text-2xl mb-4">Discuss your project with AEGIBIT.</h2><p className="text-zinc-300 mb-6">Share the workflow, users, systems and timeline you have in mind.</p><TrackedLink href="/contact" ctaId={`${eyebrow}_contact`} ctaLabel="Discuss a project" ctaSection="company_page" className="inline-block rounded-lg bg-orange-500 text-black font-semibold px-6 py-3">Discuss a project</TrackedLink></section>
  </div></main><Footer /></>;
}
export function ProductCatalog() {
  return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{PRODUCT_CATALOG.map(p => <TrackedLink key={p.id} href={p.href} ctaId={`catalog_${p.id}`} ctaLabel={p.ctaLabel} ctaSection="product_catalog" className="block rounded-xl border border-white/15 bg-zinc-950 p-6 hover:border-orange-400 focus-visible:outline-2 focus-visible:outline-orange-400"><h3 className="text-xl text-white mb-3">{p.name}</h3><p>{p.description}</p><span className="block text-orange-400 mt-5">{p.ctaLabel} →</span></TrackedLink>)}</div>;
}
