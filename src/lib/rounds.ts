import type { Round } from "../api/types";
import type { RoundFormValues } from "./roundSchema";
import type { RoundPayload } from "../api/types";

export interface RoundFilter {
  map: string;
  condition: string;
  month: string;
}

export const filterRounds = (list: Round[], f: RoundFilter) =>
  list.filter(
    (r) =>
      (!f.map || r.map === f.map) &&
      (!f.condition || r.condition === f.condition) &&
      (!f.month || r.date.slice(0, 7) === f.month),
  );

export const paginate = <T>(list: T[], page: number, pageSize: number) => {
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    page: current,
    totalPages,
  };
};

export const uniqueSorted = (values: string[]) =>
  [...new Set(values.filter(Boolean))].sort();

export const sortRounds = (list: Round[]) =>
  [...list].sort((a, b) => {
    const da = `${a.date}T${a.time || "00:00"}`;
    const db = `${b.date}T${b.time || "00:00"}`;
    if (da !== db) return db.localeCompare(da);
    return b.number - a.number;
  });

export const nextRoundNumber = (list: Round[]) =>
  list.length === 0 ? 1 : Math.max(...list.map((r) => r.number)) + 1;

export const toPayload = (v: RoundFormValues): RoundPayload => ({
  round_number: v.number,
  round_date: v.date,
  round_time: v.time,
  map: v.map,
  map_condition: v.condition,
  money: v.money,
  xp: v.xp,
});

// RoundCard
export const isDeath = (r: Round, threshold: number) => r.money <= threshold;

export const averages = (list: Round[]) => {
  const n = list.length;
  return {
    avgMoney: n ? list.reduce((s, r) => s + r.money, 0) / n : 0,
    avgXP: n ? list.reduce((s, r) => s + r.xp, 0) / n : 0,
  };
};

export const deltaPercent = (value: number, avg: number) =>
  avg > 0 ? Math.round(((value - avg) / avg) * 100) : null;

export const isTopRun = (r: Round, avgMoney: number, factor: number) =>
  avgMoney > 0 && r.money >= avgMoney * factor;
