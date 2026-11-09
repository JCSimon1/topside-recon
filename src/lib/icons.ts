import {
  Backpack,
  ChartColumn,
  Construction,
  Handbag,
  List,
  PieChart,
  PlusCircle,
  Shapes,
  Trophy,
  User,
  UserGroup,
  Users,
} from 'lucide-react'

export const icons = {
  add: PlusCircle,
  chart: ChartColumn,
  construction: Construction,
  duo: Users,
  handbag: Handbag,
  list: List,
  loot: Backpack,
  pie: PieChart,
  trials: Shapes,
  trio: UserGroup,
  trophy: Trophy,
  user: User,
} as const

export type IconName = keyof typeof icons
