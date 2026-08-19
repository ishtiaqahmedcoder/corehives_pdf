import { ContentPage, ContentSection } from '@/components/ContentPage'

export function TermsAndConditions() {
  return (
    <ContentPage title="Terms & Conditions" subtitle="Last updated August 2026">
      <ContentSection title="The service">
        <p>
          PDFHives is a free set of PDF and image tools provided by CoreHives. We aim to keep
          every tool free, with no signup and no watermark. Fair-use limits (file size and
          requests per hour) apply to keep the service usable for everyone.
        </p>
      </ContentSection>

      <ContentSection title="Acceptable use">
        <p>
          Don't use PDFHives to process content that is illegal, infringes someone else's
          rights, or that you don't have the right to process. We reserve the right to block
          access for abuse of the service.
        </p>
      </ContentSection>

      <ContentSection title="No warranty">
        <p>
          The service is provided "as is." While we test every tool, we can't guarantee the
          output will always be perfect for every file. Always keep your own copy of important
          documents before processing them.
        </p>
      </ContentSection>

      <ContentSection title="Limitation of liability">
        <p>
          CoreHives is not liable for any loss or damage arising from your use of the service,
          to the fullest extent permitted by law.
        </p>
      </ContentSection>

      <ContentSection title="Changes">
        <p>
          We may update these terms as the product evolves. Continued use of the service after a
          change means you accept the updated terms.
        </p>
      </ContentSection>
    </ContentPage>
  )
}
