import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Trust & Security", description: "Verify AEGIBIT's business identity, review website security controls and understand how project enquiries are handled.", path: "/security" });

const CONTROLS = [
  { title: "Encrypted connections and browser protections", body: "This website uses HTTPS. Its configuration includes HSTS, a Content Security Policy, clickjacking protection and restrictions on camera, microphone and location access. These controls reduce specific risks; they do not make any website immune to attack.", file: "next.config.ts" },
  { title: "Protected administration", body: "Administrative routes require a session. The application uses encrypted, HttpOnly session cookies, Secure cookies in production and scrypt password hashing. Administrative credentials stay on the server.", file: "src/lib/auth.ts" },
  { title: "Limits on public forms and chat", body: "Public endpoints validate input and apply request limits. The limiter supports shared Redis counters, with an in-memory fallback. Limits reduce automated abuse but are not a guarantee against every attack.", file: "src/lib/rate-limiter.ts" },
  { title: "A clear choice before human follow-up", body: "Aira identifies itself as an AI assistant. Chat handoff requires permission to share your questions and contact details with the team. That permission does not subscribe you to a marketing sequence. Avoid sharing passwords, payment details or confidential records in chat.", file: "src/components/conversion/ChatWidget.tsx" },
];

export default function SecurityPage() {
  return <><Navbar /><main id="main-content" className="bg-black text-white px-6 pt-36 pb-24">
    <div className="max-w-5xl mx-auto">
      <p className="text-orange-400 uppercase tracking-widest text-sm mb-5">Trust &amp; security</p>
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">Know who you are working with.</h1>
      <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl">Choose AEGIBIT with information you can check: our business identity, project work, website controls and the terms of your engagement.</p>
      <section className="mt-12 rounded-2xl border border-white/15 p-7">
        <h2 className="text-2xl font-semibold mb-4">Verify the business</h2>
        <p className="text-zinc-300 leading-relaxed">AEGIBIT Global Consulting is based in Kolkata, India. Our published MSME registration number is <strong className="text-white">UDYAM-WB-10-0209203</strong>. Use the official Udyam portal to verify the record or request business documentation from contact@aegibit.com.</p>
        <p className="text-zinc-400 mt-4">Business registration identifies the enterprise. It is not a security certification or a government endorsement of our products.</p>
        <div className="flex flex-wrap gap-5 mt-6"><a href="https://udyamregistration.gov.in/Udyam_Verify.aspx" className="text-orange-300 underline">Verify on the official Udyam portal</a><Link href="/work" className="text-orange-300 underline">Explore client work</Link><Link href="/contact" className="text-orange-300 underline">Request business details</Link></div>
      </section>
      <section className="mt-16">
        <h2 className="text-3xl font-semibold mb-4">How this website protects an enquiry</h2>
        <p className="text-zinc-300 mb-8">These are controls in the marketing website. A customer application has its own configuration and should be assessed against your requirements.</p>
        <div className="grid md:grid-cols-2 gap-6">{CONTROLS.map(c => <article key={c.title} className="rounded-2xl border border-white/10 bg-zinc-950 p-7"><h3 className="text-xl font-semibold mb-3">{c.title}</h3><p className="text-zinc-300 leading-relaxed">{c.body}</p><a href={`https://github.com/AegibitSecurity/aegibit-website/blob/main/${c.file}`} className="inline-block mt-5 text-orange-300 underline">Review the implementation</a></article>)}</div>
      </section>
      <section className="mt-16 grid md:grid-cols-2 gap-8">
        <div><h2 className="text-2xl font-semibold mb-4">Agree the details before delivery</h2><p className="text-zinc-300 leading-relaxed">Scope, milestones, acceptance criteria, ownership, hosting, access permissions, backups and support should be agreed in writing for your project. International enquiries are welcome; currency, time-zone coverage and data-location requirements are confirmed during scoping.</p></div>
        <div><h2 className="text-2xl font-semibold mb-4">Security status, stated clearly</h2><p className="text-zinc-300 leading-relaxed">We do not claim SOC 2 or ISO 27001 certification, or 100% security. If procurement needs an audit report or a specific certification, ask for the exact evidence before committing. Website controls alone do not establish compliance for your business.</p></div>
      </section>
      <section className="mt-16 rounded-2xl border border-white/15 p-7">
        <h2 className="text-2xl font-semibold mb-4">Your data and your next step</h2>
        <p className="text-zinc-300 leading-relaxed">Read our privacy policy for the information collected, service providers and contact details for data requests. To report a security concern, email contact@aegibit.com with the subject “Security Disclosure” and the affected URL. Do not include real customer records or credentials.</p>
        <div className="flex flex-wrap gap-5 mt-6"><Link href="/privacy" className="text-orange-300 underline">Read the privacy policy</Link><Link href="/contact" className="rounded-lg bg-orange-500 text-black font-semibold px-5 py-3">Discuss your requirements</Link></div>
      </section>
    </div>
  </main><Footer /></>;
}
