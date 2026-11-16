import { describe, expect, it } from "vitest";
import { growthWindow, knownCount, coveragePercent } from "./growth-metrics";
describe("growth reporting boundaries", () => {
 it("uses complete Kolkata days at a UTC date boundary", () => {
  expect(growthWindow(new Date("2026-11-15T20:00:00Z"))).toEqual({ since: "2026-10-18T18:30:00.000Z", until: "2026-11-15T18:30:00.000Z", timezone: "Asia/Kolkata", days: 28 });
 });
 it("excludes the still-incomplete business day", () => { expect(growthWindow(new Date("2026-11-15T18:29:59Z")).until).toBe("2026-11-14T18:30:00.000Z"); });
 it("does not turn query failures into zero", () => { expect(knownCount({count:0,error:{message:"failed"}})).toBeNull(); expect(knownCount({count:null,error:null})).toBeNull(); expect(knownCount({count:0,error:null})).toBe(0); });
 it("does not manufacture percentages for missing, empty or inconsistent cohorts", () => { expect(coveragePercent(null,10)).toBeNull(); expect(coveragePercent(0,0)).toBeNull(); expect(coveragePercent(11,10)).toBeNull(); expect(coveragePercent(1,3)).toBe(33.3); });
});
