'use client';

import { motion } from 'framer-motion';
import { Smartphone, Download, ShieldCheck, Zap, CalendarCheck, FileText } from 'lucide-react';

const PAYMINT_APP_URL = 'https://nibir-vault.web.app';
const PAYMINT_APK_URL = '/paymint/paymint-latest.apk';
const PAYMINT_BROCHURE_URL = '/paymint/paymint-brochure.pdf';
const PAYMINT_DEMO_URL = '/products/paymint/demo';

export function PayMintHero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center px-6 lg:px-12 pt-32 pb-20 overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Warm radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 75% 35%, rgba(249,115,22,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(249,115,22,0.10)',
              border: '1px solid rgba(249,115,22,0.30)',
            }}
          >
            <Smartphone size={14} style={{ color: '#F97316' }} />
            <span
              className="text-[11px] uppercase font-medium"
              style={{ color: '#F97316', letterSpacing: '0.2em' }}
            >
              An AEGIBIT Product
            </span>
          </div>

          {/* Logo + name */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #F97316, #EA6C0A)',
                boxShadow:
                  '0 0 0 3px rgba(249,115,22,0.10),' +
                  '0 0 30px rgba(249,115,22,0.40)',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 300, fontSize: 26, letterSpacing: '-0.02em' }}>
                P
              </span>
            </div>
            <div className="flex items-baseline">
              <span style={{ color: '#fff', fontWeight: 300, fontSize: 32, letterSpacing: '-0.02em' }}>
                Pay
              </span>
              <span style={{ color: '#F97316', fontWeight: 300, fontSize: 32, letterSpacing: '-0.02em' }}>
                Mint
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="font-light leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)' }}
          >
            <span style={{ color: '#fff' }}>Expense management,</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              built like a vault.
            </span>
          </h1>

          {/* Sub */}
          <p
            className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
            style={{ color: '#A1A1AA' }}
          >
            Multi-branch expense tracking with role-based approvals, branch-coded
            vouchers, and audit-grade logs. Engineered by a cybersecurity company,
            for businesses that can&apos;t afford a leak.
          </p>

          {/* CTAs — primary is Book Demo (sales-led growth motion).
               Launch + Download remain for existing users. */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
            <a
              href={PAYMINT_DEMO_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #F97316, #EA6C0A)',
                color: '#fff',
                boxShadow: '0 0 0 1px rgba(249,115,22,0.30), 0 10px 30px rgba(249,115,22,0.25)',
              }}
            >
              <CalendarCheck size={18} />
              Book a 20-min Demo
            </a>
            <a
              href={PAYMINT_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-5 rounded-xl text-base transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.20)',
              }}
            >
              <Zap size={18} />
              Launch Web App
            </a>
            <a
              href={PAYMINT_APK_URL}
              download
              className="group inline-flex items-center justify-center gap-3 px-7 py-5 rounded-xl text-base transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.20)',
              }}
            >
              <Download size={18} />
              <span className="flex flex-col items-start leading-tight">
                <span>Download for Android</span>
                <span className="text-[11px] font-normal" style={{ color: '#52525B' }}>
                  v1.0 · 6.5 MB · APK
                </span>
              </span>
            </a>
            <a
              href={PAYMINT_BROCHURE_URL}
              download
              className="group inline-flex items-center justify-center gap-3 px-7 py-5 rounded-xl text-base transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.20)',
              }}
            >
              <FileText size={18} />
              <span className="flex flex-col items-start leading-tight">
                <span>Download Brochure</span>
                <span className="text-[11px] font-normal" style={{ color: '#52525B' }}>
                  v1.0 · 976 KB · PDF
                </span>
              </span>
            </a>
          </div>

          {/* Trust */}
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
            style={{ color: '#52525B' }}
          >
            {[
              'End-to-end encrypted',
              'Real-time sync · 24/7',
              'Role-based access control',
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <ShieldCheck size={16} style={{ color: '#F97316' }} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: phone mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Decorative rings */}
          <div
            className="absolute w-[420px] h-[420px] rounded-full"
            style={{ border: '1px solid rgba(249,115,22,0.10)' }}
          />
          <div
            className="absolute w-[320px] h-[320px] rounded-full"
            style={{ border: '1px solid rgba(249,115,22,0.15)' }}
          />

          {/* Phone */}
          <div
            className="relative w-[280px] h-[560px] rounded-[2.5rem] p-3"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow:
                '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(249,115,22,0.15)',
            }}
          >
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl z-20"
              style={{ background: '#000' }}
            />
            <div
              className="relative w-full h-full rounded-[2rem] overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #F8FAFC, #EFF6FF)' }}
            >
              <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[10px] font-medium" style={{ color: '#334155' }}>
                <span>9:41</span>
                <span>●●●●</span>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                  />
                  <span className="text-base font-bold" style={{ color: '#0F172A' }}>
                    Pay<span style={{ color: '#10B981' }}>Mint</span>
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
              </div>
              <div
                className="mx-4 mt-3 rounded-2xl p-4"
                style={{ background: 'linear-gradient(135deg, #1E3A8A, #1D4ED8)', color: '#fff', boxShadow: '0 6px 16px rgba(29,78,216,0.25)' }}
              >
                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#BFDBFE' }}>
                  Total this month
                </div>
                <div className="text-2xl font-bold">₹ 4,82,150</div>
                <div className="text-[10px] mt-1" style={{ color: '#BFDBFE' }}>
                  +12% vs last month
                </div>
              </div>
              <div className="px-4 mt-4 space-y-2">
                {[
                  { v: 'KLY/0042/2627', t: 'Fuel', a: '₹ 8,400', c: '#3B82F6' },
                  { v: 'BHP/0019/2627', t: 'Workshop', a: '₹ 14,250', c: '#F59E0B' },
                  { v: 'CKD/0007/2627', t: 'Petty Cash', a: '₹ 2,100', c: '#10B981' },
                ].map((row) => (
                  <div
                    key={row.v}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: '#fff', boxShadow: '2px 2px 8px rgba(148,163,184,0.15)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: row.c }}
                    >
                      ₹
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-mono" style={{ color: '#64748B' }}>
                        {row.v}
                      </div>
                      <div className="text-[13px] font-semibold" style={{ color: '#0F172A' }}>
                        {row.t}
                      </div>
                    </div>
                    <div className="text-[13px] font-bold" style={{ color: '#0F172A' }}>
                      {row.a}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="absolute bottom-3 left-3 right-3 rounded-2xl flex items-center justify-around py-3"
                style={{ background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              >
                {['⌂', '✚', '▣', '✓', '₹'].map((i, idx) => (
                  <span
                    key={idx}
                    className="text-base"
                    style={{ color: idx === 0 ? '#10B981' : '#94A3B8', fontWeight: idx === 0 ? 700 : 400 }}
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating accent dots */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full" style={{ background: 'rgba(249,115,22,0.20)', filter: 'blur(40px)' }} />
          <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full" style={{ background: 'rgba(249,115,22,0.15)', filter: 'blur(40px)' }} />
        </motion.div>
      </div>
    </section>
  );
}
