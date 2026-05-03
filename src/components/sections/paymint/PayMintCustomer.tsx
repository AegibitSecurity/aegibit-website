'use client';

import { motion } from 'framer-motion';
import { Building2, Quote } from 'lucide-react';

export function PayMintCustomer() {
  return (
    <section
      className="relative py-24 md:py-32 px-6 lg:px-12"
      style={{ background: '#000000' }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{
            background: '#0D0D0D',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="absolute -top-20 -right-20 pointer-events-none"
            style={{
              width: 320,
              height: 320,
              background: 'rgba(249,115,22,0.10)',
              filter: 'blur(100px)',
              borderRadius: '50%',
            }}
          />
          <Quote
            size={64}
            strokeWidth={1}
            style={{ color: 'rgba(249,115,22,0.10)', position: 'absolute', top: 32, right: 32 }}
          />

          <div className="relative">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{
                background: 'rgba(249,115,22,0.10)',
                border: '1px solid rgba(249,115,22,0.30)',
              }}
            >
              <Building2 size={13} style={{ color: '#F97316' }} />
              <span
                className="text-[10px] uppercase font-medium"
                style={{ color: '#F97316', letterSpacing: '0.2em' }}
              >
                Flagship Customer
              </span>
            </div>

            <h2
              className="font-light leading-tight mb-4"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: '#fff' }}
            >
              Trusted by{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #F97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Nibir Motors Pvt. Ltd.
              </span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed max-w-2xl mb-8" style={{ color: '#A1A1AA' }}>
              PayMint runs the day-to-day finance operations across seven Nibir Motors
              branches in West Bengal — Berhampore, Kalyani, Krishnagar, Chakdah, Plassey,
              Raghunathganj, and Kandi. Every fuel bill, every workshop payment, every
              petty-cash voucher flows through a single audited pipeline.
            </p>

            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Stat label="Active branches" value="7" />
              <Stat label="Real-time sync" value="24/7" />
              <Stat label="Voucher uniqueness" value="100%" />
              <Stat label="Audit coverage" value="Every action" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-light mb-1" style={{ color: '#fff' }}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider" style={{ color: '#52525B' }}>
        {label}
      </div>
    </div>
  );
}
