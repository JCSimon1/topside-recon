// Tab “Übersicht”: alle Runden mit Filtern (Map, Condition, Monat), Pagination und Round Report.

import { useState } from "react";
import { useConfig, useDeleteRound, useRounds } from "../api/queries";
import type { Round } from "../api/types";
import {
  filterRounds,
  paginate,
  sortRounds,
  uniqueSorted,
  type RoundFilter,
} from "../lib/rounds";
import Button from "./Button";
import Panel from "./Panel";
import RoundReport from "./RoundReport";
import RoundsTable from "./RoundsTable";

const emptyFilter: RoundFilter = { map: "", condition: "", month: "" };
const selectClass =
  "rounded-sm border border-border bg-panel-alt px-2.5 py-1.5 text-[13px] text-text outline-none focus:border-accent-2";

interface ListViewProps {
  onEdit?: (round: Round) => void;
}

export default function ListView({ onEdit }: ListViewProps) {
  const { data: rounds, isPending, error } = useRounds();
  const { data: config } = useConfig();
  const { mutate: deleteRound } = useDeleteRound();
  const [filter, setFilter] = useState<RoundFilter>(emptyFilter);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Round | null>(null);

  if (isPending) return <p>Lade…</p>;
  if (error) return <p className="text-negative">Fehler: {error.message}</p>;

  const handleDelete = (round: Round) => {
    deleteRound(round.id, {
      onSuccess: () => {
        if (selected?.id === round.id) setSelected(null);
      },
    });
  };
  const update = (patch: Partial<RoundFilter>) => {
    setFilter((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const filtered = sortRounds(filterRounds(rounds, filter));
  const {
    items,
    page: current,
    totalPages,
  } = paginate(filtered, page, config?.ui.listPageSize ?? 20);

  return (
    <>
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

        <RoundsTable
          rounds={items}
          onSelect={setSelected}
          onEdit={onEdit}
          onDelete={handleDelete}
        />

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

      {selected && (
        <RoundReport
          round={selected}
          onClose={() => setSelected(null)}
          onEdit={
            onEdit &&
            ((r) => {
              setSelected(null);
              onEdit(r);
            })
          }
        />
      )}
    </>
  );
}
