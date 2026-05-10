import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Download,
  Hash,
  ShieldCheck,
  ArrowRight,
  Tag,
  CalendarDays,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Aira Changelog — Every Release | AEGIBIT",
  description:
    "Full release history of Aira — AEGIBIT's voice-controlled desktop assistant. Every version, every fix, every new feature. Verify your download with the SHA256 checksum on every release.",
  alternates: { canonical: "/products/aira/changelog" },
  openGraph: {
    title: "Aira Changelog — Every Release",
    description:
      "Every Aira release, indexed. SHA256 checksums included for download verification.",
    type: "website",
    url: "https://www.aegibit.com/products/aira/changelog",
    siteName: "AEGIBIT",
  },
  robots: { index: true, follow: true },
};

// Refresh from GitHub at most once per hour. The Sunday autonomous
// upgrade session typically tags new patches once a week, so 1h is
// fresh enough without burning the GitHub API rate limit.
export const revalidate = 3600;

interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
  digest?: string | null;   // GitHub returns sha256:<hex>
}

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  assets: GitHubAsset[];
}

async function fetchAiraReleases(): Promise<GitHubRelease[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/AegibitSecurity/aegibit-website/releases?per_page=30",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const all = (await res.json()) as GitHubRelease[];
    return all.filter(
      (r) => r.tag_name.startsWith("aira-v") && !r.draft,
    );
  } catch {
    return [];
  }
}

function findInstaller(assets: GitHubAsset[]): GitHubAsset | undefined {
  return (
    assets.find((a) => a.name === "AiraSetup.exe") ??
    assets.find((a) => /AiraSetup-.*\.exe$/.test(a.name))
  );
}

