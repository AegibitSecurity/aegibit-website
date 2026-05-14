"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Logo } from "@/components/shared/Logo";
import { BarChart3, Users, Mail, Settings, Home, Sparkles, Send, Menu, X, GitBranch, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Close-on-navigate sidebar.
 *
 * Previous shape did `useEffect(() => setOpen(false), [pathname])` —
 * which trips react-hooks/set-state-in-effect (cascading-render
 * anti-pattern). Rewritten using React's documented "derive state
 * during render" pattern: track the last-seen pathname in state,
 * and when it differs from the current pathname, reschedule a render
 * with `open=false`. React batches this so the visitor sees one
 * render with the closed state, not two.
 *
 * Reference:
 *   https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 */

const NAV = [
  { href: "/dashboard",            icon: Home,      label: "Overview" },
  { href: "/dashboard/aira",       icon: Sparkles,  label: "Aira Ops" },
  { href: "/dashboard/funnel",     icon: GitBranch, label: "Funnel" },
  { href: "/dashboard/agents",     icon: Bot,       label: "Agents" },
  { href: "/dashboard/outbound",   icon: Send,      label: "Outbound" },
  { href: "/dashboard/leads",      icon: Mail,      label: "Leads" },
  { href: "/dashboard/visitors",   icon: Users,     label: "Visitors" },
  { href: "/dashboard/analytics",  icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/settings",   icon: Settings,  label: "Settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Derived-state-during-render: close the mobile sidebar when route
  // changes. React batches the two setState calls into a single render
  // and the lint rule (which targets effects, not render) is satisfied.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Mobile header bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 bg-[#070d1a] border-b border-[rgba(37,99,235,0.15)]">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#D1D5DB] hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Logo size="sm" />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 border-r border-[rgba(37,99,235,0.15)] bg-[#070d1a] flex flex-col w-56",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out",
          "md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-[rgba(37,99,235,0.15)] flex items-center justify-between">
          <div>
            <Logo size="sm" />
            <p className="mono-label text-[#374151] mt-1">Admin Panel</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#6B7280] hover:text-[#D1D5DB] hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
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
    </>
  );
}
