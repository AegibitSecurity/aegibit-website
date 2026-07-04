import { Download } from "lucide-react";
import {
  getAiraDownloads,
  getCounterDownloads,
  getMcpShieldMonthlyDownloads,
  getPayMintDownloadStats,
} from "@/lib/downloads";
import { LiveDownloadCount } from "@/components/shared/LiveDownloadCount";

/**
 * DownloadStats, a slim strip showing the exact, real download count
 * for an app (standing rule: Play-Store-style numbers, never
 * fabricated, live synced 24/7). The server renders the current exact
 * count; LiveDownloadCount then keeps it updating in real time (mount,
 * tab focus, 45s poll while visible) so the number visibly increases
 * the moment anyone downloads. Renders nothing when the source is
 * unreachable, a missing number is more honest than a made-up one.
 */
export async function DownloadStats({ app }: { app: "vestiq" | "aira" | "mcp-shield" | "paymint" }) {
  let count: number | null = null;
  let label = "downloads";
  let source = "";

  if (app === "paymint") {
    const stats = await getPayMintDownloadStats();
    count = stats?.total ?? null;
    label = "Android downloads";
    source = "counted live by AEGIBIT";
  } else if (app === "vestiq") {
    count = await getCounterDownloads("vestiq");
    label = "downloads";
    source = "counted live by AEGIBIT";
  } else if (app === "aira") {
    count = await getAiraDownloads();
    label = "downloads";
    source = "counted by GitHub Releases";
  } else {
    count = await getMcpShieldMonthlyDownloads();
    label = "installs in the last 30 days";
    source = "PyPI public stats";
  }

  if (count === null) return null;

  return (
    <div className="flex justify-center px-6 py-5">
      <div
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Download size={14} style={{ color: "#F97316" }} />
        <span className="text-sm font-semibold" style={{ color: "#fff" }}>
          <LiveDownloadCount app={app} initial={count} />
        </span>
        <span className="text-sm" style={{ color: "#A1A1AA" }}>{label}</span>
        <span className="text-xs" style={{ color: "#52525B" }}>· {source}</span>
        <span className="relative flex h-1.5 w-1.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#10B981" }} />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#10B981" }} />
        </span>
        <span className="text-xs" style={{ color: "#10B981" }}>live</span>
      </div>
    </div>
  );
}
