import Link from "next/link";
import { CompanyPage } from "@/components/shared/CompanyPage";
import { SERVICES } from "@/content/services";
import { buildMetadata, SITE_URL } from "@/lib/seo";
const service = SERVICES.find(s => s.slug === "custom-business-software")!;
export const metadata = buildMetadata({ title: service.title, description: service.intro, path: "/services/custom-business-software" });
export default function Page() {
const schema = { "@context": "https://schema.org", "@type": "Service", name: service.title, description: service.intro, url: `${SITE_URL}/services/custom-business-software`, provider: { "@type": "Organization", name: "AEGIBIT Global Consulting", url: SITE_URL } };
return <CompanyPage eyebrow="Services" title={service.title} intro={service.intro}><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema).replace(/</g, "\\u003c")}} />{service.sections.map(s => <section key={s.title} className="max-w-3xl"><h2>{s.title}</h2><p>{s.body}</p></section>)}<section><h2>Related work and products</h2><div className="flex flex-wrap gap-6 text-orange-400"><Link className="underline" href="/case-studies/nibir-motors">Nibir Motors project</Link><Link className="underline" href="/products/paymint">PayMint</Link><Link className="underline" href="/products/cortex">Cortex</Link></div></section></CompanyPage>; }
