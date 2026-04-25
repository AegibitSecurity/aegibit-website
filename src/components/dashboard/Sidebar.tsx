"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { BarChart3, Users, Mail, Settings, Home, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",            icon: Home,      label: "Overview" },
  { href: "/dashboard/visitors",   icon: Users,     label: "Visitors" },
  { href: "/dashboard/analytics",  icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/leads",      icon: Mail,      label: "Leads" },
  { href: "/dashboard/settings",   icon: Settings,  label: "Settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-[rgba(37,99,235,0.15)] bg-[#070d1a] flex flex-col">
      <div className="p-5 border-b border-[rgba(37,99,235,0.15)]">
        <Logo size="sm" />
        <p className="mono-label text-[#374151] mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-[rgba(37,99,235,0.15)] text-[#60A5FA] border border-[rgba(37,99,235,0.25)]"
                  : "text-[#6B7280] hover:text-[#D1D5DB] hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[rgba(37,99,235,0.15)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="ping-green absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="text-xs text-[#6B7280]">Live tracking active</span>
        </div>
      </div>
    </aside>
  );
}
