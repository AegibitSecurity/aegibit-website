import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./auth";

/**
 * Round-trip + negative tests for the scrypt password helper.
 *
 * These run on every PR via the lint-and-test workflow. If any of these
 * regress we lose admin login, so the test gate is load-bearing for the
 * S-1 fix. Adding more tests is cheap; removing or skipping these is a
 * red flag.
 */

describe("hashPassword / verifyPassword", () => {
  it("verifies a freshly-hashed password", () => {
    const hash = hashPassword("correct-horse-battery-staple");
    expect(verifyPassword("correct-horse-battery-staple", hash)).toBe(true);
  });

  it("rejects the wrong password", () => {
    const hash = hashPassword("right-password-1234");
    expect(verifyPassword("wrong-password-1234", hash)).toBe(false);
  });

  it("rejects an empty password", () => {
    const hash = hashPassword("real-password");
    expect(verifyPassword("", hash)).toBe(false);
  });

  it("uses scrypt:salt:hash colon format (not $ — dotenv would mangle)", () => {
    const hash = hashPassword("anything");
    expect(hash).toMatch(/^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/);
    expect(hash).not.toContain("$");
  });

  it("each hash uses a fresh random salt", () => {
    const a = hashPassword("same-password");
    const b = hashPassword("same-password");
    expect(a).not.toEqual(b); // different salt → different hash
    expect(verifyPassword("same-password", a)).toBe(true);
    expect(verifyPassword("same-password", b)).toBe(true);
  });

  it("rejects malformed stored hashes without throwing", () => {
    expect(verifyPassword("anything", "")).toBe(false);
    expect(verifyPassword("anything", "scrypt")).toBe(false);
    expect(verifyPassword("anything", "scrypt:abc")).toBe(false);
    expect(verifyPassword("anything", "bcrypt:abc:def")).toBe(false); // wrong tag
    expect(verifyPassword("anything", "scrypt:zzz:zzz")).toBe(false); // non-hex
  });
});
