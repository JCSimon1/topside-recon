import { describe, expect, it } from "vitest";
import { lootTotal } from "./loot";
import type { LootItem } from "../api/types";

const item = (overrides: Partial<LootItem> = {}): LootItem => ({
  key: "test",
  name: "Test",
  price: 1000,
  amount: 0,
  ...overrides,
});

describe("lootTotal", () => {
  it("returns 0 for an empty list", () => {
    expect(lootTotal([])).toBe(0);
  });

  it("sums price * amount over all items", () => {
    const items = [
      item({ key: "Bastion Cell", price: 3000, amount: 2 }), // 6000
      item({ key: "Lepaer Pulse Unit", price: 11000, amount: 1 }), // 11000
    ];
    expect(lootTotal(items)).toBe(17000);
  });

  it("ignores items with amount 0", () => {
    const items = [item({ price: 5000, amount: 0 })];
    expect(lootTotal(items)).toBe(0);
  });
});
