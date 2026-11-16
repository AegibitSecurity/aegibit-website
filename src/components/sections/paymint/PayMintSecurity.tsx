'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Database, Eye, Server, FileLock2 } from 'lucide-react';

const LAYERS = [
 { Icon: Lock, title: 'Role and branch access', body: 'Review the maker, authoriser and payment roles, and the branch records each person can access.' },
 { Icon: Eye, title: 'Action history', body: 'Review the recorded approval and payment actions, who can access them and the retention policy for your deployment.' },
 { Icon: Database, title: 'Voucher references', body: 'Use a consistent branch and voucher reference for reconciliation. Include duplicate-submission cases in acceptance checks.' },
 { Icon: Shield, title: 'Device access', body: 'Confirm device registration, OTP controls and access revocation with the deployment owner.' },
 { Icon: FileLock2, title: 'Data recovery', body: 'Agree backup ownership, retention and a tested restore procedure before relying on a recovery commitment.' },
 { Icon: Server, title: 'Security review', body: 'Ask for deployment-specific architecture and assessment evidence. A product description is not a certification or penetration-test report.' },
];

export function PayMintSecurity() {
  return (
    <section
      className="relative py-24 md:py-32 px-6 lg:px-12 overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 700,
          height: 700,
          background: 'rgba(249,115,22,0.05)',
          filter: 'blur(150px)',
          borderRadius: '50%',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(249,115,22,0.10)',
              border: '1px solid rgba(249,115,22,0.30)',
            }}
          >
            <Shield size={14} style={{ color: '#F97316' }} />
            <span
              className="text-[11px] uppercase font-medium"
              style={{ color: '#F97316', letterSpacing: '0.2em' }}
            >
              Security First
            </span>
          </div>
          <h2
            className="font-light leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff' }}
          >
            Controls to review.<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Clear responsibilities.
            </span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#A1A1AA' }}>
            Security requirements should be checked against your deployment, user roles and operating process. Review these areas during scoping.
          </p>
        </motion.div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {LAYERS.map((l, idx) => (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-7 transition-colors duration-300"
              style={{ background: '#000000' }}
            >
              <l.Icon size={22} style={{ color: '#F97316' }} strokeWidth={1.5} />
              <h3 className="text-base font-medium mb-2 mt-4" style={{ color: '#fff' }}>
                {l.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#A1A1AA' }}>
                {l.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
