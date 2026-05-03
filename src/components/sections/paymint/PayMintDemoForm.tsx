'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Clock,
  Users,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Check,
} from 'lucide-react';

const ROLES = [
  'Founder / Owner',
  'CFO / Finance Head',
  'Operations Manager',
  'IT / Tech Lead',
  'Branch Manager',
  'Other',
];

const BRANCH_RANGES = [
  '1 branch',
  '2–5 branches',
  '6–15 branches',
  '16–50 branches',
  '50+ branches',
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  branches: string;
  message: string;
  // Honeypot — real users never fill this
  website: string;
}

const INITIAL: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  role: '',
  branches: '',
  message: '',
  website: '',
};

export function PayMintDemoForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Honeypot: if filled, silently treat as success (don't tip off bots)
    if (form.website) {
      setSubmitted(true);
      return;
    }

    if (!form.name || !form.email || !form.company) {
      setError('Please fill in your name, work email, and company.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.trim().toLowerCase(),
          phone:    form.phone.trim() || undefined,
          company:  form.company.trim(),
          teamSize: form.branches || undefined,
          message:
            (form.role ? `Role: ${form.role}\n` : '') +
            (form.message ? `Goal: ${form.message}` : ''),
          source: 'paymint_demo',
          page:   '/products/paymint/demo',
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Something went wrong');
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className="relative min-h-screen pt-32 pb-20 px-6 lg:px-12 overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Warm radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 75% 30%, rgba(249,115,22,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">
        {/* Left: pitch + trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(249,115,22,0.10)',
              border: '1px solid rgba(249,115,22,0.30)',
            }}
          >
            <Sparkles size={14} style={{ color: '#F97316' }} />
            <span
              className="text-[11px] uppercase font-medium"
              style={{ color: '#F97316', letterSpacing: '0.2em' }}
            >
              20-Minute Live Demo
            </span>
          </div>

          <h1
            className="font-light leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}
          >
            <span style={{ color: '#fff' }}>See PayMint run</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #F97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              your operation.
            </span>
          </h1>

          <p
            className="text-lg leading-relaxed mb-10 max-w-lg"
            style={{ color: '#A1A1AA' }}
          >
            Book a 20-minute call with a PayMint specialist. We&apos;ll walk through
            multi-branch expense tracking, branch-coded vouchers, audit-grade logging,
            and Tally-ready exports — tailored to your dealership or SME.
          </p>

          {/* Trust strip */}
          <div className="space-y-4 mb-10">
            {[
              { Icon: Clock,        text: 'No prep needed — we drive the demo' },
              { Icon: ShieldCheck,  text: 'Built by a cybersecurity company — SOC 2 ready' },
              { Icon: Building2,    text: 'Live with Nibir Motors — 7 branches, real-time sync' },
              { Icon: Zap,          text: 'Get a live PayMint sandbox link the same day' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(249,115,22,0.10)',
                    border: '1px solid rgba(249,115,22,0.20)',
                  }}
                >
                  <Icon size={16} style={{ color: '#F97316' }} />
                </div>
                <span className="text-sm" style={{ color: '#A1A1AA' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Mini testimonial */}
          <div
            className="rounded-xl p-5 max-w-lg"
            style={{
              background: '#0D0D0D',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p
              className="text-sm leading-relaxed mb-3 italic"
              style={{ color: '#CBD5E1' }}
            >
              &ldquo;Every fuel bill, workshop invoice, and petty-cash voucher across
              7 branches now flows through one audited pipeline. We see everything,
              real-time.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, #F97316, #EA6C0A)',
                  color: '#fff',
                }}
              >
                NM
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: '#fff' }}>
                  Nibir Motors Pvt. Ltd.
                </div>
                <div className="text-[11px]" style={{ color: '#52525B' }}>
                  Multi-branch automotive group · West Bengal
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: form OR success state */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div
            className="relative rounded-2xl p-7 md:p-9"
            style={{
              background: 'linear-gradient(180deg, #0D0D0D 0%, #060606 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow:
                '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(249,115,22,0.08)',
            }}
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => update('website', e.target.value)}
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      width: '1px',
                      height: '1px',
                      opacity: 0,
                    }}
                  />

                  <div className="mb-6">
                    <h2 className="text-xl font-medium mb-1" style={{ color: '#fff' }}>
                      Book your demo
                    </h2>
                    <p className="text-sm" style={{ color: '#A1A1AA' }}>
                      We&apos;ll reach out within 24 business hours.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <Field label="Full name" required>
                      <Input
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(v) => update('name', v)}
                        placeholder="Aarav Sharma"
                      />
                    </Field>
                    <Field label="Work email" required icon={Mail}>
                      <Input
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(v) => update('email', v)}
                        placeholder="aarav@yourcompany.com"
                      />
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <Field label="Phone" icon={Phone}>
                      <Input
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(v) => update('phone', v)}
                        placeholder="+91 98xxx xxxxx"
                      />
                    </Field>
                    <Field label="Company" required icon={Building2}>
                      <Input
                        type="text"
                        autoComplete="organization"
                        value={form.company}
                        onChange={(v) => update('company', v)}
                        placeholder="Acme Motors Pvt. Ltd."
                      />
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <Field label="Your role" icon={Users}>
                      <Select
                        value={form.role}
                        onChange={(v) => update('role', v)}
                        options={ROLES}
                        placeholder="Select your role…"
                      />
                    </Field>
                    <Field label="Number of branches">
                      <Select
                        value={form.branches}
                        onChange={(v) => update('branches', v)}
                        options={BRANCH_RANGES}
                        placeholder="Select branch count…"
                      />
                    </Field>
                  </div>

                  <Field label="What's your biggest expense management headache?">
                    <Textarea
                      value={form.message}
                      onChange={(v) => update('message', v)}
                      placeholder="e.g. We can't reconcile petty cash across branches…"
                      rows={3}
                    />
                  </Field>

                  {error && (
                    <div
                      className="mt-4 rounded-lg p-3 text-sm"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        color: '#FCA5A5',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-medium transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-progress disabled:transform-none"
                    style={{
                      background: 'linear-gradient(135deg, #F97316, #EA6C0A)',
                      color: '#fff',
                      boxShadow:
                        '0 0 0 1px rgba(249,115,22,0.30), 0 10px 30px rgba(249,115,22,0.25)',
                    }}
                  >
                    {submitting ? 'Sending…' : 'Book my demo'}
                    {!submitting && <ArrowRight size={18} />}
                  </button>

                  <p
                    className="text-[11px] mt-4 leading-relaxed text-center"
                    style={{ color: '#52525B' }}
                  >
                    By submitting, you agree to be contacted by AEGIBIT. We never
                    share your data. End-to-end encrypted in transit and at rest.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, rgba(16,185,129,0.25), rgba(16,185,129,0.05))',
                      border: '2px solid rgba(16,185,129,0.4)',
                    }}
                  >
                    <CheckCircle2 size={40} style={{ color: '#10B981' }} strokeWidth={2.5} />
                  </motion.div>
                  <h2
                    className="text-2xl font-light mb-3"
                    style={{ color: '#fff', letterSpacing: '-0.01em' }}
                  >
                    You&apos;re in.
                  </h2>
                  <p
                    className="text-base leading-relaxed max-w-sm mx-auto mb-8"
                    style={{ color: '#A1A1AA' }}
                  >
                    A PayMint specialist will reach out within 24 business hours to
                    schedule your demo. Check your inbox — confirmation already sent.
                  </p>
                  <a
                    href="https://nibir-vault.web.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                  >
                    <Zap size={16} />
                    Try the live web app while you wait
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Premium form atoms ───────────────────────────────────────────────────

