import Link from "next/link";

const REASONS = [
  { title: "Experience with the work behind the screen", body: "Branch requests, approvals, vouchers and payment records are part of our PayMint work for Nibir Motors. That gives you a concrete workflow to discuss, not just a list of technologies.", href: "/case-studies/nibir-motors", link: "Explore the Nibir Motors workflow" },
  { title: "A product or a custom build, based on fit", body: "Explore PayMint, Cortex and our other products before scoping a custom application. Compare what already fits with what your team needs, then define the gaps before committing to development.", href: "/features", link: "Compare our product portfolio" },
  { title: "Clear responsibilities before more features", body: "Who submits, who approves, who can see a record, and what happens when something goes wrong? Our service scope starts with those questions so the proposed system reflects how your team works.", href: "/services/custom-business-software", link: "See how we scope a project" },
];

export function WhatWeDo() {
  return <section aria-labelledby="why-aegibit" className="py-24 px-6 border-t border-white/10">
    <div className="max-w-7xl mx-auto">
      <p className="text-orange-400 text-sm uppercase tracking-widest mb-4">Why choose AEGIBIT</p>
      <h2 id="why-aegibit" className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl mb-6">Software shaped around your operations.</h2>
      <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl mb-12">AEGIBIT Global Consulting is a Kolkata-based software business building applications and websites for growing teams. Our focus: translate the way your people request, approve, sell and record work into software they can use. Our product experience and client projects give you concrete work to assess before you choose us.</p>
      <div className="grid md:grid-cols-3 gap-6">{REASONS.map(reason => <article key={reason.title} className="rounded-2xl border border-white/15 bg-zinc-950 p-7 flex flex-col">
        <h3 className="text-xl font-semibold text-white mb-4">{reason.title}</h3><p className="text-zinc-300 leading-relaxed mb-6">{reason.body}</p><Link href={reason.href} className="mt-auto text-orange-400 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-400">{reason.link}</Link>
      </article>)}</div>
      <div className="mt-10 rounded-2xl border border-white/10 p-7 md:p-9">
        <h3 className="text-xl font-semibold mb-4">Start with one problem you can describe.</h3>
        <p className="text-zinc-300 leading-relaxed max-w-4xl">A delayed approval, duplicate data entry or a website that does not explain your offer is a useful starting point. Bring the current process, the people involved and what a better result would look like. Scope, integrations, ownership, hosting and support should be agreed before work begins.</p>
        <Link href="/contact" className="inline-block mt-6 rounded-lg bg-orange-500 text-black font-semibold px-6 py-3">Discuss your workflow</Link>
      </div>
    </div>
  </section>;
}
