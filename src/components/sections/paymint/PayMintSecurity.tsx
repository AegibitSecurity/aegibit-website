'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Database, Eye, Server, FileLock2 } from 'lucide-react';

const LAYERS = [
  {
    Icon: Lock,
    title: 'Server-Enforced Rules',
    body:
      'Permissions live in Firestore Security Rules — not the client. A compromised browser still can&apos;t read another branch&apos;s data.',
  },
  {
    Icon: Eye,
    title: 'Append-Only Audit Log',
    body:
      'Every read-worthy action is recorded with an immutable timestamp and the actor&apos;s UID. No one can erase their own history.',
  },
  {
    Icon: Database,
    title: 'Atomic Transactions',
    body:
      'Voucher numbers and counters are issued inside Firestore transactions — concurrent makers can never collide on the same number.',
  },
  {
    Icon: Shield,
    title: 'Device Binding',
    body:
      'New devices require admin approval before they can read a single byte. Stolen credentials alone are not enough.',
  },
  {
    Icon: FileLock2,
    title: 'Soft-Delete Recovery',
    body:
      'Records are never destroyed on user action — they are tombstoned. A clean restore path exists for ransomware-grade incidents.',
  },
  {
    Icon: Server,
    title: 'OWASP-Hardened',
    body:
      'Tested against the OWASP Top 10 before every release. Built by a cybersecurity company — not a feature, a baseline.',
  },
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
            Eight layers of protection.<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Zero compromises.
            </span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#A1A1AA' }}>
            PayMint is the only expense platform built by a cybersecurity company. Every feature
            you see is matched by an invisible defence beneath it.
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
