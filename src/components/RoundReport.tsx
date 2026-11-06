// Modal-Karte zu einer Runde mit Map-Banner, Werten, Abweichung zum Durchschnitt, Count-up, Scanline und “Top Run”-Stempel. Der Bearbeiten-Button erscheint nur mit onEdit.

import { useConfig, useRounds } from "../api/queries";
import type { Round } from "../api/types";
import { fmtDate, fmtMoney, fmtXP, slugify } from "../lib/format";
import { averages, deltaPercent, isTopRun } from "../lib/rounds";
import { useCountUp } from "../lib/useCountUp";
import Button from "./Button";
import Modal from "./Modal";

interface RoundReportProps {
  round: Round;
  onClose: () => void;
  onEdit?: (round: Round) => void;
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

export default function RoundReport({
  round,
  onClose,
  onEdit,
}: RoundReportProps) {
  const { data: rounds = [] } = useRounds();
  const { data: config } = useConfig();
  const { avgMoney, avgXP } = averages(rounds);
  const top = isTopRun(round, avgMoney, config?.ui.topRunFactor ?? 1.2);

  const moneyShown = useCountUp(round.money);
  const xpShown = useCountUp(round.xp);

  return (
    <Modal onClose={onClose}>
      <div
        className={`relative w-105 max-w-full overflow-hidden rounded-md border bg-panel pb-5 motion-safe:animate-rc-card ${
          top
            ? "border-accent/40 shadow-[0_0_46px_rgba(232,163,61,0.28)]"
            : "border-border"
        }`}
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

        {top && (
          <div
            aria-hidden
            className="absolute top-10 left-4 z-4 rounded-sm border-2 border-accent px-2.5 py-1 font-display text-[15px] font-bold tracking-[1.5px] text-accent mix-blend-screen motion-safe:animate-rc-stamp motion-reduce:rotate-[-9deg]"
          >
            TOP RUN
          </div>
        )}

        <div className="px-6 pt-5">
          <div className="font-mono text-[10.5px] text-text-faint">
            RUN-{String(round.number).padStart(3, "0")} · {fmtDate(round.date)}{" "}
            · {round.time}
          </div>

          <div className="relative mt-3">
            <div
              aria-hidden
              className="absolute -inset-x-6 -top-4 bottom-0 z-2 origin-top bg-panel motion-safe:animate-rc-reveal motion-reduce:hidden"
            />
            <div
              aria-hidden
              className="absolute -inset-x-6 top-0 z-3 h-0.5 bg-linear-to-r from-transparent via-accent to-transparent opacity-0 shadow-[0_0_10px_1px_rgba(232,163,61,0.7)] motion-safe:animate-rc-sweep"
            />

            <dl className="font-mono text-[13.5px]">
              <Row label="CONDITION" value={round.condition} />
              <Row
                label="$ VERDIENT"
                value={fmtMoney(moneyShown)}
                className="text-positive"
              />
              <Row
                label="XP ERHALTEN"
                value={fmtXP(xpShown)}
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
        </div>

        <div className="mx-6 mt-4 flex justify-end gap-2.5 border-t border-border-soft pt-3.5">
          {onEdit && (
            <Button variant="ghost" onClick={() => onEdit(round)}>
              Bearbeiten
            </Button>
          )}
          <Button onClick={onClose}>Schließen</Button>
        </div>
      </div>
    </Modal>
  );
}
