import { useSteamProfile } from "../api/queries";
import { steamStatusDot, steamStatusLabel } from "../lib/steam";

export default function SteamCard() {
  const { data: steam, isPending } = useSteamProfile();

  if (!isPending && (!steam || !steam.configured)) return null;

  return (
    <div className="flex items-center gap-3 border-l border-border-soft px-3.5">
      <div className="flex flex-col items-end gap-0.5 text-right">
        <div className="font-mono text-[10px] tracking-wide text-text-faint">
          STEAM
        </div>
        {steam?.configured ? (
          <>
            <div className="font-display text-[15px] leading-tight font-semibold">
              {steam.name}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
              <span
                className={`size-1.75 rounded-full ${steamStatusDot[steam.status]}`}
              />
              {steamStatusLabel[steam.status]}
            </div>
          </>
        ) : (
          <div className="font-mono text-[11px] text-text-muted">Lade…</div>
        )}
      </div>
      {steam?.configured && (
        <img
          src={steam.avatar}
          alt=""
          className="size-14 shrink-0 rounded-full object-cover"
        />
      )}
    </div>
  );
}
