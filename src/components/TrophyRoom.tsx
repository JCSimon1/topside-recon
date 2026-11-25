// Tab “Trophäen”: eine kompakte Karte pro Monat. Ein Klick öffnet die Detailkarte zentriert (Portal, Escape oder Klick daneben schließt).

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useConfig, useRounds } from '../api/queries'
import { buildMonthSummaries } from '../lib/trophy'
import Panel from './Panel'
import TiltCard from './ui/TiltCard'
import TrophyCard from './TrophyCard'

export default function TrophyRoom() {
  const { data: rounds, isPending, error } = useRounds()
  const { data: config } = useConfig()
  const [openYm, setOpenYm] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!openYm) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenYm(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openYm])

  if (isPending || !config) return <p>{t('common.loading')}</p>
  if (error)
    return (
      <p className="text-negative">
        {t('common.error')}: {error.message}
      </p>
    )

  const months = buildMonthSummaries(
    rounds,
    config.trophyRoom,
    config.ui.deathMoneyThreshold,
  )
  const opened = months.find((m) => m.ym === openYm)

  return (
    <Panel title={t('trophy.title')}>
      {months.length === 0 ? (
        <p className="font-mono text-[13px] text-text-faint">
          {t('trophy.empty')}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {months.map((m) => (
            <div
              key={m.ym}
              className={m.ym === openYm ? 'invisible' : ''}
              role="button"
              tabIndex={0}
              onClick={() => setOpenYm(m.ym)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setOpenYm(m.ym)
                }
              }}
            >
              <TiltCard className="rounded-xl p-3">
                <TrophyCard summary={m} config={config.trophyRoom} />
              </TiltCard>
            </div>
          ))}
        </div>
      )}

      {opened &&
        createPortal(
          <div
            className="fixed inset-0 z-100 overflow-y-auto bg-black/75 backdrop-blur-sm"
            onMouseDown={() => setOpenYm(null)}
          >
            <div className="flex min-h-full items-center justify-center p-6">
              <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-117"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <TiltCard className="rounded-xl p-3">
                  <TrophyCard
                    summary={opened}
                    config={config.trophyRoom}
                    full
                    onClose={() => setOpenYm(null)}
                  />
                </TiltCard>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </Panel>
  )
}
