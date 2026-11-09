import { useState } from 'react'
import { tabs, type View } from './lib/views'
import type { Round } from './api/types'
import AnalysisView from './components/AnalysisView'
import DistributionView from './components/DistributionView'
import EntryView from './components/EntryView'
import Header from './components/Header'
import ListView from './components/ListView'
import LootView from './components/LootView'
import ProfileBar from './components/ProfileBar'
import ProfileView from './components/ProfileView'
import TabNav from './components/TabNav'
import TrophyTest from './components/TrophyTest'

export default function App() {
  const [view, setView] = useState<View>('entry')
  const [editing, setEditing] = useState<Round | null>(null)
  const [returnTo, setReturnTo] = useState<View | null>(null)

  const startEdit = (round: Round) => {
    setReturnTo(view)
    setEditing(round)
    setView('entry')
  }

  const finishEdit = () => {
    setEditing(null)
    if (returnTo) setView(returnTo)
    setReturnTo(null)
  }

  return (
    <div className="mx-auto max-w-310 px-5 pt-7 pb-20">
      <Header />

      <ProfileBar />

      <TabNav tabs={tabs} active={view} onChange={setView} />

      <main>
        {view === 'entry' && (
          <EntryView
            editing={editing}
            onEditingChange={setEditing}
            onEditDone={finishEdit}
          />
        )}
        {view === 'list' && <ListView onEdit={startEdit} />}
        {view === 'analysis' && <AnalysisView />}
        {view === 'distribution' && <DistributionView />}
        {view === 'loot' && <LootView />}
        {view === 'trophy' && <TrophyTest />}
        {view === 'settings' && <ProfileView />}
        {view === 'loadout'}
      </main>
    </div>
  )
}
