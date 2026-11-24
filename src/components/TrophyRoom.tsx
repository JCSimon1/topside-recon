import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useConfig, useRounds } from '../api/queries'
import type { BadgeTier } from '../api/types'
import { fmtMoney } from '../lib/format'
import {
  buildMonthTrophies,
  type MonthTrophy,
  type TitleKey,
} from '../lib/trophy'
import Panel from './Panel'
import TiltCard from './ui/TiltCard'

// TODO: auf t() aus dem i18n-Setup umstellen
const labels = {
  tier: {
    bronze: 'BRONZE',
    silver: 'SILBER',
    gold: 'GOLD',
    platinum: 'PLATIN',
  } as Record<BadgeTier, string>,
  noTier: 'KEIN TIER',
  titles: {
    lucky: 'Glückspilz',
    grinder: 'Grinder',
    survivor: 'Überlebender',
  } as Record<TitleKey, string>,
  rounds: 'Runden',
  goal: 'Monatsziel',
  best: 'Beste Runde',
  empty: 'Noch keine Runden erfasst.',
}

// Tailwind braucht statische Klassennamen
const tierText: Record<BadgeTier, string> = {
  bronze: 'text-tier-bronze',
  silver: 'text-tier-silver',
  gold: 'text-tier-gold',
  platinum: 'text-tier-platinum',
}
const tierBorder: Record<BadgeTier, string> = {
  bronze: 'border-tier-bronze/60',
  silver: 'border-tier-silver/60',
  gold: 'border-tier-gold/60',
  platinum: 'border-tier-platinum/60',
}

const fmtMonth = (month: string) => {
  const [y, m] = month.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, 1))
    .toLocaleDateString('de-DE', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .toUpperCase()
}

function MonthCardFace({ t }: { t: MonthTrophy }) {
  const tier = t.tier

  return (
    <div
      className={`flex h-105 flex-col items-center justify-between rounded-md border bg-panel p-6 text-center ${
        tier ? tierBorder[tier] : 'border-border opacity-70'
      }`}
    >
      <div className="font-mono text-[10.5px] tracking-wide text-text-muted">
        {fmtMonth(t.month)}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div
          className={`font-display text-5xl font-bold ${
            tier ? tierText[tier] : 'text-text-faint'
          }`}
        >
          {tier ? labels.tier[tier] : labels.noTier}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {t.titles.map((k) => (
            <span
              key={k}
              className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10.5px] text-text-muted"
            >
              {labels.titles[k]}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full">
        <div className="font-mono text-[15px] text-positive">
          {fmtMoney(t.totalMoney)}
        </div>
        <div className="mt-1 font-mono text-[11px] text-text-faint">
          {t.count} {labels.rounds} · {labels.best} {fmtMoney(t.bestRun)}
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-sm bg-panel-alt"
          title={labels.goal}
        >
          <div
            className="h-full bg-accent"
            style={{
              width: `${Math.min(100, Math.round(t.goalProgress * 100))}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function MonthCard({ t }: { t: MonthTrophy }) {
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFocused(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFocused])
  return (
    <>
      {/* Originalkarte im Grid */}
      <div
        className={isFocused ? 'invisible' : ''}
        onClick={() => setIsFocused(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsFocused(true)
          }
        }}
      >
        <TiltCard className="rounded-xl p-3">
          <MonthCardFace t={t} />
        </TiltCard>
      </div>

      {/* Zentrale Fokuskarte */}
      {isFocused &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm"
            onMouseDown={() => setIsFocused(false)}
          >
            <div
              className="w-full max-w-105 animate-card-appear"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <TiltCard className="rounded-xl p-3">
                <MonthCardFace t={t} />
              </TiltCard>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

export default function TrophyRoom() {
  const { data: rounds, isPending, error } = useRounds()
  const { data: config } = useConfig()

  if (isPending || !config) return <p>Lade…</p>
  if (error) return <p className="text-negative">Fehler: {error.message}</p>

  const months = buildMonthTrophies(
    rounds,
    config.trophyRoom,
    config.ui.deathMoneyThreshold,
  )

  return (
    <Panel title="Trophy Room">
      {months.length === 0 ? (
        <p className="font-mono text-[13px] text-text-faint">{labels.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {months.map((m) => (
            <MonthCard key={m.month} t={m} />
          ))}
        </div>
      )}
    </Panel>
  )
}
