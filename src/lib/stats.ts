import type { Round } from "../api/types";
import { isDeath } from "./rounds";

export interface Stats {
  count: number;
  deaths: number;
  totalMoney: number;
  totalXP: number;
  avgMoney: number;
  avgXP: number;
}

export const statsFor = (list: Round[], deathThreshold: number): Stats => {
  const count = list.length;
  const totalMoney = list.reduce((s, r) => s + r.money, 0);
  const totalXP = list.reduce((s, r) => s + r.xp, 0);
  return {
    count,
    deaths: list.filter((r) => isDeath(r, deathThreshold)).length,
    totalMoney,
    totalXP,
    avgMoney: count ? totalMoney / count : 0,
    avgXP: count ? totalXP / count : 0,
  };
};

export const groupBy = <T, K>(list: T[], keyFn: (item: T) => K) => {
  const map = new Map<K, T[]>();
  for (const item of list) {
    const k = keyFn(item);
    const bucket = map.get(k);
    if (bucket) bucket.push(item);
    else map.set(k, [item]);
  }
  return map;
};

export const topRounds = (list: Round[], metric: "money" | "xp", n: number) =>
  [...list].sort((a, b) => b[metric] - a[metric]).slice(0, n);

export interface Breakdown extends Stats {
  key: string;
}

export const breakdownBy = (
  list: Round[],
  keyFn: (r: Round) => string,
  deathThreshold: number,
): Breakdown[] =>
  [...groupBy(list, keyFn).entries()].map(([key, items]) => ({
    key,
    ...statsFor(items, deathThreshold),
  }));
