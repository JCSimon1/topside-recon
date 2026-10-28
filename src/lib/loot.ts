import type { LootItem } from "../api/types";

export const lootTotal = (items: LootItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.amount, 0);
