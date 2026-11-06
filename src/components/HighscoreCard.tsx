// Zeigt die beste Runde nach Geld oder XP und eine aufklappbare Top-Liste. Einträge öffnen optional den Round Report.

import { useState } from "react";
import type { Round } from "../api/types";
import { fmtDate, fmtMoney, fmtXP } from "../lib/format";

interface HighscoreCardProps {
  title: string;
  metric: "money" | "xp";
  rounds: Round[]; // bereits sortiert, beste zuerst
  onSelect?: (round: Round) => void;
}

export default function HighscoreCard({
  title,
  metric,
  rounds,
  onSelect,
}: HighscoreCardProps) {
  const [open, setOpen] = useState(false);
  const fmt = metric === "money" ? fmtMoney : fmtXP;
  const best = rounds[0];

  return (
    <div className="rounded-sm border border-border bg-panel p-4">
      <div className="font-mono text-[10.5px] tracking-wide text-text-faint">
        {title}
      </div>
      {best ? (
        <>
          <div className="mt-1.5 font-display text-3xl font-bold text-accent">
            {fmt(best[metric])}
          </div>
          <div className="font-mono text-[11.5px] text-text-muted">
            {best.map} · {fmtDate(best.date)}
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="mt-3 cursor-pointer text-xs text-text-faint hover:text-accent"
          >
            {open ? "Top-Liste ausblenden" : "Top-Liste anzeigen"}
          </button>
          {open && (
            <ol className="mt-2 flex flex-col gap-1 font-mono text-[14px]">
              {rounds.map((r, i) => (
                <li
                  key={r.id}
                  onClick={() => onSelect?.(r)}
                  className={`flex justify-between gap-4 ${onSelect ? "cursor-pointer hover:text-accent" : ""}`}
                >
                  <span className="text-text-faint text-left">{i + 1}.</span>
                  <span className="flex-1 truncate font-sans text-right">
                    {r.map}
                  </span>
                  <span className="flex-1 truncate font-sans text-right">
                    {r.condition}
                  </span>
                  <span className="text-accent">{fmt(r[metric])}</span>
                  <span className="w-24 shrink-0 text-text-faint">
                    {fmtDate(r.date)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </>
      ) : (
        <div className="mt-2 text-text-faint">Keine Daten</div>
      )}
    </div>
  );
}
