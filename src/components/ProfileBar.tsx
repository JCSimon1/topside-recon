import { useSettings } from "../api/queries";
import SteamCard from "./SteamCard";

export default function ProfileBar() {
  const { data: settings } = useSettings();

  const rankKey = settings?.rank ?? null;
  const rankName = rankKey
    ? (settings?.ranks.find((r) => r.key === rankKey)?.name ?? rankKey)
    : "Kein Rang gewählt";

  return (
    <div className="mb-6 flex flex-wrap items-stretch justify-end rounded-sm border border-border bg-panel px-4 py-2.5">
      <div className="flex items-center gap-3 px-3.5">
        <div className="flex flex-col items-end gap-0.5 text-right">
          <div className="font-mono text-[10px] tracking-wide text-text-faint">
            RANG
          </div>
          <div className="font-display text-[15px] leading-tight font-semibold">
            {rankName}
          </div>
        </div>
        {rankKey && (
          <img
            src={`/images/ranks/${rankKey}.webp`}
            alt=""
            className="size-14 shrink-0 animate-float object-contain drop-shadow-[0_0_8px_rgba(232,163,61,0.25)]"
            onError={(e) => (e.currentTarget.style.visibility = "hidden")}
          />
        )}
        <SteamCard />
      </div>
    </div>
  );
}
