import type { Round } from "../api/types";
import { fmtDate, fmtMoney, fmtXP } from "../lib/format";

interface RoundsTableProps {
  rounds: Round[];
}

export default function RoundsTable({ rounds }: RoundsTableProps) {
  if (rounds.length === 0) {
    return (
      <div className="px-5 py-9 text-center font-mono text-[13px] text-text-faint">
        Noch keine Runden erfasst.
      </div>
    );
  }

  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="border-b border-border text-left font-mono text-[11px] text-text-faint">
          <th className="px-2.5 pb-2.5">Nr.</th>
          <th className="px-2.5 pb-2.5">Datum</th>
          <th className="px-2.5 pb-2.5">Zeit</th>
          <th className="px-2.5 pb-2.5">Map</th>
          <th className="px-2.5 pb-2.5">Condition</th>
          <th className="px-2.5 pb-2.5 text-right">$</th>
          <th className="px-2.5 pb-2.5 text-right">XP</th>
        </tr>
      </thead>
      <tbody>
        {rounds.map((r) => (
          <tr
            key={r.id}
            className="border-b border-border-soft font-mono last:border-b-0 hover:bg-accent/10"
          >
            <td className="px-2.5 py-2.5">{r.number}</td>
            <td className="px-2.5 py-2.5">{fmtDate(r.date)}</td>
            <td className="px-2.5 py-2.5">{r.time}</td>
            <td className="px-2.5 py-2.5 font-sans">{r.map}</td>
            <td className="px-2.5 py-2.5 font-sans">{r.condition}</td>
            <td className="px-2.5 py-2.5 text-right text-positive">
              {fmtMoney(r.money)}
            </td>
            <td className="px-2.5 py-2.5 text-right text-accent-2">
              {fmtXP(r.xp)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