function fmtBytes(n: number): string {
  if (n > 1024 * 1024 * 1024) return `${(n / 1024 / 1024 / 1024).toFixed(1)} GB`;
  if (n > 1024 * 1024) return `${Math.round(n / 1024 / 1024)} MB`;
  if (n > 1024) return `${Math.round(n / 1024)} KB`;
  return `${n} B`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shortSha(digest: string | null | undefined): string | null {
  if (!digest) return null;
  return digest.replace(/^sha256:/, "").slice(0, 12);
}

export default async function AiraChangelogPage() {
  const releases = await fetchAiraReleases();

  return (
    <>
      <Navbar />
      <main style={{ background: "#000" }}>
        {/* HERO */}
        <section
          className="relative pt-32 pb-12 px-6 lg:px-12 overflow-hidden"
          style={{ background: "#000" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(59,130,246,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Link
              href="/products/aira"
              className="inline-flex items-center gap-2 mb-6 text-sm transition-colors"
              style={{ color: "#60A5FA" }}
            >
              <ArrowRight size={14} className="rotate-180" />
              Back to Aira
            </Link>
            <h1
              className="font-light leading-[1.05] tracking-tight mb-6"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                color: "#fff",
              }}
            >
              <span style={{ color: "#EAEAEA" }}>Aira</span>{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #fff 0%, #60A5FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                changelog.
              </span>
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: "#A1A1AA" }}
            >
              Every release, every fix, every new feature — in order. Each
              installer is published with a SHA256 checksum so you can verify
              what you downloaded matches what we shipped.
            </p>
          </div>
        </section>

        {/* RELEASES */}
        <section className="px-6 lg:px-12 pb-24">
          <div className="max-w-3xl mx-auto">
            {releases.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-5">
                {releases.map((r, idx) => (
                  <ReleaseCard
                    key={r.id}
                    release={r}
                    isLatest={idx === 0}
                  />
                ))}
              </div>
            )}

            {/* Verification helper */}
            <div
              className="mt-12 rounded-2xl p-7"
              style={{
                background: "#0D0D0D",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(59,130,246,0.10)",
                    border: "1px solid rgba(59,130,246,0.30)",
                  }}
                >
                  <ShieldCheck
                    size={18}
                    style={{ color: "#60A5FA" }}
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <h3
                    className="text-base font-medium mb-2"
                    style={{ color: "#fff" }}
                  >
                    Verify your download
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: "#A1A1AA" }}
                  >
                    On Windows, open PowerShell where the installer was saved
                    and run:
                  </p>
                  <pre
                    className="text-xs leading-relaxed rounded-lg p-3 overflow-x-auto"
                    style={{
                      background: "#000",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#E4E4E7",
                      fontFamily:
                        'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
                    }}
                  >
                    Get-FileHash AiraSetup.exe -Algorithm SHA256
                  </pre>
                  <p
                    className="text-xs leading-relaxed mt-3"
                    style={{ color: "#71717A" }}
                  >
                    The hash you see must match the SHA256 listed for that
                    version above. If they differ — do not run the installer
                    and email{" "}
                    <a
                      href="mailto:contact@aegibit.com"
                      style={{ color: "#60A5FA" }}
                    >
                      contact@aegibit.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Code-signing transparency */}
            <div
              className="mt-5 rounded-2xl p-7"
              style={{
                background: "rgba(245,158,11,0.05)",
                border: "1px solid rgba(245,158,11,0.20)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(245,158,11,0.10)",
                    border: "1px solid rgba(245,158,11,0.30)",
                  }}
                >
                  <ShieldCheck
                    size={18}
                    style={{ color: "#F59E0B" }}
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <h3
                    className="text-base font-medium mb-2"
                    style={{ color: "#fff" }}
                  >
                    Code signing — transparency note
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#A1A1AA" }}
                  >
                    The installer is currently <strong>unsigned</strong>, which
                    means Windows SmartScreen will display an &ldquo;Unknown
                    publisher&rdquo; prompt the first time you run it. Click{" "}
                    <em>More info → Run anyway</em> to proceed. Your SHA256
                    above is your guarantee that the file is unmodified. We
                    are actively procuring an EV code-signing certificate and
                    will sign every release going forward — track progress on
                    this page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ReleaseCard({
  release,
  isLatest,
}: {
  release: GitHubRelease;
  isLatest: boolean;
}) {
  const installer = findInstaller(release.assets);
  const sha = shortSha(installer?.digest);
  return (
    <article
      className="rounded-2xl p-7 md:p-8"
      style={{
        background: isLatest
          ? "linear-gradient(180deg, rgba(59,130,246,0.08) 0%, #0a0a0a 60%)"
          : "#0D0D0D",
        border: isLatest
          ? "1px solid rgba(59,130,246,0.25)"
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(59,130,246,0.10)",
            border: "1px solid rgba(59,130,246,0.30)",
          }}
        >
          <Tag size={11} style={{ color: "#60A5FA" }} />
          <span
            className="text-[11px] uppercase font-bold"
            style={{ color: "#60A5FA", letterSpacing: "0.12em" }}
          >
            {release.tag_name}
          </span>
        </div>
        <div
          className="inline-flex items-center gap-1.5 text-xs"
          style={{ color: "#71717A" }}
        >
          <CalendarDays size={12} />
          {fmtDate(release.published_at)}
        </div>
        {isLatest && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold"
            style={{
              background: "rgba(16,185,129,0.10)",
              border: "1px solid rgba(16,185,129,0.30)",
              color: "#10B981",
              letterSpacing: "0.12em",
            }}
          >
            Latest
          </span>
        )}
        {release.prerelease && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold"
            style={{
              background: "rgba(245,158,11,0.10)",
              border: "1px solid rgba(245,158,11,0.30)",
              color: "#F59E0B",
              letterSpacing: "0.12em",
            }}
          >
            Pre-release
          </span>
        )}
      </header>

      <h2
        className="text-xl md:text-2xl font-light mb-4"
        style={{ color: "#fff", letterSpacing: "-0.01em" }}
      >
        {release.name ?? release.tag_name}
      </h2>

      {release.body && (
        <div
          className="text-sm leading-relaxed mb-5 whitespace-pre-wrap"
          style={{ color: "#C0C0C7" }}
        >
          {release.body.length > 600
            ? release.body.slice(0, 600) + "…"
            : release.body}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {installer && (
          <a
            href={installer.browser_download_url}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: isLatest
                ? "linear-gradient(135deg, #3B82F6, #1D4ED8)"
                : "rgba(59,130,246,0.10)",
              color: "#fff",
              border: isLatest ? "none" : "1px solid rgba(59,130,246,0.30)",
              boxShadow: isLatest
                ? "0 0 0 1px rgba(59,130,246,0.30), 0 10px 30px rgba(59,130,246,0.20)"
                : "none",
            }}
          >
            <Download size={15} />
            Download · {fmtBytes(installer.size)}
          </a>
        )}
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs"
          style={{ color: "#71717A" }}
        >
          <ExternalLink size={12} />
          View on GitHub
        </a>
        {sha && (
          <div
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: "#71717A" }}
          >
            <Hash size={12} />
            <span style={{ fontFamily: "ui-monospace, monospace" }}>
              sha256:{sha}…
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-2xl p-10 text-center"
      style={{
        background: "#0D0D0D",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <p className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
        We couldn&apos;t reach the GitHub Releases API right now. Visit{" "}
        <a
          href="https://github.com/AegibitSecurity/aegibit-website/releases?q=aira"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#60A5FA" }}
        >
          the releases page directly
        </a>{" "}
        for the latest version.
      </p>
    </div>
  );
}
