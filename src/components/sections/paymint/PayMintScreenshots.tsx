'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function PayMintScreenshots() {
  return (
    <section
      className="relative py-24 md:py-32 px-6 lg:px-12"
      style={{ background: '#000000' }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: '#F97316', letterSpacing: '0.3em' }}
          >
            On every device
          </p>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff' }}
          >
            One platform.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Boardroom to factory floor.
            </span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 justify-items-center">
          <ScreenCard title="Dashboard" subtitle="Weekly · Monthly · Yearly insight at a glance." delay={0}>
            <div className="px-3 pt-2 space-y-2">
              <div
                className="rounded-lg p-3"
                style={{ background: 'linear-gradient(135deg, #1E3A8A, #1D4ED8)', color: '#fff' }}
              >
                <div className="text-[8px] uppercase tracking-wider" style={{ color: '#BFDBFE' }}>
                  Total · May
                </div>
                <div className="text-base font-bold">₹ 4,82,150</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg p-2" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div className="text-[8px]" style={{ color: '#64748B' }}>Branch</div>
                  <div className="text-xs font-bold" style={{ color: '#0F172A' }}>₹ 2,80,000</div>
                </div>
                <div className="rounded-lg p-2" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div className="text-[8px]" style={{ color: '#64748B' }}>Service</div>
                  <div className="text-xs font-bold" style={{ color: '#0F172A' }}>₹ 2,02,150</div>
                </div>
              </div>
              <div className="rounded-lg p-2" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div className="text-[8px] mb-1" style={{ color: '#64748B' }}>Trend</div>
                <div className="flex items-end gap-1 h-12">
                  {[40, 65, 50, 78, 55, 82, 70].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        height: `${h}%`,
                        flex: 1,
                        borderRadius: '2px 2px 0 0',
                        background: 'linear-gradient(0deg, #10B981, #34D399)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScreenCard>

          <ScreenCard title="Voucher" subtitle="Branch-coded, immutable, audit-ready." delay={0.1}>
            <div className="px-3 pt-2">
              <div className="rounded-xl p-3" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div className="text-[8px] uppercase tracking-wider" style={{ color: '#94A3B8' }}>
                  Voucher No.
                </div>
                <div className="text-sm font-mono font-bold mb-2" style={{ color: '#0F172A' }}>
                  KLY/0042/2627
                </div>
                <div className="h-px my-2" style={{ background: '#E2E8F0' }} />
                <div className="text-[9px] mb-1" style={{ color: '#64748B' }}>Payee</div>
                <div className="text-xs font-semibold mb-2" style={{ color: '#0F172A' }}>
                  Reliance Petrol Pump
                </div>
                <div className="text-[9px] mb-1" style={{ color: '#64748B' }}>Amount</div>
                <div className="text-base font-bold mb-2" style={{ color: '#10B981' }}>
                  ₹ 8,400.00
                </div>
                <div className="flex items-center gap-1 text-[9px]" style={{ color: '#059669' }}>
                  <span>●</span>
                  <span className="font-semibold">PAID</span>
                </div>
              </div>
              <div className="text-center text-[8px] mt-2" style={{ color: '#94A3B8' }}>
                Page 1 of 2 · Maker bill on page 2
              </div>
            </div>
          </ScreenCard>

          <ScreenCard title="Approvals" subtitle="Pending queue. One tap to approve or reject." delay={0.2}>
            <div className="px-3 pt-2 space-y-2">
              {[
                { v: 'BHP/0019/2627', t: 'Workshop', a: '₹ 14,250', s: 'pending' },
                { v: 'CKD/0007/2627', t: 'Petty Cash', a: '₹ 2,100', s: 'pending' },
                { v: 'KNJ/0033/2627', t: 'Tyre Repair', a: '₹ 6,800', s: 'approved' },
              ].map((r) => (
                <div key={r.v} className="rounded-lg p-2" style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[9px] font-mono" style={{ color: '#64748B' }}>
                      {r.v}
                    </div>
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                      style={
                        r.s === 'pending'
                          ? { background: '#FEF3C7', color: '#92400E' }
                          : { background: '#D1FAE5', color: '#065F46' }
                      }
                    >
                      {r.s.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: '#0F172A' }}>{r.t}</span>
                    <span className="text-xs font-bold" style={{ color: '#0F172A' }}>{r.a}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScreenCard>
        </div>
      </div>
    </section>
  );
}

function ScreenCard({
  title,
  subtitle,
  delay,
  children,
}: {
  title: string;
  subtitle: string;
  delay: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center"
    >
      <div
        className="relative w-[240px] h-[480px] rounded-[2rem] p-2.5"
        style={{
          background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(249,115,22,0.08)',
        }}
      >
        <div
          className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-20"
          style={{ background: '#000' }}
        />
        <div
          className="relative w-full h-full rounded-[1.6rem] overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #F8FAFC, #EFF6FF)' }}
        >
          <div className="px-4 pt-2 pb-2 flex items-center justify-between text-[9px] font-medium" style={{ color: '#334155' }}>
            <span>9:41</span>
            <span>●●●●</span>
          </div>
          <div className="px-4 py-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }} />
            <span className="text-sm font-bold" style={{ color: '#0F172A' }}>
              Pay<span style={{ color: '#10B981' }}>Mint</span>
            </span>
          </div>
          {children}
        </div>
      </div>

      <h3 className="mt-6 text-base font-medium" style={{ color: '#fff' }}>
        {title}
      </h3>
      <p className="mt-1 text-sm text-center max-w-[220px]" style={{ color: '#A1A1AA' }}>
        {subtitle}
      </p>
    </motion.div>
  );
}
