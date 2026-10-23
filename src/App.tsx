import { useSettings, useSaveRank } from "./api/queries";

export default function App() {
  const { data: settings, isPending, error } = useSettings();
  const { mutate: saveRank } = useSaveRank();

  if (isPending) return <p className="p-6">Lade…</p>;
  if (error) return <p className="p-6 text-red-400">Fehler: {error.message}</p>;

  return (
    <main className="p-6">
      <select
        value={settings.rank ?? ''}
        onChange={(e) => saveRank(e.target.value || null)}
        className="bg-gray-800 p-2 text-white"
      >
        <option value="">Rang wählen…</option>
        {settings.ranks.map((r) => (
          <option key={r.key} value={r.key}>
            {r.name}
          </option>
        ))}
      </select>
    </main>
  )
}
