import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function PdfToMarkdown() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="pdf-to-markdown"
      title={t('tools.pdf-to-markdown.label')}
      description={t('tools.pdf-to-markdown.description')}
      submitLabel={t('tools.pdf-to-markdown.label')}
    />
  )
}
