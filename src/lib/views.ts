import type { Tab } from '../components/TabNav'

export type View =
  | 'entry'
  | 'list'
  | 'analysis'
  | 'distribution'
  | 'loot'
  | 'trophy'
  | 'settings'
  | 'loadout'

export const tabs: Tab<View>[] = [
  { id: 'entry', label: 'Erfassen', icon: 'add' },
  { id: 'list', label: 'Übersicht', icon: 'list' },
  { id: 'analysis', label: 'Auswertung', icon: 'chart' },
  { id: 'distribution', label: 'Verteilung', icon: 'pie' },
  { id: 'loot', label: 'Loot', icon: 'loot' },
  { id: 'trophy', label: 'Trophy Room', icon: 'trophy' },
  { id: 'settings', label: 'Profil', icon: 'user' },
  { id: 'loadout', label: 'Loadout', icon: 'construction' },
]
