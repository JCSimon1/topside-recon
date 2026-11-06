// Panel mit Umschalter (Map, Condition, Monat), Balkendiagramm und Tabelle aus denselben Daten.

import { useState } from "react";
import type { Round } from "../api/types";
import { fmtMoney, fmtXP } from "../lib/format";
import {
  breakdownBy,
  keyFor,
  sortBreakdown,
  type BreakdownDim,
} from "../lib/stats";
import BreakdownChart from "./BreakdownChart";
import Panel from "./Panel";

const dims: { id: BreakdownDim; label: string; column: string }[] = [
  { id: "map", label: "Pro Map", column: "Map" },
  { id: "condition", label: "Pro Condition", column: "Condition" },
  { id: "month", label: "Monatlich", column: "Monat" },
];

interface BreakdownPanelProps {
  rounds: Round[];
  deathThreshold: number;
}

export default function BreakdownPanel({
  rounds,
  deathThreshold,
}: BreakdownPanelProps) {
  const [dim, setDim] = useState<BreakdownDim>("map");

  const rows = sortBreakdown(
    breakdownBy(rounds, keyFor[dim], deathThreshold),
    dim,
  );
  const column = dims.find((d) => d.id === dim)?.column;

  return (
    <Panel>
      <div className="mb-4 flex gap-2">
        {dims.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDim(d.id)}
            className={`cursor-pointer rounded-sm border px-3 py-1.5 text-[13px] font-medium ${
              dim === d.id
                ? "border-accent text-accent"
                : "border-border bg-panel-alt text-text-muted hover:text-text"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <BreakdownChart rows={rows} dim={dim} />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[11px] text-text-faint">
              <th className="px-2.5 pb-2.5 text-text">{column}</th>
              <th className="px-2.5 pb-2.5">Runden</th>
              <th className="px-2.5 pb-2.5">Gesamt $</th>
              <th className="px-2.5 pb-2.5">Ø $</th>
              <th className="px-2.5 pb-2.5">Gesamt XP</th>
              <th className="px-2.5 pb-2.5">Ø XP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.key}
                className="border-b border-border-soft font-mono last:border-b-0 hover:bg-accent/10"
              >
                <td className="px-2.5 py-3 font-sans font-semibold">{r.key}</td>
                <td className="px-2.5 py-3">{r.count}</td>
                <td className="px-2.5 py-3 text-positive">
                  {fmtMoney(r.totalMoney)}
                </td>
                <td className="px-2.5 py-3 text-positive">
                  {fmtMoney(Math.round(r.avgMoney))}
                </td>
                <td className="px-2.5 py-3 text-accent-2">
                  {fmtXP(r.totalXP)}
                </td>
                <td className="px-2.5 py-3 text-accent-2">
                  {fmtXP(Math.round(r.avgXP))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
