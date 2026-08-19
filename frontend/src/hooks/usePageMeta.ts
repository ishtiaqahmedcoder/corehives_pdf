import { useEffect } from 'react'
import { APP_NAME } from '@/lib/brand'

function setMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Sets the document title and meta description for the current page, restoring the previous values on unmount. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} — ${APP_NAME}`

    if (description) {
      setMetaTag('description', description)
      setMetaTag('og:title', `${title} — ${APP_NAME}`, 'property')
      setMetaTag('og:description', description, 'property')
      setMetaTag('twitter:title', `${title} — ${APP_NAME}`)
      setMetaTag('twitter:description', description)
    }

    return () => {
      document.title = previousTitle
    }
  }, [title, description])
}
