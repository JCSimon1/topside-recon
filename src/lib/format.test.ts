import { describe, expect, it } from 'vitest'
import { slugify } from './format'

describe('slugify', () => {
  it('lowercases and removes spaces', () => {
    expect(slugify('Dam Battlegrounds')).toBe('dambattlegrounds')
  })

  it('removes accents', () => {
    expect(slugify('Café Müller')).toBe('cafemuller')
  })

  it('removes special characters', () => {
    expect(slugify("Stella Montis!")).toBe('stellamontis')
  })

  it('returns an empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })
})