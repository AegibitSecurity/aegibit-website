"use client";
import { useEffect, useState } from "react";
import { Users, TrendingUp, Mail, Activity, type LucideIcon } from "lucide-react";

interface Stats {
  totalVisitors: number;
  activeNow: number;
  totalLeads: number;
  conversionRate: string;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: LucideIcon; color: string }) {
  return (
    <div className="p-6 rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#6B7280] text-sm">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#F9FAFB]">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalVisitors: 0, activeNow: 0, totalLeads: 0, conversionRate: "0.0" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics", {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_DASHBOARD_TOKEN ?? ""}` },
    })
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#F9FAFB]">Overview</h1>
        <p className="text-[#6B7280] text-sm mt-1">Real-time visitor and lead intelligence</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Visitors Today" value={loading ? "..." : stats.totalVisitors} icon={Users} color="#2563EB" />
        <StatCard label="Active Now" value={loading ? "..." : stats.activeNow} icon={Activity} color="#10B981" />
        <StatCard label="Leads Today" value={loading ? "..." : stats.totalLeads} icon={Mail} color="#06B6D4" />
        <StatCard label="Conversion Rate" value={loading ? "..." : `${stats.conversionRate}%`} icon={TrendingUp} color="#8B5CF6" />
      </div>

      <div className="rounded-xl border border-[rgba(37,99,235,0.15)] bg-[#070d1a] p-6">
        <h2 className="font-semibold text-[#F9FAFB] mb-4">Recent Activity</h2>
        <p className="text-[#6B7280] text-sm">
          Connect Supabase to see live visitor events and lead submissions here.
        </p>
        <p className="text-[#374151] text-xs mt-2 font-mono">
          Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and DASHBOARD_SECRET in .env.local
        </p>
      </div>
    </div>
  );
}
