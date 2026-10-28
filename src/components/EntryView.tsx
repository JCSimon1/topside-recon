import { useState } from 'react'
import { useConfig, useRounds } from '../api/queries'
import type { Round } from '../api/types'
import { nextRoundNumber, sortRounds } from '../lib/rounds'
import Panel from './Panel'
import RoundForm from './RoundForm'
import RoundsTable from './RoundsTable'

export default function EntryView() {
  const { data: rounds, isPending, error } = useRounds()
  const { data: config } = useConfig()
  const [editing, setEditing] = useState<Round | null>(null)   // <- hier, in der Funktion

  if (isPending) return <p>Lade…</p>
  if (error) return <p className="text-negative">Fehler: {error.message}</p>

  const recentRows = config?.ui.recentRows ?? 6
  const recent = sortRounds(rounds).slice(0, recentRows)

  return (
    <div className="flex flex-col gap-4.5">
      <Panel title={editing ? 'Runde bearbeiten' : 'Neue Runde eintragen'}>
        <RoundForm
          key={editing?.id ?? 'new'}
          editing={editing}
          nextNumber={nextRoundNumber(rounds)}
          onDone={() => setEditing(null)}
        />
      </Panel>

      <Panel title="Letzte Runden">
        <RoundsTable rounds={recent} onEdit={setEditing} />
      </Panel>
    </div>
  )
}