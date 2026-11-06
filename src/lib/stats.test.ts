import { describe, expect, it } from "vitest";
import type { Round } from "../api/types";
import { 
  breakdownBy,
  groupBy,
  keyFor,
  sortBreakdown,
  statsFor,
  topRounds,
  type Breakdown,
 } from "./stats";

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

const row = (overrides: Partial<Breakdown> = {}): Breakdown => ({
  key: 'A',
  count: 1,
  deaths: 0,
  totalMoney: 0,
  totalXP: 0,
  avgMoney: 0,
  avgXP: 0,
  ...overrides,
})

describe("statsFor", () => {
  it("returns zeros for an empty list", () => {
    expect(statsFor([], 0)).toEqual({
      count: 0,
      deaths: 0,
      totalMoney: 0,
      totalXP: 0,
      avgMoney: 0,
      avgXP: 0,
    });
  });

  it("sums and averages money and xp", () => {
    const list = [
      round({ money: 1000, xp: 200 }),
      round({ money: 3000, xp: 600 }),
    ];
    expect(statsFor(list, 0)).toEqual({
      count: 2,
      deaths: 0,
      totalMoney: 4000,
      totalXP: 800,
      avgMoney: 2000,
      avgXP: 400,
    });
  });

  it("counts deaths using the threshold", () => {
    const list = [
      round({ money: 0 }),
      round({ money: 500 }),
      round({ money: 5000 }),
    ];
    expect(statsFor(list, 0).deaths).toBe(1);
    expect(statsFor(list, 500).deaths).toBe(2);
  });
});

describe("groupBy", () => {
  it("returns an empty map for an empty list", () => {
    expect(groupBy([], (x: number) => x).size).toBe(0);
  });

  it("groups items and keeps their order", () => {
    const groups = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 ? "odd" : "even"));
    expect(groups.get("odd")).toEqual([1, 3, 5]);
    expect(groups.get("even")).toEqual([2, 4]);
  });
});

describe("topRounds", () => {
  const list = [
    round({ id: 1, money: 300, xp: 10 }),
    round({ id: 2, money: 900, xp: 5 }),
    round({ id: 3, money: 600, xp: 50 }),
  ];

  it("sorts descending by the chosen metric and cuts to n", () => {
    expect(topRounds(list, "money", 2).map((r) => r.id)).toEqual([2, 3]);
    expect(topRounds(list, "xp", 1).map((r) => r.id)).toEqual([3]);
  });

  it("does not mutate the input", () => {
    const copy = [...list];
    topRounds(list, "money", 3);
    expect(list).toEqual(copy);
  });
});

describe("breakdownBy", () => {
  it("creates one row per key with correct stats", () => {
    const list = [
      round({ map: "A", money: 100 }),
      round({ map: "A", money: 300 }),
      round({ map: "B", money: 50 }),
    ];
    const rows = breakdownBy(list, (r) => r.map, 0);
    const a = rows.find((r) => r.key === "A")!;
    expect(rows).toHaveLength(2);
    expect(a.count).toBe(2);
    expect(a.totalMoney).toBe(400);
    expect(a.avgMoney).toBe(200);
  });
});

describe('keyFor', () => {
  it('uses the map name', () => {
    expect(keyFor.map(round({ map: 'Spaceport' }))).toBe('Spaceport')
  })

  it('replaces an empty map with a dash', () => {
    expect(keyFor.map(round({ map: '' }))).toBe('—')
  })

  it('uses the condition name', () => {
    expect(keyFor.condition(round({ condition: 'Night Raid' }))).toBe(
      'Night Raid',
    )
  })

  it('replaces an empty condition with a dash', () => {
    expect(keyFor.condition(round({ condition: '' }))).toBe('—')
  })

  it('uses year and month for the month key', () => {
    expect(keyFor.month(round({ date: '2026-02-20' }))).toBe('2026-02')
  })
})

describe('sortBreakdown', () => {
  const rows = [
    row({ key: '2026-01', totalMoney: 500 }),
    row({ key: '2026-03', totalMoney: 100 }),
    row({ key: '2026-02', totalMoney: 900 }),
  ]

  it('sorts map and condition by total money, highest first', () => {
    expect(sortBreakdown(rows, 'map').map((r) => r.key)).toEqual([
      '2026-02',
      '2026-01',
      '2026-03',
    ])
    expect(sortBreakdown(rows, 'condition').map((r) => r.key)).toEqual([
      '2026-02',
      '2026-01',
      '2026-03',
    ])
  })

  it('sorts months chronologically, newest first', () => {
    expect(sortBreakdown(rows, 'month').map((r) => r.key)).toEqual([
      '2026-03',
      '2026-02',
      '2026-01',
    ])
  })

  it('does not mutate the input', () => {
    const copy = [...rows]
    sortBreakdown(rows, 'month')
    expect(rows).toEqual(copy)
  })

  it('returns an empty array for empty input', () => {
    expect(sortBreakdown([], 'map')).toEqual([])
  })
})