import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function OcrPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="ocr"
      title={t('tools.ocr.label')}
      description={t('tools.ocr.description')}
      submitLabel={t('tools.ocr.label')}
    />
  )
}
