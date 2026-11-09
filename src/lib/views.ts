import type { Tab } from '../components/TabNav'
import {
  PlusCircle,
  ChartColumn,
  PieChart,
  Backpack,
  Trophy,
  User,
  Target,
} from 'lucide-react'

export type View =
  | 'entry'
  | 'list'
  | 'analysis'
  | 'distribution'
  | 'loot'
  | 'trophy'
  | 'settings'

export const tabs: Tab<View>[] = [
  { id: 'entry', label: 'Erfassen', icon: PlusCircle },
  { id: 'list', label: 'Übersicht', icon: Target },
  { id: 'analysis', label: 'Auswertung', icon: ChartColumn },
  { id: 'distribution', label: 'Verteilung', icon: PieChart },
  { id: 'loot', label: 'Loot', icon: Backpack },
  { id: 'trophy', label: 'Trophy Room', icon: Trophy },
  { id: 'settings', label: 'Profil', icon: User },
]
