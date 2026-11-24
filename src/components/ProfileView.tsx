// Tab “Profil”: Rang-Auswahl mit Vorschaubild. Nutzt das optimistische Update von useSaveRank.

import { useSaveRank, useSettings } from '../api/queries'
import { useTranslation } from 'react-i18next'
import Panel from './Panel'

export default function ProfileView() {
  const { data: settings, isPending, error } = useSettings()
  const { mutate: saveRank } = useSaveRank()

  const { t, i18n } = useTranslation()
  const toggleLanguage = () => {
    const nextLanguage = i18n.resolvedLanguage === 'en' ? 'de' : 'en'
    void i18n.changeLanguage(nextLanguage)
  }

  if (isPending) return <p>Lade…</p>
  if (error) return <p className="text-negative">Fehler: {error.message}</p>

  return (
    <div className="flex flex-col gap-4.5">
      <Panel title={t('settings.rank.title')}>
        <div className="flex flex-wrap items-center gap-4.5">
          <div className="flex size-20 items-center justify-center rounded-sm border border-border bg-panel-alt p-2.5">
            {settings.rank && (
              <img
                src={`/images/ranks/${settings.rank}.webp`}
                alt=""
                className="size-full object-contain"
                onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
              />
            )}
          </div>
          <select
            value={settings.rank ?? ''}
            onChange={(e) => saveRank(e.target.value || null)}
            className="min-w-50 cursor-pointer rounded-sm border border-border bg-panel-alt px-2.5 py-2 text-[13.5px] font-medium outline-none focus:border-accent-2"
          >
            <option value="">{t('settings.rank.selectRank')}</option>
            {settings.ranks.map((r) => (
              <option key={r.key} value={r.key}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </Panel>
      <Panel title={t('settings.language.title')}>
        <div className="flex flex-wrap items-center gap-4.5">
          <p>{t('settings.language.languageDescription')}</p>
          <button
            onClick={toggleLanguage}
            type="button"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {i18n.language === 'en' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
          </button>
        </div>
      </Panel>
    </div>
  )
}
