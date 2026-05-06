#!/usr/bin/env node
// Local-only utility: hash an admin password into the storage format used
// by ADMIN_PASSWORD_HASH. Zero deps — uses Node's built-in scrypt.
//
// Usage:
//   node scripts/hash-password.mjs
//   (then paste your password — it's read from stdin, never echoed)
//
// Copy the printed hash into Vercel's env settings as ADMIN_PASSWORD_HASH.
// Never commit the plaintext password anywhere.

import { scryptSync, randomBytes } from "node:crypto";

// Must match src/lib/auth.ts scrypt parameters exactly.
const N = 1 << 14;
const r = 8;
const p = 1;
const maxmem = 64 * 1024 * 1024;
const KEY_LEN = 64;

// ASCII control codes — written as fromCharCode so the bytes survive any
// editor/transport that might strip raw control characters.
const CTRL_C = String.fromCharCode(3);
const CTRL_D = String.fromCharCode(4);
const BACKSPACE_BS = String.fromCharCode(8);
const BACKSPACE_DEL = String.fromCharCode(127);
const RETURN = "\r";
const NEWLINE = "\n";

function hash(plaintext) {
  const salt = randomBytes(16);
  const derived = scryptSync(plaintext, salt, KEY_LEN, { N, r, p, maxmem });
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

const stdin = process.stdin;
if (!stdin.isTTY) {
  console.error("Run this in an interactive terminal (not piped/redirected).");
  process.exit(1);
}

process.stdout.write("Admin password (input hidden): ");
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding("utf8");

let password = "";

stdin.on("data", (chunk) => {
  for (const ch of chunk) {
    if (ch === CTRL_C || ch === CTRL_D) {
      process.stdout.write("\n");
      process.exit(130);
    }
    if (ch === RETURN || ch === NEWLINE) {
      stdin.setRawMode(false);
      stdin.pause();
      process.stdout.write("\n");
      if (password.length < 8) {
        console.error("Password must be at least 8 characters.");
        process.exit(1);
      }
      const out = hash(password);
      password = "";
      console.log("\nADMIN_PASSWORD_HASH=" + out + "\n");
      console.log("Paste the line above into Vercel -> Project -> Settings -> Environment Variables.");
      process.exit(0);
    }
    if (ch === BACKSPACE_BS || ch === BACKSPACE_DEL) {
      password = password.slice(0, -1);
      continue;
    }
    password += ch;
  }
});
