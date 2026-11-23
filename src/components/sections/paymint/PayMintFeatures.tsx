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
      'Branch-coded references such as KLY/0001/2627 combine a branch, sequence and financial year for reconciliation. Review numbering and duplicate-submission handling during acceptance testing.',
  },
  {
    Icon: Users,
    title: 'Role-Based Approvals',
    body:
      'Expense requests move through the approval and payment roles configured for your team. Confirm branch access and permissions against your operating process.',
  },
  {
    Icon: RefreshCw,
    title: 'Connected workflow updates',
    body:
      'Connected devices receive workflow updates through Firebase. Availability and update timing depend on connectivity and service conditions; confirm offline behaviour for your deployment.',
  },
  {
    Icon: ScrollText,
    title: 'Approval and payment history',
    body:
      'Review recorded approval and payment actions alongside voucher references. Agree the events captured, editing permissions, retention and export requirements during scoping.',
  },
  {
    Icon: FileSpreadsheet,
    title: 'Tally-Ready Exports',
    body:
      'Export accounting CSVs with voucher references, account heads and branch information. Validate ledger mappings and import compatibility against your accounting setup.',
  },
  {
    Icon: Bell,
    title: 'Live Notifications',
    body:
      'Workflow alerts help users identify requests needing attention. Review notification recipients and delivery behaviour during your walkthrough.',
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
