// Tab “Auswertung”: sechs Stat-Cards, zwei Highscore-Karten und das Aufschlüsselungs-Panel.

import { useState } from 'react'
import { useConfig, useRounds } from '../api/queries'
import type { Round } from '../api/types'
import { fmtMoney, fmtXP } from '../lib/format'
import { statsFor, topRounds } from '../lib/stats'
import { useTranslation } from 'react-i18next'
import BreakdownPanel from './BreakdownPanel'
import HighscoreCard from './HighscoreCard'
import RoundReport from './RoundReport'
import StatCard from './StatCard'

export default function AnalysisView() {
  const { data: rounds, isPending, error } = useRounds()
  const { data: config } = useConfig()
  const [selected, setSelected] = useState<Round | null>(null)
  const { t } = useTranslation()

  if (isPending) return <p>{t('common.loading')}</p>
  if (error)
    return (
      <p className="text-negative">
        {t('common.error')}: {error.message}
      </p>
    )

  const threshold = config?.ui.deathMoneyThreshold ?? 0
  const stats = statsFor(rounds, threshold)
  const topN = config?.ui.highscoreTopN ?? 10

  return (
    <div className="flex flex-col gap-4.5">
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label={t('analysis.stats.rounds')}
          value={String(stats.count)}
        />
        <StatCard
          label={t('analysis.stats.deaths')}
          value={String(stats.deaths)}
          tone="negative"
        />
        <StatCard
          label={t('analysis.stats.totalMoney')}
          value={fmtMoney(stats.totalMoney)}
          tone="accent"
        />
        <StatCard
          label={t('analysis.stats.avgMoneyPerRound')}
          value={fmtMoney(Math.round(stats.avgMoney))}
        />
        <StatCard
          label={t('analysis.stats.totalXp')}
          value={fmtXP(stats.totalXP)}
          tone="teal"
        />
        <StatCard
          label={t('analysis.stats.avgXpPerRound')}
          value={fmtXP(Math.round(stats.avgXP))}
        />
      </div>

      <div className="grid gap-3.5 md:grid-cols-2">
        <HighscoreCard
          title={t('analysis.stats.highscoreMoney')}
          metric="money"
          rounds={topRounds(rounds, 'money', topN)}
          onSelect={setSelected}
        />
        <HighscoreCard
          title={t('analysis.stats.highscoreXp')}
          metric="xp"
          rounds={topRounds(rounds, 'xp', topN)}
          onSelect={setSelected}
        />
      </div>

      <div className="grid items-start gap-4.5 md:col-span-2">
        <BreakdownPanel rounds={rounds} deathThreshold={threshold} />
      </div>

      {selected && (
        <RoundReport round={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
