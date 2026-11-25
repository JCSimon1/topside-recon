import type { BadgeTier, Round, TrophyRoomConfig } from '../api/types'
import { isDeath, sortRounds } from './rounds'
import { groupBy, statsFor, type Stats } from './stats'

export type TitleKey = 'lucky' | 'grinder' | 'survivor'

export interface MonthBadge {
  key: string
  n?: number
}

export interface MapStat extends Stats {
  map: string
}

export interface DayStat extends Stats {
  day: string // 'YYYY-MM-DD'
}

export interface MonthSummary extends Stats {
  ym: string // 'YYYY-MM'
  year: number
  month: number // 1..12
  isOpen: boolean
  activeDays: number
  survivalRate: number // 0..1
  deltaMoney: number | null // relative change vs. previous month, e.g. -0.32
  bestStreak: number
  bestDay: DayStat
  favMap: MapStat
  bestMap: MapStat | null
  bestRun: Round
  dayCounts: number[] // runs per day of the month
  offset: number // weekday of the 1st, Monday = 0
  rank: number
  monthCount: number
  tier: BadgeTier | null
  title: TitleKey | null
  badges: MonthBadge[]
}

const tierOrder: BadgeTier[] = ['platinum', 'gold', 'silver', 'bronze']

export const localeFor = (lng: string) =>
  lng.startsWith('de') ? 'de-DE' : 'en-US'

export const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

export const tierFor = (
  totalMoney: number,
  count: number,
  cfg: TrophyRoomConfig['tiers'],
): BadgeTier | null => {
  if (count < cfg.minRounds) return null
  return tierOrder.find((t) => totalMoney >= cfg.money[t]) ?? null
}

export const titleFor = (
  s: {
    count: number
    totalMoney: number
    bestRun: Pick<Round, 'money'>
    survivalRate: number
  },
  cfg: TrophyRoomConfig,
): TitleKey | null => {
  if (s.count < cfg.tiers.minRounds) return null
  if (
    s.totalMoney > 0 &&
    s.bestRun.money / s.totalMoney >= cfg.titles.luckyShare
  )
    return 'lucky'
  if (s.count >= cfg.titles.grinderRounds) return 'grinder'
  if (s.survivalRate >= cfg.titles.survivorRate) return 'survivor'
  return null
}

export const buildMonthSummaries = (
  rounds: Round[],
  cfg: TrophyRoomConfig,
  deathThreshold: number,
  now: Date = new Date(),
): MonthSummary[] => {
  const groups = groupBy(
    rounds.filter((r) => r.date),
    (r) => r.date.slice(0, 7),
  )
  const keys = [...groups.keys()].sort()
  const stats = new Map(
    keys.map((k) => [k, statsFor(groups.get(k)!, deathThreshold)]),
  )
  const byTotal = [...keys].sort(
    (a, b) => stats.get(b)!.totalMoney - stats.get(a)!.totalMoney,
  )
  const nowKey = monthKey(now)

  return keys
    .map((ym, idx): MonthSummary => {
      const list = groups.get(ym)!
      const s = stats.get(ym)!
      const [year, month] = ym.split('-').map(Number)
      const isOpen = ym === nowKey

      // Longest deathless streak (chronological)
      let run = 0
      let bestStreak = 0
      for (const r of sortRounds(list).reverse()) {
        run = isDeath(r, deathThreshold) ? 0 : run + 1
        bestStreak = Math.max(bestStreak, run)
      }

      // Days
      const byDay = groupBy(list, (r) => r.date)
      const dayCounts = Array.from(
        { length: new Date(year, month, 0).getDate() },
        () => 0,
      )
      byDay.forEach((l, d) => {
        dayCounts[Number(d.slice(8, 10)) - 1] = l.length
      })
      const bestDay = [...byDay.entries()]
        .map(([day, l]) => ({ day, ...statsFor(l, deathThreshold) }))
        .sort((a, b) => b.totalMoney - a.totalMoney)[0]

      // Maps
      const byMap = [...groupBy(list, (r) => r.map || '—').entries()].map(
        ([map, l]) => ({ map, ...statsFor(l, deathThreshold) }),
      )
      const favMap = [...byMap].sort((a, b) => b.count - a.count)[0]
      const bestMap =
        [...byMap]
          .filter((x) => x.count >= 3)
          .sort((a, b) => b.avgMoney - a.avgMoney)[0] ?? null

      const bestRun = [...list].sort((a, b) => b.money - a.money)[0]
      const survivalRate = s.count ? 1 - s.deaths / s.count : 0

      // Delta vs. previous month. For the running month only the same
      // days of the previous month are compared, otherwise it always looks bad.
      let deltaMoney: number | null = null
      const prevKey = idx > 0 ? keys[idx - 1] : null
      if (prevKey) {
        const prevList = isOpen
          ? groups
              .get(prevKey)!
              .filter((r) => Number(r.date.slice(8, 10)) <= now.getDate())
          : groups.get(prevKey)!
        const prevTotal = statsFor(prevList, deathThreshold).totalMoney
        if (prevTotal > 0) deltaMoney = s.totalMoney / prevTotal - 1
      }

      return {
        ...s,
        ym,
        year,
        month,
        isOpen,
        activeDays: byDay.size,
        survivalRate,
        deltaMoney,
        bestStreak,
        bestDay,
        favMap,
        bestMap,
        bestRun,
        dayCounts,
        offset: (new Date(year, month - 1, 1).getDay() + 6) % 7,
        rank: byTotal.indexOf(ym) + 1,
        monthCount: keys.length,
        tier: isOpen ? null : tierFor(s.totalMoney, s.count, cfg.tiers),
        title: isOpen ? null : titleFor({ ...s, bestRun, survivalRate }, cfg),
        // TODO: port computeBadges('month', date) from the old project
        badges: [],
      }
    })
    .reverse() // newest first
}
