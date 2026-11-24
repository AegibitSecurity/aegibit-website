import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export const metadata = { title: "Dashboard | AEGIBIT" };

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <DashboardSidebar />
      <main className="flex-1 min-w-0 overflow-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
