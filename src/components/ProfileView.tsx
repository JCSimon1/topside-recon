import { useSaveRank, useSettings } from "../api/queries";
import Panel from "./Panel";

export default function ProfileView() {
  const { data: settings, isPending, error } = useSettings();
  const { mutate: saveRank } = useSaveRank();

  if (isPending) return <p>Lade…</p>;
  if (error) return <p className="text-negative">Fehler: {error.message}</p>;

  return (
    <div className="flex flex-col gap-4.5">
      <Panel title="Trials-Rang">
        <div className="flex flex-wrap items-center gap-4.5">
          <div className="flex size-20 items-center justify-center rounded-sm border border-border bg-panel-alt p-2.5">
            {settings.rank && (
              <img
                src={`/images/ranks/${settings.rank}.webp`}
                alt=""
                className="size-full object-contain"
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              />
            )}
          </div>
          <select
            value={settings.rank ?? ""}
            onChange={(e) => saveRank(e.target.value || null)}
            className="min-w-[200px] cursor-pointer rounded-sm border border-border bg-panel-alt px-2.5 py-2 text-[13.5px] font-medium outline-none focus:border-accent-2"
          >
            <option value="">Rang wählen…</option>
            {settings.ranks.map((r) => (
              <option key={r.key} value={r.key}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </Panel>
    </div>
  );
}
