import { useTranslation } from 'react-i18next'
import MapImage from '../components/ui/MapImage'

export function I18nTest() {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === 'en' ? 'de' : 'en'
    void i18n.changeLanguage(nextLanguage)
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {t('testPage.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-400">{t('testPage.subtitle')}</p>
        </div>

        <button
          onClick={toggleLanguage}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          {i18n.language === 'en' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">
          {t('testPage.welcome')}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {t('testPage.description')}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <MapImage
          map="Dam Battlegrounds"
          version="2026-11-26"
          className="h-30 w-60 rounded-md object-cover  drop-shadow-accent-2 drop-shadow-md"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(['totalRaids', 'successfulRaids', 'survivalRate'] as const).map(
          (stat) => (
            <div
              key={stat}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-xs uppercase tracking-wider text-gray-400">
                {t(`testPage.stats.${stat}`)}
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                {stat === 'totalRaids'
                  ? '128'
                  : stat === 'successfulRaids'
                    ? '94'
                    : '73.4%'}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
