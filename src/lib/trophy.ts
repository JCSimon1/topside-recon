import type { BadgeTier, Round, TrophyRoomConfig } from '../api/types'
import { groupBy, statsFor, type Stats } from './stats'

export type TitleKey = 'lucky' | 'grinder' | 'survivor'

export interface MonthTrophy extends Stats {
  month: string // 'YYYY-MM'
  tier: BadgeTier | null
  titles: TitleKey[]
  bestRun: number
  goalProgress: number // 0..1, bei Übererfüllung > 1
}

const tierOrder: BadgeTier[] = ['platinum', 'gold', 'silver', 'bronze']

export const tierFor = (
  totalMoney: number,
  count: number,
  cfg: TrophyRoomConfig['tiers'],
): BadgeTier | null => {
  if (count < cfg.minRounds) return null
  return tierOrder.find((t) => totalMoney >= cfg.money[t]) ?? null
}

export const buildMonthTrophies = (
  rounds: Round[],
  cfg: TrophyRoomConfig,
  deathThreshold: number,
): MonthTrophy[] => {
  const byMonth = groupBy(rounds, (r) => r.date.slice(0, 7))

  return [...byMonth.entries()]
    .map(([month, items]) => {
      const stats = statsFor(items, deathThreshold)
      const bestRun = Math.max(...items.map((r) => r.money))
      const enough = stats.count >= cfg.tiers.minRounds

      const titles: TitleKey[] = []
      if (
        enough &&
        stats.totalMoney > 0 &&
        bestRun / stats.totalMoney >= cfg.titles.luckyShare
      )
        titles.push('lucky')
      if (stats.count >= cfg.titles.grinderRounds) titles.push('grinder')
      if (
        enough &&
        (stats.count - stats.deaths) / stats.count >= cfg.titles.survivorRate
      )
        titles.push('survivor')

      return {
        ...stats,
        month,
        bestRun,
        titles,
        tier: tierFor(stats.totalMoney, stats.count, cfg.tiers),
        goalProgress:
          cfg.monthlyGoal.money > 0
            ? stats.totalMoney / cfg.monthlyGoal.money
            : 0,
      }
    })
    .sort((a, b) => b.month.localeCompare(a.month))
}
