import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Test runner config.
 *
 * Scope: pure unit tests of `src/lib/*` and other framework-agnostic
 * modules. We are deliberately NOT running React component tests or
 * Next.js route-handler tests here yet — those require a DOM (jsdom)
 * and Next-specific harness. Adding them is its own slice.
 *
 * Why vitest, not jest:
 *   - Native ESM support; matches the rest of the project (ESM-first)
 *   - 0 config to support TypeScript
 *   - Faster than jest on this codebase size
 *   - Tiny dep footprint, MIT-licensed, no paid tier needed
 */
export default defineConfig({
  test: {
    include: ["src/lib/**/*.test.ts", "src/lib/**/*.test.tsx"],
    environment: "node",
    globals: false,
    reporters: ["default"],
    coverage: {
      enabled: false, // Opt-in via --coverage on the CLI
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**/*.ts"],
      exclude: ["src/lib/**/*.test.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
