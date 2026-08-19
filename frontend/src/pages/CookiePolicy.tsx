import { ContentPage, ContentSection } from '@/components/ContentPage'

export function CookiePolicy() {
  return (
    <ContentPage title="Cookie Policy" subtitle="Last updated August 2026">
      <ContentSection title="What we use today">
        <p>
          PDFHives currently uses zero tracking cookies. Your light/dark theme choice is
          saved in your browser's local storage, not a cookie. It stays on your device and is
          never sent to our servers.
        </p>
      </ContentSection>

      <ContentSection title="If that changes">
        <p>
          If we add advertising to keep the tools free, our ad partner (e.g. Google AdSense) may
          set cookies to show relevant ads and measure performance. We'll update this page and
          add a cookie-consent banner before that happens, so you can choose what to allow.
        </p>
      </ContentSection>

      <ContentSection title="Controlling cookies">
        <p>
          You can clear or block cookies at any time through your browser's settings. Doing so
          won't stop any PDFHives tool from working.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
