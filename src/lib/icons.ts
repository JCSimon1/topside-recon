import {
  Backpack,
  ChartColumn,
  List,
  PieChart,
  PlusCircle,
  PocketKnife,
  Trophy,
  User,
} from 'lucide-react'

export const icons = {
  add: PlusCircle,
  chart: ChartColumn,
  list: List,
  loot: Backpack,
  pie: PieChart,
  trials: PocketKnife,
  trophy: Trophy,
  user: User,
} as const

export type IconName = keyof typeof icons
