// Tab “Verteilung”: Kennzahl-Umschalter ($, XP, Runden) und zwei Charts, nach Map und nach Condition.

import { useState } from "react";
import { useConfig, useRounds } from "../api/queries";
import { fmtMoney, fmtXP } from "../lib/format";
import { breakdownBy, keyFor, pieSlices, type PieMetric } from "../lib/stats";
import DistributionPie from "./DistributionPie";
import Panel from "./Panel";

const FALLBACK_COLORS = ["#e8a33d", "#5c8b8f", "#8faa66", "#c1503f", "#b07a4f"];

const metrics: {
  id: PieMetric;
  label: string;
  format: (n: number) => string;
}[] = [
  { id: "totalMoney", label: "Gesamt $", format: fmtMoney },
  { id: "totalXP", label: "Gesamt XP", format: fmtXP },
  { id: "count", label: "Runden", format: (n) => String(n) },
];

export default function DistributionView() {
  const { data: rounds, isPending, error } = useRounds();
  const { data: config } = useConfig();
  const [metric, setMetric] = useState<PieMetric>("totalMoney");

  if (isPending) return <p>Lade…</p>;
  if (error) return <p className="text-negative">Fehler: {error.message}</p>;

  const threshold = config?.ui.deathMoneyThreshold ?? 0;
  const topN = config?.ui.distributionTopN ?? 5;
  const colors = config?.charts.pieColors.length
    ? config.charts.pieColors
    : FALLBACK_COLORS;
  const current = metrics.find((m) => m.id === metric)!;

  const byMap = pieSlices(
    breakdownBy(rounds, keyFor.map, threshold),
    metric,
    topN,
  );
  const byCondition = pieSlices(
    breakdownBy(rounds, keyFor.condition, threshold),
    metric,
    topN,
  );

  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex gap-2">
        {metrics.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMetric(m.id)}
            className={`cursor-pointer rounded-sm border px-3 py-1.5 text-[13px] font-medium ${
              metric === m.id
                ? "border-accent text-accent"
                : "border-border bg-panel-alt text-text-muted hover:text-text"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-4.5 lg:grid-cols-2">
        <Panel title="Nach Map">
          <DistributionPie
            slices={byMap}
            colors={colors}
            format={current.format}
          />
        </Panel>
        <Panel title="Nach Condition">
          <DistributionPie
            slices={byCondition}
            colors={colors}
            format={current.format}
          />
        </Panel>
      </div>
    </div>
  );
}
