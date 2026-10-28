import { describe, expect, it } from "vitest";
import type { Round } from "../api/types";
import { nextRoundNumber, sortRounds } from "./rounds";

const round = (overrides: Partial<Round> = {}): Round => ({
  id: 1,
  number: 1,
  date: "2026-01-01",
  time: "12:00",
  map: "Spaceport",
  condition: "Clear",
  money: 0,
  xp: 0,
  ...overrides,
});

describe("sortRounds", () => {
  it("returns an empty array for an empty list", () => {
    expect(sortRounds([])).toEqual([]);
  });

  it("sorts by date, newest first", () => {
    const older = round({ id: 1, date: "2026-01-01" });
    const newer = round({ id: 2, date: "2026-01-02" });
    expect(sortRounds([older, newer])).toEqual([newer, older]);
  });

  it("sorts by time when the date is equal", () => {
    const morning = round({ id: 1, time: "08:00" });
    const evening = round({ id: 2, time: "20:00" });
    expect(sortRounds([morning, evening])).toEqual([evening, morning]);
  });

  it("sorts by round number when date and time are equal", () => {
    const low = round({ id: 1, number: 5 });
    const high = round({ id: 2, number: 6 });
    expect(sortRounds([low, high])).toEqual([high, low]);
  });

  it("does not mutate the input array", () => {
    const a = round({ id: 1, date: "2026-01-01" });
    const b = round({ id: 2, date: "2026-01-02" });
    const input = [a, b];
    sortRounds(input);
    expect(input).toEqual([a, b]);
  });
});

describe("nextRoundNumber", () => {
  it("returns 1 for an empty list", () => {
    expect(nextRoundNumber([])).toBe(1);
  });

  it("returns the highest number plus one", () => {
    const list = [
      round({ number: 3 }),
      round({ number: 10 }),
      round({ number: 7 }),
    ];
    expect(nextRoundNumber(list)).toBe(11);
  });
});
