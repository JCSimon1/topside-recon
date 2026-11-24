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
  | 'i18n'

export const tabs: Tab<View>[] = [
  { id: 'entry', labelKey: 'navigation.entry', icon: 'add' },
  { id: 'list', labelKey: 'navigation.list', icon: 'list' },
  { id: 'analysis', labelKey: 'navigation.analysis', icon: 'chart' },
  { id: 'distribution', labelKey: 'navigation.distribution', icon: 'pie' },
  { id: 'loot', labelKey: 'navigation.loot', icon: 'loot' },
  { id: 'trophy', labelKey: 'navigation.trophy', icon: 'trophy' },
  { id: 'settings', labelKey: 'navigation.settings', icon: 'user' },
  { id: 'loadout', labelKey: 'navigation.loadout', icon: 'construction' },
  { id: 'i18n', labelKey: 'navigation.i18nTestPage', icon: 'construction' },
]
