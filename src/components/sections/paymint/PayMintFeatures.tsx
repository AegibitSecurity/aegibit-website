'use client';

import { motion } from 'framer-motion';
import {
  GitBranch,
  ScrollText,
  Users,
  RefreshCw,
  FileSpreadsheet,
  Bell,
} from 'lucide-react';

const FEATURES = [
  {
    Icon: GitBranch,
    title: 'Branch-Coded Vouchers',
    body:
      'Every payment is stamped with a tamper-proof voucher like KLY/0001/2627 — branch code, sequence, fiscal year. Atomic per-branch counters guarantee zero duplicates, even under concurrent writes.',
  },
  {
    Icon: Users,
    title: 'Role-Based Approvals',
    body:
      'Maker → Authoriser → Accountant → Admin → Super Admin. Each role sees only what their job demands. Server-enforced rules — not a UI gate.',
  },
  {
    Icon: RefreshCw,
    title: 'Real-Time, 24/7 Sync',
    body:
      'Built on Firebase real-time streams. The moment a maker submits, every approver across every device sees it. Works offline; syncs the second the network returns.',
  },
  {
    Icon: ScrollText,
    title: 'Audit-Grade Logging',
    body:
      'Every action — create, edit, approve, reject, pay — is captured in an append-only audit trail. Server rules block tampering. Forensics-ready, day one.',
  },
  {
    Icon: FileSpreadsheet,
    title: 'Tally-Ready Exports',
    body:
      'Eleven-column accounting CSVs that map straight to Tally and Power BI. Cost centers, voucher types, and amounts pre-formatted. No manual cleanup.',
  },
  {
    Icon: Bell,
    title: 'Live Notifications',
    body:
      'Per-user real-time alerts the moment something needs attention. Approvers know within seconds, not at the end of the day.',
  },
];

export function PayMintFeatures() {
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
          className="text-center mb-16 md:mb-20"
        >
          <p
            className="text-[11px] uppercase mb-4 font-medium"
            style={{ color: '#F97316', letterSpacing: '0.3em' }}
          >
            What&apos;s inside
          </p>
          <h2
            className="font-light leading-tight max-w-3xl mx-auto"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff' }}
          >
            Built for businesses that{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              refuse to lose money
            </span>{' '}
            to sloppy paperwork.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="group relative rounded-2xl p-7 transition-all duration-300"
              style={{
                background: '#0D0D0D',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              whileHover={{ y: -2 }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors"
                style={{
                  background: 'rgba(249,115,22,0.10)',
                  border: '1px solid rgba(249,115,22,0.20)',
                }}
              >
                <f.Icon size={20} style={{ color: '#F97316' }} strokeWidth={1.6} />
              </div>
              <h3
                className="text-lg font-medium mb-3 leading-snug"
                style={{ color: '#fff' }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#A1A1AA' }}>
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
