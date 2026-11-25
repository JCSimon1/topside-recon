// Monatskarte. Kompakt im Grid (full = false) oder als Detailansicht im Fokus (full = true).

import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { BadgeTier, TrophyRoomConfig } from '../api/types'
import { fmtDate, fmtMoney, slugify } from '../lib/format'
import { localeFor, type MonthSummary } from '../lib/trophy'
import TrophyHeatmap from './TrophyHeatmap'

interface TrophyCardProps {
  summary: MonthSummary
  config: TrophyRoomConfig
  full?: boolean
  onClose?: () => void
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

const FALLBACK_IMG = '/images/misc/monthly_trophy_background_orig.webp'

function HeroImage({ map, version }: { map?: string; version: string | null }) {
  const fallback =
    FALLBACK_IMG + (version ? `?v=${encodeURIComponent(version)}` : '')
  const primary = map ? `/images/maps/${slugify(map)}.webp` : fallback
  const [src, setSrc] = useState(primary)
  const [hidden, setHidden] = useState(false)
  if (hidden) return null

  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 size-full object-cover mask-[linear-gradient(to_bottom,black_35%,transparent_100%)]"
      onError={() => {
        if (src !== fallback) setSrc(fallback)
        else setHidden(true)
      }}
    />
  )
}

function Hero({
  summary: s,
  config,
  full,
  onClose,
}: Required<Pick<TrophyCardProps, 'summary' | 'config'>> &
  Pick<TrophyCardProps, 'full' | 'onClose'>) {
  const { t, i18n } = useTranslation()
  const name = new Date(Date.UTC(s.year, s.month - 1, 1)).toLocaleDateString(
    localeFor(i18n.language),
    { month: 'long', timeZone: 'UTC' },
  )
  const bgMap = (s.bestMap ?? s.favMap).map
  const neg = (s.deltaMoney ?? 0) < 0

  return (
    <div className="relative flex min-h-52 flex-col justify-end overflow-hidden px-5 pt-12 pb-4">
      <HeroImage key={bgMap} map={bgMap} version={config.imageVersion} />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-panel to-transparent"
      />

      <div className="absolute top-3 left-5 font-mono text-[10px] tracking-wide text-text-muted">
        {t('trophy.eyebrow')}
      </div>
      {full && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-5 cursor-pointer font-mono text-[10px] tracking-wide text-text-muted hover:text-text"
        >
          {t('common.close').toUpperCase()} ×
        </button>
      )}
      {(s.isOpen || s.tier) && (
        <div
          className={`absolute right-5 rounded-sm border-2 bg-black/40 px-2.5 py-0.5 font-display text-[15px] font-bold tracking-[1.5px] ${
            full ? 'top-9' : 'top-3'
          } ${s.tier ? `${tierBorder[s.tier]} ${tierText[s.tier]}` : 'border-border text-text-muted'}`}
        >
          {s.tier ? t(`trophy.tier.${s.tier}`) : t('trophy.inProgress')}
        </div>
      )}

      <div className="relative">
        <div className="font-display text-[28px] leading-none font-bold text-accent text-shadow-md text-shadow-black/50">
          {name} <span className="text-[0.8em]">{s.year}</span>
        </div>
        {full && s.title && (
          <div className="mt-1 font-mono text-[11px] text-text-muted">
            {t(`trophy.titles.${s.title}`)}
          </div>
        )}
        <div className="mt-1 font-display text-5xl leading-tight font-bold text-text text-shadow-md text-shadow-black/50">
          {fmtMoney(s.totalMoney)}
        </div>
        {s.deltaMoney !== null && (
          <div className="font-mono text-[11px] text-text-muted">
            <b className={neg ? 'text-negative' : 'text-positive'}>
              {neg ? '▼ ' : '▲ +'}
              {Math.round(Math.abs(s.deltaMoney) * 100)}%
            </b>{' '}
            {t('trophy.vsPrev')}
          </div>
        )}
      </div>
    </div>
  )
}

const tones = { neg: 'text-negative', accent: 'text-accent' } as const

function Tile({
  value,
  label,
  tone,
}: {
  value: ReactNode
  label: string
  tone?: keyof typeof tones
}) {
  return (
    <div className="rounded-sm border border-border-soft bg-panel-alt/60 px-2.5 py-2">
      <div
        className={`font-display text-[22px] leading-tight font-bold ${tone ? tones[tone] : ''}`}
      >
        {value}
      </div>
      <div className="font-mono text-[10px] tracking-wide text-text-faint">
        {label}
      </div>
    </div>
  )
}

function Highlight({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: boolean
}) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-wide text-text-faint">
        {label}
      </div>
      <div
        className={`font-display text-[22px] leading-tight font-bold ${accent ? 'text-accent' : ''}`}
      >
        {value}
      </div>
      {sub && (
        <div className="font-mono text-[11px] text-text-muted">{sub}</div>
      )}
    </div>
  )
}

const section = 'border-t border-dashed border-border px-5 py-3.5'

