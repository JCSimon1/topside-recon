// Pie-Chart mit gleichem Winkel pro Segment und Radius nach Wert. Eigene Legende und Tooltip mit Prozentanteil.

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
} from "recharts";
import type { Slice } from "../lib/stats";

interface DistributionPieProps {
  slices: Slice[];
  colors: string[];
  format: (n: number) => string;
}

export default function DistributionPie({
  slices,
  colors,
  format,
}: DistributionPieProps) {
  if (slices.length === 0) {
    return (
      <div className="py-9 text-center font-mono text-[13px] text-text-faint">
        Keine Daten
      </div>
    );
  }

  const total = slices.reduce((s, x) => s + x.value, 0);

  function SliceTooltip({ active, payload }: TooltipContentProps) {
    if (!active || !payload?.length) return null;
    const s = payload[0].payload as Slice;
    return (
      <div className="rounded-sm border border-border bg-panel px-3 py-2 font-mono text-xs shadow-lg">
        <div className="mb-1 font-display text-sm font-semibold">{s.name}</div>
        <div>{format(s.value)}</div>
        <div className="text-text-muted">
          {Math.round((s.value / total) * 100)} %
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="var(--color-panel)"
              animationDuration={800}
              animationEasing="ease-in"
            >
              {slices.map((s, i) => (
                <Cell key={s.name} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={SliceTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[11.5px] text-text-muted">
        {slices.map((s, i) => (
          <li key={s.name} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
