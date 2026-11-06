import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { fmtMoney, fmtXP } from "../lib/format";
import type { Breakdown, BreakdownDim } from "../lib/stats";

interface BreakdownChartProps {
  rows: Breakdown[];
  dim: BreakdownDim;
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as Breakdown;
  return (
    <div className="rounded-sm border border-border bg-panel px-3 py-2 font-mono text-xs shadow-lg">
      <div className="mb-1 font-display text-sm font-semibold">{row.key}</div>
      <div className="text-positive">
        Ø {fmtMoney(Math.round(row.avgMoney))}
      </div>
      <div className="text-accent-2">Ø {fmtXP(Math.round(row.avgXP))} XP</div>
      <div className="text-text-muted">{row.count} Runden</div>
    </div>
  );
}

const axisTick = { fontSize: 11, fontFamily: "var(--font-mono)" };

export default function BreakdownChart({ rows, dim }: BreakdownChartProps) {
  if (rows.length === 0) return null;
  const data = dim === "month" ? [...rows].reverse() : rows;

  return (
    <div className="mb-5 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--color-border-soft)" />
          <XAxis
            dataKey="key"
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            tick={{ ...axisTick, fill: "var(--color-text-muted)" }}
          />
          <YAxis
            yAxisId="money"
            width={64}
            tickLine={false}
            axisLine={false}
            tick={{ ...axisTick, fill: "var(--color-accent)" }}
            tickFormatter={(v: number) => fmtXP(v)}
          />
          <YAxis
            yAxisId="xp"
            orientation="right"
            width={56}
            tickLine={false}
            axisLine={false}
            tick={{ ...axisTick, fill: "var(--color-accent-2)" }}
            tickFormatter={(v: number) => fmtXP(v)}
          />
          <Tooltip
            content={ChartTooltip}
            cursor={{ fill: "rgba(232,163,61,0.06)" }}
          />
          <Legend
            verticalAlign="top"
            iconType="square"
            wrapperStyle={{
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-muted)",
            }}
          />
          <Bar
            yAxisId="money"
            dataKey="avgMoney"
            name="Ø $ pro Runde"
            fill="var(--color-accent)"
            fillOpacity={0.55}
            stroke="var(--color-accent)"
            barSize={22}
            radius={[2, 2, 0, 0]}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Bar
            yAxisId="xp"
            dataKey="avgXP"
            name="Ø XP pro Runde"
            fill="var(--color-accent-2)"
            fillOpacity={0.55}
            stroke="var(--color-accent-2)"
            barSize={22}
            radius={[2, 2, 0, 0]}
            animationDuration={800}
            animationBegin={150}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
