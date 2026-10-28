import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Round } from '../api/types'
import { renderWithClient } from '../test/renderWithClient'
import ListView from './ListView'

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

describe('ListView', () => {
  it('shows an empty state when there are no rounds', () => {
    renderWithClient(<ListView />, { rounds: [] })
    expect(screen.getByText('Noch keine Runden erfasst.')).toBeInTheDocument()
  })

  it('shows rounds newest first', () => {
    renderWithClient(<ListView />, {
      rounds: [
        round({ id: 1, number: 1, date: '2026-01-01' }),
        round({ id: 2, number: 2, date: '2026-01-02' }),
      ],
    })
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('2')
    expect(rows[2]).toHaveTextContent('1')
  })
})