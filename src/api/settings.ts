import { request } from "./client";
import type { Settings } from "./types";

export const getSettings = () => request<Settings>("/api/settings");

export const saveRank = (rank: string | null) =>
  request<{ rank: string | null }>("/api/settings/rank", {
    method: "PUT",
    body: JSON.stringify({ rank }),
  });
