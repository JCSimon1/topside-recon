import { useLoot } from '../api/queries'
import { lootTotal } from '../lib/loot'
import { fmtMoney } from '../lib/format'
import LootRow from './LootRow'
import Panel from './Panel'

export default function LootView() {
  const { data: loot, isPending, error } = useLoot()

  if (isPending) return <p>Lade…</p>
  if (error) return <p className="text-negative">Fehler: {error.message}</p>

  return (
    <div className="flex flex-col gap-4.5">
      <Panel>
        <div className="flex flex-wrap items-baseline justify-between gap-2.5">
          <div className="font-mono text-xs tracking-wide text-text-faint">
            GESAMTWERT STASH
          </div>
          <div className="font-display text-4xl font-bold text-accent">
            {fmtMoney(lootTotal(loot))}
          </div>
        </div>
      </Panel>

      <Panel title="Loot Stash">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[11px] text-text-faint">
              <th className="px-2.5 pb-2.5">Item</th>
              <th className="px-2.5 pb-2.5 text-right">Preis</th>
              <th className="px-2.5 pb-2.5 text-right">Menge</th>
              <th className="px-2.5 pb-2.5 text-right">Summe</th>
            </tr>
          </thead>
          <tbody>
            {loot.map((item) => (
              <LootRow key={item.key} item={item} />
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}