export default function TrophyCard({
  summary: s,
  config,
  full = false,
  onClose,
}: TrophyCardProps) {
  const { t } = useTranslation()
  const bestRunValue = fmtMoney(s.bestRun.money)
  const goal = config.monthlyGoal.money
  const goalPct = goal > 0 ? Math.round((s.totalMoney / goal) * 100) : 0
  const showRank = !s.isOpen && s.monthCount >= 2

  const border = s.tier
    ? tierBorder[s.tier]
    : s.isOpen
      ? 'border-dashed border-border'
      : 'border-border'

  const favMap = (
    <Highlight
      label={t('trophy.favMap')}
      value={s.favMap.map}
      sub={t('trophy.favMapSub', { n: s.favMap.count })}
    />
  )

  return (
    <div className={`overflow-hidden rounded-md border bg-panel ${border}`}>
      <Hero summary={s} config={config} full={full} onClose={onClose} />

      {!full ? (
        <div className="px-5 pb-5">
          <div className="grid grid-cols-3 gap-2">
            <Tile value={s.count} label={t('trophy.runs')} />
            <Tile
              value={s.deaths}
              label={t('trophy.deaths')}
              tone={s.deaths ? 'neg' : undefined}
            />
            <Tile
              value={bestRunValue}
              label={t('trophy.bestRun')}
              tone="accent"
            />
          </div>
          {s.isOpen && (
            <div className="mt-3 text-center font-mono text-[11px] text-text-faint">
              {t('trophy.openHint')}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 px-5 pb-4">
            <Tile value={s.count} label={t('trophy.runs')} />
            <Tile
              value={s.deaths}
              label={t('trophy.deaths')}
              tone={s.deaths ? 'neg' : undefined}
            />
            <Tile
              value={`${Math.round(s.survivalRate * 100)} %`}
              label={t('trophy.survived')}
            />
            <Tile value={s.activeDays} label={t('trophy.activeDays')} />
          </div>

          <div className={`${section} grid grid-cols-2 gap-x-4 gap-y-4`}>
            <Highlight
              label={t('trophy.bestRun')}
              value={bestRunValue}
              sub={`#${s.bestRun.number} · ${s.bestRun.map} · ${fmtDate(s.bestRun.date)}`}
              accent
            />
            {s.bestMap ? (
              <Highlight
                label={t('trophy.bestMap')}
                value={s.bestMap.map}
                sub={t('trophy.avgPerRun', {
                  value: fmtMoney(Math.round(s.bestMap.avgMoney)),
                })}
              />
            ) : (
              favMap
            )}
            <Highlight
              label={t('trophy.streak')}
              value={t('trophy.streakValue', { n: s.bestStreak })}
            />
            <Highlight
              label={t('trophy.bestDay')}
              value={fmtMoney(s.bestDay.totalMoney)}
              sub={`${fmtDate(s.bestDay.day)} · ${t('trophy.bestDaySub', { n: s.bestDay.count })}`}
            />
            {s.bestMap && favMap}
            {showRank && (
              <Highlight
                label={t('trophy.rank')}
                value={t('trophy.rankValue', {
                  rank: s.rank,
                  total: s.monthCount,
                })}
              />
            )}
          </div>

          {goal > 0 && (
            <div className={section}>
              <div className="font-mono text-[10px] tracking-wide text-text-faint">
                {t('trophy.goal')} · {fmtMoney(s.totalMoney)} / {fmtMoney(goal)}{' '}
                ({goalPct}%)
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-panel-alt">
                <div
                  className={`h-full ${goalPct >= 100 ? 'bg-positive' : 'bg-accent'}`}
                  style={{ width: `${Math.min(100, goalPct)}%` }}
                />
              </div>
            </div>
          )}

          <div className={section}>
            <div className="mb-2 font-mono text-[10px] tracking-wide text-text-faint">
              {t('trophy.activity')}
            </div>
            <TrophyHeatmap
              ym={s.ym}
              dayCounts={s.dayCounts}
              offset={s.offset}
            />
          </div>

          <div className={section}>
            <div className="mb-2 font-mono text-[10px] tracking-wide text-text-faint">
              {t('trophy.badges')}
            </div>
            <div className="flex flex-wrap gap-2">
              {s.badges.length === 0 ? (
                <span className="font-mono text-[11px] text-text-faint">
                  {t('trophy.noBadges')}
                </span>
              ) : (
                s.badges.map(({ key, n }) => (
                  <span
                    key={key}
                    title={t(`badgeTip.${key}`, { n: n ?? '' })}
                    className="flex items-center gap-1.5 rounded-sm border border-accent/40 bg-accent/10 px-2.5 py-1 text-[12px] font-semibold text-accent"
                  >
                    <img
                      src={`/images/misc/badge_${key}.webp`}
                      alt=""
                      className="size-4"
                      onError={(e) => e.currentTarget.remove()}
                    />
                    {t(`badge.${key}`)}
                  </span>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
