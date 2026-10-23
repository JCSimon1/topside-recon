import { useState } from 'react'
import { tabs, type View } from './lib/views'
import TabNav from './components/TabNav'
import Header from './components/Header'
import ProfileBar from './components/ProfileBar'


export default function App() {
  const [view, setView] = useState<View>('entry')

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-7 pb-20">

      <Header /> 

      <ProfileBar />

      <TabNav tabs={tabs} active={view} onChange={setView} />

      <main>
        {view === 'entry' && <p>Erfassen</p>}
        {view === 'list' && <p>Übersicht</p>}
        {view === 'analysis' && <p>Auswertung</p>}
        {view === 'distribution' && <p>Verteilung</p>}
        {view === 'loot' && <p>Loot</p>}
        {view === 'trophy' && <p>Trophy Room</p>}
        {view === 'settings' && <p>Profil</p>}
      </main>
    </div>
  )
}