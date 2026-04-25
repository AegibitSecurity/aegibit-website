"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-[rgba(37,99,235,0.3)] bg-[#070d1a] p-8">
      <h2 className="text-2xl font-bold text-[#F9FAFB] mb-1">Sign in</h2>
      <p className="text-[#6B7280] text-sm mb-6">Access your VoiceCore dashboard.</p>
      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[#D1D5DB] text-sm">Work Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" required
            className="bg-[rgba(4,8,16,0.8)] border-[rgba(37,99,235,0.25)] text-[#F9FAFB] placeholder:text-[#374151] focus:border-[#2563EB] h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[#D1D5DB] text-sm">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" required
            className="bg-[rgba(4,8,16,0.8)] border-[rgba(37,99,235,0.25)] text-[#F9FAFB] placeholder:text-[#374151] focus:border-[#2563EB] h-11 rounded-xl" />
        </div>
        <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#3B82F6] text-white h-12 rounded-xl font-semibold">
          Sign In
        </Button>
      </form>
      <p className="text-center text-[#374151] text-xs mt-4">
        Don&apos;t have access? <Link href="/signup" className="text-[#60A5FA] hover:text-[#93C5FD]">Join the waitlist</Link>
      </p>
    </div>
  );
}
