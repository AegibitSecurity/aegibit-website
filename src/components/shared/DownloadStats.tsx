import { Download } from "lucide-react";
import {
  getAiraDownloads,
  getCounterDownloads,
  getMcpShieldMonthlyDownloads,
} from "@/lib/downloads";

/**
 * DownloadStats, a slim server-rendered strip showing the exact, real
 * download count for an app (standing rule: Play-Store-style numbers,
 * never fabricated). Renders nothing when the source is unreachable, a
 * missing number is more honest than a made-up one.
 */
export async function DownloadStats({ app }: { app: "vestiq" | "aira" | "mcp-shield" }) {
  let count: number | null = null;
  let label = "downloads";
  let source = "";

  if (app === "vestiq") {
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
          {count.toLocaleString("en-IN")}
        </span>
        <span className="text-sm" style={{ color: "#A1A1AA" }}>{label}</span>
        <span className="text-xs" style={{ color: "#52525B" }}>· {source}</span>
      </div>
    </div>
  );
}
