import type { Round } from "../api/types";
import type { RoundFormValues } from "./roundSchema";
import type { RoundPayload } from "../api/types";

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
