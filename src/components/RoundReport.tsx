import { useState } from 'react'
import { useConfig, useRounds } from '../api/queries'
import type { Round } from '../api/types'
import { fmtDate, fmtMoney, fmtXP, slugify } from '../lib/format'
import { averages, deltaPercent, isDeath, isTopRun } from '../lib/rounds'
import { useCountUp } from '../lib/useCountUp'
import Button from './Button'
import Modal from './Modal'
import TiltCard from './ui/TiltCard'

interface RoundReportProps {
  round: Round
  onClose: () => void
  onEdit?: (round: Round) => void
}

type Squad = 'solo' | 'duo' | 'trio'
const squadLabel: Record<Squad, string> = {
  solo: 'SOLO',
  duo: 'DUO',
  trio: 'TRIO',
}

const badgeBase =
  'grid size-10 place-items-center rounded-full border bg-bg/75 backdrop-blur-sm'

function ConditionBadge({ condition }: { condition: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`${badgeBase} border-border`} title={condition}>
      {failed ? (
        <span className="font-mono text-[9px] text-text-muted">
          {condition.slice(0, 3).toUpperCase()}
        </span>
      ) : (
        <img
          src={`/images/conditions/${slugify(condition)}.webp`}
          alt={condition}
          className="size-6 object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

function SkullBadge() {
  return (
    <div className={`${badgeBase}`} title="death">
      <img src="/images/misc/icon_skull.webp"></img>
    </div>
  )
}

function Delta({ label, pct }: { label: string; pct: number | null }) {
  if (pct === null) return null
  const neg = pct < 0
  return (
    <div className="flex items-baseline gap-1.5 font-mono text-[11px]">
      <b className={neg ? 'text-negative' : 'text-positive'}>
        {pct >= 0 ? '+' : ''}
        {pct}%
      </b>
      <span className="text-text-faint">{label}</span>
    </div>
  )
}

function Stat({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className: string
}) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-wide text-text-faint">
        {label}
      </div>
      <div
        className={`font-display text-[28px] leading-tight font-bold ${className}`}
      >
        {value}
      </div>
    </div>
  )
}

export default function RoundReport({
  round,
  onClose,
  onEdit,
}: RoundReportProps) {
  const { data: rounds = [] } = useRounds()
  const { data: config } = useConfig()
  const { avgMoney, avgXP } = averages(rounds)
  const top = isTopRun(round, avgMoney, config?.ui.topRunFactor ?? 1.2)
  const died = isDeath(round, config?.ui.deathMoneyThreshold ?? 0)
  const squad: Squad = 'solo' // Platzhalter: später aus den Rundendaten

  const moneyShown = useCountUp(round.money, 700, 1100)
  const xpShown = useCountUp(round.xp, 700, 1100)

  const moneyDelta = deltaPercent(round.money, avgMoney)
  const xpDelta = deltaPercent(round.xp, avgXP)

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <TiltCard className="rounded-xl p-3">
          <div
            className={`relative flex aspect-33/50 w-82.5 max-w-full flex-col overflow-hidden rounded-md border bg-panel ${
              top
                ? 'border-accent/50 shadow-[0_0_46px_rgba(232,163,61,0.28)]'
                : 'border-border'
            }`}
          >
            <div className="relative flex items-center justify-center px-3 pt-3 pb-1.5">
              <h2 className="font-display text-[18px] font-bold tracking-[2px] uppercase">
                Round Report
              </h2>
              <div className="absolute top-4.5 right-3 rounded-sm bg-negative px-2 py-0.5 font-mono text-[16px] font-semibold text-white">
                {String(round.number).padStart(3, '0')}
              </div>
            </div>
            <div className="border-b border-border-soft pb-1.5 text-center font-mono text-[11px] text-text-muted">
              {fmtDate(round.date)} · {round.time}
            </div>

            {/* 4 + 5: Kartenbild mit Overlays */}
            <div className="relative h-[38%] shrink-0 bg-panel-alt">
              <img
                src={`/images/maps/${slugify(round.map)}.webp`}
                alt=""
                className="size-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent"
              />

              {top && (
                <div
                  aria-hidden
                  style={{ animationDelay: '1.5s' }}
                  className="absolute top-3 left-3 rounded-sm border-2 border-accent bg-black/45 px-2 py-0.5 font-display text-[14px] font-bold tracking-[1.5px] text-accent motion-safe:animate-rc-stamp motion-reduce:rotate-[-9deg] shadow-amber-200 shadow-md"
                >
                  TOP RUN
                </div>
              )}

              <div className="absolute right-2.5 bottom-2.5 flex gap-2">
                <ConditionBadge condition={round.condition} />
                {died && <SkullBadge />}
                <div className={`${badgeBase}`} title="Squad">
                  <span className="font-mono text-[10px] text-text-muted">
                    {squadLabel[squad]}
                  </span>
                </div>
              </div>
            </div>

            {/* 6: Name der Karte */}
            <div className="border-y border-border bg-panel-alt py-1.5 text-center font-display text-[24px] font-semibold tracking-[1px] uppercase">
              {round.map}
            </div>

            {/* 7 + 8: Stats und Vergleich, mit Scanline-Maske */}
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div
                aria-hidden
                style={{ animationDelay: '0.6s' }}
                className="absolute inset-0 z-2 origin-top bg-panel motion-safe:animate-rc-reveal motion-reduce:hidden"
              />
              <div
                aria-hidden
                style={{ animationDelay: '0.6s' }}
                className="absolute inset-x-0 top-0 z-3 h-0.5 bg-linear-to-r from-transparent via-accent to-transparent opacity-0 shadow-[0_0_10px_1px_rgba(232,163,61,0.7)] motion-safe:animate-rc-sweep"
              />

              <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <Stat
                    label="$ VERDIENT"
                    value={fmtMoney(moneyShown)}
                    className="text-positive"
                  />
                  <Stat
                    label="XP ERHALTEN"
                    value={fmtXP(xpShown)}
                    className="text-accent-2"
                  />
                </div>
                <div
                  className="flex items-center justify-between rounded-sm border border-dashed border-border px-3 py-1.5 font-mono text-[10px] text-text-faint"
                  title="Loadout folgt"
                >
                  <span>LOADOUT</span>
                  <span>—</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-border-soft bg-panel-alt/60 px-4 py-2">
                <span className="font-mono text-[10px] tracking-wide text-text-faint">
                  VS. Ø-RUNDE
                </span>
                {moneyDelta === null && xpDelta === null ? (
                  <span className="font-mono text-[11px] text-text-faint">
                    —
                  </span>
                ) : (
                  <div className="flex gap-3">
                    <Delta label="$" pct={moneyDelta} />
                    <Delta label="XP" pct={xpDelta} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </TiltCard>

        <div className="flex gap-2.5">
          {onEdit && (
            <Button variant="ghost" onClick={() => onEdit(round)}>
              Bearbeiten
            </Button>
          )}
          <Button onClick={onClose}>Schließen</Button>
        </div>
      </div>
    </Modal>
  )
}
