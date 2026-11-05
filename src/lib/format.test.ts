import { describe, expect, it } from "vitest";
import { fmtDate, fmtMoney, fmtXP, slugify } from "./format";

describe("slugify", () => {
  it("lowercases and removes spaces", () => {
    expect(slugify("Dam Battlegrounds")).toBe("dambattlegrounds");
  });

  it("removes accents", () => {
    expect(slugify("Café Müller")).toBe("cafemuller");
  });

  it("removes special characters", () => {
    expect(slugify("Stella Montis!")).toBe("stellamontis");
  });

  it("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });
});

describe("fmtMoney", () => {
  it("prefixes a dollar sign", () => {
    expect(fmtMoney(0)).toBe("$0");
  });

  it("uses German thousands separators", () => {
    expect(fmtMoney(1234567)).toBe("$1.234.567");
  });

  it("handles negative values", () => {
    expect(fmtMoney(-5000)).toBe("$-5.000");
  });
});

describe("fmtXP", () => {
  it("formats without a prefix", () => {
    expect(fmtXP(1234567)).toBe("1.234.567");
  });

  it("leaves small numbers untouched", () => {
    expect(fmtXP(999)).toBe("999");
  });
});

describe("fmtDate", () => {
  it("formats an ISO date in German notation", () => {
    expect(fmtDate("2026-01-05")).toBe("05.01.2026");
  });

  it("does not shift the day because of the time zone", () => {
    expect(fmtDate("2026-12-31")).toBe("31.12.2026");
  });
});
