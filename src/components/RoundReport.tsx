// src/components/RoundReport.tsx
import { useConfig, useRounds } from "../api/queries";
import type { Round } from "../api/types";
import { fmtDate, fmtMoney, fmtXP, slugify } from "../lib/format";
import { averages, deltaPercent, isTopRun } from "../lib/rounds";
import Button from "./Button";
import Modal from "./Modal";

interface RoundReportProps {
  round: Round;
  onClose: () => void;
  onEdit: (round: Round) => void;
}

function Delta({
  pct,
  over,
  under,
}: {
  pct: number | null;
  over: string;
  under: string;
}) {
  if (pct === null) return null;
  const neg = pct < 0;
  return (
    <div className="font-mono text-[11.5px] text-text-faint">
      <b className={neg ? "text-negative" : "text-positive"}>
        {pct >= 0 ? "+" : ""}
        {pct}%
      </b>{" "}
      {neg ? under : over}
    </div>
  );
}

export default function RoundReport({
  round,
  onClose,
  onEdit,
}: RoundReportProps) {
  const { data: rounds = [] } = useRounds();
  const { data: config } = useConfig();
  const { avgMoney, avgXP } = averages(rounds);
  const top = isTopRun(round, avgMoney, config?.ui.topRunFactor ?? 1.2);

  return (
    <Modal onClose={onClose}>
      <div
        className={`w-[420px] max-w-full overflow-hidden rounded-md border bg-panel pb-5 ${top ? "border-accent/40" : "border-border"}`}
      >
        <div className="relative h-32 bg-panel-alt">
          <img
            src={`/images/maps/${slugify(round.map)}.webp`}
            alt=""
            className="size-full object-cover brightness-75"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="absolute bottom-2.5 left-4 font-display text-xl font-bold">
            {round.map}
          </div>
        </div>
        <div className="px-6 pt-5">
          <div className="font-mono text-[10.5px] text-text-faint">
            RUN-{String(round.number).padStart(3, "0")} · {fmtDate(round.date)}{" "}
            · {round.time}
          </div>
          <dl className="mt-3 font-mono text-[13.5px]">
            <Row label="CONDITION" value={round.condition} />
            <Row
              label="$ VERDIENT"
              value={fmtMoney(round.money)}
              className="text-positive"
            />
            <Row
              label="XP ERHALTEN"
              value={fmtXP(round.xp)}
              className="text-accent-2"
            />
          </dl>
          <div className="mt-3.5 flex flex-col gap-1">
            <Delta
              pct={deltaPercent(round.money, avgMoney)}
              over="über deinem Ø-Verdienst"
              under="unter deinem Ø-Verdienst"
            />
            <Delta
              pct={deltaPercent(round.xp, avgXP)}
              over="über deinem Ø-XP"
              under="unter deinem Ø-XP"
            />
          </div>
        </div>
        <div className="mx-6 mt-4 flex justify-end gap-2.5 border-t border-border-soft pt-3.5">
          <Button variant="ghost" onClick={() => onEdit(round)}>
            Bearbeiten
          </Button>
          <Button onClick={onClose}>Schließen</Button>
        </div>
      </div>
    </Modal>
  );
}

function Row({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border-soft py-2 last:border-b-0">
      <dt className="text-[11.5px] text-text-muted">{label}</dt>
      <dd className={className}>{value}</dd>
    </div>
  );
}
