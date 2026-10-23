import { useRounds } from "./api/queries";

export default function App() {
  const { data: rounds, isPending, error } = useRounds();

  if (isPending) return <p className="p-6">Lade…</p>;
  if (error) return <p className="p-6 text-red-400">Fehler: {error.message}</p>;

  return <p className="p-6">{rounds.length} Runden</p>;
}
