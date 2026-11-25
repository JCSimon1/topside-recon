import { describe, expect, it } from 'vitest'
import type { Round } from '../api/types'
import { computeBadges, periodRange, periodStartKey } from './badges'

const round = (overrides: Partial<Round> = {}): Round => ({
  id: 1,
  number: 1,
  date: '2026-01-10',
  time: '12:00',
  map: 'Spaceport',
  condition: 'Clear',
  money: 100,
  xp: 0,
  ...overrides,
})

const jan = new Date(2026, 0, 15)
const feb = new Date(2026, 1, 15)

const two = [round({ id: 1 }), round({ id: 2, date: '2026-01-11' })]

describe('periodRange / periodStartKey', () => {
  it('returns [first of month, first of next month)', () => {
    expect(periodRange('month', jan)).toEqual(['2026-01-01', '2026-02-01'])
  })
  it('rolls over the year in December', () => {
    expect(periodRange('month', new Date(2026, 11, 5))).toEqual([
      '2026-12-01',
      '2027-01-01',
    ])
  })
  it('starts weeks on Monday', () => {
    expect(periodRange('week', new Date(2026, 0, 7))).toEqual([
      '2026-01-05',
      '2026-01-12',
    ])
    expect(periodStartKey('week', '2026-01-11')).toBe('2026-01-05')
    expect(periodStartKey('month', '2026-01-11')).toBe('2026-01-01')
  })
})

describe('computeBadges', () => {
  it('returns nothing for an empty period or without rules', () => {
    expect(computeBadges('month', feb, two, { grinder: {} }, 0)).toEqual([])
    expect(computeBadges('month', jan, two, undefined, 0)).toEqual([])
  })

  it('awards grinder with the configured minimum', () => {
    const rules = { grinder: { minRounds: 2 } }
    expect(computeBadges('month', jan, two, rules, 0)).toEqual([
      { key: 'grinder', n: 2 },
    ])
    expect(
      computeBadges('month', jan, two, { grinder: { minRounds: 3 } }, 0),
    ).toEqual([])
  })

  it('reads minRounds per period', () => {
    const rules = { grinder: { minRounds: { month: 2, week: 50 } } }
    expect(computeBadges('month', jan, two, rules, 0)[0]?.n).toBe(2)
  })

  it('respects enabled and periods', () => {
    expect(
      computeBadges(
        'month',
        jan,
        two,
        { grinder: { minRounds: 1, enabled: false } },
        0,
      ),
    ).toEqual([])
    expect(
      computeBadges(
        'month',
        jan,
        two,
        { grinder: { minRounds: 1, periods: ['week'] } },
        0,
      ),
    ).toEqual([])
  })

  it('awards deathless only without deaths', () => {
    const rules = { deathless: { minRounds: 2 } }
    expect(computeBadges('month', jan, two, rules, 0)).toHaveLength(1)
    const withDeath = [...two, round({ id: 3, money: 0 })]
    expect(computeBadges('month', jan, withDeath, rules, 0)).toEqual([])
  })

  it('awards record to the period holding the best run', () => {
    const list = [
      round({ id: 1, money: 500, xp: 50 }),
      round({ id: 2, date: '2026-02-03', money: 100, xp: 10 }),
    ]
    const rules = { record: {} }
    expect(computeBadges('month', jan, list, rules, 0)).toEqual([
      { key: 'record', n: undefined },
    ])
    expect(computeBadges('month', feb, list, rules, 0)).toEqual([])
  })

  it('awards aboveAvg when the average beats the overall average', () => {
    const list = [
      round({ id: 1, money: 100 }),
      round({ id: 2, money: 300 }),
      round({ id: 3, date: '2026-02-03', money: 100 }),
      round({ id: 4, date: '2026-02-04', money: 100 }),
    ]
    const rules = { aboveAvg: { minRounds: 2 } }
    expect(computeBadges('month', jan, list, rules, 0)).toEqual([
      { key: 'aboveAvg', n: 2 },
    ])
    expect(computeBadges('month', feb, list, rules, 0)).toEqual([])
  })

  it('awards best to the period with the highest total', () => {
    const list = [
      round({ id: 1, money: 300 }),
      round({ id: 2, date: '2026-02-03', money: 100 }),
    ]
    const rules = { best: {} }
    expect(computeBadges('month', jan, list, rules, 0)).toHaveLength(1)
    expect(computeBadges('month', feb, list, rules, 0)).toEqual([])
    // too few periods
    expect(computeBadges('month', jan, [list[0]], rules, 0)).toEqual([])
  })
})
