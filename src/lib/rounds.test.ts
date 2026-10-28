import { describe, expect, it } from "vitest";
import type { Round } from "../api/types";
import {
  filterRounds,
  nextRoundNumber,
  paginate,
  sortRounds,
  uniqueSorted,
} from "./rounds";

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

// Test sorting of rounds
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

// Tests of filtering of the round list
describe("filterRounds", () => {
  const list = [
    round({
      id: 1,
      date: "2026-10-01",
      map: "Buried City",
      condition: "Clear",
    }),
    round({
      id: 2,
      date: "2026-10-02",
      map: "Buried City",
      condition: "Bird City",
    }),
    round({
      id: 3,
      date: "2026-09-30",
      map: "Spaceport",
      condition: "Night Raid",
    }),
  ];

  const none = { map: "", condition: "", month: "" };

  it("returns the complete list for an empty filter", () => {
    expect(filterRounds(list, none)).toEqual(list);
  });

  it("filters by map", () => {
    const ids = filterRounds(list, { ...none, map: "Spaceport" }).map(
      (r) => r.id,
    );
    expect(ids).toEqual([3]);
  });

  it("filters by condition", () => {
    const ids = filterRounds(list, { ...none, condition: "Bird City" }).map(
      (r) => r.id,
    );
    expect(ids).toEqual([2]);
  });

  it("filters by month", () => {
    const ids = filterRounds(list, { ...none, month: "2026-10" }).map(
      (r) => r.id,
    );
    expect(ids).toEqual([1, 2]);
  });

  it("combines all filters with AND", () => {
    const result = filterRounds(list, {
      map: "Buried City",
      condition: "Bird City",
      month: "2026-10",
    });
    expect(result.map((r) => r.id)).toEqual([2]);
  });
});

// Test list pagination
describe("paginate", () => {
  const items = [1, 2, 3, 4, 5, 6, 7];

  it("returns the first page", () => {
    expect(paginate(items, 1, 3)).toEqual({
      items: [1, 2, 3],
      page: 1,
      totalPages: 3,
    });
  });

  it("returns a partial last page", () => {
    expect(paginate(items, 3, 3).items).toEqual([7]);
  });

  it("clamps a page below 1", () => {
    expect(paginate(items, 0, 3).page).toBe(1);
  });

  it("clamps a page above the last one", () => {
    expect(paginate(items, 99, 3).page).toBe(3);
  });

  it("has one page for an empty list", () => {
    expect(paginate([], 1, 3)).toEqual({ items: [], page: 1, totalPages: 1 });
  });
});

describe("uniqueSorted", () => {
  it("removes duplicates and sorts", () => {
    expect(uniqueSorted(["b", "a", "b"])).toEqual(["a", "b"]);
  });

  it("drops empty strings", () => {
    expect(uniqueSorted(["", "a", ""])).toEqual(["a"]);
  });
});
