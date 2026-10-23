import { useState } from 'react'

type View =
  | 'entry'
  | 'list'
  | 'analysis'
  | 'distribution'
  | 'loot'
  | 'trophy'
  | 'settings'

const tabs: { id: View; label: string }[] = [
  { id: 'entry', label: 'Erfassen' },
  { id: 'list', label: 'Übersicht' },
  { id: 'analysis', label: 'Auswertung' },
  { id: 'distribution', label: 'Verteilung' },
  { id: 'loot', label: 'Loot' },
  { id: 'trophy', label: 'Trophy Room' },
  { id: 'settings', label: 'Profil' },
]



export default function App() {
  const [view, setView] = useState<View>('trophy')

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-7 pb-20">
      <header className="mb-6 flex items-end justify-between border-b border-border pb-4">
        <div className="flex items-baseline gap-3">
          <div className="font-display text-3xl font-bold"> Arc Raiders <span className="text-accent">Topside Recon</span>
          </div>
          <div className="font-mono text-xs text-text-faint">Tracker</div>
        </div>
      </header>

      <nav className="mb-6 flex gap-0.5 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`-mb-px mr-6 border-b-2 px-1 py-2.5 text-[14.5px] font-medium ${
              view === tab.id
                ? 'border-accent text-text'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

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