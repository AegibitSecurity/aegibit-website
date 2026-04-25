"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mic, CheckCircle2, XCircle, Clock } from "lucide-react";

const COMMANDS = [
  {
    id: "deploy",
    label: "Deploy to Production",
    command: "deploy api-gateway v2.4.1 to production",
    steps: [
      { icon: "🎙", text: "Voice captured", status: "done" },
      { icon: "🔐", text: "Biometric verified — Rohan M. [0.97]", status: "done" },
      { icon: "🛡", text: "RBAC check: role=admin → APPROVED", status: "done" },
      { icon: "🚀", text: "Deployed api-gateway@v2.4.1", status: "done" },
      { icon: "📋", text: "Audit log: tx-8f2a9c4b [immutable]", status: "done" },
    ],
  },
  {
    id: "export",
    label: "Export Customer Data",
    command: "export all customer records to CSV",
    steps: [
      { icon: "🎙", text: "Voice captured", status: "done" },
      { icon: "🔐", text: "Biometric verified — Rohan M. [0.97]", status: "done" },
      { icon: "🛡", text: "RBAC check: role=analyst → DENIED", status: "denied" },
      { icon: "🚨", text: "Action blocked — insufficient permissions", status: "denied" },
      { icon: "📋", text: "Audit log: denial recorded [immutable]", status: "done" },
    ],
  },
  {
    id: "sudo",
    label: "Wire Transfer Approval",
    command: "initiate wire transfer INR 50 lakh to vendor",
    steps: [
      { icon: "🎙", text: "Voice captured", status: "done" },
      { icon: "🔐", text: "Biometric verified — Priya S. [0.99]", status: "done" },
      { icon: "🔑", text: "Sudo Mode — dual approval required", status: "pending" },
      { icon: "✅", text: "CFO approval received [biometric]", status: "done" },
      { icon: "📋", text: "Transfer initiated + audit logged", status: "done" },
    ],
  },
];

const statusColor = {
  done:    "text-[#10B981]",
  denied:  "text-[#EF4444]",
  pending: "text-[#F59E0B]",
};

const statusIcon = {
  done:    <CheckCircle2 className="w-3.5 h-3.5" />,
  denied:  <XCircle className="w-3.5 h-3.5" />,
  pending: <Clock className="w-3.5 h-3.5" />,
};

export function InteractiveDemo() {
  const [active, setActive]       = useState(0);
  const [running, setRunning]     = useState(false);
  const [visibleSteps, setVisible] = useState<number>(0);
  const [ref, inView]             = useInView({ triggerOnce: true, threshold: 0.2 });

  const cmd = COMMANDS[active];

  function runDemo(idx: number) {
    if (running) return;
    setActive(idx);
    setVisible(0);
    setRunning(true);

    const steps = COMMANDS[idx].steps;
    steps.forEach((_, i) => {
      setTimeout(() => {
        setVisible(i + 1);
        if (i === steps.length - 1) setRunning(false);
      }, 600 + i * 700);
    });
  }

  return (
    <section ref={ref} className="py-24 sm:py-32 px-6 lg:px-10 bg-[#111111] border-y border-[rgba(255,255,255,0.06)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="mono-label text-[#FF6A00] block mb-4">Interactive Demo</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            See Zero Trust in action.
          </h2>
          <p className="text-[#52525B] text-sm mt-2">Click a scenario to watch the full security flow execute.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Scenario picker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            {COMMANDS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => runDemo(i)}
                disabled={running}
                className={`w-full text-left p-5 rounded-sm border transition-all ${
                  active === i
                    ? "border-[rgba(255,106,0,0.4)] bg-[rgba(255,106,0,0.06)]"
                    : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] bg-[#0A0A0A]"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold text-sm ${active === i ? "text-white" : "text-[#A1A1AA]"}`}>
                    {c.label}
                  </span>
                  {active === i && running && (
                    <span className="mono-label text-[#FF6A00] animate-pulse">running…</span>
                  )}
                </div>
                <p className="mono-label text-[#2A2A2A]">❯ {c.command}</p>
              </button>
            ))}

            <p className="text-[#2A2A2A] text-xs mt-2">Click any scenario to run it</p>
          </motion.div>

          {/* Terminal output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-sm border border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] overflow-hidden"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#111111]">
              <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
              <span className="ml-3 mono-label text-[#2A2A2A]">voicecore security pipeline</span>
              <Mic className="ml-auto w-3.5 h-3.5 text-[#FF6A00]" />
            </div>

            <div className="p-5 min-h-[240px]">
              {/* Command line */}
              <div className="flex items-start gap-2 mb-5">
                <span className="mono-label text-[#FF6A00]">❯</span>
                <span className="font-mono text-sm text-[#A1A1AA]">{cmd.command}</span>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <AnimatePresence>
                  {cmd.steps.slice(0, visibleSteps).map((step, i) => (
                    <motion.div
                      key={`${active}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3"
                    >
                      <span className={statusColor[step.status as keyof typeof statusColor]}>
                        {statusIcon[step.status as keyof typeof statusIcon]}
                      </span>
                      <span className={`text-xs font-mono ${
                        step.status === "denied" ? "text-[#EF4444]" :
                        step.status === "pending" ? "text-[#F59E0B]" : "text-[#A1A1AA]"
                      }`}>
                        {step.icon} {step.text}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {visibleSteps === 0 && (
                  <p className="text-[#2A2A2A] text-xs font-mono">Select a scenario to begin…</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