function Field({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="flex items-center gap-1.5 text-[12px] font-medium mb-1.5"
        style={{ color: '#A1A1AA', letterSpacing: '0.01em' }}
      >
        {Icon && <Icon size={13} style={{ color: '#52525B' }} />}
        {label}
        {required && <span style={{ color: '#F97316' }}>*</span>}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
};

function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      style={inputStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
      }}
    />
  );
}

/**
 * Custom premium dropdown — replaces the native <select>, whose <option>
 * list ignores our dark theme and renders with a browser-default white
 * background. The custom dropdown:
 *   • Matches the form's glass-dark aesthetic exactly
 *   • Closes on outside click, Escape key, or selection
 *   • Animates open with a spring, fades out on close
 *   • Selected option is marked with an accent check
 *   • Mobile-friendly: tappable rows, proper hit areas
 *   • Keyboard accessible: Enter/Space to toggle, Tab to navigate
 */
function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between transition-colors"
        style={{
          ...inputStyle,
          paddingRight: 12,
          cursor: 'pointer',
          textAlign: 'left',
          color: value ? '#fff' : '#52525B',
          borderColor: open ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.08)',
          background: open ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        }}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          size={16}
          style={{
            color: '#71717A',
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            flexShrink: 0,
            marginLeft: 8,
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute z-50 mt-2 w-full overflow-hidden"
            style={{
              borderRadius: 12,
              background: 'linear-gradient(180deg, #0F0F0F 0%, #0A0A0A 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow:
                '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset, 0 0 30px rgba(249,115,22,0.06)',
              padding: 6,
              maxHeight: 280,
              overflowY: 'auto',
            }}
          >
            {options.map((opt) => {
              const selected = opt === value;
              return (
                <li key={opt}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-between gap-2 transition-all"
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      fontSize: 14,
                      textAlign: 'left',
                      color: selected ? '#F97316' : '#E4E4E7',
                      background: selected
                        ? 'rgba(249,115,22,0.10)'
                        : 'transparent',
                      cursor: 'pointer',
                      border: 'none',
                      fontWeight: selected ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#E4E4E7';
                      }
                    }}
                  >
                    <span className="truncate">{opt}</span>
                    {selected && (
                      <Check size={14} style={{ color: '#F97316', flexShrink: 0 }} />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.5)'; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
    />
  );
}
