import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";

export const metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;
  const session = await getAdminSession().catch(() => null);
  if (session?.admin) {
    redirect(params.from && params.from.startsWith("/") ? params.from : "/dashboard");
  }

  const errorMessage =
    params.error === "invalid"
      ? "Incorrect password."
      : params.error === "config"
        ? "Server is missing SESSION_SECRET or ADMIN_PASSWORD_HASH."
        : params.error === "rate"
          ? "Too many attempts. Try again in a minute."
          : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex items-center gap-2 justify-center">
          <div className="w-8 h-8 rounded-md bg-black inline-flex items-center justify-center border border-orange-500/40">
            <span className="text-orange-500 text-lg font-bold">✓</span>
          </div>
          <span className="text-base font-light tracking-[0.18em]">
            <span className="text-white">AEGI</span>
            <span className="text-orange-500">BIT</span>
          </span>
        </div>

        <h1 className="text-2xl font-light text-white mb-2 text-center">
          Admin sign in
        </h1>
        <p className="text-xs text-zinc-500 mb-8 text-center tracking-wide">
          Restricted area · founders only
        </p>

        <form
          action="/api/admin/login"
          method="POST"
          className="flex flex-col gap-4"
        >
          {params.from ? (
            <input type="hidden" name="from" value={params.from} />
          ) : null}
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.15em] text-zinc-500">
            Password
            <input
              type="password"
              name="password"
              autoFocus
              required
              autoComplete="current-password"
              minLength={8}
              maxLength={256}
              className="bg-zinc-950 border border-white/10 text-white px-4 py-3 rounded-md text-sm focus:outline-none focus:border-orange-500/60 transition-colors"
            />
          </label>
          {errorMessage ? (
            <div className="text-xs text-red-400 border border-red-500/30 bg-red-500/5 rounded px-3 py-2">
              {errorMessage}
            </div>
          ) : null}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-md text-sm transition-colors"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-[10px] text-zinc-600 text-center tracking-[0.15em] uppercase">
          aegibit.com · session expires in 8h
        </p>
      </div>
    </div>
  );
}
