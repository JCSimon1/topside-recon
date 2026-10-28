import { request } from "./client";
import type { LootItem } from "./types";

export const getLoot = () => request<LootItem[]>("/api/loot");

export const saveLootAmount = (key: string, amount: number) =>
  request<LootItem>(`/api/loot/${encodeURIComponent(key)}`, {
    method: 'PUT',
    body: JSON.stringify({ amount }),
  })