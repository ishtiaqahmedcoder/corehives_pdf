import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function PdfToWord() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="pdf-to-word"
      title={t('tools.pdf-to-word.label')}
      description={t('tools.pdf-to-word.description')}
      submitLabel={t('tools.pdf-to-word.label')}
    />
  )
}
