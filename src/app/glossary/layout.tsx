/**
 * /glossary/*, INDEXABLE as of Sprint 1 (exp-glossary-geo).
 *
 * History: this layout carried an emergency noindex while the glossary
 * was one-paragraph stubs (thin content did us net harm). The rewrite
 * has now shipped: every entry is a full 8-section primer with
 * DefinedTerm + FAQPage schema and real internal links, so the
 * noindex is lifted and the section joins the sitemap. Measurement
 * for the experiment runs via GSC on /glossary/* URLs.
 */
export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
