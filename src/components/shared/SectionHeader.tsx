import { TextReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/motion/FadeIn";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  labelDelay?: number;
  titleDelay?: number;
  subtitleDelay?: number;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  centered = true,
  labelDelay = 0,
  titleDelay = 0.15,
  subtitleDelay = 0.3,
}: SectionHeaderProps) {
  return (
    <div className={`space-y-4 ${centered ? "text-center" : ""}`}>
      {label && (
        <FadeIn delay={labelDelay} direction="up">
          <span className="mono-label text-[#60A5FA]">{label}</span>
        </FadeIn>
      )}
      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F9FAFB] leading-tight tracking-tight ${centered ? "mx-auto" : ""}`}>
        <TextReveal text={title} delay={titleDelay} stagger={0.04} />
      </div>
      {subtitle && (
        <FadeIn delay={subtitleDelay} direction="up">
          <p className={`text-[#6B7280] text-lg leading-relaxed ${centered ? "max-w-2xl mx-auto" : "max-w-xl"}`}>
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
