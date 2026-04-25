"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TERMINAL_LINES = [
  { type: "prompt", text: "voicecore auth --session" },
  { type: "output", text: "🎙  Listening for voice command..." },
  { type: "output", text: '✓  Speaker verified: Rohan M. [score: 0.97]' },
  { type: "output", text: "✓  RBAC check passed: role=admin, cmd=deploy" },
  { type: "prompt", text: "deploy --env production --service api-gateway" },
  { type: "output", text: "🔐  Dual approval requested → Priya K. (CTO)" },
  { type: "output", text: "✓  Approval received [2FA confirmed]" },
  { type: "output", text: "🚀  Deploying api-gateway@v2.4.1 to production..." },
  { type: "output", text: "✓  Deploy complete in 42s" },
  { type: "output", text: "📋  Audit log written: tx-8f2a9c4b [immutable]" },
];

function TypingLine({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => onDone?.(), 200);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="cursor-blink inline-block w-1.5 h-3.5 bg-[#06B6D4] ml-0.5 align-middle" />
      )}
    </span>
  );
}

export function TerminalDemo() {
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState<typeof TERMINAL_LINES>([]);

  useEffect(() => {
    if (currentLine >= TERMINAL_LINES.length) {
      const t = setTimeout(() => {
        setCurrentLine(0);
        setCompletedLines([]);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [currentLine]);

  function handleLineDone() {
    setCompletedLines((prev) => [...prev, TERMINAL_LINES[currentLine]]);
    setCurrentLine((n) => n + 1);
  }

  return (
    <div
      className="rounded-xl border border-[rgba(37,99,235,0.2)] bg-[rgba(7,13,26,0.9)] overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.15)] backdrop-blur"
      style={{ fontFamily: "var(--font-jetbrains, monospace)" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(37,99,235,0.15)] bg-[rgba(4,8,16,0.8)]">
        <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
        <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
        <span className="w-3 h-3 rounded-full bg-[#10B981]" />
        <span className="ml-3 text-xs text-[#6B7280]">voicecore — terminal</span>
      </div>

      {/* Terminal body */}
      <div className="p-5 space-y-1.5 min-h-[220px] text-sm">
        {/* Completed lines */}
        <AnimatePresence>
          {completedLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              className={line.type === "prompt" ? "text-[#60A5FA]" : "text-[#D1D5DB]"}
            >
              <span className="text-[#6B7280] mr-2 select-none">
                {line.type === "prompt" ? "❯" : " "}
              </span>
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current typing line */}
        {currentLine < TERMINAL_LINES.length && (
          <motion.div
            key={currentLine}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              TERMINAL_LINES[currentLine].type === "prompt"
                ? "text-[#60A5FA]"
                : "text-[#D1D5DB]"
            }
          >
            <span className="text-[#6B7280] mr-2 select-none">
              {TERMINAL_LINES[currentLine].type === "prompt" ? "❯" : " "}
            </span>
            <TypingLine
              text={TERMINAL_LINES[currentLine].text}
              onDone={handleLineDone}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
