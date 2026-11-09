import type { Tab } from '../components/TabNav'

export type View =
  | 'entry'
  | 'list'
  | 'analysis'
  | 'distribution'
  | 'loot'
  | 'trophy'
  | 'settings'

export const tabs: Tab<View>[] = [
  { id: 'entry', label: 'Erfassen', icon: 'add' },
  { id: 'list', label: 'Übersicht', icon: 'add' },
  { id: 'analysis', label: 'Auswertung', icon: 'add' },
  { id: 'distribution', label: 'Verteilung', icon: 'add' },
  { id: 'loot', label: 'Loot', icon: 'loot' },
  { id: 'trophy', label: 'Trophy Room', icon: 'add' },
  { id: 'settings', label: 'Profil', icon: 'add' },
]
