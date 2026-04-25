import type { ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4">
      <div className="mb-10"><Logo size="md" /></div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
