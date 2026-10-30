import { useState } from "react";
import { useConfig, useDeleteRound, useRounds } from "../api/queries";
import type { Round } from "../api/types";
import { nextRoundNumber, sortRounds } from "../lib/rounds";
import Panel from "./Panel";
import RoundForm from "./RoundForm";
import RoundReport from "./RoundReport";
import RoundsTable from "./RoundsTable";

export default function EntryView() {
  const { data: rounds, isPending, error } = useRounds();
  const { data: config } = useConfig();
  const [editing, setEditing] = useState<Round | null>(null);
  const [selected, setSelected] = useState<Round | null>(null);
  const { mutate: deleteRound } = useDeleteRound();

  if (isPending) return <p>Lade…</p>;
  if (error) return <p className="text-negative">Fehler: {error.message}</p>;

  const recentRows = config?.ui.recentRows ?? 6;
  const recent = sortRounds(rounds).slice(0, recentRows);
  const handleDelete = (round: Round) => {
    if (!window.confirm(`Runde ${round.number} wirklich löschen?`)) return;
    deleteRound(round.id, {
      onSuccess: () => {
        if (editing?.id === round.id) setEditing(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4.5">
      <Panel title={editing ? "Runde bearbeiten" : "Neue Runde eintragen"}>
        <RoundForm
          key={editing?.id ?? "new"}
          editing={editing}
          nextNumber={nextRoundNumber(rounds)}
          onDone={() => setEditing(null)}
        />
      </Panel>

      <Panel title="Letzte Runden">
        <RoundsTable
          rounds={recent}
          onSelect={setSelected}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      </Panel>

      {selected && (
        <RoundReport
          round={selected}
          onClose={() => setSelected(null)}
          onEdit={(r) => {
            setSelected(null);
            setEditing(r);
          }}
        />
      )}
    </div>
  );
}
