// Programmatic SEO pages: industry, city, platform combinations. Tier T0.
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadConfig, loadState, saveState, log, withJob, slugify } from "./_lib.mjs";

const ARG_COUNT = (() => {
  const a = process.argv.find((x) => x.startsWith("--count="));
  return a ? parseInt(a.split("=")[1], 10) : 5;
})();

await withJob("generate-seo-pages", async () => {
  const cfg = loadConfig();
  const state = loadState();
  const generated = new Set(state.metrics?.generatedSeoPages || []);

  const candidates = [];
  for (const industry of cfg.content.industries) {
    candidates.push({ type: "industry-website", key: `website-development-for-${slugify(industry)}`, title: `Secure Website Development for ${industry} | AEGIBIT`, h1: `${industry} Website Development — Built Secure by Default`, subject: industry, route: `services/website-development-for-${slugify(industry)}` });
    candidates.push({ type: "industry-app", key: `app-development-for-${slugify(industry)}`, title: `${industry} Mobile App Development | AEGIBIT`, h1: `${industry} App Development with Built-in Security`, subject: industry, route: `services/app-development-for-${slugify(industry)}` });
  }
  for (const city of cfg.content.cities) {
    candidates.push({ type: "city", key: `website-development-${slugify(city)}`, title: `Website Development Company in ${city} | AEGIBIT`, h1: `Website Development in ${city} — Security-First`, subject: city, route: `locations/website-development-${slugify(city)}` });
  }
  for (const platform of cfg.content.platforms) {
    candidates.push({ type: "platform", key: `${slugify(platform)}-app-development`, title: `${platform} App Development | AEGIBIT`, h1: `${platform} App Development with Enterprise Security`, subject: platform, route: `services/${slugify(platform)}-app-development` });
  }

  const todo = candidates.filter((c) => !generated.has(c.key)).slice(0, ARG_COUNT);
  if (todo.length === 0) { log("generate-seo-pages", "Queue exhausted"); return; }

  for (const page of todo) {
    const dir = path.join(ROOT, "src", "app", ...page.route.split("/"));
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, "page.tsx");
    if (fs.existsSync(filePath)) continue;

    const flavor = page.type === "city" ? `for businesses in ${page.subject}` :
                   page.type === "platform" ? `using ${page.subject}` :
                   `for ${page.subject} companies`;

    fs.writeFileSync(filePath, `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ${JSON.stringify(page.title)},
  description: "AEGIBIT delivers secure, scalable software ${flavor}. SOC 2 ready, OWASP-tested, deployed in weeks.",
  alternates: { canonical: "/${page.route}" },
  openGraph: {
    title: ${JSON.stringify(page.title)},
    description: "Secure software ${flavor}. Built by a cybersecurity company.",
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm uppercase tracking-widest text-orange-400">
          ${page.type === "city" ? "Local Service" : page.type === "platform" ? "Platform Expertise" : "Industry Specialist"}
        </p>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight">
          ${page.h1}
        </h1>
        <p className="mt-6 text-xl text-white/70 max-w-2xl">
          AEGIBIT is a cybersecurity-first software company. We build websites, apps, and SaaS
          platforms ${flavor} with security, compliance, and performance baked in from day one.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="/contact" className="rounded-md bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400">
            Get a Free Security Audit
          </a>
          <a href="/pricing" className="rounded-md border border-white/20 px-6 py-3 font-semibold hover:bg-white/5">
            See Pricing
          </a>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-semibold">OWASP-Hardened</h2>
            <p className="mt-2 text-white/60">Every project is tested against the OWASP Top 10 before delivery.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">SOC 2 Ready</h2>
            <p className="mt-2 text-white/60">Audit-ready logging, RBAC, and secret management from day one.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Production in Weeks</h2>
            <p className="mt-2 text-white/60">Most ${page.subject} projects ship in 4–8 weeks, not quarters.</p>
          </div>
        </div>

        <div className="mt-20 rounded-xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold">Why ${page.subject} ${page.type === "city" ? "businesses" : "companies"} choose AEGIBIT</h2>
          <ul className="mt-6 space-y-3 text-white/70">
            <li>— Security-first development from a dedicated cybersecurity team</li>
            <li>— Compliance-ready architectures (SOC 2, GDPR, HIPAA where applicable)</li>
            <li>— Direct access to senior engineers, not account managers</li>
            <li>— Fixed-price packages starting at $499/mo or $4,999 one-time</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
`);
    log("generate-seo-pages", `Created ${filePath}`);
    generated.add(page.key);
  }

  state.metrics ??= {};
  state.metrics.generatedSeoPages = [...generated];
  state.metrics.pagesGenerated = (state.metrics.pagesGenerated || 0) + todo.length;
  saveState(state);
  log("generate-seo-pages", `Generated ${todo.length} pages`);
});
