import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang } from '../content/types'
import { useSettings } from '../state/useSettings'
import { langFromUrl, pickLang, translate, translatePlural } from './messages'
import { I18nCtx, type I18nContextValue } from './useI18n'

export function I18nProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettings()

  // A ?lang= paraméter csak erre a betöltésre érvényes: a mentett beállítást nem írja át,
  // amíg a játékos maga nem vált nyelvet.
  const [urlLang, setUrlLang] = useState<Lang | null>(() => langFromUrl(window.location.search))
  const lang = urlLang ?? settings.lang

  const setLang = useCallback(
    (next: Lang) => {
      setUrlLang(null)
      updateSettings({ lang: next })
    },
    [updateSettings],
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translate(lang, 'doc.title')
  }, [lang])

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (key, params) => translate(lang, key, params),
      tn: (key, n, params) => translatePlural(lang, key, n, params),
      pick: (text) => pickLang(lang, text),
    }),
    [lang, setLang],
  )

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}
