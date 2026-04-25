"use client";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linkHref?: string;
}

const sizes = {
  sm: { icon: 22, text: "text-base" },
  md: { icon: 28, text: "text-lg" },
  lg: { icon: 36, text: "text-2xl" },
};

export function Logo({ size = "md", linkHref = "/" }: LogoProps) {
  const { icon, text } = sizes[size];

  const content = (
    <div className="flex items-center gap-2.5 select-none">
      {/* Orange shield mark matching brand logo */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 2L4 9V22C4 31.9 11.1 41.1 20 43C28.9 41.1 36 31.9 36 22V9L20 2Z"
          fill="#FF6A00"
        />
        <path
          d="M20 2L4 9V22C4 31.9 11.1 41.1 20 43"
          fill="#CC5500"
          opacity="0.4"
        />
        <path
          d="M20 12V26M14 18H26"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>

      <span
        className={`font-bold tracking-tight ${text} text-white`}
        style={{ fontFamily: "var(--font-sora, sans-serif)", letterSpacing: "-0.02em" }}
      >
        AEGIBIT
      </span>
    </div>
  );

  return linkHref ? <Link href={linkHref}>{content}</Link> : content;
}
