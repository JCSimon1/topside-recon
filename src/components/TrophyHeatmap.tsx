// Aktivitäts-Heatmap eines Monats: Wochen ab Montag, Intensität nach Runden pro Tag.

import { useTranslation } from 'react-i18next'
import { fmtDate } from '../lib/format'
import { localeFor } from '../lib/trophy'

interface TrophyHeatmapProps {
  ym: string
  dayCounts: number[]
  offset: number
}

// Tailwind braucht statische Klassennamen
const levels = [
  'bg-panel-alt',
  'bg-heat-1',
  'bg-heat-2',
  'bg-heat-3',
  'bg-heat-4',
]

export default function TrophyHeatmap({
  ym,
  dayCounts,
  offset,
}: TrophyHeatmapProps) {
  const { t, i18n } = useTranslation()
  const locale = localeFor(i18n.language)
  const max = Math.max(1, ...dayCounts)

  // 1 Jan 2024 war ein Montag
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'narrow' }),
  )

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {weekdays.map((d, i) => (
        <span
          key={i}
          className="text-center font-mono text-[10px] text-text-faint"
        >
          {d}
        </span>
      ))}
      {Array.from({ length: offset }, (_, i) => (
        <span key={`lead-${i}`} />
      ))}
      {dayCounts.map((v, i) => {
        const level = v === 0 ? 0 : Math.min(4, Math.ceil((4 * v) / max))
        const day = `${ym}-${String(i + 1).padStart(2, '0')}`
        return (
          <span
            key={day}
            title={`${fmtDate(day)} · ${v} ${t('analysis.stats.rounds')}`}
            className={`aspect-square rounded-sm ${levels[level]}`}
          />
        )
      })}
    </div>
  )
}
