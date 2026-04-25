import { SectionHeader } from "@/components/shared/SectionHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FadeIn } from "@/components/motion/FadeIn";
import { FAQS } from "@/lib/constants";

export function FAQSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070d1a] border-t border-[rgba(37,99,235,0.1)]">
      <div className="max-w-3xl mx-auto">
        <SectionHeader label="FAQ" title="Frequently asked questions" />
        <FadeIn delay={0.2} className="mt-12">
          <Accordion className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={i}
                className="border border-[rgba(37,99,235,0.15)] rounded-xl bg-[rgba(4,8,16,0.6)] px-5 data-[state=open]:border-[rgba(37,99,235,0.35)] transition-colors"
              >
                <AccordionTrigger className="text-[#D1D5DB] hover:text-[#F9FAFB] text-sm font-medium text-left py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#6B7280] text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
