import { useState } from "react";
import { useConfig, useRounds } from "../api/queries";
import {
  filterRounds,
  paginate,
  sortRounds,
  uniqueSorted,
  type RoundFilter,
} from "../lib/rounds";
import Button from "./Button";
import Panel from "./Panel";
import RoundsTable from "./RoundsTable";

const emptyFilter: RoundFilter = { map: "", condition: "", month: "" };
const selectClass =
  "rounded-sm border border-border bg-panel-alt px-2.5 py-1.5 text-[13px] text-text outline-none focus:border-accent-2";

export default function ListView() {
  const { data: rounds, isPending, error } = useRounds();
  const { data: config } = useConfig();
  const [filter, setFilter] = useState<RoundFilter>(emptyFilter);
  const [page, setPage] = useState(1);

  if (isPending) return <p>Lade…</p>;
  if (error) return <p className="text-negative">Fehler: {error.message}</p>;

  const update = (patch: Partial<RoundFilter>) => {
    setFilter((f) => ({ ...f, ...patch }));
    setPage(1); // jeder Filterwechsel springt auf Seite 1
  };

  const filtered = sortRounds(filterRounds(rounds, filter));
  const {
    items,
    page: current,
    totalPages,
  } = paginate(filtered, page, config?.ui.listPageSize ?? 20);

  return (
    <Panel title="Alle Runden">
      <div className="mb-4 flex flex-wrap gap-2.5">
        <select
          className={selectClass}
          value={filter.map}
          onChange={(e) => update({ map: e.target.value })}
        >
          <option value="">Alle Maps</option>
          {uniqueSorted(rounds.map((r) => r.map)).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filter.condition}
          onChange={(e) => update({ condition: e.target.value })}
        >
          <option value="">Alle Conditions</option>
          {uniqueSorted(rounds.map((r) => r.condition)).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="month"
          className={selectClass}
          value={filter.month}
          onChange={(e) => update({ month: e.target.value })}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setFilter(emptyFilter);
            setPage(1);
          }}
        >
          Filter zurücksetzen
        </Button>
      </div>

      <RoundsTable rounds={items} />

      <div className="mt-4 flex items-center justify-center gap-3.5">
        <Button
          variant="ghost"
          disabled={current <= 1}
          onClick={() => setPage(current - 1)}
        >
          ← Zurück
        </Button>
        <span className="font-mono text-xs text-text-muted">
          Seite {current} von {totalPages}
        </span>
        <Button
          variant="ghost"
          disabled={current >= totalPages}
          onClick={() => setPage(current + 1)}
        >
          Weiter →
        </Button>
      </div>
    </Panel>
  );
}
