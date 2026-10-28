import { useConfig, useRounds } from "../api/queries";
import { sortRounds, nextRoundNumber } from "../lib/rounds";
import Panel from "./Panel";
import RoundsTable from "./RoundsTable";
import RoundForm from "./RoundForm";

export default function EntryView() {
  const { data: rounds, isPending, error } = useRounds();
  const { data: config } = useConfig();

  if (isPending) return <p>Lade…</p>;
  if (error) return <p className="text-negative">Fehler: {error.message}</p>;

  const recentRows = config?.ui.recentRows ?? 6;
  const recent = sortRounds(rounds).slice(0, recentRows);

  return (
    <div className="flex flex-col gap-4.5">
      <Panel title="Neue Runde eintragen">
        <RoundForm nextNumber={nextRoundNumber(rounds)} />
      </Panel>
      <Panel title="Letzte Runden">
        <RoundsTable rounds={recent} />
      </Panel>
    </div>
  );
}
