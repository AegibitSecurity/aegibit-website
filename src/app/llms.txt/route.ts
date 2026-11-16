import { COMPANY_DESCRIPTION, PRODUCT_CATALOG } from "@/content/product-catalog";
import { SERVICES } from "@/content/services";
export const dynamic = "force-static";
/** Optional plain-text directory. Not a ranking or AI-citation guarantee. */
export function GET() {
 const site = "https://www.aegibit.com";
 const lines = ["# AEGIBIT Global Consulting", "", COMPANY_DESCRIPTION, "", "## Products", ...PRODUCT_CATALOG.map(p => `- [${p.name}](${site}${p.href}): ${p.description}`), "", "## Services", ...SERVICES.map(s => `- [${s.title}](${site}/services/${s.slug}): ${s.intro}`), "", "## Company and project information", ...["about", "work", "case-studies/nibir-motors", "security", "contact", "blog"].map(path => `- ${site}/${path}`), "", "Contact: contact@aegibit.com", "", "Product pages describe their own feature scope and access options. Project scope and support are agreed separately.", ""];
 return new Response(lines.join("\n"), {headers:{"Content-Type":"text/plain; charset=utf-8"}});
}
