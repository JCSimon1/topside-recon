import { request } from "./client";
import type { LootItem } from "./types";

export const getLoot = () => request<LootItem[]>("/api/loot");
