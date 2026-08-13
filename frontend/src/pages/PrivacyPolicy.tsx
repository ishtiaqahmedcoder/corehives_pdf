import { ContentPage, ContentSection } from '@/components/ContentPage'

export function PrivacyPolicy() {
  return (
    <ContentPage title="Privacy Policy" subtitle="Last updated August 2026">
      <ContentSection title="What we collect">
        <p>
          When you use a CoreHives PDF tool, we temporarily store the files you upload and the
          file(s) we produce, purely to process your request. We also store a one-way hash of
          your IP address (not the IP itself) to apply fair-use rate limits and prevent abuse.
        </p>
      </ContentSection>

      <ContentSection title="Auto-deletion">
        <p>
          Every file — input and output — is automatically and permanently deleted 1 hour after
          your job completes. We don't keep backups of your files beyond that window, and we
          don't read, scan, or analyze their contents for any purpose other than running the tool
          you selected.
        </p>
      </ContentSection>

      <ContentSection title="No accounts, no tracking">
        <p>
          Every tool works without creating an account. We don't sell your data, and we don't
          use third-party analytics or advertising trackers today. If we introduce advertising
          (to keep the tools free) or optional accounts in the future, this page will be updated
          before that happens.
        </p>
      </ContentSection>

      <ContentSection title="Cookies">
        <p>
          We use a single cookie-free browser preference (light/dark theme) stored in your
          browser's local storage — it never leaves your device. See our{' '}
          <a href="/cookies" className="underline" style={{ color: 'var(--accent)' }}>
            Cookie Policy
          </a>{' '}
          for details.
        </p>
      </ContentSection>

      <ContentSection title="Contact">
        <p>
          Questions about this policy? Reach us at{' '}
          <a href="mailto:privacy@corehives.com" className="underline" style={{ color: 'var(--accent)' }}>
            privacy@corehives.com
          </a>
          .
        </p>
      </ContentSection>
    </ContentPage>
  )
}
