import { describe, expect, it } from 'vitest'
import type { Round, TrophyRoomConfig } from '../api/types'
import { buildMonthSummaries, tierFor, titleFor } from './trophy'

const round = (overrides: Partial<Round> = {}): Round => ({
  id: 1,
  number: 1,
  date: '2026-01-01',
  time: '12:00',
  map: 'Spaceport',
  condition: 'Clear',
  money: 0,
  xp: 0,
  ...overrides,
})

const cfg: TrophyRoomConfig = {
  tiers: {
    minRounds: 2,
    money: { bronze: 100, silver: 200, gold: 300, platinum: 400 },
  },
  titles: { luckyShare: 0.5, grinderRounds: 3, survivorRate: 0.8 },
  monthlyGoal: { money: 1000 },
  imageVersion: null,
}

const later = new Date(2027, 0, 1)

describe('tierFor', () => {
  it('returns null below minRounds', () => {
    expect(tierFor(9999, 1, cfg.tiers)).toBeNull()
  })
  it('returns the highest reached tier', () => {
    expect(tierFor(350, 2, cfg.tiers)).toBe('gold')
  })
  it('returns null below bronze', () => {
    expect(tierFor(50, 2, cfg.tiers)).toBeNull()
  })
  it('counts money exactly on the threshold', () => {
    expect(tierFor(100, 2, cfg.tiers)).toBe('bronze')
  })
})

describe('titleFor', () => {
  const base = {
    count: 5,
    totalMoney: 1000,
    bestRun: { money: 100 },
    survivalRate: 0.5,
  }
  it('returns null below minRounds', () => {
    expect(titleFor({ ...base, count: 1 }, cfg)).toBeNull()
  })
  it('prefers lucky over grinder', () => {
    expect(titleFor({ ...base, bestRun: { money: 900 } }, cfg)).toBe('lucky')
  })
  it('awards grinder at the configured round count', () => {
    expect(titleFor({ ...base, count: 3 }, cfg)).toBe('grinder')
  })
  it('awards survivor for a high survival rate', () => {
    expect(titleFor({ ...base, count: 2, survivalRate: 0.9 }, cfg)).toBe(
      'survivor',
    )
  })
  it('returns null when nothing applies', () => {
    expect(titleFor({ ...base, count: 2 }, cfg)).toBeNull()
  })
})

describe('buildMonthSummaries', () => {
  it('returns an empty array for no rounds', () => {
    expect(buildMonthSummaries([], cfg, 0, later)).toEqual([])
  })

  it('groups by month, newest first', () => {
    const list = [
      round({ id: 1, date: '2026-01-05' }),
      round({ id: 2, date: '2026-03-05' }),
      round({ id: 3, date: '2026-02-05' }),
    ]
    expect(buildMonthSummaries(list, cfg, 0, later).map((m) => m.ym)).toEqual([
      '2026-03',
      '2026-02',
      '2026-01',
    ])
  })

  it('computes the longest deathless streak chronologically', () => {
    const money = [50, 0, 50, 50, 50]
    const list = money.map((m, i) =>
      round({ id: i + 1, number: i + 1, date: `2026-01-0${i + 1}`, money: m }),
    )
    expect(buildMonthSummaries(list, cfg, 0, later)[0].bestStreak).toBe(3)
  })

  it('finds the best day and counts active days', () => {
    const list = [
      round({ id: 1, date: '2026-01-02', money: 100 }),
      round({ id: 2, date: '2026-01-02', money: 100 }),
      round({ id: 3, date: '2026-01-09', money: 150 }),
    ]
    const [m] = buildMonthSummaries(list, cfg, 0, later)
    expect(m.bestDay.day).toBe('2026-01-02')
    expect(m.bestDay.totalMoney).toBe(200)
    expect(m.bestDay.count).toBe(2)
    expect(m.activeDays).toBe(2)
  })

  it('builds the heatmap data with a Monday-based offset', () => {
    const [m] = buildMonthSummaries(
      [round({ date: '2026-01-02' }), round({ id: 2, date: '2026-01-02' })],
      cfg,
      0,
      later,
    )
    expect(m.dayCounts).toHaveLength(31)
    expect(m.dayCounts[1]).toBe(2)
    expect(m.offset).toBe(3) // 1 Jan 2026 is a Thursday
  })

  it('needs at least 3 runs for the most profitable map', () => {
    const three = [1, 2, 3].map((n) => round({ id: n, map: 'A', money: 10 }))
    const one = round({ id: 4, map: 'B', money: 100 })
    const [m] = buildMonthSummaries([...three, one], cfg, 0, later)
    expect(m.bestMap?.map).toBe('A')
    expect(m.favMap.map).toBe('A')

    const [few] = buildMonthSummaries(three.slice(0, 2), cfg, 0, later)
    expect(few.bestMap).toBeNull()
  })

  it('ranks months by total money', () => {
    const list = [
      round({ id: 1, date: '2026-01-01', money: 100 }),
      round({ id: 2, date: '2026-02-01', money: 300 }),
      round({ id: 3, date: '2026-03-01', money: 200 }),
    ]
    const res = buildMonthSummaries(list, cfg, 0, later)
    const rank = (ym: string) => res.find((m) => m.ym === ym)!.rank
    expect(rank('2026-02')).toBe(1)
    expect(rank('2026-03')).toBe(2)
    expect(rank('2026-01')).toBe(3)
    expect(res[0].monthCount).toBe(3)
  })

  it('computes the change against the previous month', () => {
    const list = [
      round({ id: 1, date: '2026-01-01', money: 1000 }),
      round({ id: 2, date: '2026-02-01', money: 500 }),
    ]
    const res = buildMonthSummaries(list, cfg, 0, later)
    expect(res[0].deltaMoney).toBe(-0.5)
    expect(res[1].deltaMoney).toBeNull()
  })

  it('treats the running month separately', () => {
    const now = new Date(2026, 1, 10)
    const list = [
      round({ id: 1, date: '2026-01-01', money: 1000 }),
      round({ id: 2, date: '2026-01-20', money: 1000 }),
      round({ id: 3, date: '2026-02-05', money: 1000 }),
      round({ id: 4, date: '2026-02-06', money: 1000 }),
    ]
    const [feb] = buildMonthSummaries(list, cfg, 0, now)
    expect(feb.isOpen).toBe(true)
    expect(feb.tier).toBeNull()
    expect(feb.title).toBeNull()
    // 2000 so far vs. 1000 in the first 10 days of January
    expect(feb.deltaMoney).toBe(1)
  })
})
