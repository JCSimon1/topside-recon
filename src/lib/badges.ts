import type {
  BadgePeriod,
  BadgeRulesConfig,
  MinRounds,
  Round,
} from '../api/types'
import { groupBy, statsFor, topRounds } from './stats'

export interface Badge {
  key: string
  n?: number
}

// Lose Sicht auf einen Regel-Eintrag; die Regel-Keys kommen aus der Config
interface RuleCfg {
  enabled?: boolean
  periods?: BadgePeriod[]
  minRounds?: MinRounds
  metrics?: ('money' | 'xp')[]
  minPeriods?: number
}

type RuleResult = { n?: number } | null

const pad = (n: number) => String(n).padStart(2, '0')

export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const mondayOf = (d: Date) => {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7))
  return m
}

// [Start, Ende) als 'YYYY-MM-DD'. Wochen beginnen am Montag.
export const periodRange = (kind: BadgePeriod, ref: Date): [string, string] => {
  if (kind === 'month') {
    const start = new Date(ref.getFullYear(), ref.getMonth(), 1)
    const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 1)
    return [dateKey(start), dateKey(end)]
  }
  const start = mondayOf(ref)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return [dateKey(start), dateKey(end)]
}

// Startdatum der Periode, in der ein 'YYYY-MM-DD' liegt
export const periodStartKey = (kind: BadgePeriod, date: string) => {
  const [y, m, d] = date.split('-').map(Number)
  return periodRange(kind, new Date(y, m - 1, d))[0]
}

export const badgeMin = (
  cfg: RuleCfg,
  kind: BadgePeriod,
  fallback: number,
): number => {
  const v = cfg.minRounds
  if (typeof v === 'number') return v
  return v?.[kind] ?? fallback
}

export const computeBadges = (
  kind: BadgePeriod,
  ref: Date,
  rounds: Round[],
  rulesCfg: BadgeRulesConfig | Record<string, RuleCfg | undefined> | undefined,
  deathThreshold: number,
): Badge[] => {
  const cfgs = (rulesCfg ?? {}) as Record<string, RuleCfg | undefined>
  const [startKey, endKey] = periodRange(kind, ref)
  const inPeriod = rounds.filter(
    (r) => r.date && r.date >= startKey && r.date < endKey,
  )
  if (inPeriod.length === 0) return []

  const cur = statsFor(inPeriod, deathThreshold)
  const all = statsFor(rounds, deathThreshold)

  const aboveAvg = (cfg: RuleCfg): RuleResult => {
    const n = badgeMin(cfg, kind, 3)
    const metrics = cfg.metrics ?? ['money', 'xp']
    const ok =
      (metrics.includes('money') && cur.avgMoney > all.avgMoney) ||
      (metrics.includes('xp') && cur.avgXP > all.avgXP)
    return cur.count >= n && ok ? { n } : null
  }

  const rules: Record<string, (cfg: RuleCfg) => RuleResult> = {
    // Beste Runde (Geld oder XP) aller Zeiten liegt in dieser Periode
    record: () => {
      const best = [
        topRounds(rounds, 'money', 1)[0],
        topRounds(rounds, 'xp', 1)[0],
      ]
      return best.some(
        (r) =>
          r && (r.money > 0 || r.xp > 0) && inPeriod.some((p) => p.id === r.id),
      )
        ? {}
        : null
    },
    deathless: (cfg) => {
      const n = badgeMin(cfg, kind, 3)
      return cur.count >= n && cur.deaths === 0 ? { n } : null
    },
    grinder: (cfg) => {
      const n = badgeMin(cfg, kind, 10)
      return cur.count >= n ? { n } : null
    },
    aboveAvg,
    aboveAverage: aboveAvg, // Name aus types.ts
    // Höchstes Gesamtgeld aller bisherigen Perioden
    best: (cfg) => {
      const groups = groupBy(
        rounds.filter((r) => r.date),
        (r) => periodStartKey(kind, r.date),
      )
      if (groups.size < (cfg.minPeriods || 2) || cur.totalMoney <= 0)
        return null
      const maxTotal = Math.max(
        ...[...groups.values()].map(
          (l) => statsFor(l, deathThreshold).totalMoney,
        ),
      )
      return cur.totalMoney >= maxTotal ? {} : null
    },
  }

  return Object.keys(cfgs).flatMap((key) => {
    const cfg = cfgs[key]
    const rule = rules[key]
    if (!cfg || cfg.enabled === false || !rule) return []
    if (cfg.periods && !cfg.periods.includes(kind)) return []
    const result = rule(cfg)
    return result ? [{ key, n: result.n }] : []
  })
}
