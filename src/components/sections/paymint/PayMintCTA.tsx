'use client';

import { motion } from 'framer-motion';
import { Zap, Download, ArrowRight, CalendarCheck } from 'lucide-react';
import { track } from '@/lib/track';

const PAYMINT_APP_URL = 'https://nibir-vault.web.app';
const PAYMINT_APK_URL = '/paymint/paymint-latest.apk';
const PAYMINT_DEMO_URL = '/products/paymint/demo';

export function PayMintCTA() {
  return (
    <section
      className="relative py-24 md:py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: '#000000' }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 600,
          background: 'rgba(249,115,22,0.08)',
          filter: 'blur(160px)',
          borderRadius: '50%',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-light leading-[1.1] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#fff' }}
          >
            Ready when you are.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Install in seconds.
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: '#A1A1AA' }}>
            No app store. No 50&nbsp;MB download. Open the link, tap install, log in.
            Your team is on PayMint before the kettle boils.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center mb-8">
            <a
              href={PAYMINT_DEMO_URL}
              onClick={() => track('cta_click', { cta_id: 'paymint_bottom_book_demo', cta_label: 'Book a 20-min Demo', cta_section: 'paymint_bottom_cta', target: PAYMINT_DEMO_URL })}
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
              onClick={() => track('cta_click', { cta_id: 'paymint_bottom_launch_webapp', cta_label: 'Launch Web App', cta_section: 'paymint_bottom_cta', target: PAYMINT_APP_URL, external: true })}
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
              onClick={() => track('cta_click', { cta_id: 'paymint_bottom_download_apk', cta_label: 'Download for Android', cta_section: 'paymint_bottom_cta', target: PAYMINT_APK_URL, asset_type: 'apk' })}
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
          </div>

          <a
            href="/contact"
            onClick={() => track('cta_click', { cta_id: 'paymint_bottom_talk_to_founder', cta_label: 'Talk to a founder', cta_section: 'paymint_bottom_cta', target: '/contact' })}
            className="inline-flex items-center gap-2 text-sm transition-colors group"
            style={{ color: '#A1A1AA' }}
          >
            Have an enterprise question? Talk to a founder
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
