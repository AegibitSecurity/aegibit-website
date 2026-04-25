import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export const metadata = { title: "Dashboard | AEGIBIT VoiceCore" };

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#040810]">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
