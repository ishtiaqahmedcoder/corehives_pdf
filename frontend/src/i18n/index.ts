import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import ur from './locales/ur.json'
import hi from './locales/hi.json'
import ar from './locales/ar.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ur', label: 'اردو', dir: 'rtl' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
] as const

export const RTL_LANGUAGES: Set<string> = new Set(LANGUAGES.filter((l) => l.dir === 'rtl').map((l) => l.code))

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
      hi: { translation: hi },
      ar: { translation: ar },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    supportedLngs: LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'corehives-lang',
    },
  })

function applyDirection(lang: string) {
  document.documentElement.dir = RTL_LANGUAGES.has(lang as never) ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
}

applyDirection(i18n.resolvedLanguage ?? 'en')
i18n.on('languageChanged', applyDirection)

export default i18n
